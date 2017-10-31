import React, {Component} from 'react'
import {View, Image, Text} from 'react-native'
import Bounceable from '../component/bounceable'

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
        <Bounceable
          onPress={this.props.onPress}
          level={1.1}>
          <View>
            <Image source={require('../../img/gps_reload.png')} style={styles.imgReload} />
          </View>
        </Bounceable>
      </View>
    )
  }
}

module.exports = NoGps
