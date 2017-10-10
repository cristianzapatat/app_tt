'use strict'
/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  View, TouchableOpacity, Text
} from 'react-native'
import styles from '../style/app.style'
import consts from '../constants/constants'
import HeaderIcon from '../util/headerIcon'
import t from 'tcomb-form-native'
import FloatingLabel from 'react-native-floating-label'
import fs from 'react-native-fs'

const Form = t.form.Form
const LoginForm = t.struct({
  id: t.Number,
  password: t.String
})

let options = {
  fields: {
    id: {
      label: 'Cédula',
      editable: true,
      factory: FloatingLabel
    },
    password: {
      label: 'Constraseña',
      editable: true,
      secureTextEntry: true,
      factory: FloatingLabel
    }
  }
}

export default class Login extends Component {
  test () {
    console.log(fs.DocumentDirectoryPath)
  }
  async login () {
    let form = this.refs.form.getValue()
    if (form) {
      if (form.id && form.password) {
        try {
          let url = consts.loginService(form.id, form.password)
          let response = await fetch(url)
          let token = await response.json()
          if (token) {
            if (token.token) {
              token['id'] = form.id
              token['password'] = form.password
            } else {}
          } else {}
        } catch (error) {
        }
      } else {
      }
    }
  }

  render () {
    return (
      <View style={styles.all}>
        <HeaderIcon />
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <Form ref='form'
              type={LoginForm}
              options={options}
            />
            <TouchableOpacity onPress={() => { this.test() }}>
              <View>
                <Text>
                  Ingresar
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
