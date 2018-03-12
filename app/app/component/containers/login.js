import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ProgressBarAndroid
} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'

import style from '../../style/containers/login.style'

import Shadow from '../../elements/shadow'

import global from '../../util/global'
import kts from '../../util/kts'

import Map from '../map'

class ContainerLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
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
      return (<Map.Classic.MapDay style={style.map} />)
    } else {
      return (<Map.Classic.MapNight style={style.map} />)
    }
  }
  render () {
    return (
      <View style={style.container}>
        { this.__drawMap() }
        <View style={style.logoContainer}>
          <Shadow setting={{height: 70, width: 70, borderRadius: 10}}>
            <View style={style.logoView}>
              <Image
                style={style.logo}
                source={require('../../../img/taxitura.png')} />
            </View>
          </Shadow>
        </View>
        <View style={style.children}>
          {this.props.children}
        </View>
        <View style={[{display: this.props.isLoad ? 'flex' : 'none'}, style.load]}>
          <ProgressBarAndroid
            styleAttr={'Horizontal'}
            animating={this.props.isLoad}
            color={this.state.isMap ? kts.color.black : kts.color.white} />
        </View>
        <View style={[{display: this.state.isMns ? 'flex' : 'none'}, style.msn]}>
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
          <Image
            style={[
              {display: this.props.typeMessage === kts.enum.WITHOUT || !this.props.typeMessage ? 'flex' : 'none'},
              style.mIcon ]}
            source={require('../../../img/without.png')} />
          <Text
            style={style.mText}
            numberOfLines={3}
            ellipsizeMode={kts.hardware.tail}>
            {this.props.message}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={style.mButton}
            onPressOut={() => { this.setState({isMns: false}) }}>
            <Image
              style={style.mClose}
              source={require('../../../img/close.png')} />
          </TouchableOpacity>
        </View>
        <View style={[{display: this.props.isFocus ? 'none' : 'flex'}, style.help]}>
          <Shadow setting={{height: 50, width: 50, borderRadius: 25}}>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!this.props.editable}
              style={style.ButtonHelp}
              onPressOut={() => { this.props.help() }} >
              <Image
                style={style.iconHelp}
                source={require('../../../img/question.png')} />
            </TouchableOpacity>
          </Shadow>
        </View>
      </View>
    )
  }
}

module.exports = ContainerLogin
