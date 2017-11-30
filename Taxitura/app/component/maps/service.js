import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import '../../../UserAgent'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import kts from '../../util/kts'
import text from '../../util/text'

import mapDay from './json/mapStyleDay.json'
import mapNight from './json/mapStyleNight.json'

const {width, height} = Dimensions.get(kts.hardware.window)
const ASPECT_RATIO = width / height
let LATITUDE_DELTA = kts.position.DELTA
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class MapDay extends Component {
  _onRegionChange (region) {
    LATITUDE_DELTA = region.latitudeDelta
    LONGITUDE_DELTA = region.longitudeDelta
  }
  render () {
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapDay}
        onRegionChange={this._onRegionChange}
        region={{
          latitude: this.props.latitude,
          longitude: this.props.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }} >
        <MapView.Marker
          image={require('../../../img/cab.png')}
          title={text.app.icon.you}
          coordinate={{
            latitude: this.props.latitude,
            longitude: this.props.longitude
          }} />
        <MapView.Marker
          image={require('../../../img/user.png')}
          title={text.app.icon.client}
          description={this.props.address}
          coordinate={{
            latitude: this.props.latitudeService,
            longitude: this.props.longitudeService
          }} />
        <MapView.Polyline
          coordinates={this.props.coords}
          strokeWidth={3}
          strokeColor='#000' />
      </MapView>
    )
  }
}

class MapNight extends Component {
  _onRegionChange (region) {
    LATITUDE_DELTA = region.latitudeDelta
    LONGITUDE_DELTA = region.longitudeDelta
  }
  render () {
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapNight}
        onRegionChange={this._onRegionChange}
        region={{
          latitude: this.props.latitude,
          longitude: this.props.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }} >
        <MapView.Marker
          image={require('../../../img/cab.png')}
          title={text.app.icon.you}
          coordinate={{
            latitude: this.props.latitude,
            longitude: this.props.longitude
          }} />
        <MapView.Marker
          image={require('../../../img/user.png')}
          title={text.app.icon.client}
          description={this.props.address}
          coordinate={{
            latitude: this.props.latitudeService,
            longitude: this.props.longitudeService
          }} />
        <MapView.Polyline
          coordinates={this.props.coords}
          strokeWidth={3}
          strokeColor='#FFF' />
      </MapView>
    )
  }
}

module.exports = {
  MapDay,
  MapNight
}
