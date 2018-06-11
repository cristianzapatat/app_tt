/* eslint handle-callback-err: ["error", "error"] */
/* eslint no-useless-return: 0 */
import React, {Component} from 'react'
import {View, Image, Text, TouchableOpacity, Animated, Vibration} from 'react-native'
import Play from 'react-native-sound'

import style from '../style/modalOrder.style'

import Modal from './modal'
import Shadow from '../elements/shadow'

import util from '../util/util'
import text from '../util/text'
import kts from '../util/kts'

let cancelState = true
let song = null

class ModalOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: kts.help.image,
      animated: new Animated.Value(1)
    }
  }
  componentWillMount () {
    song = new Play('notification.mp3', Play.MAIN_BUNDLE, (err) => {
      if (err) return
    })
  }
  reduction () {
    this.state.animated.setValue(1)
    Animated.timing(
      this.state.animated,
      {
        toValue: 0,
        duration: 10500
      }
    ).start(() => {
      song.stop()
      if (cancelState) {
        this.props.onCancel()
      } else {
        this.props.onAccept()
      }
      this.setState({run: false})
    })
  }
  cancelOrder () {
    this.state.animated.stopAnimation()
  }
  acceptOrder () {
    cancelState = false
    this.state.animated.stopAnimation()
  }
  startTime () {
    cancelState = true
    song.play((success) => {
      if (!success) song.release()
    });
    (async () => {
      Vibration.vibrate(500)
    })()
    this.setState({run: true})
    this.reduction()
  }
  _drawAcceptService () { 
    if (this.props.isCredit) { 
      return ( 
        <Shadow setting={{width: 120, height: 40, borderRadius: 30}}> 
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={[style.button, style.accept]} 
                onPress={this.acceptOrder.bind(this)}> 
                <Text style={[style.tText, style.tAccept]}> 
                  {text.app.label.accept} 
                </Text> 
              </TouchableOpacity> 
            </Shadow> 
      ) 
    } else { 
      return null 
    } 
  }
  render () {
    let { animated } = this.state
    return (
      <Modal
        animationInTiming={200}
        animationOutTiming={200}
        isVisible={this.props.isVisible}
        callBack={this.cancelOrder.bind(this)}
        onModalShow={this.startTime.bind(this)}>
        <View style={style.content}>
          <Image
            style={style.image}
            source={{uri: this.props.uri || this.state.uri}} />
          <Text
            style={[style.text, style.name]}
            numberOfLines={1}
            ellipsizeMode={kts.hardware.tail}>
            { this.props.name }
          </Text>
          <Text
            style={[style.text, style.distance]}
            numberOfLines={1}
            ellipsizeMode={kts.hardware.tail}>
            {`${text.app.label.a} ${util.getMeters(this.props.distance || 0)}`}
          </Text>
          <Text
            style={[style.text, style.address]}
            numberOfLines={1}
            ellipsizeMode={kts.hardware.tail}>
            { this.props.address }
          </Text>
          <View style={style.progress}>
            <Animated.View
              style={[style.animated, {
                transform: [{translateX: animated.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-270, 0] })}]}]} />
          </View>
          <View style={[style.buttons, {justifyContent: this.props.isCredit ? 'space-between' : 'center'}]}> 
            <Shadow setting={{width: 120, height: 40, borderRadius: 30}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[style.button, style.cancel]}
                onPress={this.cancelOrder.bind(this)}>
                <Text style={[style.tText, style.tCancel]}>
                  {text.app.label.cancel}
                </Text>
              </TouchableOpacity>
            </Shadow>
            { this._drawAcceptService() }
          </View>
        </View>
      </Modal>
    )
  }
}

module.exports = ModalOrder
