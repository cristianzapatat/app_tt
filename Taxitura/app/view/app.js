/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Dimensions, AppState } from 'react-native'
import Geocoder from 'react-native-geocoding'
import GPSState from 'react-native-gps-state'
import Polyline from '@mapbox/polyline'
import * as Progress from 'react-native-progress'

import styles from '../style/app.style'
import Container from '../component/container'
import Map from '../component/map'
import NoGps from '../component/noGps'
import OrderModal from '../component/orderModal'
import consts from '../constant/constant'
import fs from '../util/fs'

Geocoder.setApiKey(consts.apiKeyGeocoding)

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
let LATITUDE_DELTA = 0.015
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

let service = null
let orders = []
let waitId = null
let coords = []

export default class Taxitura extends Component {
  constructor (props) {
    super(props)
    if (consts.user) {
      consts.view = 'app'
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
      markerPosition: { latitude: 3.8863253, longitude: -77.0498246 },
      markerPositionOrder: { latitude: 0, longitude: 0 },
      address: '',
      addressMarker: '',
      distance: null,
      time: null,
      processOrder: false,
      goOrder: false,
      renderGPS: true,
      noGpsText: consts.offGPS,
      noGps: true,
      loading: true,
      button: {
        title: consts.arrive,
        color: consts.colorArrive,
        action: consts.actionArrive
      }
    }
    consts.socket.on('app', order => {
      if (consts.view === 'app' && !consts.waitCanceled &&
          order.action === consts.order && service === null && waitId === null) {
        service = order
        this.getDistance(true, this.state.markerPosition,
          {latitude: service.position_user.latitude, longitude: service.position_user.longitude})
        this.setState({ processOrder: true })
      } else if (order.action === consts.order) {
        orders.push(order)
      }
    })
    consts.socket.on('orderCanceled', order => {
      if (order) {
        if (consts.view === 'app' && consts.waitCanceled &&
            order.action === consts.order && service === null && waitId === null) {
          service = order
          this.getInfoOrder(this.state.markerPosition, service.position_user)
        }
      } else {
        consts.waitCanceled = false
        this.cleanService()
      }
    })
    consts.socket.on('accept', order => {
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
    consts.socket.on('arrive', order => {
      if (order.service.id === service.service.id) {
        service = order
        this.setState({button: {
          title: consts.endService,
          color: consts.colorEndService,
          action: consts.actionEnd
        }})
      }
    })
    consts.socket.on('deleteService', order => {
      this.deleteService(order)
      if (service === order) {
        this.cancelOrder(false)
      }
    })
    consts.socket.on('getPositionApp', data => {
      if (service) {
        if (data.user.id === service.user.id && data.service.id === service.service.id) {
          let response = {
            position: this.state.markerPosition,
            user: service.user
          }
          consts.socket.emit('returnPositionApp', response)
        }
      }
    })
    this.getStatus()
  }

  componentWillMount () {
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        this._componentWillUnmount()
      } else if (nextAppState === 'active') {
        this.getStatus()
      }
    })
  }

  _componentWillUnmount () {
    console.log('_componentWillUnmount')
    navigator.geolocation.clearWatch(this.watchID)
    AppState.removeEventListener('change')
  }

  getStatus () {
    GPSState.getStatus().then(status => {
      if (status === GPSState.RESTRICTED) {
        this.setState({renderGPS: false, loading: false})
      } else if (status === GPSState.DENIED) {
        this.setState({renderGPS: false, noGpsText: consts.deniedGPS, noGps: false, loading: false})
      } else {
        this.analitycPosition()
      }
    })
  }

  analitycPosition () {
    if (consts.position !== null) {
      this.__drawPosition(consts.position)
    }
    navigator.geolocation.getCurrentPosition(position => {
      consts.position = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.__drawPosition(consts.position)
    },
    err => {
      console.log(err)
      consts.position = null
    },
    {enableHighAccuracy: false, timeout: 85000, maximumAge: 1000})
    this.watchID = navigator.geolocation.watchPosition(position => {
      consts.position = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.__drawPosition(consts.position)
    },
    err => {
      console.log(err)
      consts.position = null
      this.getStatus()
    },
    {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: 5})
  }

  __drawPosition (position) {
    this.uploadPosition(position)
    this.setState({
      initialPosition: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: position.latitudeDelta,
        longitudeDelta: position.longitudeDelta
      },
      markerPosition: position,
      renderGPS: true,
      loading: false
    })
    this.getAddress(position, true)
  }

  uploadPosition (position) {
    if (service && position) {
      let response = {
        position_cabman: {
          latitude: position.latitude,
          longitude: position.longitude
        },
        cabman: { id: consts.user.cedula }
      }
      consts.socket.emit('savePositionCab', response)
    }
  }

  async getDistance (status, start, end) {
    try {
      let data = await fetch(consts.getDistanceMatrix(start, end))
      let json = await data.json()
      if (status) {
        this.setState({
          distance: json.rows[0].elements[0].distance.value,
          time: json.rows[0].elements[0].duration.value
        })
      } else {
        this.state.distance = json.rows[0].elements[0].distance.value
        this.state.time = json.rows[0].elements[0].duration.value
        this.acceptOrder()
      }
    } catch (err) {
      this.setState({distance: null, time: null})
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
    } catch (err) {
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

  cleanService () {
    service = null
    waitId = null
    coords = []
    this.setState({loading: false})
  }

  cancelOrder (status) {
    if (status) {
      service['cabman'] = {
        id: consts.user.cedula
      }
      consts.socket.emit('addServiceCanceled', service)
    }
    this.setState({processOrder: false, loading: false, distance: null, time: null})
    service = null
    waitId = null
  }

  acceptOrder () {
    if (service) {
      this.setState({
        processOrder: false,
        loading: true
      })
      service['cabman'] = {
        id: consts.user.cedula,
        name: consts.user.nombre,
        photo: 'https://thumbs.dreamstime.com/b/taxista-14436793.jpg'
      }
      service['position_cabman'] = {
        distance: this.state.distance,
        time: this.state.time,
        latitude: this.state.markerPosition.latitude,
        longitude: this.state.markerPosition.longitude
      }
      consts.socket.emit('app', service)
      waitId = service.service.id
      service = null
      this.state.distance = null
      this.state.time = null
    }
  }

  processService (msn) {
    service.action = msn
    consts.socket.emit('app', service)
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

  deleteService (service) {
    let index = orders.indexOf(service)
    if (index > -1) {
      orders.splice(index, 1)
    }
  }

  logout () {
    this.componentWillUnmount()
    this.props.navigation.navigate('login')
    fs.deleteFile(`${consts.persistenceFile}${consts.fileLogin}`)
  }

  goListServives () {
    this.props.navigation.navigate('listService', {destroy: () => { this._componentWillUnmount() }})
  }

  onRegionChange (region) {
    LATITUDE_DELTA = region.latitudeDelta
    LONGITUDE_DELTA = region.longitudeDelta
    consts.position = region
  }

  _drawMap () {
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
      return (
        <NoGps
          onPress={() => { this.getStatus() }}
          visible={this.state.noGps}
          text={this.state.noGpsText} />
      )
    }
  }

  _drawModal () {
    if (this.state.processOrder && this.state.renderGPS &&
      !this.state.loading && this.state.distance != null) {
      return (
        <OrderModal
          isVisible
          nameUser={service ? service.user.name : null}
          uri={service ? service.user.url_pic : null}
          distance={(this.state.distance) ? this.state.distance : 0}
          accept={() => { this.acceptOrder() }}
          cancel={() => { this.cancelOrder(true) }} />
      )
    } else {
      return (
        <View />
      )
    }
  }

  render () {
    return (
      <Container
        renderMenu
        isListServives
        goListServives={() => { this.goListServives() }}
        destroy={() => { this._componentWillUnmount() }}
        onPress={() => { this.logout() }}>
        <View style={styles.enter}>
          <View style={styles.addreess}>
            <Text style={styles.textAddreess}>{this.state.address}</Text>
            <Progress.CircleSnail
              style={[{display: this.state.loading ? 'flex' : 'none'}, styles.loading]}
              size={30}
              color={['#2980b9']}
              strokeCap={'round'}
              animating={this.state.loading} />
          </View>
          { this._drawMap() }
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
        { this._drawModal() }
      </Container>
    )
  }
}
