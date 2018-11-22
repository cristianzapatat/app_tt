import React, { Component } from 'react'
import { View } from 'react-native'
import AlertAwesome from 'react-native-awesome-alerts'
import { Texts } from '../../util'
import Style from './index.style'

export default class Warning extends Component {
    render () {
        const {
            show = false,
            title = Texts.DEFAULT.ALERTS.WARNING.TITLE,
            message = Texts.DEFAULT.ALERTS.WARNING.MESSAGE,
            showButton = true,
            textButton = Texts.DEFAULT.ALERTS.WARNING.BUTTON,
            onAction = () => {}
        } = this.props

        return (
            <View style={ Style.container }>
                <AlertAwesome
                    show={ show }
                    contentContainerStyle={ Style.contentContainer }
                    title={ title || Texts.DEFAULT.ALERTS.WARNING.TITLE }
                    message={ message }
                    messageStyle={ Style.message }
                    closeOnTouchOutside
                    closeOnHardwareBackPress
                    showConfirmButton={ showButton }
                    confirmButtonStyle={ Style.warningButton }
                    confirmText={ textButton }
                    confirmButtonTextStyle={ Style.warningText }
                    onConfirmPressed={ onAction.bind(this) }
                />
            </View>
        )
    }
}
