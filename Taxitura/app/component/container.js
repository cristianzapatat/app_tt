import React, { Component } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'

import style from '../style/container.style'

import Map from './map'

class Container extends Component {
  getMap (value) {
    switch (value) {
      case 0:
        return <Map.MapClassic style={style.map} />
      default:
        return <Map.MapClassic style={style.map} />
    }
  }
  render () {
    return (
      <View style={style.container}>
        { this.getMap(this.props.idMap) }
        <View style={style.children}>
          {this.props.children}
        </View>
        <View style={[
          {display: this.props.isFocus ? 'none' : 'flex'},
          style.help
        ]}>
          <TouchableOpacity style={style.ButtonHelp}>
            <Image
              style={style.iconHelp}
              source={require('../../img/menu.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

module.exports = Container
