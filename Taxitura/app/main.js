'use strict'

import React, { Component } from 'react'
import { View, Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import * as Progress from 'react-native-progress'
import consts from '../constants/constants'
import fs from '../util/fs'
import styles from '../style/main.style'
import Header from '../components/header'
import Login from './login'
import App from './app'

const RouteNavigation = StackNavigator(
  {
    login: {screen: Login},
    app: {screen: App}
  },
  {
    initialRouteName: 'login',
    mode: 'card',
    headerMode: 'none'
  }
)

export default class Main extends Component {
  constructor () {
    super()
    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    fs.readFile(`${consts.persistenceFile}${consts.fileLogin}`)
      .then(response => {
        this.setState({ loading: false })
        if (response) {
        }
      })
  }

  render () {
    if (!this.state.loading) {
      return (
        <View style={styles.container}>
          <Header />
          <RouteNavigation />
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
            color={['#133b8e']}
            animating={this.state.loading}
            thickness={5}
          />
        </View>
      )
    }
  }
}
