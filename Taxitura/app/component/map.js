import React, { Component } from 'react'
import '../../UserAgent'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import styles from '../style/map.style'

export default class Map extends Component {
  render () {
    if (this.props.goOrder) {
      return (
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={this.props.initial}
          rotateEnabled={this.props.goOrder}
          onRegionChange={this.props.onRegionChange}>
          <MapView.Marker
            coordinate={this.props.markerMe}
            title={'Tú'}
            image={require('../../img/cab.png')} />
          <MapView.Marker
            coordinate={this.props.markerOrder}
            title={'Cliente'}
            description={this.props.address}
            image={require('../../img/user.png')} />
          <MapView.Polyline
            coordinates={this.props.coords}
            strokeWidth={3}
            strokeColor='#007AFF' />
        </MapView>
      )
    } else {
      return (
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={this.props.initial}
          rotateEnabled={this.props.goOrder}
          onRegionChange={this.props.onRegionChange}>
          <MapView.Marker
            coordinate={this.props.markerMe}
            title={'Tú'}
            image={require('../../img/cab.png')} />
        </MapView>
      )
    }
  }
}
