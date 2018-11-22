import React, { Component } from 'react'
import { View } from 'react-native'
import AlertAwesome from 'react-native-awesome-alerts'
import { Constants, Texts } from '../../util'
import Style from './index.style'

export default class Loading extends Component {
    render () {
        const {
            show = false,
            title = Texts.DEFAULT.LOGIN.VALIDATING_INFO,
            showCancel = true,
            onCancel = () => {}
        } = this.props

        return (
            <View style={ Style.container }>
                <AlertAwesome
                    show={ show }
                    contentContainerStyle={ Style.contentContainer }
                    showProgress
                    title={ title }
                    closeOnTouchOutside={ false }
                    closeOnHardwareBackPress={ false }
                    progressSize={ 24 }
                    progressColor={ Constants.COLOR.TAXITURA }
                    showCancelButton={ showCancel }
                    cancelButtonStyle={ Style.cancelButton }
                    cancelText={ Texts.DEFAULT.GLOBAL.CANCEL }
                    cancelButtonTextStyle={ Style.cancelText }
                    onCancelPressed={ onCancel.bind(this) }
                />
            </View>
        )
    }
}
