'use strict'
import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from 'react-native'
import styles from '../style/app.style'
import consts from '../constants/constants'
import util from '../util/util'
import Map from './map'
import Header from '../components/header'
import Bounceable from '../util/bounceable'
import io from 'socket.io-client'
import Modal from 'react-native-modal'
import Geocoder from 'react-native-geocoding'
import GPSState from 'react-native-gps-state'
import * as Progress from 'react-native-progress'
Geocoder.setApiKey(consts.apiKeyGeocoder)

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.015
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

let service = null
let orders = []

export default class Taxitura extends Component {
  constructor (props) {
    super(props)
    console.ignoredYellowBox = ['Setting a timer']
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
      processOrder: false,
      goOrder: false,
      renderGPS: true,
      renderGPSText: consts.offGPS,
      renderGPSImg: true,
      button: {
        title: consts.arrive,
        color: consts.colorArrive,
        action: consts.actionArrive
      },
      time: 1,
      enableHighAccuracy: false
    }
    this.socket = io(consts.serverSock, { transports: ['websocket'] })
    this.socket.on('app', order => {
      if (order.action === consts.order && service === null) {
        service = order
        this.getDistance(this.state.markerPosition,
          {latitude: order.order.latitude, longitude: order.order.longitude})
        this.setState({processOrder: true})
        this.reductionTime()
      } else if (order.action === consts.order && service !== null) {
        orders.push(order)
      }
    })
    this.socket.on('accept', order => {
      if (order.id === service.id) {
        service = order
        this.setState({goOrder: true})
        this.getAddress(this.state.markerPositionOrder, false)
      }
    })
    this.socket.on('arrive', order => {
      if (order.id === service.id) {
        service = order
        this.setState({button: {
          title: consts.endService,
          color: consts.colorEndService,
          action: consts.actionEnd
        }})
      }
    })
  }

  componentWillMount () {
    this.getStatus()
  }

  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { navigation } = this.props
      if (navigation.state.routeName === 'app') {
        BackHandler.exitApp()
      }
      return false
    })
  }

  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
    this.setState({renderGPS: false, renderGPSText: consts.offGPS, renderGPSImg: true})
    BackHandler.removeEventListener('hardwareBackPress')
  }

  getStatus () {
    GPSState.getStatus().then(status => {
      if (status === GPSState.RESTRICTED) {
        this.setState({renderGPS: false})
      } else if (status === GPSState.DENIED) {
        this.setState({renderGPS: false, renderGPSText: consts.deniedGPS, renderGPSImg: false})
      } else {
        this.analitycPosition()
      }
    })
  }

  analitycPosition () {
    navigator.geolocation.getCurrentPosition(position => {
      let initialRegion = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.setState({initialPosition: initialRegion})
      this.setState({markerPosition: initialRegion})
      this.setState({renderGPS: true})
      if (!this.state.enableHighAccuracy) {
        this.setState({enableHighAccuracy: true})
      }
    },
    err => {
      this.setState({renderGPS: false, renderGPSText: consts.offGPS, renderGPSImg: true})
    },
    {enableHighAccuracy: this.state.enableHighAccuracy, timeout: 1000, maximumAge: 1000})

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
      this.setState({renderGPS: true})
      if (!this.state.enableHighAccuracy) {
        this.setState({enableHighAccuracy: true})
      }
    },
    err => {
      this.setState({renderGPS: false, renderGPSText: consts.offGPS, renderGPSImg: true})
    },
    {enableHighAccuracy: this.state.enableHighAccuracy, timeout: 1000, maximumAge: 1000, distanceFilter: 2})
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
            source={{uri: service.order.url_pic}} />
          <View style={styles.nameUser}>
            <Text style={styles.textLarge}>
              {service.order.name}
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
          <TouchableOpacity onPress={() => { this.cancelOrder() }}>
            <View style={styles.buttonCancel}>
              <Text style={styles.textCancel}>Cancelar</Text>
            </View>
          </TouchableOpacity>
          <Progress.Bar
            progress={this.state.time}
            width={280}
            color={'rgb(163, 153, 167)'}
            borderColor={'rgb(163, 153, 167)'}
            style={styles.progress} />
        </View>
      )
    } else {
      return (<View />)
    }
  }

  reductionTime () {
    let idSet = setInterval(() => {
      let time = this.state.time
      if (time <= 0.0) {
        this.setState({ processOrder: false })
        this.setState({ order: null, time: 1 })
        clearInterval(idSet)
      } else {
        time = time - 0.025
        this.setState({time})
      }
    }, 250)
  }

  cancelOrder () {
    this.setState({processOrder: false, time: 1})
    service = null
  }

  acceptOrder () {
    let position = {
      latitude: service.order.latitude,
      longitude: service.order.longitude
    }
    this.state.markerPositionOrder = position
    this.setState({processOrder: false, time: 1})
    let data = service
    data['action'] = 'order'
    let accept = {
      nameCabman: 'Taxista de pruebas',
      distance: this.state.distance,
      latitude: this.state.markerPosition.latitude,
      longitude: this.state.markerPosition.longitude
    }
    data['accept'] = accept
    service = data
    this.socket.emit('app', data)
  }

  processService (msn) {
    service.action = msn
    this.socket.emit('app', service)
    if (msn === consts.actionEnd) {
      this.setState({button: {
        title: consts.arrive,
        color: consts.colorArrive,
        action: consts.actionArrive
      }})
      this.setState({goOrder: false})
      service = null
    }
  }

  changeGPS () {
    if (this.state.renderGPS) {
      return (
        <Map
          goOrder={this.state.goOrder}
          initial={this.state.initialPosition}
          markerMe={this.state.markerPosition}
          markerOrder={this.state.markerPositionOrder}
          address={this.state.addressMarker} />
      )
    } else {
      if (this.state.renderGPSImg) {
        return (
          <View style={styles.notgps}>
            <Image source={require('../img/gps_disenabled.png')} />
            <Text style={styles.textGps}>{this.state.renderGPSText}</Text>
            <Bounceable
              onPress={() => { this.getStatus() }}
              level={1.1}>
              <View>
                <Image source={require('../img/gps_reload.png')} style={styles.imgReload} />
              </View>
            </Bounceable>
          </View>
        )
      } else {
        return (
          <View style={styles.notgps}>
            <Image source={require('../img/gps_denied.png')} />
            <Text style={styles.textGps}>{this.state.renderGPSText}</Text>
            <Bounceable
              onPress={() => { this.getStatus() }}
              level={1.1}>
              <View>
                <Image source={require('../img/gps_reload.png')} style={styles.imgReload} />
              </View>
            </Bounceable>
          </View>
        )
      }
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: null,
      header: <Header
        login
        navigate={navigation}
      />
    }
  }

  render () {
    return (
      <View style={styles.all}>
        <View style={styles.container}>
          <View style={styles.addreess}>
            <Text style={styles.textAddreess}>{this.state.address}</Text>
          </View>
          { this.changeGPS() }
          <View style={[styles.footer, {display: (this.state.goOrder && this.state.renderGPS) ? 'flex' : 'none'}]}>
            <TouchableOpacity onPress={() => { this.processService(this.state.button.action) }}>
              <View style={styles.footerAccept}>
                <Text style={styles.textFooter}>
                  {this.state.button.title}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Modal isVisible={(this.state.processOrder && this.state.renderGPS)}>
          { this.generateOrder() }
        </Modal>
      </View>
    )
  }
}
