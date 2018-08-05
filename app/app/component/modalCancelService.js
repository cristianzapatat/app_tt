import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Vibration
} from "react-native"
import Play from 'react-native-sound'

import style from '../style/modalCancelService.style'

import Modal from './modal'
import Shadow from '../elements/shadow'

import text from '../util/text'
import kts from '../util/kts'

let songCancel = null

class ModalCancelService extends Component {
    constructor (props) {
        super(props)
        this.state = {
          uri: kts.help.image
        }
    }
    componentWillMount () {
        songCancel = new Play('notification.mp3', Play.MAIN_BUNDLE, (err) => {
            if (err) return
        })
    }
    validateService (service) {
        return service !== null && service !== undefined
    }
    renderBody (service) {
        if (this.validateService(service)) {
            return (
                <View style={[style.content]}>
                    <Image
                        style={[style.image]}
                        source={{uri:  this.props.service.user.url_pic || this.state.uri}} />
                    <Text
                        style={[style.text, style.name]}
                        numberOfLines={1}
                        ellipsizeMode={kts.hardware.tail}>
                        { this.props.service.user.name }
                    </Text>
                    <Text
                        style={[style.text, style.action]}
                        numberOfLines={2}
                        ellipsizeMode={kts.hardware.tail}>
                        { text.service.cancel.service }
                    </Text>
                    <View style={[style.buttons]}> 
                        <Shadow setting={{width: 120, height: 40, borderRadius: 30}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[style.button, style.accept]}
                                onPress={this.closeModal.bind(this)}>
                                <Text style={[style.tText, style.tAccept]}>
                                    { text.app.label.accept }
                                </Text>
                            </TouchableOpacity>
                        </Shadow>
                    </View>
                </View>
            )
        }
        return <View />
    }
    start () {
        songCancel.play((success) => {
            if (!success) song.release()
          });
          (async () => {
            Vibration.vibrate(500)
          })()
    }
    closeModal () {
        this.props.close()
    }
    render () {
        return (
            <Modal
                animationInTiming={200}
                animationOutTiming={200}
                isVisible={this.validateService(this.props.service)}
                callBack={this.closeModal.bind(this)}
                onModalShow={this.start.bind(this)}>
                { this.renderBody(this.props.service) }
            </Modal>
        )
    }
}

module.exports = ModalCancelService