/* global fetch,Headers,FormData:true */
import React, {Component} from 'react'
import {View, Text, TouchableOpacity, KeyboardAvoidingView, Keyboard} from 'react-native'
import t from 'tcomb-form-native'
import Modal from 'react-native-modal'

import styles from '../style/updatePassword.style'
import styleForm from '../style/form.style'

import consts from '../constant/constant'

const Form = t.form.Form
const UpdateForm = t.struct({
  current: t.String,
  new: t.String,
  check: t.String
})

class UpdatePassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditable: true,
      show: false,
      text: '',
      value: {},
      options: {}
    }
    this.state.options = {
      fields: {
        stylesheet: styleForm,
        current: {
          label: consts.password,
          editable: this.state.isEditable,
          autoCapitalize: 'none',
          autoCorrect: false,
          returnKeyType: 'next',
          secureTextEntry: true,
          onSubmitEditing: () => { this.refs.form.getComponent('new').refs.input.focus() },
          onFocus: () => { this.onFocus() }
        },
        new: {
          label: consts.newPassword,
          editable: this.state.isEditable,
          autoCapitalize: 'none',
          autoCorrect: false,
          returnKeyType: 'next',
          secureTextEntry: true,
          onSubmitEditing: () => { this.refs.form.getComponent('check').refs.input.focus() },
          onFocus: () => { this.onFocus() }
        },
        check: {
          label: consts.repeatNewpassword,
          editable: this.state.isEditable,
          autoCapitalize: 'none',
          autoCorrect: false,
          returnKeyType: 'go',
          secureTextEntry: true,
          onSubmitEditing: () => { this.updatePassword() },
          onFocus: () => { this.onFocus() }
        }
      }
    }
  }

  updatePassword () {
    Keyboard.dismiss()
    let form = this.refs.form.getValue()
    if (form) {
      if (form.current && form.new && form.check) {
        if (form.new === form.check) {
          this.setState({isEditable: false})
          let myHeaders = new Headers()
          myHeaders.append('Content-Type', 'multipart/form-data')
          myHeaders.append('user_token', consts.user.token)
          var data = new FormData()
          data.append('contrasenia_antigua', form.current)
          data.append('contrasenia_nueva', form.new)
          data.append('confirmacion_contrasenia_nueva', form.check)
          let init = {
            method: 'PUT',
            headers: myHeaders,
            body: data
          }
          fetch(consts.updatePasswordService(consts.user.id), init)
            .then(response => {
              return response.json()
            })
            .then(json => {
              if (json.token) {
              } else {
                if (json.message) {
                } else {
                }
              }
              this.setState({isEditable: true})
            })
        } else {
          this.setState({
            value: {
              current: form.current,
              new: '',
              check: ''
            },
            show: true,
            text: consts.errorNewPassword
          })
        }
      }
    }
  }

  callBack (call) {
    Keyboard.dismiss()
    call()
  }

  onFocus () {
    this.setState({
      show: false,
      text: ''
    })
  }

  onChange (value) {
    this.setState({value})
  }

  hideModal () {
    this.setState({
      isEditable: true,
      show: false,
      text: '',
      value: {}
    })
  }

  render () {
    return (
      <Modal
        isVisible={this.props.isVisible}
        callBack={() => { this.callBack(this.props.visibleModal) }}
        animationIn={'slideInLeft'}
        animationOut={'slideOutRight'}
        onModalHide={this.hideModal.bind(this)}>
        <View style={styles.content}>
          <KeyboardAvoidingView behavior='padding' style={styles.form}>
            <Form
              ref='form'
              type={UpdateForm}
              value={this.state.value}
              options={this.state.options}
              onChange={this.onChange.bind(this)} />
            <View style={styles.buttons}>
              <TouchableOpacity onPressOut={() => { this.callBack(this.props.visibleModal) }}>
                <View style={[styles.btn]}>
                  <Text style={[styles.text, styles.close]}>{consts.btnClose}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPressOut={() => { this.updatePassword() }}>
                <View style={[styles.btn]}>
                  <Text style={[styles.text, styles.update]}>{consts.btnUpdate}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
        <View style={[{display: this.state.show ? 'flex' : 'none'}, styles.content, styles.show]}>
          <Text style={[styles.text, styles.error]}>{this.state.text}</Text>
        </View>
      </Modal>
    )
  }
}

module.exports = UpdatePassword
