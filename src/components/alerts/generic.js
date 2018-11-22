import React, { Component } from 'react'
import { View } from 'react-native'
import AlertAwesome from 'react-native-awesome-alerts'
import { Texts } from '../../util'
import Style from './index.style'

export default class GenericAlert extends Component {
    render () {
        const {
            show = false,
            title = '',
            message = '',
            showButton = true,
            textButton = Texts.DEFAULT.ALERTS.GENERIC.OK,
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
                    confirmButtonStyle={ Style.okButton }
                    confirmText={ textButton }
                    confirmButtonTextStyle={ Style.warningText }
                    onConfirmPressed={ onAction.bind(this) }
                    onDismiss={ onAction.bind(this) }
                />
            </View>
        )
    }
}
