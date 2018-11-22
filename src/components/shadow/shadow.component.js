import React, { Component } from 'react'
import { View } from 'react-native'

export default class Shadow extends Component {
    render () {
        const { children, style = { marginVertical: 5 } } = this.props
        const { props: { style: _style } } = children
        let styleShadow = {}
        if (Array.isArray(_style)) {
            styleShadow = _style[0]
        } else {
            styleShadow = _style
        }
        const {
            width = 0,
            height = 0,
            color = 'rgb(0, 0, 0)',
            border = 2,
            borderRadius = 0,
            opacity = 0.3,
            x = 0,
            y = 4
        } = styleShadow
        const viewStyle = [
            { position: 'relative', width, height },
            style,
            this.props.style
        ]
        const styleChildren = {
            height: (height),
            width: (width + 1),
            position: 'absolute',
            top: (y - border),
            left: (x),
            borderRadius: borderRadius,
            backgroundColor: color,
            opacity: opacity
        }

        return (
            <View style={ viewStyle }>
                <View style={ styleChildren }/>
                { children }
            </View>
        )
    }
}
