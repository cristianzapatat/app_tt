import React, { Component } from 'react'
import { View } from 'react-native'
import AlertAwesome from 'react-native-awesome-alerts'
import { Texts } from '../../util'
import Style from './index.style'

export default class GpsOff extends Component {
    render () {
        const {
            show = false,
            title = Texts.LABEL.GPS,
            message = Texts.LABEL.GPS_OFF,
            showButton = true,
            textButton = Texts.LABEL.GPS_ON_ACTION,
            onAction = () => {}
        } = this.props

        return (
            <View style={ Style.container }>
                <AlertAwesome
                    show={ show }
                    contentContainerStyle={ Style.contentContainer }
                    title={ title || Texts.DEFAULT.ALERTS.WARNING.TITLE }
                    message={ message || Texts.LABEL.GPS_OFF }
                    messageStyle={ Style.message }
                    closeOnTouchOutside={ false }
                    closeOnHardwareBackPress={ false }
                    showConfirmButton={ showButton }
                    confirmButtonStyle={ Style.warningButton }
                    confirmText={ textButton || Texts.LABEL.GPS_ON_ACTION }
                    confirmButtonTextStyle={ Style.warningText }
                    onConfirmPressed={ onAction.bind(this) }
                />
            </View>
        )
    }
}
