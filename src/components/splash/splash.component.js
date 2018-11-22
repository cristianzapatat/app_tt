import React, { Component } from 'react'
import {
    StatusBar,
    View,
    Image,
    ActivityIndicator
} from 'react-native'
import { Constants } from '../../util'
import Style from './splash.style'

export default class Splash extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <View style={ Style.container }>
                <StatusBar barStyle='dark-content'/>
                <Image
                    style={ Style.image }
                    resizeMode={ 'cover' }
                    source={ require('../../assets/splash.jpg') }/>
                <ActivityIndicator
                    size={ Constants.SIZE.SMALL }
                    color={ Constants.COLOR.PROGESS_BAR }/>
            </View>
        )
    }
}
