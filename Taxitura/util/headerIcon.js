'use strict'
import React, {Component} from 'react'
import {View, Image} from 'react-native'
import styles from '../style/app.style'

export default class HeaderIcon extends Component {
  render () {
    return (
      <View style={styles.nav}>
        <Image source={require('../img/taxitura.png')} />
      </View>
    )
  }
}
