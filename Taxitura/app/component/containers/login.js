import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text
} from 'react-native'
import { EventRegister } from 'react-native-event-listeners'

import style from '../../style/containers/login.style'

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
          <Image
            style={style.logo}
            source={require('../../../img/taxitura.png')}
          />
        </View>
        <View style={style.children}>
          {this.props.children}
        </View>
        <View style={[
          {display: this.state.isMns ? 'flex' : 'none'},
          style.msn
        ]}>
          <Image
            style={[
              {display: this.props.typeMessage === kts.enum.ERROR ? 'flex' : 'none'},
              style.mIcon
            ]}
            source={require('../../../img/warning.png')}
          />
          <Image
            style={[
              {display: this.props.typeMessage === kts.enum.OK || !this.props.typeMessage ? 'flex' : 'none'},
              style.mIcon
            ]}
            source={require('../../../img/ok.png')}
          />
          <Text
            style={style.mText}
            numberOfLines={2}
            ellipsizeMode={kts.hardware.tail}>
            {this.props.message}
          </Text>
          <TouchableOpacity
            style={style.mButton}
            onPressOut={() => { this.setState({isMns: false}) }}>
            <Image
              style={style.mClose}
              source={require('../../../img/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={[
          {display: this.props.isFocus ? 'none' : 'flex'},
          style.help
        ]}>
          <TouchableOpacity
            style={style.ButtonHelp}>
            <Image
              style={style.iconHelp}
              source={require('../../../img/question.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

module.exports = ContainerLogin