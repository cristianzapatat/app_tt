import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Animated,
    Vibration,
    ScrollView,
    Easing
} from 'react-native'
import Play from 'react-native-sound'
import { Utilities, Constants, Texts } from '../../../util'
import NativeModal from '../nativeModal'
import Shadow from '../../shadow/shadow.component'

import Style from './newOrder.style'

let cancelState = true
let song = null

export default class NewOrder extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isVisible: false,
            uri: Constants.HELP.IMAGE,
            animated: new Animated.Value(100)
        }
    }

    componentWillMount () {
        song = new Play('notification.mp3', Play.MAIN_BUNDLE, err => {
            if (err) return
        })
    }

    componentWillReceiveProps ({ isVisible }) {
        if (isVisible && !this.state.isVisible) {
            this.setState({ isVisible })
        }
    }

    componentWillUnmount () {
        this.resetView()
    }

    reduction () {
        this.state.animated.setValue(100)
        Animated.timing(
            this.state.animated, { toValue: 0, duration: 10500, easing: Easing.linear }
        ).start(() => {
            song.stop()
            if (cancelState) {
                this.cancelOrder()
            } else {
                this.props.onAccept()
            }
        })
    }

    cancel () {
        this.state.animated.stopAnimation()
    }

    cancelOrder () {
        this.resetView()
        this.props.onCancel()
    }

    acceptOrder () {
        cancelState = false
        this.resetView()
        this.state.animated.stopAnimation()
    }

    resetView () {
        this.setState({ isVisible: false, animated: new Animated.Value(100) })
    }

    startTime () {
        cancelState = true
        song.play(success => {
            if (!success) song.release()
        })
        const vibrate = (async () => {
            Vibration.vibrate(500)
        })
        vibrate()
        this.reduction()
    }

    getDrawAcceptService (isCredit) {
        if (isCredit) {
            return(
                <Shadow>
                    <TouchableOpacity
                        activeOpacity={ Constants.ENUM.ACTIVE_OPACITY }
                        style={ [Style.button, Style.accept] }
                        onPress={ this.acceptOrder.bind(this) }>
                        <Text style={ [Style.tText, Style.tAccept] }>
                            { Texts.ACTIONS.ACCEPT }
                        </Text>
                    </TouchableOpacity>
                </Shadow>
            )
        }

        return null
    }

    getContentOrder () {
        let { animated } = this.state
        const { order, isCredit } = this.props
        if (order) {
            const {
                user: { url_pic, name },
                position_user: { ref, address },
                position_cabman: { distance }
            } = order

            return (
                <View style={ Style.content }>
                    <Image
                        style={ Style.image }
                        source={ { uri: url_pic || this.state.uri } }/>
                    <Text
                        style={ [Style.text, Style.name] }
                        numberOfLines={ 1 }
                        ellipsizeMode={ Constants.ENUM.TAIL }>
                        { name }
                    </Text>
                    <Text
                        style={ [Style.text, Style.distance] }
                        numberOfLines={ 1 }
                        ellipsizeMode={ Constants.ENUM.TAIL }>
                        { `${Texts.LABEL.A} ${Utilities.getMeters(distance || 0)}` }
                    </Text>
                    <Text
                        style={ [Style.text, Style.address] }
                        numberOfLines={ 1 }
                        ellipsizeMode={ Constants.ENUM.TAIL }>
                        { address }
                    </Text>
                    <ScrollView style={ [Style.reference, (ref ? Style.displayFlex : Style.displayNone)] }>
                        <Text style={ [Style.title_reference] }>
                            { Texts.LABEL.LOCATION_REFERENCE }:
                        </Text>
                        <Text style={ [Style.text_reference] }>
                            { ref }
                        </Text>
                    </ScrollView>
                    <View style={ Style.progress }>
                        <Animated.View
                            style={ [Style.animated, {
                                width: animated.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '1%']
                                })
                            }] }/>
                    </View>
                    <View style={ [Style.buttons, isCredit ? Style.spaceBetween : Style.center] }>
                        <Shadow>
                            <TouchableOpacity
                                activeOpacity={ Constants.ENUM.ACTIVE_OPACITY }
                                style={ [Style.button, Style.cancel] }
                                onPress={ this.cancel.bind(this) }>
                                <Text style={ [Style.tText, Style.tCancel] }>
                                    { Texts.ACTIONS.CANCEL }
                                </Text>
                            </TouchableOpacity>
                        </Shadow>
                        { this.getDrawAcceptService(isCredit) }
                    </View>
                </View>
            )
        }

        return (
            <View/>
        )
    }

    render () {
        return (
            <NativeModal
                animationInTiming={ 200 }
                animationOutTiming={ 200 }
                isVisible={ this.state.isVisible }
                callBack={ this.cancel.bind(this) }
                onModalShow={ this.startTime.bind(this) }>
                { this.getContentOrder() }
            </NativeModal>
        )
    }
}
