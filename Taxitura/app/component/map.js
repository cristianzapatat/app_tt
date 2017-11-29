import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import '../../UserAgent'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import kts from '../util/kts'
import text from '../util/text'

const {width, height} = Dimensions.get(kts.hardware.window)
const ASPECT_RATIO = width / height
let LATITUDE_DELTA = 0.015
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class MapClassic extends Component {
  render () {
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: 3.8804178377998277,
          longitude: -77.02326726168394,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }} />
    )
  }
}

class MapCabman extends Component {
  _onRegionChange (region) {
    LATITUDE_DELTA = region.latitudeDelta
    LONGITUDE_DELTA = region.longitudeDelta
  }
  render () {
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        onRegionChange={this._onRegionChange}
        region={{
          latitude: this.props.latitude || 3.8804178377998277,
          longitude: this.props.longitude || -77.02326726168394,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }} >
        <MapView.Marker
          image={require('../../img/cab.png')}
          title={text.app.icon.you}
          coordinate={{
            latitude: this.props.latitude || 3.8804178377998277,
            longitude: this.props.longitude || -77.02326726168394
          }} />
      </MapView>
    )
  }
}

class MapService extends Component {
  _onRegionChange (region) {
    LATITUDE_DELTA = region.latitudeDelta
    LONGITUDE_DELTA = region.longitudeDelta
  }
  render () {
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        onRegionChange={this._onRegionChange}
        region={{
          latitude: this.props.latitude,
          longitude: this.props.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }} >
        <MapView.Marker
          image={require('../../img/cab.png')}
          title={text.app.icon.you}
          coordinate={{
            latitude: this.props.latitude,
            longitude: this.props.longitude
          }} />
        <MapView.Marker
          image={require('../../img/user.png')}
          title={text.app.icon.client}
          description={this.props.address}
          coordinate={{
            latitude: this.props.latitudeService,
            longitude: this.props.longitudeService
          }} />
        <MapView.Polyline
          coordinates={this.props.coords}
          strokeWidth={2}
          strokeColor='#000' />
      </MapView>
    )
  }
}

module.exports = {
  MapClassic,
  MapCabman,
  MapService
}
