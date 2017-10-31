'use strict'
import React, { Component } from 'react'
import {Image} from 'react-native'

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
            title={'Tú'}>
            <Image
              source={require('../../img/cab.png')}
              style={styles.img} />
          </MapView.Marker>
          <MapView.Marker
            coordinate={this.props.markerOrder}
            title={'Cliente'}
            description={this.props.address}>
            <Image
              source={require('../../img/user.png')}
              style={styles.img} />
          </MapView.Marker>
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
            title={'Tú'}>
            <Image
              source={require('../../img/cab.png')}
              style={styles.img} />
          </MapView.Marker>
        </MapView>
      )
    }
  }
}
