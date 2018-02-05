/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {View, FlatList, PermissionsAndroid} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'

import style from '../style/waitingServices.style'

import global from '../util/global'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'

import Container from '../component/container'
import Item from '../component/itemService'

let changeList = false

export default class WaitingServices extends Component {
  constructor (props) {
    super(props)
    this.state = {
      load: true,
      data: []
    }
  }

  componentWillMount () {
    this.eventChangePos = EventRegister.addEventListener(kts.event.changePosition, (pos) => {
      if (this.state.isNoGps) this.setState({isNoGps: false, load: true})
      if (!changeList) this.getList()
    })
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(granted => {
        if (granted) {
          if (global.position !== null) {
            this.getList()
          } else {
            this.setState({isNoGps: true, textNoGps: text.waitingServices.label.position})
          }
        } else {
          this.setState({isNoGps: true, textNoGps: text.waitingServices.gps.withoutPermission, load: false})
        }
      })
  }

  componentWillUnmount () {
    EventRegister.removeEventListener(this.eventChangePos)
  }

  getList () {
    fetch(urls.getListWaitingServices(global.user.id))
      .then(response => {
        return response.json()
      })
      .then(json => {
        changeList = true
        this.setState({data: json, load: false})
      })
      .catch(err => {
        changeList = false
        this.setState({data: []})
      })
  }

  goBack () {
    const { goBack } = this.props.navigation
    this.setState({load: false, json: [], isNoGps: false})
    goBack()
  }

  acceptService (service) {
    global.waitCanceled = true
    service.action = kts.action.accept
    service[kts.json.cabman] = {
      id: global.user.id,
      name: global.user.nombre,
      photo: urls.getUrlPhoto(global.user.foto.url)
    }
    service[kts.json.position_cabman] = {
      distance: null,
      time: null,
      latitude: global.position.latitude,
      longitude: global.position.longitude
    }
    global.tempState = global.state
    global.socket.emit(kts.socket.acceptCancel, service)
    EventRegister.emit(kts.event.appAcceptCancel)
    this.goBack()
  }

  onShow () {
    EventRegister.emit(kts.event.onShow)
  }

  _keyExtractor (item, index) {
    return item.service.id
  }

  render () {
    return (
      <Container.ContainerGeneral
        load={this.state.load}
        title={text.waitingServices.label.title}
        isNoGps={this.state.isNoGps}
        textNoGps={this.state.textNoGps}
        onBack={() => { this.goBack() }}>
        <View style={style.content}>
          <FlatList
            style={style.list}
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            renderItem={({item, index}) =>
              <Item
                item={item}
                index={index}
                onShow={this.onShow.bind(this)}
                acceptService={() => { this.acceptService(item) }}
              />
          } />
        </View>
      </Container.ContainerGeneral>
    )
  }
}
