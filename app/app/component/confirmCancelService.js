import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native'

import style from "../style/confirmCancelService.style"

import Modal from './modal'
import Shadow from '../elements/shadow'

import text from '../util/text'

class ConfirmCancelService extends Component {
    render() {
        return (
            <Modal
                animationInTiming={200}
                animationOutTiming={200}
                isVisible={this.props.isVisible}
                callBack={this.props.onClose} >
                <View style={style.modalContent}>
                    <Text style={[style.text]}>
                        { text.app.label.confirmCancelService }
                    </Text>
                    <View style={[style.btns]}>
                        <Shadow setting={{width: 120, height: 40, borderRadius: 30}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPressOut={this.props.onClose}>
                                <View style={[style.btnClose]}>
                                    <Text style={[style.text, style.close]}>{text.answer.no}</Text>
                                </View>
                            </TouchableOpacity>
                        </Shadow>
                        <Shadow setting={{width: 120, height: 40, borderRadius: 30}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPressOut={this.props.onCancel}>
                                <View style={[style.btnCancel]}>
                                    <Text style={[style.text, style.cancel]}>{text.answer.yes}</Text>
                                </View>
                            </TouchableOpacity>
                        </Shadow>
                    </View>
                </View>
            </Modal>
        )
    }
}

module.exports = ConfirmCancelService