import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'
import Modal from 'react-native-modal'

import style from '../style/menu.style'

import global from '../util/global'
import urls from '../util/urls'
import text from '../util/text'
import kts from '../util/kts'

export default class Menu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: false
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.isVisible && !this.state.isVisible) {
      this.setState({ isVisible: true })
    } else if (!nextProps.isVisible && this.state.isVisible) {
      this.setState({ isVisible: false })
    }
  }
  navigate (id) {
    this.setState({isVisible: false})
    setTimeout(() => {
      this.props.navigation.navigate(id)
    }, 400)
  }
  closeSession () {
    this.setState({isVisible: false})
    setTimeout(() => {
      AsyncStorage.removeItem(kts.key.user, () => {
        this.props.navigation.navigate(kts.login.id)
      })
    }, 400)
  }
  render () {
    return (
      <Modal
        style={style.modal}
        isVisible={this.state.isVisible}
        onBack
        animationIn={'slideInLeft'}
        animationInTiming={400}
        animationOut={'slideOutLeft'}
        animationOutTiming={400}>
        <View style={style.container}>
          <View style={style.header}>
            <TouchableOpacity
              style={style.out}
              onPressOut={() => { this.setState({isVisible: false}) }} >
              <Image
                style={style.outIcon}
                source={require('../../img/out.png')} />
            </TouchableOpacity>
            <View style={style.headerPhoto}>
              <Image
                style={style.photo}
                source={{uri: urls.getUrlPhoto(global.user.foto.url)}} />
            </View>
            <View style={style.headerName}>
              <Text
                style={[style.name]}
                numberOfLines={1}
                ellipsizeMode={kts.hardware.tail}>
                {global.user.nombre}
              </Text>
            </View>
          </View>
          <View style={style.content}>
            <TouchableOpacity
              style={style.item}
              onPressOut={() => { this.navigate(kts.waitingServices.id) }}>
              <Image
                style={style.iconItem}
                source={require('../../img/services.png')} />
              <Text style={style.textItem}>
                {text.menu.label.waitingServices}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.item}
              onPressOut={() => { this.navigate(kts.changePassword.id) }}>
              <Image
                style={style.iconItem}
                source={require('../../img/password.png')} />
              <Text style={style.textItem}>
                {text.menu.label.changePassword}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={style.close}>
            <TouchableOpacity
              style={style.ItemClose}
              onPressOut={() => { this.closeSession() }}>
              <Image
                style={style.iconClose}
                source={require('../../img/close_session.png')} />
              <Text style={style.textItem}>
                {text.menu.label.closeSession}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}
