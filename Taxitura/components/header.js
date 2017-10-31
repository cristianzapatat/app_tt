'use strict'
import React, {Component} from 'react'
import {View, Image} from 'react-native'
import Menu from './menu'
import styles from '../style/header.style'

class Header extends Component {
  render () {
    return (
      <View style={styles.all}>
        <View style={styles.nav}>
          <Image source={require('../img/taxitura.png')} />
        </View>
        <Menu
          style={[{display: this.props.renderMenu ? 'flex' : 'none'}, styles.menu]}
          fnLogout={this.props.onPress} />
        <View style={styles.container}>
          {this.props.children}
        </View>
      </View>
    )
  }
}

module.exports = Header
