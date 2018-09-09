import React, {Component} from 'react'
import {
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native'

import style from '../style/score.style'

import Modal from './modal'
import Shadow from '../elements/shadow'

import text from '../util/text'
import kts from '../util/kts'

class Score extends Component {
    constructor (props) {
        super(props)
        this.state = { uri: kts.help.image }
    }

    render () {
        return (
            <Modal
                animationInTiming={200}
                animationOutTiming={200}
                isVisible={this.props.isVisible}
                callBack={this.props.onClose} >
                <View style={[style.content]}>
                    <Image 
                        style={style.image}
                        source={{uri: (this.props.info) ? this.props.info.uri : this.state.uri}} />
                    <Text
                        style={[style.text, style.name]}
                        numberOfLines={1}
                        ellipsizeMode={kts.hardware.tail}>
                        { (this.props.info) ? this.props.info.name : 'Taxitura' }
                    </Text>
                    <Text
                        style={[style.text, style.quality]}
                        numberOfLines={1}
                        ellipsizeMode={kts.hardware.tail}>
                        { text.score.text }
                    </Text>
                    <Text
                        style={[style.text, style.star]}
                        numberOfLines={1}
                        ellipsizeMode={kts.hardware.tail}>
                        { (this.props.info) ? this.props.info.score : '0' } { text.score.star }
                    </Text>
                    <Text
                        style={[style.text, style.legend]}
                        numberOfLines={4}
                        ellipsizeMode={kts.hardware.tail}>
                        { text.score.legend }
                    </Text>
                    <Shadow setting={{width: 250, height: 40, borderRadius: 30, style: {marginTop: 12}}}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[style.button]}
                            onPress={this.props.onClose}>
                            <Text style={[style.tText]}>
                                { text.score.close }
                            </Text>
                        </TouchableOpacity>
                    </Shadow>
                </View>
            </Modal>
        )
    }
}

module.exports = Score