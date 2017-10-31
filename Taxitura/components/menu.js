import React, { Component } from 'react'
import { Animated, TouchableOpacity, View, Image } from 'react-native'
import styles from '../style/menu.style'

export default class Menu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animated: new Animated.Value(0),
      right: 400,
      left: 0
    }
  }

  showOrHide () {
    this.ejecution()
  }

  ejecution () {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 4000
      }
    ).start()
  }

  render () {
    return (
      <View
        style={[this.props.style, styles.all]} >
        <View style={styles.iconSide}>
          <TouchableOpacity onPress={() => { this.showOrHide() }}>
            <Image
              source={require('../img/menu.png')}
              style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Animated.View style={styles.menuSide}>
          <TouchableOpacity onPress={this.props.fnLogout}>
            <Image
              source={require('../img/logout.png')}
              style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.fnLogout}>
            <Image
              source={require('../img/logout.png')}
              style={styles.icon} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}
