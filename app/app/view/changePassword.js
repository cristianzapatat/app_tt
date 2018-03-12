/* global fetch,Headers,FormData:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  AsyncStorage
} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'

import style from '../style/changePassword.style'

import Shadow from '../elements/shadow'

import global from '../util/global'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'
import util from '../util/util'

import Container from '../component/container'

export default class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editable: true,
      tCurrent: '',
      tNew: '',
      tRepeat: '',
      load: false
    }
  }

  componentWillMount () {
    Keyboard.addListener(kts.hardware.keyboardDidShow, () => {
      this.setState({isFocus: true, isMns: false})
    })
    Keyboard.addListener(kts.hardware.keyboardDidHide, () => {
      this.setState({isFocus: false})
    })
    this.isApp = EventRegister.addEventListener(kts.event.appIsApp, () => {
      this.goBack()
    })
  }

  componentWillUnmount () {
    Keyboard.removeAllListeners(kts.hardware.keyboardDidShow)
    Keyboard.removeAllListeners(kts.hardware.keyboardDidHide)
    EventRegister.removeEventListener(this.isApp)
  }

  goBack () {
    const { goBack } = this.props.navigation
    this.setState({load: false, isMns: false})
    global.isApp = true
    goBack()
  }

  resetView (message, value) {
    this.setState({
      tCurrent: '',
      tNew: '',
      tRepeat: '',
      message: message,
      typeMessage: value,
      load: false,
      editable: true,
      isMns: true
    })
  }

  changePassword () {
    Keyboard.dismiss()
    setTimeout(() => {
      let tCurrent = this.state.tCurrent
      let tNew = this.state.tNew
      let tRepeat = this.state.tRepeat
      if (tCurrent.length > 0 && tNew.length > 0 && tRepeat.length > 0) {
        if (tNew === tRepeat) {
          this.setState({load: true, editable: false})
          let myHeaders = new Headers()
          myHeaders.append(kts.header.contentType, kts.header.multiparFormData)
          myHeaders.append(kts.key.userToken, global.user.token)
          var data = new FormData()
          data.append(kts.body.currentPassword, tCurrent)
          data.append(kts.body.newPassword, tNew)
          data.append(kts.body.repeatPassword, tRepeat)
          let init = {
            method: kts.method.put,
            headers: myHeaders,
            body: data
          }
          util.isInternet().then(status => {
            if (status) {
              fetch(urls.updatePasswordService(global.user.id), init)
                .then(response => {
                  if ((response.status >= 200 && response.status <= 299) || response.status === 422) {
                    return response.json()
                  } else {
                    this.goBack()
                    EventRegister.emit(kts.event.sessionEnd)
                  }
                })
                .then(json => {
                  if (json.token) {
                    AsyncStorage.setItem(kts.key.user, JSON.stringify(json), () => {
                      global.user = json
                      this.resetView(text.changePassword.msn.changeSuccess, kts.enum.OK)
                    })
                  } else {
                    if (json.message) {
                      this.resetView(json.message, kts.enum.ERROR)
                    } else {
                      this.resetView(text.changePassword.msn.verifyCredential, kts.enum.ERROR)
                    }
                  }
                })
                .catch(err => {
                  this.resetView(text.changePassword.msn.error, kts.enum.ERROR)
                })
            } else {
              this.resetView(text.intenet.without, kts.enum.WITHOUT)
            }
          })
        } else {
          this.setState({tNew: '', tRepeat: '', message: text.changePassword.msn.noEquals, typeMessage: kts.enum.ERROR, isMns: true})
        }
      } else {
        this.setState({message: text.changePassword.msn.empty, typeMessage: kts.enum.ERROR, isMns: true})
      }
    }, 200)
  }

  onFocus () {
    EventRegister.emit(kts.event.onShow)
    this.setState({isFocus: true, isMns: false})
  }

  onChangeText (name, text) {
    if (name === 'tCurrent') this.setState({tCurrent: text})
    else if (name === 'tNew') this.setState({tNew: text})
    else if (name === 'tRepeat') this.setState({tRepeat: text})
    EventRegister.emit(kts.event.onShow)
  }

  render () {
    return (
      <Container.ContainerGeneral
        load={this.state.load}
        title={text.changePassword.label.title}
        isFocus={this.state.isFocus}
        isMns={this.state.isMns}
        typeMessage={this.state.typeMessage}
        message={this.state.message}
        isClose
        onBack={() => { this.goBack() }}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={style.container}>
          <View style={style.formContainer}>
            <Shadow
              setting={{width: 290, height: 45, borderRadius: 30}}
              style={{marginBottom: 10}} >
              <TextInput
                style={style.input}
                editable={this.state.editable}
                placeholder={text.changePassword.label.current}
                placeholderTextColor={'#A8A8A8'}
                secureTextEntry
                autoCorrect={false}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => { this.onChangeText('tCurrent', text) }}
                value={this.state.tCurrent}
                onFocus={() => { this.onFocus() }} />
            </Shadow>
            <Shadow
              setting={{width: 290, height: 45, borderRadius: 30}}
              style={{marginBottom: 10}} >
              <TextInput
                style={style.input}
                editable={this.state.editable}
                placeholder={text.changePassword.label.new}
                placeholderTextColor={'#A8A8A8'}
                secureTextEntry
                autoCorrect={false}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => { this.onChangeText('tNew', text) }}
                value={this.state.tNew}
                onFocus={() => { this.onFocus() }} />
            </Shadow>
            <Shadow
              setting={{width: 290, height: 45, borderRadius: 30}}
              style={{marginBottom: 10}} >
              <TextInput
                style={style.input}
                editable={this.state.editable}
                placeholder={text.changePassword.label.repeat}
                placeholderTextColor={'#A8A8A8'}
                secureTextEntry
                autoCorrect={false}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => { this.onChangeText('tRepeat', text) }}
                value={this.state.tRepeat}
                onFocus={() => { this.onFocus() }} />
            </Shadow>
          </View>
          <Shadow
            setting={{width: 290, height: 45, borderRadius: 30}}
            style={{marginTop: 40}} >
            <TouchableOpacity
              activeOpacity={0.8}
              style={style.button}
              disabled={!this.state.editable}
              onPressIn={() => { EventRegister.emit(kts.event.onShow) }}
              onPressOut={this.changePassword.bind(this)}>
              <Text style={style.text}>
                {text.changePassword.label.save}
              </Text>
            </TouchableOpacity>
          </Shadow>
        </KeyboardAvoidingView>
      </Container.ContainerGeneral>
    )
  }
}
