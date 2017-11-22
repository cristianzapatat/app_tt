import React, { Component } from 'react'
import '../../UserAgent'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import text from '../util/text'

class MapClassic extends Component {
  render () {
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: 3.8804178377998277,
          longitude: -77.02326726168394,
          latitudeDelta: 0.007920898497118856,
          longitudeDelta: 0.01352313447443576
        }} />
    )
  }
}

class MapCabman extends Component {
  render () {
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: 3.8804178377998277,
          longitude: -77.02326726168394,
          latitudeDelta: 0.007920898497118856,
          longitudeDelta: 0.01352313447443576
        }} >
        <MapView.Marker
          image={require('../../img/cab.png')}
          title={text.app.icon.you}
          coordinate={{
            latitude: 3.8804178377998277,
            longitude: -77.02326726168394
          }} />
      </MapView>
    )
  }
}

module.exports = {
  MapClassic,
  MapCabman
}
