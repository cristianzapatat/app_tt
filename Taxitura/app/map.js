'use strict'
import React, { Component } from 'react'
import {Image} from 'react-native'

import '../UserAgent'
import styles from '../style/map.style'
import MapView from 'react-native-maps'
import Root from './root.js'

export default class Map extends Component {
  constructor (props) {
    super(props)
    console.ignoredYellowBox = ['Setting a timer']
  }
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
              source={require('../img/cab.png')}
              style={styles.img} />
          </MapView.Marker>
          <MapView.Marker
            coordinate={this.props.markerOrder}
            title={'Cliente'}>
            <Image
              source={require('../img/user.png')}
              style={styles.img} />
          </MapView.Marker>
          <Root
            startLoc={{
              latitude: this.props.markerMe.latitude,
              longitude: this.props.markerMe.longitude
            }}
            endLoc={{
              latitude: this.props.markerOrder.latitude,
              longitude: this.props.markerOrder.longitude
            }} />
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
              source={require('../img/cab.png')}
              style={styles.img} />
          </MapView.Marker>
        </MapView>
      )
    }
  }
}
