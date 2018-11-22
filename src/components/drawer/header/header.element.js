import React from 'react'
import {
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native'
import { Constants,Utilities } from '../../../util'
import Style from './header.style'

const Header = ({ user, style: styleIn, closeMenu }) => {
    const data = user || Constants.AUX.USER

    return (
        <View style={ [styleIn, Style.all] }>
            <TouchableOpacity
                activeOpacity={ Constants.ENUM.ACTIVE_OPACITY }
                style={ Style.out }
                onPressOut={ closeMenu.bind(this) }>
                <Image
                    style={ Style.outIcon }
                    source={ require('../../../assets/close.png') }/>
            </TouchableOpacity>
            <View style={ Style.headerPhoto }>
                <Image
                    style={ Style.photo }
                    source={ { uri:  Utilities.getUrlPhoto(data.foto.url) } }/>
            </View>
            <View style={ Style.headerName }>
                <Text
                    style={ [Style.name] }
                    numberOfLines={ 1 }
                    ellipsizeMode={ Constants.ENUM.TAIL }>
                    { data.nombre }
                </Text>
            </View>
            <View style={ Style.headerPlaca }>
                <Text
                    style={ [Style.placa] }
                    numberOfLines={ 1 }
                    ellipsizeMode={ Constants.ENUM.TAIL }>
                    { data.taxis[0].placa }
                </Text>
            </View>
        </View>
    )
}

export default Header
