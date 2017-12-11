import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal'

import style from '../style/menu.style'

import global from '../util/global'
import urls from '../util/urls'
import text from '../util/text'
import kts from '../util/kts'

export default class Menu extends Component {
  render () {
    return (
      <Modal
        style={style.modal}
        isVisible={this.props.isVisible}
        callBack={this.props.onClose}
        animationIn={'slideInLeft'}
        animationInTiming={200}
        animationOut={'slideOutLeft'}
        animationOutTiming={200}>
        <View style={style.container}>
          <View style={style.header}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={style.out}
              onPressOut={this.props.onClose} >
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
              activeOpacity={0.8}
              style={style.item}
              onPressOut={this.props.goWaitingServices} >
              <Image
                style={[style.iconItem, {width: 20.5, height: 26.5}]}
                source={require('../../img/services.png')} />
              <Text style={style.textItem}>
                {text.menu.label.waitingServices}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={style.item}
              onPressOut={this.props.goChangePassword}>
              <Image
                style={[style.iconItem, {width: 20.5, height: 26.5}]}
                source={require('../../img/password.png')} />
              <Text style={style.textItem}>
                {text.menu.label.changePassword}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={style.item}
              onPressOut={this.props.goRechargePoints}>
              <Image
                style={[style.iconItem, {width: 20, height: 25.5}]}
                source={require('../../img/recharge_points.png')} />
              <Text style={style.textItem}>
                {text.menu.label.rechargePoints}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={style.item}
              onPressOut={this.props.goShoppingHistory}>
              <Image
                style={[style.iconItem, {width: 20.5, height: 15.42}]}
                source={require('../../img/card_recharge.png')} />
              <Text style={style.textItem}>
                {text.menu.label.shoppingHistory}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={style.close}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={style.ItemClose}
              onPressOut={this.props.closeSession}>
              <Image
                style={[style.iconItem, {width: 20.5, height: 21.42}]}
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
