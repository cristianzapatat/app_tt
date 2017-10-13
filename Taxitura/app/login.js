'use strict'
/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  View, TouchableOpacity, Text, KeyboardAvoidingView, Keyboard
} from 'react-native'
import styles from '../style/app.style'
import consts from '../constants/constants'
import t from 'tcomb-form-native'
import * as Progress from 'react-native-progress'
import fs from '../util/fs'

const Form = t.form.Form
const LoginForm = t.struct({
  id: t.Number,
  password: t.String
})

export default class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: {
        id: 7806756688,
        password: '123456'
      },
      options: {
        fields: {
          id: {
            label: 'Cédula',
            editable: true,
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'next',
            onSubmitEditing: () => { this.refs.form.getComponent('password').refs.input.focus() },
            error: 'Ingrese su cédula'
          },
          password: {
            label: 'Constraseña',
            editable: true,
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'go',
            secureTextEntry: true,
            onSubmitEditing: () => { this.login() },
            error: 'Ingrese su contraseña'
          }
        }
      },
      animating: false,
      statusLogin: false,
      messageLogin: ''
    }
  }

  setMessage (messageLogin) {
    this.setState({
      statusLogin: true,
      messageLogin
    })
  }

  async login () {
    let form = this.refs.form.getValue()
    Keyboard.dismiss()
    if (form) {
      if (form.id && form.password) {
        try {
          this.setState({animating: true})
          let url = consts.loginService(form.id, form.password)
          let response = await fetch(url)
          let token = await response.json()
          if (token) {
            if (token.token) {
              token['id'] = form.id
              token['password'] = form.password
              fs.createFile(consts.persistenceFile, consts.fileLogin, token)
                .then(status => {
                  this.setState({ animating: false })
                  this.props.navigation.navigate('app')
                  if (!status) {
                    this.setMessage('Archivo error')
                  }
                })
            } else {
              this.setState({value: {id: form.id, password: ''}, animating: false})
              this.setMessage('Acceso denegado\nVerifique sus credenciales')
            }
          } else {
            this.setState({value: {id: form.id, password: ''}, animating: false})
            this.setMessage('Acceso denegado\nVerifique sus credenciales')
          }
        } catch (error) {
          this.setState({animating: false})
          this.setMessage('Se presento un error en la autenticación\nIntento de nuevo')
        }
      } else {
        this.setMessage('Por favor ingrese sus credenciales para ingresar')
      }
    } else {
      this.setMessage('Por favor ingrese sus credenciales para ingresar')
    }
  }

  onChange (value) {
    if (this.state.statusLogin) {
      this.setState({ statusLogin: false, messageLogin: '' })
    }
    this.setState({value})
  }

  render () {
    return (
      <View style={styles.all}>
        <KeyboardAvoidingView behavior='padding'>
          <Form
            ref='form'
            type={LoginForm}
            options={this.state.options}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', display: this.state.animating ? 'flex' : 'none' }} >
            <Progress.CircleSnail
              size={80}
              animating={this.state.animating}
              thickness={5}
            />
          </View>
          <TouchableOpacity onPress={() => { this.login() }}>
            <View>
              <Text>
                Ingresar
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[{display: this.state.statusLogin ? 'flex' : 'none'}]}>
            <Text>{this.state.messageLogin}</Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    )
  }
}
