'use strict'
/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  View, TouchableOpacity, Text, KeyboardAvoidingView, Keyboard
} from 'react-native'
import styles from '../style/login.style'
import styleForm from '../style/form.style'
import consts from '../constants/constants'
import Header from '../components/header'
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
        stylesheet: styleForm,
        fields: {
          id: {
            label: 'Cédula',
            editable: true,
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'next',
            onSubmitEditing: () => { this.refs.form.getComponent('password').refs.input.focus() },
            onFocus: () => { this.onFocus() }
          },
          password: {
            label: 'Constraseña',
            editable: true,
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'go',
            secureTextEntry: true,
            onSubmitEditing: () => { this.login() },
            onFocus: () => { this.onFocus() }
          }
        }
      },
      loading: false,
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
    Keyboard.dismiss()
    let form = this.refs.form.getValue()
    if (form) {
      if (form.id && form.password) {
        try {
          this.setState({loading: true})
          let url = consts.loginService(form.id, form.password)
          let response = await fetch(url)
          let token = await response.json()
          if (token) {
            if (token.token) {
              token['id'] = form.id
              token['password'] = form.password
              fs.createFile(consts.persistenceFile, consts.fileLogin, token)
                .then(status => {
                  this.setState({ loading: false })
                  this.props.navigation.navigate('app')
                  if (!status) {
                    this.setMessage('Archivo error')
                  }
                })
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

  onFocus () {
    this.setState({ loading: false, statusLogin: false, messageLogin: '' })
  }

  static navigationOptions = {
    headerLeft: null,
    header: <Header />
  }

  render () {
    return (
      <View style={styles.all}>
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <View style={styles.form}>
            <Form
              ref='form'
              type={LoginForm}
              options={this.state.options}
              value={this.state.value}
              onChange={this.onChange.bind(this)} />
            <TouchableOpacity onPress={() => {
              Keyboard.dismiss()
              this.login()
            }}>
              <View style={styles.button}>
                <Text style={styles.text}>
                  Ingresar
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.response}>
            <View style={[{ display: this.state.loading ? 'flex' : 'none' }, styles.loading]}>
              <Progress.CircleSnail
                size={80}
                animating={this.state.loading}
                thickness={5}
                color={['#2980b9']}
              />
            </View>
            <View style={[{display: this.state.statusLogin ? 'flex' : 'none'}, styles.message]}>
              <Text style={[styles.text, styles.error]}>{this.state.messageLogin}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    )
  }
}
