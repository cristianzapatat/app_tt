import React, {Component} from 'react'
import {View, Image, Text, TouchableOpacity} from 'react-native'

import styles from '../style/noGps.style'

class NoGps extends Component {
  render () {
    return (
      <View style={styles.notgps}>
        <Image
          source={require('../../img/gps_disenabled.png')}
          style={{display: this.props.visible ? 'flex' : 'none'}} />
        <Image
          source={require('../../img/gps_denied.png')}
          style={{display: this.props.visible ? 'none' : 'flex'}} />
        <Text style={styles.textGps}>{this.props.text}</Text>
        <TouchableOpacity onPressOut={this.props.onPress}>
          <View style={styles.btnBack}>
            <Text style={[styles.back]}>Actualizar</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

module.exports = NoGps
