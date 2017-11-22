import React, { Component } from 'react'
import {View, TouchableOpacity, Text} from 'react-native'

import styles from '../style/settings.style'
import Container from '../component/container'
import UpdatePassword from '../component/updatePassword'

export default class Settings extends Component {
  constructor () {
    super()
    this.state = {
      visibleUpdatePassword: false
    }
  }

  __visibleModalUpdatePassword (state) {
    this.setState({visibleUpdatePassword: state})
  }

  render () {
    return (
      <Container>
        <View style={styles.enter}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Ajustes</Text>
          </View>
          <View style={styles.container}>
            <TouchableOpacity onPressOut={() => { this.__visibleModalUpdatePassword(true) }}>
              <View style={[styles.btn]}>
                <Text style={styles.text}>Cambiar Constraseña</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <UpdatePassword
          isVisible={this.state.visibleUpdatePassword}
          visibleModal={() => { this.__visibleModalUpdatePassword(false) }} />
      </Container>
    )
  }
}
