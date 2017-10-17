'use strict'

import React, { Component } from 'react'
import { View, Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import * as Progress from 'react-native-progress'
import consts from '../constants/constants'
import fs from '../util/fs'
import styles from '../style/main.style'
import Login from './login'
import App from './app'

const roots = {
  login: {screen: Login},
  app: {screen: App}
}

const config = {
  mode: 'card'
}

config['initialRouteName'] = 'login'
const RouteNavigationLogin = StackNavigator(roots, config)

config['initialRouteName'] = 'app'
const RouteNavigationApp = StackNavigator(roots, config)

export default class Main extends Component {
  constructor () {
    super()
    this.state = {
      loading: true,
      rendering: false
    }
  }

  componentDidMount () {
    fs.readFile(`${consts.persistenceFile}${consts.fileLogin}`)
      .then(response => {
        if (response) {
          this.setState({ rendering: true })
        }
        this.setState({ loading: false })
      })
  }

  isRendering () {
    if (this.state.rendering) {
      return (
        <RouteNavigationApp />
      )
    } else {
      return (
        <RouteNavigationLogin />
      )
    }
  }

  render () {
    if (!this.state.loading) {
      return (
        <View style={styles.container}>
          { this.isRendering() }
        </View>
      )
    } else {
      return (
        <View style={styles.load}>
          <Image
            style={styles.imgLoading}
            source={require('../img/taxitura.png')}
          />
          <Progress.CircleSnail
            style={styles.loading}
            size={50}
            color={['#2980b9']}
            animating={this.state.loading}
            thickness={5}
          />
        </View>
      )
    }
  }
}
