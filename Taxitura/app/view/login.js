/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  BackHandler,
  Platform
} from 'react-native'

import style from '../style/login.style'

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
    let form = this.refs.form.getValue()
    if (form) {
      if (form.id && form.password) {
        try {
          this.setState({loading: true})
          let response = await fetch(urls.loginService(form.id, form.password))
          let token = await response.json()
          if (token) {
            if (token.token) {
              if (token.activo) {
                //
                // fs.createFile(consts.persistenceFile, consts.fileLogin, token)
                //   .then(status => {
                //     this.setState({ loading: false })
                //     consts.user = token
                //     consts.position = null
                //     this.props.navigation.navigate('app')
                //     if (!status) {
                //       this.setMessage('Archivo error')
                //     }
                //   })
              } else {
                this.setState({value: {id: form.id, password: ''}, loading: false})
                this.setMessage('Usuario inactivo\nComuníquese con soporte')
              }
            } else {
              this.setState({value: {id: form.id, password: ''}, loading: false})
              this.setMessage('Acceso denegado\nVerifique sus credenciales')
            }
          } else {
            this.setState({value: {id: form.id, password: ''}, loading: false})
            this.setMessage('Acceso denegado\nVerifique sus credenciales')
          }
        } catch (error) {
          this.setState({loading: false})
          this.setMessage('Verifique su conexión de Internet\nIntento de nuevo')
        }
      } else {
        this.setMessage('Por favor ingrese sus credenciales para ingresar')
      }
    } else {
      this.setMessage('Por favor ingrese sus credenciales para ingresar')
    }
  }

  render () {
    return (
      <Container isFocus={this.state.isFocus}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={style.container}
        >
          <View style={style.logoContainer}>
            <Image
              style={style.logo}
              source={require('../../img/taxitura.png')}
            />
          </View>
          <View style={style.formContainer}>
            <TextInput
              style={style.input}
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
            <TouchableOpacity style={style.button}>
              <Text style={style.text}>
                {text.login.enter}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
