/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {View, FlatList} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'

import style from '../style/shoppingHistory.style'

import global from '../util/global'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'
import util from '../util/util'

import Container from '../component/container'
import Item from '../component/itemShoppingHistory'

export default class ShoppingHistory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      load: true,
      data: []
    }
  }

  componentWillMount () {
    this.getList()
  }

  getList () {
    util.isInternet().then(async (status) => {
      if (status) {
        try {
          let result = await fetch(urls.getShoppingHistory(global.user.id))
          let json = await result.json()
          if (json.erros) {
            this.setState({data: [], load: false})
          } else {
            this.setState({data: json, load: false})
          }
        } catch (err) {
          this.setState({data: [], load: false})
        }
      } else {
        this.setState({
          message: text.intenet.without,
          typeMessage: kts.enum.WITHOUT,
          load: false,
          isMns: true
        })
      }
    })
  }

  goBack () {
    const { goBack } = this.props.navigation
    this.setState({load: false, json: [], isMns: false})
    goBack()
  }

  onShow () {
    EventRegister.emit(kts.event.onShow)
  }

  _keyExtractor (item, index) {
    return item.id
  }

  render () {
    return (
      <Container.ContainerGeneral
        load={this.state.load}
        title={text.shoppingHistory.label.title}
        isMns={this.state.isMns}
        typeMessage={this.state.typeMessage}
        message={this.state.message}
        onBack={() => { this.goBack() }}>
        <View style={style.content}>
          <FlatList
            style={style.list}
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            renderItem={({item, index}) =>
              <Item
                item={item}
                index={index}
                onShow={this.onShow.bind(this)} />
          } />
        </View>
      </Container.ContainerGeneral>
    )
  }
}
