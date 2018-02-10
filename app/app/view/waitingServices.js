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
import util from '../util/util'

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
      if (this.state.isNoGps) this.setState({isNoGps: false, isMns: false})
      if (!changeList) this.getList()
    })
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(granted => {
        if (granted) {
          if (global.position !== null) {
            this.getList()
          } else {
            this.setState({isNoGps: true, isMns: false, textNoGps: text.waitingServices.label.position})
          }
        } else {
          this.setState({isNoGps: true, isMns: false, textNoGps: text.waitingServices.gps.withoutPermission, load: false})
        }
      })
  }

  componentWillUnmount () {
    EventRegister.removeEventListener(this.eventChangePos)
  }

  getList () {
    this.setState({load: true, isMns: false})
    util.isInternet().then(status => {
      if (status) {
        fetch(urls.getListWaitingServices(global.user.id))
          .then(response => {
            return response.json()
          })
          .then(json => {
            changeList = true
            this.setState({data: json, load: false, isMns: false})
          })
          .catch(err => {
            changeList = false
            this.setState({data: [], load: false, isMns: false})
          })
      } else {
        changeList = false
        this.setState({
          message: text.intenet.without,
          typeMessage: kts.enum.WITHOUT,
          load: false,
          isMns: true
        })
      }
    })
  }

  goBack () {
    const { goBack } = this.props.navigation
    this.setState({load: false, json: [], isNoGps: false, isMns: false})
    goBack()
  }

  acceptService (service) {
    util.isInternet().then(status => {
      if (status) {
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
        global.socket.emit(kts.socket.acceptCancel, service, global.user.token)
        EventRegister.emit(kts.event.appAcceptCancel)
        this.goBack()
      } else {
        this.setState({
          message: text.intenet.without,
          typeMessage: kts.enum.WITHOUT,
          load: false,
          isMns: true
        })
      }
    })
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
        isMns={this.state.isMns}
        typeMessage={this.state.typeMessage}
        message={this.state.message}
        onBack={() => { this.goBack() }}>
        <View style={[{maxHeight: this.state.isMns ? 325 : 425}, style.content]}>
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
