'use strict'

import React, { Component } from 'react'
import {Navigator} from 'react-native-deprecated-custom-components'
import Header from '../components/header'
import Login from './login'
import App from './app'

let NavigatorBarRouteMapper = {
  LeftButton: (route, navigator, index) => {
    return null
  },
  RightButton: (route, navigator, index) => {
    return null
  },
  Title: (route, navigator, index) => {
    return (
      <Header />
    )
  }
}

export default class Main extends Component {
  renderScene (route, navigator) {
    switch (route.name) {
      case 'login':
        return (
          <Login navigator={navigator} route={route} />
        )
      case 'app':
        return (
          <App navigator={navigator} route={route} />
        )
      default:
        return (
          <Login navigator={navigator} route={route} />
        )
    }
  }

  render () {
    return (
      <Navigator
        initialRoute={{name: 'login'}}
        renderScene={this.renderScene}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig
          }
          return Navigator.SceneConfigs.FloatFromRight
        }}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigatorBarRouteMapper} />
        }
      />
    )
  }
}
