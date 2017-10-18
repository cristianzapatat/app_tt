'use strict'
import React, { Component } from 'react'
import {View} from 'react-native'

import '../UserAgent'
import styles from '../style/app.style'
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
          rotateEnabled={this.props.goOrder}>
          <MapView.Marker
            coordinate={this.props.markerMe}
            title={'Tú'}>
            <View style={styles.radius}>
              <View style={styles.marker} />
            </View>
          </MapView.Marker>
          <MapView.Marker
            coordinate={this.props.markerOrder}
            title={'Cliente'}
            description={this.props.address}>
            <View style={styles.radius}>
              <View style={styles.markerOrder} />
            </View>
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
          rotateEnabled={this.props.goOrder}>
          <MapView.Marker
            coordinate={this.props.markerMe}
            title={'Tú'}>
            <View style={styles.radius}>
              <View style={styles.marker} />
            </View>
          </MapView.Marker>
        </MapView>
      )
    }
  }
}
