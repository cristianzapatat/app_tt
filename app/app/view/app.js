/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  AppState,
  Platform,
  BackHandler,
  PermissionsAndroid,
  AsyncStorage
} from 'react-native'
import GPSState from 'react-native-gps-state'
import { EventRegister } from 'react-native-event-listeners'

import global from '../util/global'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'
import util from '../util/util'

import Container from '../component/container'
import Menu from '../component/menu'
import ModalOrder from '../component/modalOrder'
import ModalPermission from '../component/modalPermission'

let coords = []
let permissionsStatus = false
let isServiceInMemory = false

export default class Taxitura extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isModalPermission: false,
      isModalOrder: false,
      isMenu: false,
      load: true,
      loadService: false,
      message: text.intenet.without,
      typeMessage: kts.enum.WITHOUT,
      isMns: false
    }
    util.isInternet().then(status => {
      if (status) {
        global.socket.emit(kts.socket.serviceInMemory, global.user.id)
        global.socket.on(kts.socket.isServiceInMemory, order => {
          if (order) {
            global.service = order
            isServiceInMemory = true
          } else {
            this.setState({isButton: false})
          }
          global.socket.on(kts.socket.receiveService, order => {
            const { navigation } = this.props
            if (global.state && navigation.state.routeName === kts.app.id &&
              global.position !== null && !global.waitCanceled &&
              order.action === kts.action.order && global.service === null &&
              global.waitId === null && (parseInt(global.user.credito + global.user.credito_ganancia) - global.serviceFact) > 0) {
              global.service = order
              this.openModalOrder(global.position, global.service.position_user)
            }
          })
          global.socket.on(kts.socket.orderCanceled, order => {
            if (order) {
              const { navigation } = this.props
              if (navigation.state.routeName === kts.app.id && global.position !== null &&
                global.waitCanceled && order.action === kts.action.accept &&
                global.service === null && global.waitId === null && (parseInt(global.user.credito + global.user.credito_ganancia) - global.serviceFact) > 0) {
                global.service = order
                this.getInfoOrder()
              }
            } else { this.cleanService() }
          })
          global.socket.on(kts.socket.acceptService, order => {
            if (order !== null) {
              if (order.service.id === global.waitId && global.service === null) {
                global.service = order
                this.getInfoOrder()
              } else { this.cleanService() }
            } else {
              this.cleanService()
              EventRegister.emit(kts.event.showOtherAccept, true)
            }
          })
          global.socket.on(kts.socket.processService, order => {
            global.service = order
            if (global.service.action === kts.action.arrive) {
              coords = []
              this.setState({textButton: text.app.label.aboard, isService: false, isButton: true, loadService: false})
            } else if (global.service.action === kts.action.aboard) {
              this.setState({textButton: text.app.label.weArrived, isButton: true, loadService: false})
            } else if (global.service.action === kts.action.end) {
              EventRegister.emit(kts.event.addServiceToday, 1)
              this.cleanService()
            }
          })
          global.socket.on(kts.socket.deleteService, idService => {
            if (global.service && global.service.service.id === idService) {
              this.cancelOrder(false)
            }
          })
          global.socket.on(kts.socket.onMyWay, (data) => {
            if (global.service && global.service.service.id === parseInt(data.service.id)) {
              EventRegister.emit(kts.event.showOnMyWay, true)
            }
          })
          this.getStatus(true)
        })
      } else {
        this.setState({isMns: true, load: false})
      }
    })
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
    this.appEventAcceptCancel = EventRegister.addEventListener(kts.event.appAcceptCancel, () => {
      this.setState({isButton: null, loadService: true})
      EventRegister.emit(kts.event.changeState, {state: false, case: 0})
    })
  }

  componentWillUnmount () {
    AppState.removeEventListener(kts.hardware.change)
    if (Platform.OS === kts.platform.android) {
      BackHandler.removeEventListener(kts.hardware.backPress)
    }
    EventRegister.removeEventListener(this.appEventAcceptCancel)
  }

  getStatus (action) {
    if (!action) this.setState({load: true})
    GPSState.getStatus().then(status => {
      if (status === GPSState.RESTRICTED) {
        this.setState({isNoGps: true, textNoGps: text.app.gps.offGps, title: '', load: false})
      } else if (status === GPSState.DENIED) {
        this.setState({load: false})
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
            this.setState({load: true})
            this.analitycPosition()
          } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
            this.setState({isNoGps: true, textNoGps: text.app.gps.withoutPermission, title: '', load: false})
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            this.setState({isNoGps: false, title: '', isModalPermission: true, load: false})
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
    {enableHighAccuracy: true, timeout: 1000, maximumAge: 1000, distanceFilter: 0.5})
  }

  drawPosition (position) {
    this.sendPosition(position)
    this.getAddress(position)
    EventRegister.emit(kts.event.changePosition, position)
    this.setState({
      latitude: position.latitude,
      longitude: position.longitude
    })
    if (isServiceInMemory) {
      isServiceInMemory = false
      EventRegister.emit(kts.event.changeState, {state: false, case: 0})
      this.getInfoOrder()
    }
  }

  sendPosition (position) {
    if (position) {
      global.socket.emit(kts.socket.savePositionCab, {
        id: global.user.id,
        service: global.service !== null ? global.service.service.id : null,
        action: global.service !== null ? global.service.action : '',
        position: {
          latitude: position.latitude,
          longitude: position.longitude
        }
      })
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
            this.setState({title: `${pos[0]}, ${pos[1]}`, load: false})
          } else {
            this.setState({title: text.app.label.notAddress, load: false})
          }
        })
        .catch(err => {
          this.setState({title: text.app.label.notAddress, load: false})
        })
    }
  }

  openModalOrder (start, end) {
    EventRegister.emit(kts.event.onShow)
    util.isInternet().then(status => {
      if (status) {
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
              isMenu: false,
              isModalOrder: true
            })
          })
      } else {
        this.setState({isMns: true})
      }
    })
  }

  cancelOrder (status) {
    this.setState({isModalOrder: false, isButton: false, loadService: false})
    if (status) {
      util.isInternet().then(status => {
        if (status) {
          global.service[kts.json.cabman] = {id: global.user.id}
          global.socket.emit(kts.socket.addServiceCanceled, global.service)
        } else {
          this.setState({isMns: true})
        }
      })
    }
    global.service = null
    global.waitId = null
  }

  acceptOrder () {
    this.setState({isModalOrder: false})
    util.isInternet().then(status => {
      if (status) {
        this.setState({isButton: null, loadService: true})
        if (global.service) {
          global.service.action = kts.action.accept
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
          global.tempState = true
          EventRegister.emit(kts.event.changeState, {state: false, case: 0})
          global.socket.emit(kts.socket.responseService, global.service)
          global.waitId = global.service.service.id
          global.service = null
        }
      } else {
        this.cleanService()
        this.setState({isButton: false, loadService: false, isMns: true})
      }
    })
  }

  cleanService () {
    global.service = null
    global.waitId = null
    coords = []
    global.waitCanceled = false
    EventRegister.emit(kts.event.changeState, {state: true, case: 0, temp: true})
    this.setState({isButton: false, isService: false, loadService: false})
  }

  async getInfoOrder () {
    if (global.service.action === kts.action.accept) {
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
    }
    this.setState({
      latitudeService: global.service.position_user.latitude,
      longitudeService: global.service.position_user.longitude,
      address: global.service.position_user.andress,
      textButton: util.getTextButton(global.service.action),
      isService: global.service.action === kts.action.accept,
      loadService: false,
      isButton: true
    })
  }

  processService () {
    util.isInternet().then(status => {
      if (status) {
        global.service.action = util.getAction(global.service.action)
        global.socket.emit(kts.socket.responseService, global.service)
        this.setState({isButton: null, loadService: true, isMns: false})
      } else {
        this.setState({isMns: true})
      }
    })
  }

  navigate (id) {
    this.setState({isMenu: false})
    setTimeout(() => {
      this.props.navigation.navigate(id)
    }, 400)
  }

  closeSession () {
    this.setState({isMenu: false})
    navigator.geolocation.clearWatch(this.watchID)
    setTimeout(() => {
      AsyncStorage.removeItem(kts.key.user, () => {
        this.props.navigation.navigate(kts.login.id)
      })
    }, 400)
  }

  render () {
    return (
      <Container.ContainerApp
        load={this.state.load}
        loadService={this.state.loadService}
        title={this.state.title}
        onPressMenu={() => { this.setState({isMenu: true}) }}
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
        isMns={this.state.isMns}
        typeMessage={this.state.typeMessage}
        message={this.state.message}
        closeMns={() => { this.setState({isMns: false}) }}
        getStatus={() => {
          this.setState({isNoGps: false})
          if (!permissionsStatus) {
            this.setState({isNoGps: false})
          } else {
            permissionsStatus = false
          }
          this.getStatus()
        }}>
        <Menu
          isVisible={this.state.isMenu}
          onClose={() => { this.setState({isMenu: false}) }}
          navigate={this.navigate.bind(this)}
          closeSession={() => { this.closeSession() }} />
        <ModalOrder
          isVisible={this.state.isModalOrder}
          uri={this.state.uri}
          name={this.state.name}
          distance={this.state.distance}
          address={this.state.address}
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
