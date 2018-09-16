import React, {Component} from 'react'
import {
    View,
    Text,
    ActivityIndicator
} from 'react-native'

import style from '../style/alertSocket.style'

import Modal from './modal'

import text from '../util/text'
import kts from '../util/kts'

class AlertSocket extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <Modal
            animationInTiming={100}
            animationOutTiming={100}
            isVisible={this.props.isVisible}
            callBack={() => {}} >
                <View style={[style.content]}>
                    <ActivityIndicator
                        animating={this.props.isVisible}
                        style={[{display: this.props.isVisible ? 'flex' : 'none'}]}
                        size={32}
                        color={kts.color.active} />
                    <Text
                        style={[style.text]}
                        numberOfLines={2}
                        ellipsizeMode={kts.hardware.tail}>
                        { text.socket.reconnect }
                    </Text>
                </View>
            </Modal>
        )
    }
}

module.exports = AlertSocket