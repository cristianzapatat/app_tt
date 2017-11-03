'use strict'
import React, { Component } from 'react'

import '../../UserAgent'
import styles from '../style/map.style'
import MapView from 'react-native-maps'

export default class Map extends Component {
  render () {
    if (this.props.goOrder) {
      return (
        <MapView style={styles.map}
          loadingEnabled
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
          loadingEnabled
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
