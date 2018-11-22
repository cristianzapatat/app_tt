import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native'
import { Constants, Texts } from '../../../util'
import Style from './footer.style'

const Footer = ({ logout, style }) => {
    return (
        <TouchableOpacity
            activeOpacity={ Constants.ENUM.ACTIVE_OPACITY }
            onPressOut={ logout.bind(this) }>
            <View style={ [style, Style.all] }>
                <Image
                    style={ Style.icon }
                    source={ require('../../../assets/logout.png') }/>
                <Text style={ Style.text }>
                    { Texts.LOGOUT.OUT }
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default Footer
