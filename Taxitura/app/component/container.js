'use strict'
import React, {Component} from 'react'
import {View} from 'react-native'

import styles from '../style/container.style'
import Header from './header'
import Menu from './menu'

class Container extends Component {
  render () {
    return (
      <View style={styles.all}>
        <Header />
        <Menu
          style={{display: this.props.renderMenu ? 'flex' : 'none'}}
          visible={this.props.renderMenu}
          goSettings={this.props.goSettings}
          isMap={this.props.isMap}
          goMap={this.props.goMap}
          isListServives={this.props.isListServives}
          goListServives={this.props.goListServives}
          fnLogout={this.props.onPress} />
        <View style={styles.container}>
          {this.props.children}
        </View>
      </View>
    )
  }
}

module.exports = Container
