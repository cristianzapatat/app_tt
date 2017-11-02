import React, { Component } from 'react'
import {View, TouchableOpacity, Image, Text} from 'react-native'

import styles from '../style/item.style'

export default class Item extends Component {
  render () {
    let index = this.props.index
    return (
      <View style={[{backgroundColor: (index === 0 || index % 2 === 0 ? '#ecf0f1' : '#bdc3c7')}, styles.item]}>
        <TouchableOpacity onPress={this.props.viewPhoto}>
          <Image
            style={styles.photo}
            source={{uri: 'https://scontent.feoh3-1.fna.fbcdn.net/v/t1.0-9/18199295_1446469008706928_5567627519015673328_n.jpg?oh=b6a914fff5b0014b87bac7d82fff5a2f&oe=5A709BD7'}} />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text
            style={[styles.text, styles.headerText]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            Cristian Camilo Zapata Torres
          </Text>
          <Text
            style={[styles.text, styles.footerText]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            Ingeniero de Software
          </Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => { console.log('') }}>
            <View style={[styles.btn, styles.btnAccept]}>
              <Text style={styles.text}>Aceptar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { console.log('') }}>
            <View style={[styles.btn, styles.btnMap]}>
              <Text style={styles.text}>Mapa</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
