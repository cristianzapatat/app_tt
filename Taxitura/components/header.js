'use strict'
import React, {Component} from 'react'
import {View, Image, TouchableOpacity} from 'react-native'
import fs from '../util/fs'
import consts from '../constants/constants'
import styles from '../style/header.style'

class Header extends Component {
  logout () {
    this.props.navigation.navigate('login')
    fs.deleteFile(`${consts.persistenceFile}${consts.fileLogin}`)
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

module.exports = Header
