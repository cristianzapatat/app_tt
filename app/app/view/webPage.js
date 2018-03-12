import React, { Component } from 'react'
import {
  Image,
  View,
  TouchableOpacity,
  WebView
} from 'react-native'

import urls from '../util/urls'
import style from '../style/webPage.style'

export default class WebPage extends Component {
  goBack () {
    this.props.navigation.goBack()
  }
  render () {
    return (
      <View style={style.content}>
        <View style={style.bar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressOut={this.goBack.bind(this)}
            style={style.back} >
            <Image
              style={style.icon}
              source={require('../../img/back.png')} />
          </TouchableOpacity>
        </View>
        <WebView source={{uri: urls.serverHelp}} />
      </View>
    )
  }
}
