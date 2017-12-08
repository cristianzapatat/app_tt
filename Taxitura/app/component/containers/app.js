import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  AsyncStorage,
  TouchableWithoutFeedback
} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import Switch from 'react-native-switch-pro'

import style from '../../style/containers/app.style'

import Shadow from '../../elements/shadow'

import global from '../../util/global'
import text from '../../util/text'
import kts from '../../util/kts'

import Map from '../map'

let isState = false

class ContainerApp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      state: true,
      disabled: false,
      isMap: true,
      animated: new Animated.Value(0)
    }
    isState = false
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
        this.setState({state: value.state})
        global.user['state_app'] = value.state
        global.user['state_temp'] = global.tempState
        AsyncStorage.setItem(kts.key.user, JSON.stringify(global.user))
      }
    })
    this.eventOnShow = EventRegister.addEventListener(kts.event.onShow, () => {
      this.onShowState()
    })
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
          <Shadow setting={{height: 50, width: 137, borderRadius: 30}}>
            <View style={style.itemFooter}>
              <Text style={style.tNumber}>15</Text>
              <Text
                style={style.tText}
                numberOfLines={2}
                ellipsizeMode={kts.hardware.tail}>
                {text.app.label.available}
              </Text>
            </View>
          </Shadow>
          <Shadow setting={{height: 50, width: 137, borderRadius: 30}}>
            <View style={style.itemFooter}>
              <Text style={style.tNumber}>08</Text>
              <Text style={style.tText}>
                {text.app.label.borroweb}
              </Text>
            </View>
          </Shadow>
          <Shadow setting={{height: 50, width: 50, borderRadius: 25}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPressIn={this.onShowState.bind(this)}
              style={style.ButtonGraphic}>
              <Image
                style={style.iconGraphic}
                source={require('../../../img/charts.png')} />
            </TouchableOpacity>
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
  render () {
    let { animated } = this.state
    return (
      <TouchableWithoutFeedback
        style={style.all}
        onPressIn={this.onShowState.bind(this)}>
        <View style={style.container}>
          { this.__drawMap() }
          <View style={[style.content, style.headerLogo]}>
            <TouchableOpacity
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
