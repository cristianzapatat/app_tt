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

let idSet
let status = true

export default class WaitingServices extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentWillMount () {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(granted => {
        if (granted) {
          if (global.position !== null) {
            this.getList()
          } else {
            this.setState({isNoGps: true, textNoGps: text.waitingServices.label.position})
            this.UpdateView()
          }
        } else {
          this.setState({isNoGps: true, textNoGps: text.waitingServices.gps.withoutPermission})
        }
      })
  }

  componentWillUnmount () {
    clearInterval(idSet)
    if (status) {
      global.socket.emit(kts.socket.nextService, global.user.id)
    }
  }

  getList () {
    fetch(urls.getListWaitingServices(global.user.id))
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({
          data: json
        })
      })
  }

  UpdateView () {
    idSet = setInterval(() => {
      if (global.position !== null) {
        this.setState({isNoGps: false})
        this.getList()
        clearInterval(idSet)
      }
    }, 3000)
  }

  goBack () {
    const { goBack } = this.props.navigation
    goBack()
  }

  acceptService (service) {
    global.waitCanceled = true
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
    service.action = kts.action.accept
    status = false
    global.tempState = global.state
    const { goBack } = this.props.navigation
    EventRegister.emit(kts.event.changeState, {state: false, case: 0})
    global.socket.emit(kts.socket.acceptCancel, service)
    goBack()
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
                onShow={() => { this.onShow() }}
                acceptService={() => { this.acceptService(item) }}
              />
          } />
        </View>
      </Container.ContainerGeneral>
    )
  }
}
