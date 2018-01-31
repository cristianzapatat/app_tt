import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  AsyncStorage,
  TouchableWithoutFeedback,
  Vibration
} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import Switch from 'react-native-switch-pro'

import style from '../../style/containers/app.style'

import Shadow from '../../elements/shadow'

import global from '../../util/global'
import text from '../../util/text'
import kts from '../../util/kts'
import util from '../../util/util'

import Map from '../map'

let isState = false
let isNoti = false

class ContainerApp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      state: true,
      disabled: false,
      isMap: true,
      animated: new Animated.Value(0),
      animaNoti: new Animated.Value(0),
      color: kts.color.active,
      countAvailable: util.getValueText(global.user.credito, global.user.credito_ganancia)
    }
    isState = false
    this.state.color = global.state ? kts.color.active : kts.color.inactive
    this.state.state = global.state
    this.state.isMap = global.isDay
  }
  componentWillMount () {
    EventRegister.addEventListener(kts.event.changeMap, (data) => {
      if (this.state.isMap !== data) {
        this.setState({isMap: data})
      }
    })
    this.eventeChangeState = EventRegister.addEventListener(kts.event.changeState, (value) => {
      if (value.case === 0) {
        this.setState({disabled: !this.state.disabled})
      }
      if (global.tempState !== null && value.temp) {
        value.state = global.tempState
        global.tempState = null
      }
      if (this.state.state !== value.state) {
        global.state = value.state
        this.setState({state: value.state, color: global.state ? kts.color.active : kts.color.inactive})
        global.user['state_app'] = value.state
        global.user['state_temp'] = global.tempState
        AsyncStorage.setItem(kts.key.user, JSON.stringify(global.user))
      }
    })
    this.eventOnShow = EventRegister.addEventListener(kts.event.onShow, () => {
      this.onShowState()
    })
  }
  componentDidUpdate () {
    if (this.props.isNoti && !isNoti) {
      this.state.animaNoti.setValue(0)
      isNoti = true
      this.showNotification()
    }
  }
  componentWillUnmount () {
    EventRegister.removeEventListener(this.eventeChangeState)
    EventRegister.removeEventListener(this.eventOnShow)
  }
  __drawFooter () {
    if (this.props.isButton) {
      return (
        <Shadow setting={{height: 50, width: 290, borderRadius: 30}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={this.onShowState.bind(this)}
            onPressOut={this.props.onProcess}
            style={style.button}>
            <Text style={style.text}>
              {this.props.textButton}
            </Text>
          </TouchableOpacity>
        </Shadow>
      )
    } else {
      return (
        <View style={style.contentFooter}>
          <Shadow setting={{height: 50, width: 170, borderRadius: 30}}>
            <View style={style.itemFooter}>
              <Text style={style.tNumber}>{this.state.countAvailable}</Text>
              <Text
                style={style.tText}
                numberOfLines={2}
                ellipsizeMode={kts.hardware.tail}>
                {text.app.label.available}
              </Text>
            </View>
          </Shadow>
          <Shadow setting={{height: 50, width: 170, borderRadius: 30}}>
            <View style={style.itemFooter}>
              <Text style={style.tNumber}>018</Text>
              <Text style={style.tText}>
                {text.app.label.borroweb}
              </Text>
            </View>
          </Shadow>
        </View>
      )
    }
  }
  getMapService () {
    if (this.state.isMap) {
      return (
        <Map.Service.MapDay
          style={style.map}
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
          style={style.map}
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
          style={style.map}
          latitude={this.props.latitude}
          longitude={this.props.longitude}
        />
      )
    } else {
      return (
        <Map.Cabman.MapNight
          style={style.map}
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
        duration: 500
      }
    ).start()
  }
  onShowState () {
    if (isState) this.showState()
  }
  modifyState () {
    let state = !this.state.state
    EventRegister.emit(kts.event.changeState, {state, case: 1})
    this.showState()
  }
  showNotification () {
    let value = isNoti ? 1 : 0
    if (isNoti) Vibration.vibrate(500)
    Animated.timing(
      this.state.animaNoti,
      {
        toValue: value,
        duration: 1000
      }
    ).start(() => {
      if (isNoti) {
        this.state.animaNoti.setValue(1)
        setTimeout(() => {
          isNoti = false
          this.showNotification()
        }, 5000)
      }
    })
  }
  render () {
    let { animated, animaNoti } = this.state
    return (
      <TouchableWithoutFeedback
        style={style.all}
        onPressIn={this.onShowState.bind(this)}>
        <View style={style.container}>
          { this.__drawMap() }
          <View style={[style.content, style.headerLogo, {backgroundColor: this.state.color}]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPressIn={this.onShowState.bind(this)}
              onPressOut={this.props.onPressMenu}
              style={style.menu} >
              <Image
                style={style.icon}
                source={require('../../../img/menu.png')} />
            </TouchableOpacity>
            <Image
              style={style.logo}
              source={require('../../../img/taxitura.png')} />
            <TouchableOpacity
              activeOpacity={0.8}
              onPressOut={this.showState.bind(this)}
              style={style.state} >
              <Image
                style={style.iconstate}
                source={require('../../../img/state.png')} />
            </TouchableOpacity>
          </View>
          <Animated.View style={[
            {opacity: animated},
            style.floatState]}>
            <Switch
              width={50}
              height={25}
              value={!this.state.state}
              disabled={this.state.disabled}
              backgroundActive={'#B3B3B3'}
              backgroundInactive={'#ffaf18'}
              onSyncPress={this.modifyState.bind(this)} />
            <TouchableWithoutFeedback onPressIn={() => { if (this.state.disabled) this.onShowState() }}>
              <View>
                <Text style={style.tState}>
                  {this.state.state ? text.menu.label.available : text.menu.label.occupied}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
          <View style={[style.content, style.headerTitle]}>
            <Text
              style={style.title}
              numberOfLines={1}
              ellipsizeMode={kts.hardware.tail}>
              {this.props.title}
            </Text>
          </View>
          <Animated.View
            style={[style.notification, {
              transform: [{translateX: animaNoti.interpolate({
                inputRange: [0, 1],
                outputRange: [185, 0] })}]}]}>
            <Image
              style={style.photo}
              source={{uri: this.props.isNoti || isNoti ? global.service.user.url_pic : kts.help.image}} />
            <View style={style.infoNoti}>
              <Text
                numberOfLines={1}
                ellipsizeMode={kts.hardware.tail}
                style={[style.textNoti, {fontWeight: '300'}]}>
                {this.props.isNoti || isNoti ? global.service.user.first_name : ''}
              </Text>
              <Text style={style.textNoti}>{text.app.label.coming}</Text>
            </View>
          </Animated.View>
          <View style={[
            {display: this.props.isNoGps ? 'flex' : 'none'},
            style.warning ]}>
            <Image
              style={style.iconWarning}
              source={require('../../../img/no_gps.png')} />
            <Text style={style.textWarning}>
              {this.props.textNoGps}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={style.buttonWarning}
              onPressIn={this.onShowState.bind(this)}
              onPressOut={this.props.getStatus}>
              <Text style={style.textButtonWarning}>
                {text.app.gps.update}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[style.content, style.footer]}>
            { this.__drawFooter() }
          </View>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

module.exports = ContainerApp
