import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import Switch from 'react-native-switch-pro'

import style from '../../style/containers/general.style'

import global from '../../util/global'
import text from '../../util/text'
import kts from '../../util/kts'

import Map from '../map'

let isState = false

class ContainerGeneral extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isMns: false,
      isMap: true,
      state: true,
      disabled: false,
      animated: new Animated.Value(0)
    }
    isState = false
    this.state.disabled = global.service !== null || global.waitId !== null || global.waitCanceled
    this.state.state = global.state
    this.state.isMap = global.isDay
  }
  componentWillMount () {
    EventRegister.addEventListener(kts.event.changeMap, (data) => {
      if (this.state.isMap !== data) {
        this.setState({isMap: data})
      }
    })
    this.eventOnShow = EventRegister.addEventListener(kts.event.onShow, () => {
      this.onShowState()
    })
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.isMns && !this.state.isMns) {
      this.setState({ isMns: true })
    } else if (!nextProps.isMns && this.state.isMns) {
      this.setState({ isMns: false })
    }
  }
  componentWillUnmount () {
    EventRegister.removeEventListener(this.eventOnShow)
  }
  __drawMap () {
    if (this.state.isMap) {
      return (<Map.Classic.MapDay style={style.map} />)
    } else {
      return (<Map.Classic.MapNight style={style.map} />)
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
    this.setState({state})
    EventRegister.emit(kts.event.changeState, {state, case: 1})
    this.showState()
  }
  render () {
    let { animated } = this.state
    return (
      <TouchableWithoutFeedback
        activeOpacity={1}
        style={style.all}
        onPressIn={this.onShowState.bind(this)}>
        <View style={style.container}>
          { this.__drawMap() }
          <View style={[style.content, style.headerLogo]}>
            <TouchableOpacity
              onPressIn={this.onShowState.bind(this)}
              onPressOut={this.props.onBack}
              style={style.menu} >
              <Image
                style={style.icon}
                source={require('../../../img/back.png')} />
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
                  {this.state.state ? text.item.label.available : text.item.label.occupied}
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
              onPressOut={this.props.onBack}>
              <Text style={style.textButtonWarning}>
                {text.waitingServices.label.return}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[
            {display: this.state.isMns ? 'flex' : 'none'},
            style.msn ]}>
            <Image
              style={[
                {display: this.props.typeMessage === kts.enum.ERROR ? 'flex' : 'none'},
                style.mIcon ]}
              source={require('../../../img/warning.png')} />
            <Image
              style={[
                {display: this.props.typeMessage === kts.enum.OK || !this.props.typeMessage ? 'flex' : 'none'},
                style.mIcon ]}
              source={require('../../../img/ok.png')} />
            <Text
              style={style.mText}
              numberOfLines={2}
              ellipsizeMode={kts.hardware.tail}>
              {this.props.message}
            </Text>
            <TouchableOpacity
              style={style.mButton}
              onPressIn={this.onShowState.bind(this)}
              onPressOut={() => { this.setState({isMns: false}) }}>
              <Image
                style={style.mClose}
                source={require('../../../img/close.png')} />
            </TouchableOpacity>
          </View>
          <View style={[
            {display: this.props.isFocus ? 'none' : 'flex'},
            style.content,
            style.footer ]}>
            <View style={style.contentFooter}>
              <View style={style.itemFooter}>
                <Text style={style.tNumber}>15</Text>
                <Text
                  style={style.tText}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}>
                  {text.app.label.available}
                </Text>
              </View>
              <View style={style.itemFooter}>
                <Text style={style.tNumber}>08</Text>
                <Text style={style.tText}>
                  {text.app.label.borroweb}
                </Text>
              </View>
              <TouchableOpacity
                onPressIn={this.onShowState.bind(this)}
                style={style.ButtonGraphic}>
                <Image
                  style={style.iconGraphic}
                  source={require('../../../img/charts.png')} />
              </TouchableOpacity>
            </View>
          </View>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

module.exports = ContainerGeneral
