'use strict'
import React, {Component} from 'react'
import {View, Image, TouchableOpacity} from 'react-native'
import styles from '../style/header.style'

export default class Header extends Component {
  logout () {
    this.props.navigate.navigate('login')
  }

  render () {
    return (
      <View style={styles.nav}>
        <Image source={require('../img/taxitura.png')} />
        <View style={[styles.menu, {display: this.props.login ? 'flex' : 'none'}]}>
          <TouchableOpacity onPress={() => { this.logout() }}>
            <Image
              source={require('../img/logout.png')}
              style={styles.logout} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
