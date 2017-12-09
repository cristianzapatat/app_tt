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
    let cab = this.props.cab || []
    let markers = this.props.markers || []
    let latitude = cab.length > 0 ? cab[0].latitude || LATITUDE : LATITUDE
    let longitude = cab.length > 0 ? cab[0].longitude || LONGITUDE : LONGITUDE
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapDay}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}>
        {markers.map((marker, i) => (
          <MapView.Marker
            key={`${i}-mar`}
            image={require('../../../img/rechargehome_map.png')}
            coordinate={{
              latitude: parseFloat(marker.latitud),
              longitude: parseFloat(marker.longitud)
            }}
            title={marker.nombre}
            description={marker.direccion}
          />
        ))}
        {cab.map((marker, i) => (
          <MapView.Marker
            key={`${i}-tura`}
            image={require('../../../img/cab.png')}
            coordinate={{
              latitude: latitude,
              longitude: longitude
            }}
            title={text.app.icon.you}
          />
        ))}
      </MapView>
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
    let cab = this.props.cab || []
    let markers = this.props.markers || []
    let latitude = cab.length > 0 ? cab[0].latitude || LATITUDE : LATITUDE
    let longitude = cab.length > 0 ? cab[0].longitude || LONGITUDE : LONGITUDE
    return (
      <MapView
        style={this.props.style}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapNight}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }} >
        {markers.map((marker, i) => (
          <MapView.Marker
            identifier={`${i}-mar`}
            image={require('../../../img/rechargehome_map.png')}
            coordinate={{
              latitude: parseFloat(marker.latitud),
              longitude: parseFloat(marker.longitud)
            }}
            title={marker.nombre}
            description={marker.direccion}
          />
        ))}
        {cab.map((marker, i) => (
          <MapView.Marker
            identifier={`${i}-tura`}
            image={require('../../../img/cab.png')}
            coordinate={{
              latitude: latitude,
              longitude: longitude
            }}
            title={text.app.icon.you}
          />
        ))}
      </MapView>
    )
  }
}

module.exports = {
  MapDay,
  MapNight
}
