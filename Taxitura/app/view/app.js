/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  AppState,
  Platform,
  BackHandler,
  PermissionsAndroid
} from 'react-native'
import GPSState from 'react-native-gps-state'

import global from '../util/global'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'

import Container from '../component/container'
import ModalOrder from '../component/modalOrder'
import ModalPermission from '../component/modalPermission'

let service = null
let waitId = null
let permissionsStatus = false
let isServiceInMemory = false

export default class Taxitura extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isModalPermission: false,
      isModalOrder: false
    }
    global.socket.emit(kts.socket.serviceInMemory, global.user.id)
    global.socket.on(kts.socket.isServiceInMemory, order => {
      if (order) {
        service = order
        isServiceInMemory = true
      }
    })
    global.socket.on(kts.socket.app, order => {
      const { navigation } = this.props
      if (navigation.state.routeName === kts.app.id && global.position !== null &&
       !global.waitCanceled && order.action === kts.action.order &&
       service === null && waitId === null) {
        service = order
        this.openModalOrder(global.position, service.position_user)
      } else if (order.action === kts.action.order) {
        order[kts.json.cabman] = { id: global.user.id }
        global.socket.emit(kts.socket.addServiceList, order)
      }
    })
    this.getStatus()
  }

  componentWillMount () {
    if (Platform.OS === kts.platform.android) {
      BackHandler.addEventListener(kts.hardware.backPress, () => {
        const { navigation } = this.props
        if (navigation.state.routeName === kts.app.id) {
          BackHandler.exitApp()
        }
        return false
      })
    }
    AppState.addEventListener(kts.hardware.change, (nextAppState) => {
      if (nextAppState === kts.hardware.background) {
        this.componentWillUnmount()
      } else if (nextAppState === kts.hardware.active) {
        if (service) {
          // this.setState({ renderGPS: true })
        } else {
          // this.setState({ renderGPS: true, title: text.app.get.position, loading: true })
        }
        this.getStatus()
      }
    })
  }

  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
    AppState.removeEventListener(kts.hardware.change)
    if (Platform.OS === kts.platform.android) {
      BackHandler.removeEventListener(kts.hardware.backPress)
    }
  }

  getStatus () {
    GPSState.getStatus().then(status => {
      if (status === GPSState.RESTRICTED) {
        this.setState({isNoGps: true, textNoGps: text.app.gps.offGps, title: ''})
      } else if (status === GPSState.DENIED) {
        this.getPermissions()
      } else {
        this.analitycPosition()
      }
    })
  }

  getPermissions () {
    if (!permissionsStatus) {
      permissionsStatus = true
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.analitycPosition()
          } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
            this.setState({isNoGps: true, textNoGps: text.app.gps.withoutPermission, title: ''})
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            this.setState({isNoGps: false, title: '', isModalPermission: true})
          }
        })
    }
  }

  analitycPosition () {
    this.setState({title: text.app.get.position})
    if (global.position !== null) {
      this.drawPosition(global.position)
    }
    navigator.geolocation.getCurrentPosition(position => {
      global.position = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude)
      }
      this.drawPosition(global.position)
    },
    err => {
      if (global.position === null) {
        global.position = null
      }
    },
    {enableHighAccuracy: false, timeout: 8000, maximumAge: 1000})
    this.watchID = navigator.geolocation.watchPosition(position => {
      global.position = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude)
      }
      this.drawPosition(global.position)
    },
    err => {
      if (global.position === null) {
        global.position = null
      }
      this.getStatus()
    },
    {enableHighAccuracy: true, timeout: 1000, maximumAge: 5000, distanceFilter: 5})
  }

  drawPosition (position) {
    this.sendPosition(position)
    this.getAddress(position)
    this.setState({
      latitude: position.latitude,
      longitude: position.longitude
    })
  }

  sendPosition (position) {
    if (position) {
      let response = {
        position_cabman: {
          latitude: position.latitude,
          longitude: position.longitude
        },
        cabman: { id: global.user.id }
      }
      global.socket.emit(kts.socket.savePositionCab, response)
    }
  }

  getAddress (position) {
    fetch(urls.getGeocoding(position))
      .then(result => {
        return result.json()
      })
      .then(json => {
        let pos = json.results[0].formatted_address.split(kts.board.coma)
        this.setState({title: `${pos[0]}, ${pos[1]}`})
      })
  }

  openModalOrder (start, end) {
    fetch(urls.getDistanceMatrix(start, end))
      .then(result => {
        return result.json()
      })
      .then(json => {
        this.setState({
          distance: json.rows[0].elements[0].distance.value,
          time: json.rows[0].elements[0].duration.value,
          uri: service.user.url_pic,
          name: service.user.name,
          address: service.position_user.address,
          isModalOrder: true
        })
      })
  }

  render () {
    return (
      <Container.ContainerApp
        title={this.state.title}
        isService={this.state.isService}
        latitude={this.state.latitude}
        longitude={this.state.longitude}
        latitudeService={this.state.latitudeService}
        longitudeService={this.state.longitudeService}
        address={this.state.address}
        coords={this.state.coords}
        isNoGps={this.state.isNoGps}
        textNoGps={this.state.textNoGps}
        getStatus={() => {
          this.setState({isNoGps: false})
          if (!permissionsStatus) {
            this.setState({isNoGps: false})
          } else {
            permissionsStatus = false
          }
          this.getStatus()
        }}>
        <ModalOrder
          isVisible={this.state.isModalOrder}
          uri={this.state.uri}
          name={this.state.name}
          distance={this.state.distance}
          address={this.state.address}
          duration={1}
          onCancel={() => {}}
          onAccept={() => {}}
          />
        <ModalPermission
          isVisible={this.state.isModalPermission}
          onClose={() => {
            permissionsStatus = false
            this.setState({isModalPermission: false, isNoGps: true, textNoGps: text.app.gps.withoutPermission})
          }}
          onPreview={() => {
            permissionsStatus = false
            this.setState({isModalPermission: false})
          }} />
      </Container.ContainerApp>
    )
  }
}
