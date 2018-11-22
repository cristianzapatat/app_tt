import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import Shadow from '../shadow/shadow.component'
import { Constants, Texts } from '../../util'
import Style from './footer-service.style'

export default class FooterService extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        const {
            render = true,
            btnDisabled = false,
            btnCancelRender = false,
            btnText = Texts.LABEL.BTN_ACTIONS_SERVICE.ACCEPT,
            onAccept = () => {},
            onCancel = () => {}
        } = this.props
        if (render) {
            return (
                <View style={ Style.container }>
                    <View style={ Style.containerInfo }>
                        <TouchableOpacity
                            activeOpacity={ Constants.ENUM.ACTIVE_OPACITY }
                            disabled={ btnDisabled }
                            onPressOut={ onAccept.bind(this) }>
                            <Shadow>
                                <View style={ [Style.button, btnDisabled ? Style.inactiveBackground : Style.activeBackground] }>
                                    <Text style={ Style.btnText }>
                                        { btnText }
                                    </Text>
                                </View>
                            </Shadow>
                        </TouchableOpacity>
                        { this.renderBtnCancel(btnCancelRender, btnDisabled, onCancel) }
                    </View>
                </View>
            )
        }

        return null
    }

    renderBtnCancel (btnCancelRender, btnDisabled, onCancel) {
        if (btnCancelRender) {
            return (
                <TouchableOpacity
                    activeOpacity={ Constants.ENUM.ACTIVE_OPACITY }
                    disabled={ btnDisabled }
                    onPressOut={ onCancel.bind(this) }>
                    <Shadow>
                        <View style={ [Style.button, btnDisabled ? Style.inactiveBackground : Style.btnCancel] }>
                            <Text style={ Style.btnText }>
                                { Texts.LABEL.CANCEL_SERVICE }
                            </Text>
                        </View>
                    </Shadow>
                </TouchableOpacity>
            )
        }

        return null
    }
}
