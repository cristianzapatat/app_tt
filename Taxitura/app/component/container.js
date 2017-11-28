import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text
} from 'react-native'

import style from '../style/container.style'

import text from '../util/text'
import kts from '../util/kts'

import Map from './map'

class ContainerLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      styleLogin: style.login,
      isMns: false
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.isMns && !this.state.isMns) {
      this.setState({ isMns: true })
    } else if (!nextProps.isMns && this.state.isMns) {
      this.setState({ isMns: false })
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
          {display: this.state.isMns ? 'flex' : 'none'},
          this.state.styleLogin.msn
        ]}>
          <Image
            style={[
              {display: this.props.typeMessage === kts.enum.ERROR ? 'flex' : 'none'},
              this.state.styleLogin.mIcon
            ]}
            source={require('../../img/warning.png')}
          />
          <Image
            style={[
              {display: this.props.typeMessage === kts.enum.OK || !this.props.typeMessage ? 'flex' : 'none'},
              this.state.styleLogin.mIcon
            ]}
            source={require('../../img/ok.png')}
          />
          <Text
            style={this.state.styleLogin.mText}
            numberOfLines={2}
            ellipsizeMode={kts.hardware.tail}>
            {this.props.message}
          </Text>
          <TouchableOpacity
            style={this.state.styleLogin.mButton}
            onPress={() => { this.setState({isMns: false}) }}>
            <Image
              style={this.state.styleLogin.mClose}
              source={require('../../img/close.png')}
            />
          </TouchableOpacity>
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
    if (this.props.isButton) {
      return (
        <TouchableOpacity
          onPressOut={this.props.onProcess}
          style={this.state.styleApp.button}>
          <Text style={this.state.styleApp.text}>
            {this.props.textButton}
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
              ellipsizeMode={kts.hardware.tail}>
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
  __drawMap () {
    if (this.props.isService) {
      return (
        <Map.MapService
          style={this.state.styleApp.map}
          latitude={this.props.latitude}
          longitude={this.props.longitude}
          latitudeService={this.props.latitudeService}
          longitudeService={this.props.longitudeService}
          address={this.props.address}
          coords={this.props.coords}
        />
      )
    } else {
      return (
        <Map.MapCabman
          style={this.state.styleApp.map}
          latitude={this.props.latitude}
          longitude={this.props.longitude}
        />
      )
    }
  }
  render () {
    return (
      <View style={this.state.styleApp.container}>
        { this.__drawMap() }
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
            ellipsizeMode={kts.hardware.tail}>
            {this.props.title}
          </Text>
        </View>
        <View style={[
          {display: this.props.isNoGps ? 'flex' : 'none'},
          this.state.styleApp.warning
        ]}>
          <Image
            style={this.state.styleApp.iconWarning}
            source={require('../../img/no_gps.png')}
          />
          <Text style={this.state.styleApp.textWarning}>
            {this.props.textNoGps}
          </Text>
          <TouchableOpacity
            style={this.state.styleApp.buttonWarning}
            onPressOut={this.props.getStatus}>
            <Text style={this.state.styleApp.textButtonWarning}>
              {text.app.gps.update}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[this.state.styleApp.content, this.state.styleApp.footer]}>
          { this.__drawFooter() }
        </View>
        {this.props.children}
      </View>
    )
  }
}

class ContainerGeneral extends Component {
  constructor (props) {
    super(props)
    this.state = {
      styleGeneral: style.general,
      isMns: false
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.isMns && !this.state.isMns) {
      this.setState({ isMns: true })
    } else if (!nextProps.isMns && this.state.isMns) {
      this.setState({ isMns: false })
    }
  }
  render () {
    return (
      <View style={this.state.styleGeneral.container}>
        <Map.MapClassic
          style={this.state.styleGeneral.map}
        />
        <View style={[this.state.styleGeneral.content, this.state.styleGeneral.headerLogo]}>
          <TouchableOpacity
            style={this.state.styleGeneral.menu} >
            <Image
              style={this.state.styleGeneral.icon}
              source={require('../../img/menu.png')}
            />
          </TouchableOpacity>
          <Image
            style={this.state.styleGeneral.logo}
            source={require('../../img/taxitura.png')}
          />
        </View>
        <View style={[this.state.styleGeneral.content, this.state.styleGeneral.headerTitle]}>
          <Text
            style={this.state.styleGeneral.title}
            numberOfLines={1}
            ellipsizeMode={kts.hardware.tail}>
            {this.props.title}
          </Text>
        </View>
        <View style={[
          {display: this.props.isNoGps ? 'flex' : 'none'},
          this.state.styleGeneral.warning
        ]}>
          <Image
            style={this.state.styleGeneral.iconWarning}
            source={require('../../img/no_gps.png')}
          />
          <Text style={this.state.styleGeneral.textWarning}>
            {this.props.textNoGps}
          </Text>
          <TouchableOpacity
            style={this.state.styleGeneral.buttonWarning}
            onPressOut={this.props.onClick}>
            <Text style={this.state.styleGeneral.textButtonWarning}>
              {text.waitingServices.label.return}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[
          {display: this.state.isMns ? 'flex' : 'none'},
          this.state.styleGeneral.msn
        ]}>
          <Image
            style={[
              {display: this.props.typeMessage === kts.enum.ERROR ? 'flex' : 'none'},
              this.state.styleGeneral.mIcon
            ]}
            source={require('../../img/warning.png')}
          />
          <Image
            style={[
              {display: this.props.typeMessage === kts.enum.OK || !this.props.typeMessage ? 'flex' : 'none'},
              this.state.styleGeneral.mIcon
            ]}
            source={require('../../img/ok.png')}
          />
          <Text
            style={this.state.styleGeneral.mText}
            numberOfLines={2}
            ellipsizeMode={kts.hardware.tail}>
            {this.props.message}
          </Text>
          <TouchableOpacity
            style={this.state.styleGeneral.mButton}
            onPress={() => { this.setState({isMns: false}) }}>
            <Image
              style={this.state.styleGeneral.mClose}
              source={require('../../img/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={[
          {display: this.props.isFocus ? 'none' : 'flex'},
          this.state.styleGeneral.content,
          this.state.styleGeneral.footer
        ]}>
          <View style={this.state.styleGeneral.contentFooter}>
            <View style={this.state.styleGeneral.itemFooter}>
              <Text style={this.state.styleGeneral.tNumber}>15</Text>
              <Text
                style={this.state.styleGeneral.tText}
                numberOfLines={2}
                ellipsizeMode={'tail'}>
                {text.app.label.available}
              </Text>
            </View>
            <View style={this.state.styleGeneral.itemFooter}>
              <Text style={this.state.styleGeneral.tNumber}>08</Text>
              <Text
                style={this.state.styleGeneral.tText}>
                {text.app.label.borroweb}
              </Text>
            </View>
            <TouchableOpacity
              style={this.state.styleGeneral.ButtonGraphic}>
              <Image
                style={this.state.styleGeneral.iconGraphic}
                source={require('../../img/menu.png')} />
            </TouchableOpacity>
          </View>
        </View>
        {this.props.children}
      </View>
    )
  }
}

module.exports = {
  ContainerLogin,
  ContainerApp,
  ContainerGeneral
}
