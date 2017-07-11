import React, { Component } from 'react'
import {
  Alert,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import '../UserAgent'
import io from 'socket.io-client'
import MapView from 'react-native-maps'
import Modal from 'react-native-modal'

import styles from '../style/app.style'
import consts from '../constants/constants'

const {width, height} = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.005
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class Taxitura extends Component {
  constructor (props) {
    super(props)
    this.state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      markerPosition: {
        latitude: 0,
        longitude: 0
      },
      markerPositionOrder: {
        latitude: 0,
        longitude: 0
      },
      connection: {
        state: false,
        title: consts.disconnect
      },
      order: null,
      processOrder: false,
      goOrder: false,
      button: {
        title: consts.arrive,
        color: consts.colorArrive,
        action: consts.actionArrive
      }
    }

    console.ignoredYellowBox = ['Setting a timer']

    this.socket = io(consts.serverSock, { transports: ['websocket'] })
    this.socket.on('message', data => {
      this.state.connection.state = data.connection
      if (this.state.connection.state) {
        this.state.connection.title = consts.connect
      }
    })
    this.socket.on('disconnect', reason => {
      let data = {
        title: consts.disconnect,
        state: false
      }
      this.setState({connection: data})
    })
    this.socket.on('reconnect', (attemptNumber) => {
      let data = {
        title: consts.connect,
        state: false
      }
      this.setState({connection: data})
    })
    this.socket.on('app', order => {
      if (order.action === consts.order && this.state.order === null) {
        this.state.order = order
        this.setState({processOrder: true})
      }
    })
  }

  componentDidMount () {
    navigator.geolocation.getCurrentPosition(position => {
      let lat = parseFloat(position.coords.latitude)
      let long = parseFloat(position.coords.longitude)

      let initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.setState({initialPosition: initialRegion})
      this.setState({markerPosition: initialRegion})
    },
    error => {
      Alert.alert(
        'Alerta GPS',
        'Favor enceder su GPS',
        [ {text: 'OK', onPress: () => console.log(JSON.stringify(error))} ]
      )
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000})

    this.watchID = navigator.geolocation.watchPosition(position => {
      let lat = parseFloat(position.coords.latitude)
      let long = parseFloat(position.coords.longitude)

      let lastRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.setState({initialPosition: lastRegion})
      this.setState({markerPosition: lastRegion})
    })
  }

  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
  }

  generateMap () {
    if (this.state.goOrder) {
      return (
        <MapView style={styles.map}
          region={this.state.initialPosition}
          rotateEnabled={this.state.goOrder}>
          <MapView.Marker
            coordinate={this.state.markerPosition}
            title={'Tú'}>
            <View style={styles.radius}>
              <View style={styles.marker} />
            </View>
          </MapView.Marker>
          <MapView.Marker
            coordinate={this.state.markerPositionOrder}
            title={'Cliente'}>
            <View style={styles.radius}>
              <View style={styles.markerOrder} />
            </View>
          </MapView.Marker>
        </MapView>
      )
    } else {
      return (
        <MapView style={styles.map}
          region={this.state.initialPosition}
          rotateEnabled={this.state.goOrder}>
          <MapView.Marker
            coordinate={this.state.markerPosition}
            title={'Tú'}>
            <View style={styles.radius}>
              <View style={styles.marker} />
            </View>
          </MapView.Marker>
        </MapView>
      )
    }
  }

  generateOrder () {
    if (this.state.processOrder) {
      return (
        <View style={styles.modalContent}>
          <Image
            style={styles.imageOrder}
            source={{uri: this.state.order.order.url_pic}} />
          <View style={styles.nameUser}>
            <Text style={styles.title}>
              {this.state.order.order.name}
            </Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => { this.setState({processOrder: false, order: null}) }}>
              <View style={styles.button}>
                <Text>Cancelar</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.acceptOrder() }}>
              <View style={styles.button}>
                <Text>Aceptar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return (<View />)
    }
  }

  acceptOrder () {
    let position = {
      latitude: this.state.order.order.latitude,
      longitude: this.state.order.order.longitude
    }
    this.state.markerPositionOrder = position
    this.setState({processOrder: false})

    let data = this.state.order
    data['action'] = 'order'
    let accept = {
      nameCabman: 'Taxista de pruebas',
      distance: 100,
      latitude: this.state.markerPosition.latitude,
      longitude: this.state.markerPosition.longitude
    }
    data['accept'] = accept
    this.state.order = data
    this.socket.emit('app', data)
    // se hace luego de que el servidor aseguro que el servicio si es de esta app
    this.setState({goOrder: true})
  }

  processService (action) {
    let data = this.state.order
    let now = {
      nameCabman: 'Taxista de pruebas',
      latitude: this.state.markerPosition.latitude,
      longitude: this.state.markerPosition.longitude
    }
    data[action] = now
    data.action = action
    if (action === consts.actionArrive) {
      this.state.order = data
      this.socket.emit('app', data)
      this.setState({button: {
        title: consts.endService,
        color: consts.colorEndService,
        action: consts.actionEnd
      }})
    } else if (action === consts.actionEnd) {
      this.socket.emit('app', data)
      this.setState({button: {
        title: consts.arrive,
        color: consts.colorArrive,
        action: consts.actionArrive
      }})
      this.setState({goOrder: false})
      this.setState({order: null})
    }
  }

  render () {
    const { region } = this.props
    console.log(region)

    return (
      <View style={styles.all}>
        <View style={styles.nav}>
          <Text style={styles.title}>
            Taxitura
          </Text>
          <Text style={styles.connection}>
            {this.state.connection.title}
          </Text>
        </View>
        <View style={styles.container}>
          { this.generateMap() }
        </View>
        <Button
          onPress={() => { this.processService(this.state.button.action) }}
          title={this.state.button.title}
          color={this.state.button.color}
          disabled={!this.state.goOrder}
        />
        <Modal isVisible={this.state.processOrder}>
          { this.generateOrder() }
        </Modal>
      </View>
    )
  }
}
