import React, { Component } from 'react'
import {
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import styles from '../style/app.style'
import consts from '../constants/constants'
import util from '../util/util'
import Map from './map'
import io from 'socket.io-client'
import Modal from 'react-native-modal'
import Geocoder from 'react-native-geocoding'
Geocoder.setApiKey(consts.apiKeyGeocoder)

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.015
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
      address: '',
      addressMarker: '',
      distance: null,
      connection: {},
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
      this.state.connection = data.connection
    })
    this.socket.on('disconnect', reason => {
      this.setState({connection: {}})
    })
    this.socket.on('app', order => {
      if (order.action === consts.order && this.state.order === null) {
        this.state.order = order
        this.getDistance(this.state.markerPosition,
          {latitude: order.order.latitude, longitude: order.order.longitude})
        this.setState({processOrder: true})
      }
    })
    this.socket.on('accept', order => {
      if (order.id === this.state.order.id) {
        this.setState({goOrder: true})
        this.getAddress(this.state.markerPositionOrder, false)
      }
    })
  }

  componentDidMount () {
    navigator.geolocation.getCurrentPosition(position => {
      let initialRegion = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude),
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
      let lastRegion = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.setState({initialPosition: lastRegion})
      this.setState({markerPosition: lastRegion})
      this.getAddress(lastRegion, true)
    })
  }

  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
  }

  async getDistance (start, end) {
    try {
      let startLoc = `${start.latitude},${start.longitude}`
      let endLoc = `${end.latitude},${end.longitude}`
      let data = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${startLoc}&destinations=${endLoc}&key=${consts.apiDistanceAndTime}&units=metric`)
      let json = await data.json()
      this.setState({distance: json})
    } catch (error) {
      return error
    }
  }

  getAddress (region, flag) {
    if (region !== null) {
      Geocoder.getFromLatLng(region.latitude, region.longitude).then(json => {
        let pos = json.results[0].formatted_address.split(',')
        if (flag) {
          this.setState({address: pos[0] + ', ' + pos[1]})
        } else {
          this.setState({addressMarker: pos[0] + ', ' + pos[1]})
        }
      })
    }
  }

  generateOrder () {
    if (this.state.processOrder && this.state.distance != null) {
      return (
        <View style={styles.modalContent}>
          <Image
            style={styles.imageOrder}
            source={{uri: this.state.order.order.url_pic}} />
          <View style={styles.nameUser}>
            <Text style={styles.textLarge}>
              {this.state.order.order.name}
            </Text>
            <Text style={styles.textSmall}>
              A {util.getMeters(this.state.distance.rows[0].elements[0].distance.value)}
            </Text>
          </View>
          <View style={styles.stateUser}>
            <Text style={styles.textState}>
              Usuario Recurrente
            </Text>
          </View>
          <TouchableOpacity onPress={() => { this.acceptOrder() }}>
            <View style={styles.buttonAccept}>
              <Text style={styles.textAccept}>Aceptar servicio</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.setState({processOrder: false, order: null}) }}>
            <View style={styles.buttonCancel}>
              <Text style={styles.textCancel}>Cancelar</Text>
            </View>
          </TouchableOpacity>
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
      distance: this.state.distance,
      latitude: this.state.markerPosition.latitude,
      longitude: this.state.markerPosition.longitude
    }
    data['accept'] = accept
    this.state.order = data
    this.socket.emit('app', data)
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
    return (
      <View style={styles.all}>
        <View style={styles.nav}>
          <Image source={require('../img/taxitura.png')} />
        </View>
        <View style={styles.container}>
          <View style={styles.addreess}>
            <Text style={styles.textAddreess}> {this.state.address} </Text>
          </View>
          <Map
            goOrder={this.state.goOrder}
            initial={this.state.initialPosition}
            markerMe={this.state.markerPosition}
            markerOrder={this.state.markerPositionOrder}
            address={this.state.addressMarker} />
          <View style={[styles.footer, {display: (this.state.goOrder) ? 'flex' : 'none'}]}>
            <TouchableOpacity onPress={() => { this.processService(this.state.button.action) }}>
              <View style={styles.footerAccept}>
                <Text style={styles.textFooter}>
                  {this.state.button.title}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Modal isVisible={this.state.processOrder}>
          { this.generateOrder() }
        </Modal>
      </View>
    )
  }
}
