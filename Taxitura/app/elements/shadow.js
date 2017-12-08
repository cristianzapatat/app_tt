import React, {Component} from 'react'
import {View} from 'react-native'
import Svg, { Path } from 'react-native-svg'

export default class Shadow extends Component {
  render () {
    const {
      setting: {
        width = 0,
        height = 0,
        color = '0, 0, 0',
        border = 2,
        borderRadius = 0,
        opacity = 0.5,
        x = 0,
        y = 5,
        style = {marginVertical: 5}
      },
      children } = this.props

    const lineWidth = border
    const rectWidth = width - borderRadius * 2
    const rectHeight = height - borderRadius * 2
    const outerWidth = lineWidth + borderRadius

    return (
      <View style={[
        {position: 'relative', width: width, height: height},
        style,
        this.props.style]}>
        <Svg
          height={height + lineWidth * 2 + borderRadius * 2}
          width={width + lineWidth * 2 + borderRadius * 2}
          style={{position: 'absolute', top: y - lineWidth, left: x - lineWidth}}>
          <Path
            d={`M ${outerWidth} ${lineWidth}, h ${rectWidth},q ${borderRadius} 0 ${borderRadius} ${borderRadius}, v ${rectHeight},q 0 ${borderRadius} -${borderRadius} ${borderRadius}, h -${rectWidth},q -${borderRadius} 0 -${borderRadius} -${borderRadius}, v -${rectHeight},q 0 -${borderRadius} -${borderRadius} ${borderRadius}`}
            fill={`rgba(${color},${opacity || 1})`} />
        </Svg>
        {children}
      </View>
    )
  }
}
