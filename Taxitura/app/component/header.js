'use strict'
import React, {Component} from 'react'
import {View, Image} from 'react-native'

import styles from '../style/header.style'

class Header extends Component {
  render () {
    return (
      <View style={styles.nav}>
        <Image source={require('../../img/taxitura.png')} />
      </View>
    )
  }
}

module.exports = Header
