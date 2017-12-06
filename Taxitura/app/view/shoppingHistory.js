/* global fetch, Headers:true */
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
    this.getList()
  }

  async getList () {
    let myHeaders = new Headers()
    myHeaders.append(kts.key.userToken, global.user.token)
    let init = {
      method: kts.method.get,
      headers: myHeaders
    }
    try {
      let result = await fetch(urls.getShoppingHistory(global.user.id), init)
      let json = await result.json()
      if (json.erros) {
        this.setState({data: []})
      } else {
        this.setState({data: json})
      }
    } catch (err) {
      this.setState({data: []})
    }
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
