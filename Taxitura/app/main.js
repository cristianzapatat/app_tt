'use strict'

import React, { Component } from 'react'
import { View, Image, Platform, BackHandler } from 'react-native'
import { StackNavigator } from 'react-navigation'
import * as Progress from 'react-native-progress'
import io from 'socket.io-client'

import consts from './constant/constant'
import fs from './util/fs'
import styles from './style/main.style'
import Login from './view/login'
import App from './view/app'
import ListService from './view/listService'

const roots = {
  login: {screen: Login},
  app: {screen: App},
  listService: {screen: ListService}
}

const config = {
  mode: 'card',
  headerMode: 'none'
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
    this.socket = io(consts.serverSock, { transports: ['websocket'] })
    consts.socket = this.socket
    consts.position = null
  }

  componentWillMount () {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (consts.view === 'listService') {
          consts.view = 'app'
        }
        if (consts.view === 'app' || consts.view === 'login') {
          BackHandler.exitApp()
        }
        return false
      })
    }
  }

  componentDidMount () {
    fs.readFile(`${consts.persistenceFile}${consts.fileLogin}`)
      .then(response => {
        if (response) {
          consts.user = response
          if (!consts.user.activo) {
            this.state.rendering = true
          } else {
            consts.user = null
            consts.message = 'Usuario inactivo\nComuníquese con soporte'
          }
        }
        this.setState({ loading: false })
      })
  }

  componentWillUnmount () {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress')
    }
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
