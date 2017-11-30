/* global fetch,Headers:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  View,
  Image,
  AsyncStorage
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import * as Progress from 'react-native-progress'
import io from 'socket.io-client'

import styles from './style/main.style'

import global from './util/global'
import urls from './util/urls'
import kts from './util/kts'

import Login from './view/login'
import App from './view/app'
import WaitingServices from './view/waitingServices'
import ChangePassword from './view/changePassword'

const roots = {
  login: {screen: Login},
  app: {screen: App},
  waitingServices: {screen: WaitingServices},
  changePassword: {screen: ChangePassword}
}

const config = {
  mode: kts.navigation.card,
  headerMode: kts.navigation.none
}

config[kts.navigation.initialRouteName] = kts.login.id
const RouteNavigationLogin = StackNavigator(roots, config)

config[kts.navigation.initialRouteName] = kts.app.id
const RouteNavigationApp = StackNavigator(roots, config)

let idSet

export default class Main extends Component {
  constructor () {
    super()
    this.state = {
      loading: false,
      rendering: false
    }
    this.socket = io(urls.urlInterface, { transports: [kts.main.websocket] })
    global.socket = this.socket
  }

  componentDidMount () {
    AsyncStorage.getItem(kts.key.user, (err, result) => {
      if (err) {
        this.__renderView()
      } else {
        if (result) {
          let user = JSON.parse(result)
          let myHeaders = new Headers()
          myHeaders.append(kts.key.userToken, user.token)
          let init = {
            method: kts.method.get,
            headers: myHeaders
          }
          fetch(urls.meService, init)
            .then(response => {
              return response.json()
            })
            .then(json => {
              if (json) {
                if (json.activo) {
                  AsyncStorage.setItem(kts.key.user, JSON.stringify(json), () => {
                    this.state.rendering = true
                    global.user = json
                    this.__renderView()
                  })
                } else {
                  this.__renderView()
                }
              } else {
                this.__renderView()
              }
            })
            .catch(err => {
              // TODO advertencia sobre la red - internet
              this.__renderView()
            })
        } else {
          this.__renderView()
        }
      }
    })
  }

  componentWillUnmount () {
    clearTimeout(global.idInterval)
  }

  __renderView () {
    idSet = setInterval(() => {
      this.setState({ loading: true })
      clearInterval(idSet)
    }, 1000)
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
