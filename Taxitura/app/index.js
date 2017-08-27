/* global fetch:true */
import React, { Component } from 'react'
import {
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
import * as Progress from 'react-native-progress'
Geocoder.setApiKey(consts.apiKeyGeocoder)

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.015
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

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
      order: null,
      processOrder: false,
      goOrder: false,
      renderGPS: true,
      button: {
        title: consts.arrive,
        color: consts.colorArrive,
        action: consts.actionArrive
      },
      time: 1
    }

    this.socket = io(consts.serverSock, { transports: ['websocket'] })
    this.socket.on('app', order => {
      if (order.action === consts.order && this.state.order === null) {
        this.state.order = order
        this.getDistance(this.state.markerPosition,
          {latitude: order.order.latitude, longitude: order.order.longitude})
        this.setState({processOrder: true})
        this.reductionTime()
      }
    })
    this.socket.on('accept', order => {
      if (order.id === this.state.order.id) {
        this.state.order = order
        this.setState({goOrder: true})
        this.getAddress(this.state.markerPositionOrder, false)
      }
    })
    this.socket.on('arrive', order => {
      if (order.id === this.state.order.id) {
        this.state.order = order
        this.setState({button: {
          title: consts.endService,
          color: consts.colorEndService,
          action: consts.actionEnd
        }})
      }
    })
  }

  componentDidMount () {
    this.analitycPosition()
  }

  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
    this.setState({renderGPS: false})
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
    },
    err => {
      console.log(err)
      this.setState({renderGPS: false})
    },
    {enableHighAccuracy: false, timeout: 1000, maximumAge: 1000})

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
    },
    err => {
      console.log(err)
      this.setState({renderGPS: false})
    },
    {enableHighAccuracy: false, timeout: 1000, maximumAge: 1000, distanceFilter: 2})
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
          <TouchableOpacity onPress={() => { this.setState({processOrder: false, order: null, time: 1}) }}>
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

  acceptOrder () {
    let position = {
      latitude: this.state.order.order.latitude,
      longitude: this.state.order.order.longitude
    }
    this.state.markerPositionOrder = position
    this.setState({processOrder: false, time: 1})

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

  processService (msn) {
    this.state.order.action = msn
    this.socket.emit('app', this.state.order)
    if (msn === consts.actionEnd) {
      this.setState({button: {
        title: consts.arrive,
        color: consts.colorArrive,
        action: consts.actionArrive
      }})
      this.setState({goOrder: false})
      this.setState({order: null})
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
      return (
        <View style={styles.notgps}>
          <Image source={require('../img/gps_disenabled.png')} />
          <Text style={styles.textGps}>Favor enceder el GPS</Text>
        </View>
      )
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
