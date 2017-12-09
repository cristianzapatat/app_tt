/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {PermissionsAndroid} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'

import global from '../util/global'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'

import Container from '../component/container'

let chageList = false

export default class rechargePoints extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentWillMount () {
    this.eventChangePosition = EventRegister.addEventListener(kts.event.changePosition, (pos) => {
      if (this.state.isNoGps) this.setState({isNoGps: false})
      if (!chageList) this.getList()
      this.setState({
        latitude: pos.latitude,
        longitude: pos.longitude
      })
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
          this.setState({isNoGps: true, textNoGps: text.waitingServices.gps.withoutPermission})
        }
      })
  }

  componentWillUnmount () {
    EventRegister.removeEventListener(this.eventChangePosition)
  }

  async getList () {
    try {
      let result = await fetch(urls.getRechargePoints())
      let json = await result.json()
      this.setState({
        data: json,
        latitude: global.position.latitude,
        longitude: global.position.longitude
      })
    } catch (err) {
      this.setState({data: []})
    }
  }

  goBack () {
    const { goBack } = this.props.navigation
    goBack()
  }

  render () {
    return (
      <Container.ContainerGeneral
        title={text.rechargePoints.label.title}
        isNoGps={this.state.isNoGps}
        textNoGps={this.state.textNoGps}
        cab={[{
          latitude: this.state.latitude,
          longitude: this.state.longitude
        }]}
        markers={this.state.data}
        onBack={() => { this.goBack() }} />
    )
  }
}
