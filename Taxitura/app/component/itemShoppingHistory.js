import React, { Component } from 'react'
import {View, Text} from 'react-native'

import style from '../style/itemShoppingHistory.style'

import global from '../util/global'
import text from '../util/text'

export default class Item extends Component {
  render () {
    return (
      <View style={[style.item]}>
        <View style={style.title}>
          <Text
            style={[style.place]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {this.props.item.lugar}
          </Text>
          <Text
            style={[style.date]}>
            {this.props.item.fecha}
          </Text>
        </View>
        <View style={style.body}>
          <View style={style.value}>
            <Text
              style={[style.price]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {this.props.item.valor}
            </Text>
          </View>
          <View style={style.description}>
            <Text
              style={[style.package]}>
              {text.item.label.package}{this.props.item.paquete}
            </Text>
            <Text
              style={[style.info]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {this.props.item.descripcion}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}
