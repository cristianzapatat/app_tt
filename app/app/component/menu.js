import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'

import style from '../style/menu.style'

import Modal from './modal'
import Item from './itemMenu'
import itemJson from '../json/menu'

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
            {itemJson.map((item, i) => (
              <Item item={item} key={`${i}-item`} navigate={this.props.navigate} />
            ))}
          </View>
          <View style={style.close}>
            <Item
              item={{
                title: text.menu.label.closeSession,
                icon: {
                  url: require('../../img/close_session.png'),
                  width: 20,
                  height: 21.42 }
              }}
              navigate={this.props.closeSession}
              style={style.ItemClose} />
          </View>
        </View>
        <TouchableWithoutFeedback onPressIn={this.props.onClose}>
          <View style={style.vClose} />
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}
