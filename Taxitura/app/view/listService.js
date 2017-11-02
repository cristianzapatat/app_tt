import React, { Component } from 'react'
import {View, Text, FlatList} from 'react-native'

import styles from '../style/listService.style'
import Container from '../component/container'
import Item from '../component/item'
import consts from '../constant/constant'
import fs from '../util/fs'

let data = [{key: 'a'}, {key: 'b'}, {key: 'c'}, {key: 'd'}, {key: 'e'}, {key: 'f'}, {key: 'g'}, {key: 'h'}]

export default class ListService extends Component {
  goMap () {
    this.props.navigation.navigate('app')
  }

  logout () {
    this.props.navigation.navigate('login')
    fs.deleteFile(`${consts.persistenceFile}${consts.fileLogin}`)
  }

  render () {
    return (
      <Container
        renderMenu
        isMap
        goMap={() => { this.goMap() }}
        onPress={() => { this.logout() }} >
        <View style={styles.enter}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Lista de Servicios</Text>
          </View>
          <FlatList
            style={styles.list}
            data={data}
            renderItem={({item, index}) =>
              <Item
                item={item}
                index={index} />
          } />
        </View>
      </Container>
    )
  }
}
