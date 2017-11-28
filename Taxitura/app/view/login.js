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

import style from '../style/login.style'

import global from '../util/global'
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
      isFocus: false
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
      this.setState({isFocus: true})
    })
    Keyboard.addListener(kts.hardware.keyboardDidHide, () => {
      this.setState({isFocus: false})
    })
  }

  componentWillUnmount () {
    if (Platform.OS === kts.platform.android) {
      BackHandler.removeEventListener(kts.hardware.backPress)
    }
    Keyboard.removeAllListeners(kts.hardware.keyboardDidShow)
    Keyboard.removeAllListeners(kts.hardware.keyboardDidHide)
  }

  async login () {
    Keyboard.dismiss()
    let idCard = this.state.idCard
    let password = this.state.password
    if (idCard.length > 0 && password.length > 0) {
      this.setState({editable: false})
      fetch(urls.loginService(idCard, password))
        .then(response => {
          return response.json()
        })
        .then(json => {
          if (json) {
            if (json.token) {
              if (json.activo) {
                AsyncStorage.setItem(kts.key.user, JSON.stringify(json), () => {
                  global.user = json
                  this.props.navigation.navigate(kts.app.id)
                })
              } else {
                // TODO generar mensaje de usuario inactivo
                this.setState({password: '', editable: true})
                console.log('generar mensaje de usuario inactivo')
              }
            } else {
              // TODO generar mensaje de verificar credenciales
              this.setState({idCard: '', password: '', editable: true})
              console.log('generar mensaje de verificar credenciales')
            }
          } else {
            // TODO generar mensaje de verificar credenciales
            this.setState({idCard: '', password: '', editable: true})
            console.log('generar mensaje de verificar credenciales')
          }
        })
        .catch(err => {
          // TODO generar mensaje indicado error en conexión
          this.setState({idCard: '', editable: true})
          console.log('generar mensaje indicado error en conexión')
        })
    } else {
      // TODO generar mensajes de ingresar credenciales
      console.log('generar mensajes de ingresar credenciales')
    }
  }

  render () {
    return (
      <Container.ContainerLogin isFocus={this.state.isFocus}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={style.container}
        >
          <View style={style.formContainer}>
            <TextInput
              style={style.input}
              editable={this.state.editable}
              placeholder={text.login.idCard}
              placeholderTextColor={'#A8A8A8'}
              autoCorrect={false}
              autoCapitalize={'none'}
              underlineColorAndroid={'transparent'}
              onChangeText={(text) => { this.setState({idCard: text}) }}
              value={this.state.idCard}
              onFocus={() => { this.setState({isFocus: true}) }}
            />
            <TextInput
              style={style.input}
              editable={this.state.editable}
              placeholder={text.login.password}
              placeholderTextColor={'#A8A8A8'}
              secureTextEntry
              autoCorrect={false}
              autoCapitalize={'none'}
              underlineColorAndroid={'transparent'}
              onChangeText={(text) => { this.setState({password: text}) }}
              value={this.state.password}
              onFocus={() => { this.setState({isFocus: true}) }}
              ref={(input) => { this.password = input }}
            />
            <TouchableOpacity
              style={style.button}
              onPressOut={this.login.bind(this)}>
              <Text style={style.text}>
                {text.login.enter}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Container.ContainerLogin>
    )
  }
}
