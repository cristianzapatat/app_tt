/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  View,
  Dimensions,
  AppState,
  Platform,
  BackHandler,
  PermissionsAndroid
} from 'react-native'
import Geocoder from 'react-native-geocoding'
import GPSState from 'react-native-gps-state'
import Polyline from '@mapbox/polyline'
import * as Progress from 'react-native-progress'

import global from '../util/global'
import urls from '../util/kts'
import text from '../util/text'

import Container from '../component/container'
import ModalPermission from '../component/modalPermission'

Geocoder.setApiKey(urls.keyGeocoding)

export default class Taxitura extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isModalPermission: false,
      address: text.app.get.position
    }
  }

  render () {
    return (
      <Container.ContainerApp>
        <ModalPermission
          isVisible={this.state.isModalPermission}
          onBack
          onClose={() => { this.setState({isModalPermission: false}) }} />
      </Container.ContainerApp>
    )
  }
}
