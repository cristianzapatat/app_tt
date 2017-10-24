'use strict'
/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  AppState,
  Platform
} from 'react-native'
import styles from '../style/app.style'
import consts from '../constants/constants'
import util from '../util/util'
import fs from '../util/fs'
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
let LATITUDE_DELTA = 0.015
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

let service = null
let orders = []
let user

export default class Taxitura extends Component {
  constructor (props) {
    super(props)
    if (consts.user) {
      user = consts.user
    } else {
      this.logout()
    }
    console.ignoredYellowBox = ['Setting a timer']
    this.state = {
      initialPosition: {
        latitude: 3.8863253,
        longitude: -77.0498246,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      markerPosition: {
        latitude: 3.8863253,
        longitude: -77.0498246
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
      time: 1
    }
    this.socket = io(consts.serverSock, { transports: ['websocket'] })
    this.socket.on('app', order => {
      if (order.action === consts.order && service === null) {
        service = order
        this.getDistance(this.state.markerPosition,
          {latitude: service.position_user.latitude, longitude: service.position_user.longitude})
        this.setState({processOrder: true})
        this.reductionTime()
      } else if (order.action === consts.order && service !== null) {
        orders.push(order)
      }
    })
    this.socket.on('accept', order => {
      if (order.service.id === service.service.id) {
        service = order
        this.setState({goOrder: true})
        this.getAddress(this.state.markerPositionOrder, false)
      }
    })
    this.socket.on('arrive', order => {
      if (order.service.id === service.service.id) {
        service = order
        this.setState({button: {
          title: consts.endService,
          color: consts.colorEndService,
          action: consts.actionEnd
        }})
      }
    })
    this.socket.on('getPositionApp', data => {
      if (service) {
        if (data.user.id === service.user.id && data.service.id === service.service.id) {
          let response = {
            position: this.state.markerPosition,
            user: service.user
          }
          this.socket.emit('returnPositionApp', response)
        }
      }
    })
  }

  componentWillMount () {
    this.getStatus()
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        this.componentWillUnmount()
      } else if (nextAppState === 'active') {
        this.getStatus()
      }
    })
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        const { navigation } = this.props
        if (navigation.state.routeName === 'app') {
          BackHandler.exitApp()
        }
        return false
      })
    }
  }

  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
    AppState.removeEventListener('change')
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress')
    }
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
        longitude: parseFloat(position.coords.longitude)
      }
      this.uploadPosition(initialRegion)
      this.getAddress(initialRegion, true)
      this.setState({
        initialPosition: {
          latitude: initialRegion.latitude,
          longitude: initialRegion.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        },
        markerPosition: initialRegion,
        renderGPS: true
      })
    },
    err => {
      this.getStatus()
    },
    {enableHighAccuracy: true, timeout: 10000, maximumAge: 500})

    this.watchID = navigator.geolocation.watchPosition(position => {
      let lastRegion = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude)
      }
      this.uploadPosition(lastRegion)
      this.getAddress(lastRegion, true)
      this.setState({
        initialPosition: {
          latitude: lastRegion.latitude,
          longitude: lastRegion.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        },
        markerPosition: lastRegion,
        renderGPS: true
      })
    },
    err => {
      this.getStatus()
    },
    {enableHighAccuracy: true, timeout: 10000, maximumAge: 500, distanceFilter: 1})
  }

  uploadPosition (position) {
    if (service && position) {
      let response = {
        position_cabman: {
          latitude: position.latitude,
          longitude: position.longitude
        },
        cabman: { id: user.cedula }
      }
      this.socket.emit('savePositionCab', response)
    }
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
            source={{uri: service.user.url_pic}} />
          <View style={styles.nameUser}>
            <Text style={styles.textLarge}>
              {service.user.name}
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
        this.setState({ processOrder: false, order: null, time: 1 })
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
    this.setState({
      processOrder: false,
      time: 1,
      markerPositionOrder: {
        latitude: service.position_user.latitude,
        longitude: service.position_user.longitude
      }
    })
    service['cabman'] = {
      id: user.cedula,
      name: user.nombre,
      photo: 'https://thumbs.dreamstime.com/b/taxista-14436793.jpg'
    }
    service['position_cabman'] = {
      distance: this.state.distance,
      latitude: this.state.markerPosition.latitude,
      longitude: this.state.markerPosition.longitude
    }
    this.socket.emit('app', service)
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

  logout () {
    this.componentWillUnmount()
    this.props.navigation.navigate('login')
    fs.deleteFile(`${consts.persistenceFile}${consts.fileLogin}`)
  }

  onRegionChange (region) {
    LATITUDE_DELTA = region.latitudeDelta
    LONGITUDE_DELTA = region.longitudeDelta
  }

  changeGPS () {
    if (this.state.renderGPS) {
      return (
        <Map
          goOrder={this.state.goOrder}
          initial={this.state.initialPosition}
          markerMe={this.state.markerPosition}
          markerOrder={this.state.markerPositionOrder}
          address={this.state.addressMarker}
          onRegionChange={this.onRegionChange} />
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

  getBody () {
    return (
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
    )
  }

  render () {
    return (
      <View style={styles.all}>
        <Header
          renderLogout
          onPress={() => { this.logout() }} />
        { this.getBody() }
        <Modal isVisible={(this.state.processOrder && this.state.renderGPS)}>
          { this.generateOrder() }
        </Modal>
      </View>
    )
  }
}
