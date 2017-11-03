import React, { Component } from 'react'
import {View, TouchableOpacity, Image, Text} from 'react-native'

import styles from '../style/item.style'

export default class Item extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: 'https://scontent.feoh3-1.fna.fbcdn.net/v/t1.0-1/p50x50/17903408_1044586812340472_7176591297268243543_n.png?oh=20bc54a7ec0faffce536dfa16eff5388&oe=5AA9803D'
    }
  }

  render () {
    let index = this.props.index
    return (
      <View style={[{backgroundColor: (index === 0 || index % 2 === 0 ? '#ecf0f1' : '#bdc3c7')}, styles.item]}>
        <TouchableOpacity onPress={this.props.showPhoto}>
          <Image
            style={styles.photo}
            source={{uri: this.props.item.user.url_pic || this.state.uri}} />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text
            style={[styles.text, styles.headerText]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {this.props.item.user.name || ''}
          </Text>
          <Text
            style={[styles.text, styles.footerText]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            Usuario Recurrente
          </Text>
        </View>
        <View style={[styles.buttons]}>
          <TouchableOpacity onPress={() => { console.log('asasas') }}>
            <View style={[styles.btn, styles.btnAccept]}>
              <Text style={styles.text}>Aceptar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.viewMap}>
            <View style={[styles.btn, styles.btnMap]}>
              <Text style={styles.text}>Mapa</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
