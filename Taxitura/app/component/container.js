import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text
} from 'react-native'

import style from '../style/container.style'

import text from '../util/text'

import Map from './map'

class ContainerLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      styleLogin: style.login
    }
  }
  render () {
    return (
      <View style={this.state.styleLogin.container}>
        <Map.MapClassic
          style={this.state.styleLogin.map}
        />
        <View style={this.state.styleLogin.logoContainer}>
          <Image
            style={this.state.styleLogin.logo}
            source={require('../../img/taxitura.png')}
          />
        </View>
        <View style={this.state.styleLogin.children}>
          {this.props.children}
        </View>
        <View style={[
          {display: this.props.isFocus ? 'none' : 'flex'},
          this.state.styleLogin.help
        ]}>
          <TouchableOpacity
            style={this.state.styleLogin.ButtonHelp}>
            <Image
              style={this.state.styleLogin.iconHelp}
              source={require('../../img/menu.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

class ContainerApp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      styleApp: style.app
    }
  }
  __drawFooter () {
    if (this.props.isService) {
      return (
        <TouchableOpacity style={this.state.styleApp.button}>
          <Text style={this.state.styleApp.text}>
            {this.props.textButton} Llegué!
          </Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={this.state.styleApp.contentFooter}>
          <View style={this.state.styleApp.itemFooter}>
            <Text style={this.state.styleApp.tNumber}>15</Text>
            <Text
              style={this.state.styleApp.tText}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {text.app.label.available}
            </Text>
          </View>
          <View style={this.state.styleApp.itemFooter}>
            <Text style={this.state.styleApp.tNumber}>08</Text>
            <Text
              style={this.state.styleApp.tText}>
              {text.app.label.borroweb}
            </Text>
          </View>
          <TouchableOpacity
            style={this.state.styleApp.ButtonGraphic}>
            <Image
              style={this.state.styleApp.iconGraphic}
              source={require('../../img/menu.png')} />
          </TouchableOpacity>
        </View>
      )
    }
  }
  render () {
    return (
      <View style={this.state.styleApp.container}>
        <Map.MapCabman
          style={this.state.styleApp.map}
        />
        <View style={[this.state.styleApp.content, this.state.styleApp.headerLogo]}>
          <TouchableOpacity
            style={this.state.styleApp.menu} >
            <Image
              style={this.state.styleApp.icon}
              source={require('../../img/menu.png')}
            />
          </TouchableOpacity>
          <Image
            style={this.state.styleApp.logo}
            source={require('../../img/taxitura.png')}
          />
        </View>
        <View style={[this.state.styleApp.content, this.state.styleApp.headerTitle]}>
          <Text
            style={this.state.styleApp.title}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {this.props.title}
          </Text>
        </View>
        <View style={[this.state.styleApp.content, this.state.styleApp.footer]}>
          { this.__drawFooter() }
        </View>
        {this.props.children}
      </View>
    )
  }
}

module.exports = {
  ContainerLogin,
  ContainerApp
}
