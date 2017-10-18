'use strict'
import React, {Component} from 'react'
import {View, Image, TouchableOpacity} from 'react-native'
import styles from '../style/header.style'

class Header extends Component {
  render () {
    return (
      <View style={styles.nav}>
        <Image source={require('../img/taxitura.png')} />
        <View style={[styles.menu, {display: this.props.renderLogout ? 'flex' : 'none'}]}>
          <TouchableOpacity onPress={this.props.onPress}>
            <Image
              source={require('../img/logout.png')}
              style={styles.logout} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

module.exports = Header
