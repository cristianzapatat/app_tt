import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import '../../../UserAgent'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import kts from '../../util/kts'

import mapDay from './json/mapStyleDay.json'
import mapNight from './json/mapStyleNight.json'

const {width, height} = Dimensions.get(kts.hardware.window)
const ASPECT_RATIO = width / height
let LATITUDE_DELTA = kts.position.DELTA
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
let LATITUDE = kts.position.LATITUDE
let LONGITUDE = kts.position.LONGITUDE

class MapDay extends Component {
  _onRegionChange (region) {
    LATITUDE = region.latitude
    LONGITUDE = region.longitude
    LATITUDE_DELTA = region.latitudeDelta
    LONGITUDE_DELTA = region.longitudeDelta
  }
  render () {
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapDay}
        region={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }} />
    )
  }
}

class MapNight extends Component {
  _onRegionChange (region) {
    LATITUDE = region.latitude
    LONGITUDE = region.longitude
    LATITUDE_DELTA = region.latitudeDelta
    LONGITUDE_DELTA = region.longitudeDelta
  }
  render () {
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapNight}
        region={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }} />
    )
  }
}

module.exports = {
  MapDay,
  MapNight
}
