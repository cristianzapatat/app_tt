import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated
} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import Switch from 'react-native-switch-pro'

import style from '../style/container.style'

import global from '../util/global'
import text from '../util/text'
import kts from '../util/kts'

import Map from './map'

let isState = false

class ContainerLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      styleLogin: style.login,
      isMns: false,
      isMap: true
    }
    this.state.isMap = global.isDay
  }
  componentWillMount () {
    EventRegister.addEventListener(kts.event.changeMap, (data) => {
      if (this.state.isMap !== data) {
        this.setState({isMap: data})
      }
    })
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.isMns && !this.state.isMns) {
      this.setState({ isMns: true })
    } else if (!nextProps.isMns && this.state.isMns) {
      this.setState({ isMns: false })
    }
  }
  __drawMap () {
    if (this.state.isMap) {
      return (<Map.Classic.MapDay style={this.state.styleLogin.map} />)
    } else {
      return (<Map.Classic.MapNight style={this.state.styleLogin.map} />)
    }
  }
  render () {
    return (
      <View style={this.state.styleLogin.container}>
        { this.__drawMap() }
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
            onPressOut={() => { this.setState({isMns: false}) }}>
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
              source={require('../../img/question.png')}
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
      styleApp: style.app,
      state: true,
      disabled: false,
      isMap: true,
      animated: new Animated.Value(0)
    }
    this.state.state = global.state
    this.state.isMap = global.isDay
  }
  componentWillMount () {
    EventRegister.addEventListener(kts.event.changeMap, (data) => {
      if (this.state.isMap !== data) {
        this.setState({isMap: data})
      }
    })
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
              source={require('../../img/charts.png')} />
          </TouchableOpacity>
        </View>
      )
    }
  }
  getMapService () {
    if (this.state.isMap) {
      return (
        <Map.Service.MapDay
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
        <Map.Service.MapNight
          style={this.state.styleApp.map}
          latitude={this.props.latitude}
          longitude={this.props.longitude}
          latitudeService={this.props.latitudeService}
          longitudeService={this.props.longitudeService}
          address={this.props.address}
          coords={this.props.coords}
        />
      )
    }
  }
  getMapCabman () {
    if (this.state.isMap) {
      return (
        <Map.Cabman.MapDay
          style={this.state.styleApp.map}
          latitude={this.props.latitude}
          longitude={this.props.longitude}
        />
      )
    } else {
      return (
        <Map.Cabman.MapNight
          style={this.state.styleApp.map}
          latitude={this.props.latitude}
          longitude={this.props.longitude}
        />
      )
    }
  }
  __drawMap () {
    if (this.props.isService) {
      return this.getMapService()
    } else {
      return this.getMapCabman()
    }
  }
  showState () {
    let value = !isState ? 1 : 0
    isState = value === 1
    Animated.timing(
      this.state.animated,
      {
        toValue: value,
        duration: 400
      }
    ).start()
  }
  modifyState () {
    let state = !this.state.state
    global.state = state
    this.setState({state})
    this.showState()
  }
  render () {
    let { animated } = this.state
    return (
      <View style={this.state.styleApp.container}>
        { this.__drawMap() }
        <View style={[this.state.styleApp.content, this.state.styleApp.headerLogo]}>
          <TouchableOpacity
            onPressOut={() => {
              if (isState) this.showState()
              this.props.onPressMenu()
            }}
            style={this.state.styleApp.menu} >
            <Image
              style={this.state.styleApp.icon}
              source={require('../../img/menu.png')} />
          </TouchableOpacity>
          <Image
            style={this.state.styleApp.logo}
            source={require('../../img/taxitura.png')} />
          <TouchableOpacity
            onPressOut={this.showState.bind(this)}
            style={this.state.styleApp.state} >
            <Image
              style={this.state.styleApp.iconstate}
              source={require('../../img/state.png')} />
          </TouchableOpacity>
        </View>
        <Animated.View style={[
          {opacity: animated},
          this.state.styleApp.floatState]}>
          <Switch
            width={50}
            height={25}
            value={!this.state.state}
            disabled={this.state.disabled}
            backgroundActive={'#B3B3B3'}
            backgroundInactive={'#ffaf18'}
            onSyncPress={this.modifyState.bind(this)} />
          <Text style={this.state.styleApp.tState}>
            {this.state.state ? text.item.label.available : text.item.label.occupied}
          </Text>
        </Animated.View>
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
          this.state.styleApp.warning ]}>
          <Image
            style={this.state.styleApp.iconWarning}
            source={require('../../img/no_gps.png')} />
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
      isMns: false,
      isMap: true,
      state: true,
      disabled: false,
      animated: new Animated.Value(0)
    }
    this.state.state = global.state
    this.state.isMap = global.isDay
  }
  componentWillMount () {
    EventRegister.addEventListener(kts.event.changeMap, (data) => {
      if (this.state.isMap !== data) {
        this.setState({isMap: data})
      }
    })
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.isMns && !this.state.isMns) {
      this.setState({ isMns: true })
    } else if (!nextProps.isMns && this.state.isMns) {
      this.setState({ isMns: false })
    }
  }
  __drawMap () {
    if (this.state.isMap) {
      return (<Map.Classic.MapDay style={this.state.styleGeneral.map} />)
    } else {
      return (<Map.Classic.MapNight style={this.state.styleGeneral.map} />)
    }
  }
  showState () {
    let value = !isState ? 1 : 0
    isState = value === 1
    Animated.timing(
      this.state.animated,
      {
        toValue: value,
        duration: 400
      }
    ).start()
  }
  modifyState () {
    let state = !this.state.state
    global.state = state
    this.setState({state})
    this.showState()
  }
  render () {
    let { animated } = this.state
    return (
      <View style={this.state.styleGeneral.container}>
        { this.__drawMap() }
        <View style={[this.state.styleGeneral.content, this.state.styleGeneral.headerLogo]}>
          <TouchableOpacity
            onPressOut={() => {
              if (isState) this.showState()
              this.props.onBack()
            }}
            style={this.state.styleGeneral.menu} >
            <Image
              style={this.state.styleGeneral.icon}
              source={require('../../img/back.png')} />
          </TouchableOpacity>
          <Image
            style={this.state.styleGeneral.logo}
            source={require('../../img/taxitura.png')} />
          <TouchableOpacity
            onPressOut={this.showState.bind(this)}
            style={this.state.styleGeneral.state} >
            <Image
              style={this.state.styleGeneral.iconstate}
              source={require('../../img/state.png')} />
          </TouchableOpacity>
        </View>
        <Animated.View style={[
          {opacity: animated},
          this.state.styleGeneral.floatState]}>
          <Switch
            width={50}
            height={25}
            value={!this.state.state}
            disabled={this.state.disabled}
            backgroundActive={'#B3B3B3'}
            backgroundInactive={'#ffaf18'}
            onSyncPress={this.modifyState.bind(this)} />
          <Text style={this.state.styleGeneral.tState}>
            {this.state.state ? text.item.label.available : text.item.label.occupied}
          </Text>
        </Animated.View>
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
            onPressOut={this.props.onBack}>
            <Text style={this.state.styleGeneral.textButtonWarning}>
              {text.waitingServices.label.return}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[
          {display: this.state.isMns ? 'flex' : 'none'},
          this.state.styleGeneral.msn ]}>
          <Image
            style={[
              {display: this.props.typeMessage === kts.enum.ERROR ? 'flex' : 'none'},
              this.state.styleGeneral.mIcon ]}
            source={require('../../img/warning.png')} />
          <Image
            style={[
              {display: this.props.typeMessage === kts.enum.OK || !this.props.typeMessage ? 'flex' : 'none'},
              this.state.styleGeneral.mIcon ]}
            source={require('../../img/ok.png')} />
          <Text
            style={this.state.styleGeneral.mText}
            numberOfLines={2}
            ellipsizeMode={kts.hardware.tail}>
            {this.props.message}
          </Text>
          <TouchableOpacity
            style={this.state.styleGeneral.mButton}
            onPressOut={() => { this.setState({isMns: false}) }}>
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
                source={require('../../img/charts.png')} />
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
