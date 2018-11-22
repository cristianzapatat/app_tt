import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import AlertAwesome from 'react-native-awesome-alerts'
import GPSState from 'react-native-gps-state'
import { Texts } from '../../../util'
import Style from './open-permission.style'

export default class OpenPermission extends Component {
    constructor (props) {
        super(props)
    }

    openSettings () {
        const { onAction = () => {} } = this.props
        GPSState.openAppDetails()
        onAction()
    }

    render () {
        const {
            show = false,
            title = Texts.LABEL.GPS,
            showButton = true,
            showCancel = true,
            textButton = Texts.LABEL.GPS_ON_PERMISSION_MANUAL,
            textCancel = Texts.DEFAULT.GLOBAL.CANCEL,
            onCancel = () => {}
        } = this.props

        return (
            <View style={ Style.container }>
                <AlertAwesome
                    show={ show }
                    contentContainerStyle={ Style.contentContainer }
                    title={ title || Texts.DEFAULT.ALERTS.WARNING.TITLE }
                    closeOnTouchOutside={ false }
                    closeOnHardwareBackPress={ false }
                    showConfirmButton={ showButton }
                    showCancelButton={ showCancel }
                    confirmButtonStyle={ [Style.warningButton, Style.btnCustom] }
                    cancelButtonStyle={ [Style.cancelButton, Style.btnCustom] }
                    confirmText={ textButton }
                    cancelText={ textCancel }
                    confirmButtonTextStyle={ Style.warningText }
                    onConfirmPressed={ this.openSettings.bind(this) }
                    onCancelPressed={ onCancel.bind(this) }
                    customView={ this.renderContainer() }
                />
            </View>
        )
    }

    renderContainer () {
        return (
            <View style={ Style.containerCustom }>
                <Image
                    style={ Style.image }
                    source={ require('../../../assets/settings64.png') }/>
                <Text style={ Style.large }>
                    { Texts.LABEL.PERMISSION.REQUIRE }
                </Text>
                <Text style={ Style.small }>
                    { Texts.LABEL.PERMISSION.CAUSE }
                </Text>
            </View>
        )
    }
}
