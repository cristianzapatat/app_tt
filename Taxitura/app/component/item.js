import React, { Component } from 'react'
import {View, TouchableOpacity, Image, Text} from 'react-native'

import style from '../style/item.style'

import text from '../util/text'

export default class Item extends Component {
  render () {
    return (
      <View style={[style.item]}>
        <Image
          style={style.photo}
          source={{uri: this.props.item.user.url_pic}}
        />
        <View style={style.content}>
          <Text
            style={[style.text, style.name]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {this.props.item.user.name}
          </Text>
          <Text
            style={[style.text, style.address]}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {this.props.item.position_user.address}
          </Text>
        </View>
        <TouchableOpacity
          style={style.button}
          onPressOut={this.props.acceptService}>
          <Text style={[style.textButton]}>
            {text.item.label.accept}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
