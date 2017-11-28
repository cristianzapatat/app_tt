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
import util from '../util/util'

import Container from '../component/container'
import ModalOrder from '../component/modalOrder'
import ModalPermission from '../component/modalPermission'

let coords = []
let permissionsStatus = false
let isServiceInMemory = false
let idSet

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
        global.service = order
        isServiceInMemory = true
      }
    })
    global.socket.on(kts.socket.app, order => {
      const { navigation } = this.props
      if (navigation.state.routeName === kts.app.id && global.position !== null &&
       !global.waitCanceled && order.action === kts.action.order &&
       global.service === null && global.waitId === null) {
        global.service = order
        this.openModalOrder(global.position, global.service.position_user)
      } else if (order.action === kts.action.order) {
        order[kts.json.cabman] = { id: global.user.id }
        global.socket.emit(kts.socket.addServiceList, order)
      }
    })
    global.socket.on(kts.socket.orderCanceled, order => {
      if (order) {
        const { navigation } = this.props
        if (navigation.state.routeName === kts.app.id && global.position !== null &&
          global.waitCanceled && order.action === kts.action.order &&
          global.service === null && global.waitId === null) {
          global.service = order
          this.getInfoOrder()
        }
      } else { this.cleanService() }
    })
    global.socket.on(kts.socket.accept, order => {
      if (order !== null) {
        if (order.service.id === global.waitId) {
          if (global.service === null) {
            global.service = order
            this.getInfoOrder()
          } else { this.cleanService() }
        } else { this.cleanService() }
      } else { this.cleanService() }
    })
    global.socket.on(kts.socket.deleteService, idService => {
      if (global.service) {
        if (global.service.service.id === idService) {
          this.cancelOrder(false)
        }
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
        this.getAddress(global.position)
        this.getStatus()
      }
    })
  }

  componentWillUnmount () {
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
    if (isServiceInMemory) {
      isServiceInMemory = false
      this.getInfoOrder()
    }
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
    if (position) {
      fetch(urls.getGeocoding(position))
        .then(result => {
          return result.json()
        })
        .then(json => {
          if (json.status && json.status === kts.json.ok) {
            let pos = json.results[0].formatted_address.split(kts.board.coma)
            this.setState({title: `${pos[0]}, ${pos[1]}`})
          }
        })
    }
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
          uri: global.service.user.url_pic,
          name: global.service.user.name,
          address: global.service.position_user.address,
          duration: 1,
          isModalOrder: true
        })
        this.reductionduration()
      })
  }

  reductionduration () {
    setTimeout(() => {
      idSet = setInterval(() => {
        let duration = this.state.duration
        if (duration <= 0.0) {
          this.setState({duration})
          clearInterval(idSet)
          this.cancelOrder(true)
        } else {
          duration = duration - 0.1
          this.setState({duration})
        }
      }, 1000)
    }, 100)
  }

  cancelOrder (status) {
    clearInterval(idSet)
    this.setState({ isModalOrder: false })
    if (status) {
      global.service[kts.json.cabman] = { id: global.user.id }
      global.socket.emit(kts.socket.addServiceCanceled, global.service)
    }
    global.service = null
    global.waitId = null
    global.socket.emit(kts.socket.nextService, global.user.id)
  }

  acceptOrder () {
    clearInterval(idSet)
    this.setState({ isModalOrder: false })
    if (global.service) {
      global.service[kts.json.cabman] = {
        id: global.user.id,
        name: global.user.nombre,
        photo: urls.getUrlPhoto(global.user.foto.url)
      }
      global.service[kts.json.position_cabman] = {
        distance: this.state.distance,
        time: this.state.time,
        latitude: this.state.latitude,
        longitude: this.state.longitude
      }
      global.service.action = kts.action.accept
      global.socket.emit(kts.socket.app, global.service)
      global.waitId = global.service.service.id
      global.service = null
    }
  }

  cleanService () {
    global.service = null
    global.waitId = null
    coords = []
    global.waitCanceled = false
    this.setState({ isButton: false, isService: false })
  }

  async getInfoOrder () {
    try {
      let resp = await fetch(urls.getDirections(global.position, global.service.position_user))
      let respJson = await resp.json()
      let points = util.decode(respJson.routes[0].overview_polyline.points, 5)
      coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
    } catch (err) {
      coords = [
        {latitude: global.position.latitude, longitude: global.position.longitude},
        {latitude: global.service.position_user.latitude, longitude: global.service.position_user.longitude}
      ]
    }
    this.setState({
      latitudeService: global.service.position_user.latitude,
      longitudeService: global.service.position_user.longitude,
      address: global.service.position_user.andress,
      textButton: global.service.action === kts.action.accept ? text.app.label.iArrived : text.app.label.weArrived,
      isService: global.service.action === kts.action.accept,
      isButton: true
    })
  }

  processService () {
    global.service.action = (global.service.action === kts.action.accept) ? kts.action.arrive : kts.action.end
    global.socket.emit(kts.socket.app, global.service)
    if (global.service.action === kts.action.arrive) {
      coords = []
      this.setState({ textButton: text.app.label.weArrived, isService: false })
    } else {
      this.cleanService()
      global.socket.emit(kts.socket.nextService, global.user.id)
    }
  }

  render () {
    return (
      <Container.ContainerApp
        title={this.state.title}
        isService={this.state.isService}
        isButton={this.state.isButton}
        latitude={this.state.latitude}
        longitude={this.state.longitude}
        latitudeService={this.state.latitudeService}
        longitudeService={this.state.longitudeService}
        address={this.state.address}
        coords={coords}
        textButton={this.state.textButton}
        onProcess={() => { this.processService() }}
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
          duration={this.state.duration}
          onCancel={() => { this.cancelOrder(true) }}
          onAccept={() => { this.acceptOrder() }}
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
