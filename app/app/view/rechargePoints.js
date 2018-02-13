/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {PermissionsAndroid} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'

import global from '../util/global'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'
import util from '../util/util'

import Container from '../component/container'

let changeList = false

export default class rechargePoints extends Component {
  constructor (props) {
    super(props)
    this.state = {
      load: true,
      data: []
    }
  }

  componentWillMount () {
    this.eventChangePosition = EventRegister.addEventListener(kts.event.changePosition, (pos) => {
      if (this.state.isNoGps) this.setState({isNoGps: false, isMns: false})
      if (!changeList) this.getList()
      this.setState({
        latitude: pos.latitude,
        longitude: pos.longitude
      })
    })
    this.isApp = EventRegister.addEventListener(kts.event.appIsApp, () => {
      this.goBack()
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
    EventRegister.removeEventListener(this.eventChangePosition)
    EventRegister.removeEventListener(this.isApp)
  }

  getList () {
    this.setState({load: true, isMns: false})
    util.isInternet().then(async (status) => {
      if (status) {
        try {
          let result = await fetch(urls.getRechargePoints())
          let json = await result.json()
          changeList = true
          this.setState({
            data: json,
            latitude: global.position.latitude,
            longitude: global.position.longitude,
            load: false,
            isMns: false
          })
        } catch (err) {
          changeList = false
          this.setState({data: [], load: false, isMns: false})
        }
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
    this.setState({load: false, json: [], isMns: false, isNoGps: false})
    global.isApp = true
    goBack()
  }

  render () {
    return (
      <Container.ContainerGeneral
        load={this.state.load}
        title={text.rechargePoints.label.title}
        isNoGps={this.state.isNoGps}
        textNoGps={this.state.textNoGps}
        isMns={this.state.isMns}
        typeMessage={this.state.typeMessage}
        message={this.state.message}
        cab={[{
          latitude: this.state.latitude,
          longitude: this.state.longitude
        }]}
        markers={this.state.data}
        onBack={() => { this.goBack() }} />
    )
  }
}
