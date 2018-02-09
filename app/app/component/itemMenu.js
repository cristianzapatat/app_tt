import React, { Component } from 'react'
import {
  Image,
  Text,
  TouchableOpacity
} from 'react-native'

import style from '../style/itemMenu.style'

export default class ItemMenu extends Component {
  render () {
    let item = this.props.item
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[style.item, this.props.style]}
        onPressOut={() => { item.go ? this.props.navigate(item.go) : this.props.navigate() }} >
        <Image
          style={[style.iconItem, {width: item.icon.width, height: item.icon.height}]}
          source={item.icon.url} />
        <Text style={[style.textItem]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }
}
