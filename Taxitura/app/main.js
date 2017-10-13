'use strict'

import React, { Component } from 'react'
import { View } from 'react-native'
import { StackNavigator } from 'react-navigation'
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
  render () {
    return (
      <View style={styles.container}>
        <Header />
        <RouteNavigation />
      </View>
    )
  }
}
