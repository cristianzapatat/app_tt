/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {View, FlatList} from 'react-native'

import style from '../style/shoppingHistory.style'

import global from '../util/global'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'

import Container from '../component/container'
import Item from '../component/itemShoppingHistory'

export default class ShoppingHistory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentWillMount () {
    this.state.data.push({
      id: 1,
      lugar: 'Estanquillo la flor',
      fecha: '01/12/2017',
      valor: '$300,000',
      paquete: '5',
      descripcion: '20 servicios +  4 comisión'
    })
  }

  goBack () {
    const { goBack } = this.props.navigation
    goBack()
  }

  _keyExtractor (item, index) {
    return item.id
  }

  render () {
    return (
      <Container.ContainerGeneral
        title={text.shoppingHistory.label.title}
        onBack={() => { this.goBack() }}>
        <View style={style.content}>
          <FlatList
            style={style.list}
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            renderItem={({item, index}) =>
              <Item
                item={item}
                index={index} />
          } />
        </View>
      </Container.ContainerGeneral>
    )
  }
}
