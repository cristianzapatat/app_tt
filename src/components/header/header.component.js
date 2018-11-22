import React, { Component } from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import { Constants } from '../../util'
import Style from './header.style'

export default class Header extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        const {
            navigation = () => {}
        } = this.props

        return (
            <View style={ Style.container }>
                <TouchableOpacity
                    style={ Style.menu }
                    activeOpacity={ Constants.ENUM.ACTIVE_OPACITY }
                    onPressOut={ navigation.navigate.bind(this, Constants.NAVIGATION.NAVIGATE.OPEN_MENU) }>
                    <Image
                        style={ Style.icon }
                        source={ require('../../assets/menu.png') }/>
                </TouchableOpacity>
                <Image
                    style={ Style.logo }
                    source={ require('../../assets/taxitura.png') }/>
            </View>
        )
    }
}
