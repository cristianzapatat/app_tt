import React, { Component } from 'react'
import {View, Text} from 'react-native'

import style from '../style/itemShoppingHistory.style'

import util from '../util/util'
import text from '../util/text'

export default class ItemShoppingHistory extends Component {
  render () {
    let item = this.props.item
    return (
      <View style={[style.item]}>
        <View style={style.title}>
          <Text
            style={[style.place]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {item.direccion}
          </Text>
          <Text
            style={[style.date]}>
            {util.getDateFormat(item.updated_at)}
          </Text>
        </View>
        <View style={style.body}>
          <View style={style.value}>
            <Text
              style={[style.price]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {text.item.label.symbolPrice}{util.separatorComa(`${parseInt(item.valor_de_paquete)}`)}
            </Text>
          </View>
          <View style={style.description}>
            <Text
              style={[style.package]}>
              {item.nombre_paquete !== null ? item.nombre_paquete : text.item.label.package}
            </Text>
            <Text
              style={[style.info]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {util.getTextServiceCommission(item)}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}
