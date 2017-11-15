import React, { Component } from 'react'
import { Animated, TouchableOpacity, View, Image, Text } from 'react-native'

import styles from '../style/menu.style'

let status = true

export default class Menu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      close: true,
      animated: new Animated.Value(0),
      styleMenu: {}
    }
    status = this.props.visible || true
    this.state.close = this.props.visible || true
    this.state.styleMenu = {
      transform: [{
        translateX: this.state.animated.interpolate({
          inputRange: [0, 1],
          outputRange: [120, 0]
        })
      }]
    }
  }

  _callBack (call) {
    this.showOrHide()
    call()
  }

  showOrHide () {
    this.state.animated.setValue(0)
    if (!status) {
      this.setState({
        styleMenu: {
          transform: [{
            translateX: this.state.animated.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 120]
            })
          }]
        }
      })
    } else {
      this.setState({
        styleMenu: {
          transform: [{
            translateX: this.state.animated.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0]
            })
          }]
        }
      })
    }
    this.ejecution()
    status = !status
  }

  ejecution () {
    Animated.timing(
      this.state.animated,
      {
        toValue: 1,
        duration: 500
      }
    ).start()
    this.setState({
      close: !this.state.close
    })
  }

  render () {
    return (
      <View style={[this.props.style, styles.all]}>
        <View style={[{display: this.state.close ? 'flex' : 'none'}, styles.iconSide]}>
          <TouchableOpacity onPressOut={() => { this.showOrHide() }}>
            <Image
              source={require('../../img/menu.png')}
              style={[styles.icon, styles.iconMargin]} />
          </TouchableOpacity>
        </View>
        <View style={[{display: this.state.close ? 'none' : 'flex'}, styles.iconSide]}>
          <TouchableOpacity onPressOut={() => { this.showOrHide() }}>
            <Image
              source={require('../../img/menu_close.png')}
              style={[styles.icon, styles.iconMargin]} />
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.menuSide, this.state.styleMenu]}>
          <View style={[{display: this.props.isListServives ? 'flex' : 'none'}, styles.item]}>
            <TouchableOpacity onPressOut={() => { this._callBack(this.props.goListServives) }} style={styles.element}>
              <Image
                source={require('../../img/service.png')}
                style={styles.icon} />
              <Text style={[styles.text]}>Servicios</Text>
            </TouchableOpacity>
          </View>
          <View style={[{display: this.props.isMap ? 'flex' : 'none'}, styles.item]}>
            <TouchableOpacity onPressOut={() => { this._callBack(this.props.goMap) }} style={styles.element}>
              <Image
                source={require('../../img/map.png')}
                style={styles.icon} />
              <Text style={[styles.text]}>Mapa</Text>
            </TouchableOpacity>
          </View>
          <View style={[{display: this.props.isListServives ? 'flex' : 'none'}, styles.item]}>
            <TouchableOpacity onPressOut={() => { this._callBack(this.props.goSettings) }} style={styles.element}>
              <Image
                source={require('../../img/settings48.png')}
                style={styles.icon} />
              <Text style={[styles.text]}>Ajustes</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <TouchableOpacity onPressOut={this.props.fnLogout} style={styles.element}>
              <Image
                source={require('../../img/logout.png')}
                style={styles.icon} />
              <Text style={[styles.text]}>Salir</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    )
  }
}
