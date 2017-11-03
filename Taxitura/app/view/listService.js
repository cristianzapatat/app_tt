/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {View, Text, FlatList, Dimensions, BackHandler, AppState, Platform} from 'react-native'
import GPSState from 'react-native-gps-state'
import * as Progress from 'react-native-progress'

import styles from '../style/listService.style'
import Container from '../component/container'
import Item from '../component/item'
import PhotoModal from '../component/photoModal'
import MiniMap from '../component/miniMap'
import NoGps from '../component/noGps'
import consts from '../constant/constant'
import fs from '../util/fs'

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
let LATITUDE_DELTA = 0.015
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class ListService extends Component {
  constructor (props) {
    super(props)
    consts.view = 'listService'
    this.state = {
      isVisiblePhoto: false,
      isVisibleMap: false,
      isMap: false,
      nameUser: '',
      uri: null,
      loading: true,
      render: true,
      noGpsText: consts.offGPS,
      noGps: true,
      latitudeOrder: 0,
      longitudeOrder: 0,
      data: []
    }
    consts.socket.emit('getServicesCanceled', consts.user.cedula)
    consts.socket.on('catchServicesCanceled', list => {
      this.setState({ data: list })
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
        if (navigation.state.routeName === 'listService') {
          this.componentWillUnmount()
          this.props.navigation.navigate('app')
        }
        return true
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
      if (status === GPSState.RESTRICTED && consts.position === null) {
        this.setState({render: false, loading: false})
      } else if (status === GPSState.DENIED && consts.position === null) {
        this.setState({render: false, noGpsText: consts.deniedGPS, noGps: false, loading: false})
      } else {
        this.analityc()
      }
    })
  }

  analityc () {
    if (consts.position !== null) {
      this.setState({
        render: true,
        loading: false
      })
    }
    this.watchID = navigator.geolocation.watchPosition(position => {
      let lastRegion = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude)
      }
      consts.position = lastRegion
      consts.position['latitudeDelta'] = LATITUDE_DELTA
      consts.position['longitudeDelta'] = LONGITUDE_DELTA
      this.setState({
        render: true,
        loading: false
      })
    },
    err => {
      consts.position = null
      this.getStatus()
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 5000, distanceFilter: 10})
  }

  goMap () {
    this.componentWillUnmount()
    this.props.navigation.navigate('app')
  }

  logout () {
    this.componentWillUnmount()
    this.props.navigation.navigate('login')
    fs.deleteFile(`${consts.persistenceFile}${consts.fileLogin}`)
  }

  _showPhoto (item) {
    this.setState({
      nameUser: item.user.name,
      uri: item.user.url_pic,
      isVisiblePhoto: true
    })
  }

  _hidePhoto () {
    this.setState({
      isVisiblePhoto: false
    })
  }

  _viewMap (item) {
    this.setState({
      isVisibleMap: true,
      latitudeOrder: item.position_user.latitude,
      longitudeOrder: item.position_user.longitude
    })
  }

  _hideMap () {
    this.setState({
      isVisibleMap: false
    })
  }

  _keyExtractor (item, index) {
    return item.service.id
  }

  _drawLis () {
    if (this.state.render) {
      return (
        <FlatList
          style={styles.list}
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          renderItem={({item, index}) =>
            <Item
              item={item}
              index={index}
              showPhoto={() => { this._showPhoto(item) }}
              hidePhoto={() => { this._hidePhoto() }}
              viewMap={() => { this._viewMap(item) }} />
        } />
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

  _drawModals () {
    let status = consts.position
    if (status) {
      return (
        <View>
          <PhotoModal
            isVisible={this.state.isVisiblePhoto}
            nameUser={this.state.nameUser}
            uri={this.state.uri}
            hidePhoto={() => { this._hidePhoto() }} />
          <MiniMap
            isVisible={this.state.isVisibleMap}
            hideMap={() => { this._hideMap() }}
            latitudeOrder={this.state.latitudeOrder}
            longitudeOrder={this.state.longitudeOrder} />
        </View>
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
        isMap
        goMap={() => { this.goMap() }}
        onPress={() => { this.logout() }} >
        <View style={styles.enter}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Lista de Servicios</Text>
            <Progress.CircleSnail
              style={[{display: this.state.loading ? 'flex' : 'none'}, styles.loading]}
              size={30}
              color={['#2980b9']}
              strokeCap={'round'}
              animating={this.state.loading} />
          </View>
          { this._drawLis() }
          <View style={[{display: this.state.loading ? 'flex' : 'none'}, styles.over]} />
        </View>
        { this._drawModals() }
      </Container>
    )
  }
}
