import React, {Component} from 'react'
import {View} from 'react-native'

export default class Shadow extends Component {
  render () {
    const {
      setting: {
        width = 0,
        height = 0,
        color = 'rgb(0, 0, 0)',
        border = 2,
        borderRadius = 0,
        opacity = 0.3,
        x = 0,
        y = 5,
        style = {marginVertical: 5}
      },
      children } = this.props

    return (
      <View style={[
        {position: 'relative', width: width, height: height},
        style,
        this.props.style]}>
        <View
          style={{
            height: (height),
            width: (width + 1),
            position: 'absolute',
            top: (y - border),
            left: (x),
            borderRadius: borderRadius,
            backgroundColor: color,
            opacity: opacity
          }} />
        {children}
      </View>
    )
  }
}
