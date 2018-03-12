/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  AsyncStorage,
  BackHandler,
  Platform
} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'

import style from '../style/login.style'

import Shadow from '../elements/shadow'

import global from '../util/global'
import util from '../util/util'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'

import Container from '../component/container'

export default class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      idCard: '',
      password: '',
      editable: true,
      isFocus: false,
      isLoad: false
    }
  }

  componentWillMount () {
    if (Platform.OS === kts.platform.android) {
      BackHandler.addEventListener(kts.hardware.backPress, () => {
        const { navigation } = this.props
        if (navigation.state.routeName === kts.login.id) {
          BackHandler.exitApp()
        }
        return false
      })
    }
    Keyboard.addListener(kts.hardware.keyboardDidShow, () => {
      this.setState({isFocus: true, isMns: false})
    })
    Keyboard.addListener(kts.hardware.keyboardDidHide, () => {
      this.setState({isFocus: false})
    })
    this.loginSessionEnd = EventRegister.addEventListener(kts.event.loginSessionEnd, () => {
      this.setState({
        message: text.login.msn.sessionEnd,
        typeMessage: kts.enum.ERROR,
        isMns: true
      })
    })
  }

  componentDidMount () {
    util.isInternet().then(status => {
      if (!status) {
        this.setState({
          message: text.intenet.without,
          typeMessage: kts.enum.WITHOUT,
          isMns: true
        })
      }
    })
  }

  componentWillUnmount () {
    if (Platform.OS === kts.platform.android) {
      BackHandler.removeEventListener(kts.hardware.backPress)
    }
    Keyboard.removeAllListeners(kts.hardware.keyboardDidShow)
    Keyboard.removeAllListeners(kts.hardware.keyboardDidHide)
    EventRegister.removeEventListener(this.loginSessionEnd)
  }

  login () {
    Keyboard.dismiss()
    this.setState({isMns: false})
    setTimeout(() => {
      let idCard = this.state.idCard
      let password = this.state.password
      if (idCard.length > 0 && password.length > 0) {
        this.setState({editable: false, isLoad: true})
        util.isInternet().then(status => {
          if (status) {
            fetch(urls.loginService(idCard, password))
              .then(response => {
                if ((response.status >= 200 && response.status <= 299) || response.status === 401) {
                  return response.json()
                } else {
                  throw response.status
                }
              })
              .then(json => {
                if (json) {
                  if (json.token) {
                    if (json.activo) {
                      fetch(urls.getCantServiceFact(json.id))
                        .then(info => info.json())
                        .then(data => this.goView(json, data))
                        .catch(err => this.goView(json, null))
                    } else {
                      this.setState({password: '', editable: true, message: text.login.msn.userInactive, typeMessage: kts.enum.ERROR, isLoad: false, isMns: true})
                    }
                  } else if (json.message) {
                    if (json.message === kts.text.accessDenied) {
                      this.setState({idCard: '', password: '', editable: true, message: text.login.msn.verifyCredential, typeMessage: kts.enum.ERROR, isLoad: false, isMns: true})
                    } else {
                      this.setState({idCard: '', password: '', editable: true, message: json.message, typeMessage: kts.enum.ERROR, isLoad: false, isMns: true})
                    }
                  } else {
                    this.setState({idCard: '', password: '', editable: true, message: text.login.msn.error, typeMessage: kts.enum.ERROR, isLoad: false, isMns: true})
                  }
                } else {
                  this.setState({idCard: '', password: '', editable: true, message: text.login.msn.error, typeMessage: kts.enum.ERROR, isLoad: false, isMns: true})
                }
              })
              .catch(err => {
                this.setState({idCard: '', password: '', editable: true, message: text.login.msn.error, typeMessage: kts.enum.ERROR, isLoad: false, isMns: true})
              })
          } else {
            this.setState({idCard: '', password: '', editable: true, message: text.intenet.without, typeMessage: kts.enum.WITHOUT, isLoad: false, isMns: true})
          }
        })
      } else {
        this.setState({message: text.login.msn.empty, typeMessage: kts.enum.ERROR, isLoad: false, isMns: true})
      }
    }, 200)
  }

  goView (json, data) {
    AsyncStorage.setItem(kts.key.user, JSON.stringify(json), () => {
      global.user = json
      global.state = true
      global.tempState = null
      global.serviceFact = 0
      global.serviceToday = data ? data.cant : 0
      global.isSession = true
      global.isApp = true
      this.setState({editable: true, isLoad: false})
      this.props.navigation.navigate(kts.app.id)
    })
  }

  render () {
    return (
      <Container.ContainerLogin
        isFocus={this.state.isFocus}
        isMns={this.state.isMns}
        typeMessage={this.state.typeMessage}
        editable={this.state.editable}
        isLoad={this.state.isLoad}
        message={this.state.message}
        help={() => { this.props.navigation.navigate(kts.webPage.id) }}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={style.container} >
          <View style={style.formContainer}>
            <Shadow
              setting={{height: 45, width: 290, borderRadius: 30}}
              style={{marginTop: 10}}>
              <TextInput
                style={style.input}
                editable={this.state.editable}
                placeholder={text.login.label.idCard}
                placeholderTextColor={'#A8A8A8'}
                autoCorrect={false}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => { this.setState({idCard: text}) }}
                value={this.state.idCard}
                onFocus={() => { this.setState({isFocus: true, isMns: false}) }} />
            </Shadow>
            <Shadow
              setting={{height: 45, width: 290, borderRadius: 30}}
              style={{marginTop: 10}}>
              <TextInput
                style={style.input}
                editable={this.state.editable}
                placeholder={text.login.label.password}
                placeholderTextColor={'#A8A8A8'}
                secureTextEntry
                autoCorrect={false}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => { this.setState({password: text}) }}
                value={this.state.password}
                onFocus={() => { this.setState({isFocus: true, isMns: false}) }} />
            </Shadow>
            <Shadow
              setting={{height: 45, width: 290, borderRadius: 30}}
              style={{marginTop: 30}}>
              <TouchableOpacity
                style={style.button}
                activeOpacity={0.8}
                disabled={!this.state.editable}
                onPressOut={this.login.bind(this)}>
                <Text style={style.text}>
                  {text.login.label.enter}
                </Text>
              </TouchableOpacity>
            </Shadow>
          </View>
        </KeyboardAvoidingView>
      </Container.ContainerLogin>
    )
  }
}
