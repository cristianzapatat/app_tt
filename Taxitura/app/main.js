/* global fetch,Headers:true */
import React, { Component } from 'react'
import { View, Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import * as Progress from 'react-native-progress'
import io from 'socket.io-client'

import consts from './constant/constant'
import fs from './util/fs'
import styles from './style/main.style'
import Login from './view/login'
import App from './view/app'
import ListService from './view/listService'
import Settings from './view/settings'

const roots = {
  login: {screen: Login},
  app: {screen: App},
  listService: {screen: ListService},
  settings: {screen: Settings}
}

const config = {
  mode: 'card',
  headerMode: 'none'
}

config['initialRouteName'] = 'login'
const RouteNavigationLogin = StackNavigator(roots, config)

config['initialRouteName'] = 'app'
const RouteNavigationApp = StackNavigator(roots, config)

let idSet

export default class Main extends Component {
  constructor () {
    super()
    this.state = {
      loading: false,
      rendering: false
    }
    this.socket = io(consts.serverSock, { transports: ['websocket'] })
    consts.socket = this.socket
  }

  componentDidMount () {
    fs.readFile(`${consts.persistenceFile}${consts.fileLogin}`)
      .then(result => {
        if (result) {
          let myHeaders = new Headers()
          myHeaders.append('user_token', result.token)
          let init = {
            method: 'GET',
            headers: myHeaders
          }
          fetch(consts.meService, init)
            .then(response => {
              return response.json()
            })
            .then(json => {
              if (json) {
                if (json.activo) {
                  consts.user = json
                  this.state.rendering = true
                } else {
                  consts.user = null
                  consts.message = 'Usuario inactivo\nComuníquese con soporte'
                }
              } else {
                consts.user = null
                consts.message = 'La sesión ha finalizado\nIngrese sus credenciales'
                fs.deleteFile(`${consts.persistenceFile}${consts.fileLogin}`)
              }
              this.__renderView()
            })
        } else {
          this.__renderView()
        }
      })
  }

  __renderView () {
    idSet = setInterval(() => {
      this.setState({ loading: true })
      clearInterval(idSet)
    }, 1000)
  }

  isRendering () {
    consts.position = null
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
    if (this.state.loading) {
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
            animating={!this.state.loading}
            thickness={5}
          />
        </View>
      )
    }
  }
}
