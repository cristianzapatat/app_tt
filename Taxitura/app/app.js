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
import Polyline from '@mapbox/polyline'
import * as Progress from 'react-native-progress'
Geocoder.setApiKey(consts.apiKeyGeocoding)

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
let LATITUDE_DELTA = 0.015
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

let service = null
let orders = []
let waitId = null
let user
let coords = []

export default class Taxitura extends Component {
  constructor (props) {
    super(props)
    if (consts.user) {
      user = consts.user
    } else {
      this.logout()
    }
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
      loading: true,
      button: {
        title: consts.arrive,
        color: consts.colorArrive,
        action: consts.actionArrive
      },
      time: 1
    }
    this.socket = io(consts.serverSock, { transports: ['websocket'] })
    this.socket.on('app', order => {
      if (order.action === consts.order && service === null && waitId === null) {
        service = order
        this.getDistance(this.state.markerPosition,
          {latitude: service.position_user.latitude, longitude: service.position_user.longitude})
        this.setState({processOrder: true})
        this.reductionTime()
      } else if (order.action === consts.order) {
        orders.push(order)
      }
    })
    this.socket.on('accept', order => {
      if (order !== null) {
        if (order.service.id === waitId) {
          if (service === null) {
            service = order
            this.getInfoOrder(this.state.markerPosition, service.position_user)
          } else {
            this.cleanService()
          }
        } else {
          this.cleanService()
        }
      } else {
        this.cleanService()
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
    this.getStatus()
  }

  componentWillMount () {
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
    if (!this.state.loading) {
      this.setState({ loading: true })
    }
    GPSState.getStatus().then(status => {
      if (status === GPSState.RESTRICTED) {
        this.setState({renderGPS: false, loading: false})
      } else if (status === GPSState.DENIED) {
        this.setState({renderGPS: false, renderGPSText: consts.deniedGPS, renderGPSImg: false, loading: false})
      } else {
        this.analitycPosition()
      }
    })
  }

  analitycPosition () {
    this.watchID = navigator.geolocation.watchPosition(position => {
      let lastRegion = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude)
      }
      this.uploadPosition(lastRegion)
      this.setState({
        initialPosition: {
          latitude: lastRegion.latitude,
          longitude: lastRegion.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        },
        markerPosition: lastRegion,
        renderGPS: true,
        loading: false
      })
      this.getAddress(lastRegion, true)
    },
    err => {
      this.getStatus()
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 5000, distanceFilter: 10})
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
      let data = await fetch(consts.getDistanceMatrix(start, end))
      let json = await data.json()
      this.setState({distance: json})
    } catch (error) {
      return error
    }
  }

  async getInfoOrder (start, end) {
    try {
      let resp = await fetch(consts.getDirections(start, end))
      let respJson = await resp.json()
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points)
      coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
    } catch (error) {
      coords = [
        {latitude: start.latitude, longitude: start.longitude},
        {latitude: end.latitude, longitude: end.longitude}
      ]
    }
    this.getAddress(end, false)
    this.state.markerPositionOrder = {
      latitude: end.latitude,
      longitude: end.longitude
    }
    this.setState({goOrder: true, loading: false})
  }

  getAddress (region, flag) {
    if (region !== null) {
      Geocoder.getFromLatLng(region.latitude, region.longitude).then(json => {
        let pos = json.results[0].formatted_address.split(',')
        if (flag) {
          this.setState({address: pos[0] + ', ' + pos[1]})
        } else {
          this.state.addressMarker = `${pos[0]}, ${pos[1]}`
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

  cleanService () {
    service = null
    waitId = null
    coords = []
    this.setState({loading: false})
  }

  cancelOrder () {
    this.setState({processOrder: false, time: 1})
    service = null
  }

  acceptOrder () {
    this.setState({
      processOrder: false,
      loading: true,
      time: 1
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
    waitId = service.service.id
    service = null
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
      this.cleanService()
      this.setState({goOrder: false})
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
          onRegionChange={this.onRegionChange}
          coords={coords} />
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

  render () {
    return (
      <Header
        renderMenu
        onPress={() => { this.logout() }}
      >
        <View style={styles.enter}>
          <View style={styles.addreess}>
            <Text style={styles.textAddreess}>{this.state.address}</Text>
            <Progress.CircleSnail
              style={[{display: this.state.loading ? 'flex' : 'none'}, styles.loading]}
              size={30}
              color={['#2980b9']}
              strokeCap={'round'}
              animating={this.state.loading}
            />
          </View>
          { this.changeGPS() }
          <View style={[{display: this.state.loading ? 'flex' : 'none'}, styles.over]} />
          <View style={[styles.footer, {display: (this.state.goOrder && this.state.renderGPS && !this.state.loading) ? 'flex' : 'none'}]}>
            <TouchableOpacity onPress={() => { this.processService(this.state.button.action) }}>
              <View style={styles.footerAccept}>
                <Text style={styles.textFooter}>
                  {this.state.button.title}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Modal isVisible={(this.state.processOrder && this.state.renderGPS && !this.state.loading)}>
          { this.generateOrder() }
        </Modal>
      </Header>
    )
  }
}
