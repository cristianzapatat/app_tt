/* global fetch,Headers:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  View,
  Image,
  AsyncStorage,
  ProgressBarAndroid
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import Background from 'react-native-background-timer'
import { EventRegister } from 'react-native-event-listeners'

import styles from './style/main.style'

import global from './util/global'
import urls from './util/urls'
import kts from './util/kts'
import util from './util/util'

import Login from './view/login'
import App from './view/app'
import WaitingServices from './view/waitingServices'
import ChangePassword from './view/changePassword'
import ShoppingHistory from './view/shoppingHistory'
import RechargePoints from './view/rechargePoints'
import WebPage from './view/webPage'

const roots = {
  login: {screen: Login},
  app: {screen: App},
  waitingServices: {screen: WaitingServices},
  changePassword: {screen: ChangePassword},
  shoppingHistory: {screen: ShoppingHistory},
  rechargePoints: {screen: RechargePoints},
  webPage: {screen: WebPage}
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
global.isDay = util.getIsMap()

export default class Main extends Component {
  constructor () {
    super()
    this.state = {
      loading: false,
      rendering: false
    }
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
          util.isInternet().then(status => {
            if (status) {
              fetch(urls.meService, init)
                .then(response => response.json())
                .then(json => {
                  if (json) {
                    if (json.activo) {
                      fetch(urls.getCantServiceFact(json.id))
                        .then(response => response.json())
                        .then(data => this.goView(user, json, data))
                        .catch(err => this.goView(user, json, null))
                    } else {
                      this.__renderView(true)
                    }
                  } else {
                    this.__renderView(true)
                  }
                })
                .catch(err => {
                  this.__renderView(true)
                })
            } else {
              this.__renderView(true)
            }
          })
        } else {
          this.__renderView(true)
        }
      }
    })
    Background.runBackgroundTimer(() => {
      let status = util.getIsMap()
      if (global.isDay !== status) {
        global.isDay = status
        EventRegister.emit(kts.event.changeMap, status)
      }
    }, kts.time.MINUTE)
  }

  componentWillUnmount () {
    EventRegister.removeAllListeners()
    Background.stopBackgroundTimer()
  }

  goView (user, json, data) {
    json['state_app'] = user.state_app || true
    AsyncStorage.setItem(kts.key.user, JSON.stringify(json), () => {
      this.state.rendering = true
      global.user = json
      global.state = json.state_app
      global.tempState = user.state_temp
      global.serviceFact = 0
      global.serviceToday = data ? data.cant : 0
      global.isSession = true
      global.isApp = true
      this.__renderView(false)
    })
  }

  __renderView (status) {
    if (status) AsyncStorage.removeItem(kts.key.user)
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
        <Image
          style={styles.image}
          resizeMode={'cover'}
          source={require('../img/splash.jpg')}>
          <ProgressBarAndroid
            animating={!this.state.loading}
            styleAttr={'Horizontal'}
            color={kts.color.black} />
        </Image>
      )
    }
  }
}
