import React, {Component} from 'react'
import {View, Image, Text, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal'
import * as Progress from 'react-native-progress'

import style from '../style/modalOrder.style'

import util from '../util/util'
import text from '../util/text'
import kts from '../util/kts'

class ModalOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: kts.help.image
    }
  }

  render () {
    return (
      <Modal
        animationInTiming={200}
        animationOutTiming={200}
        isVisible={this.props.isVisible}
        callBack={() => { this.cancelOrder() }}>
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
          <Progress.Bar
            progress={this.props.duration}
            width={270}
            height={20}
            color={'#AFAFAF'}
            unfilledColor={'#DCDCDC'}
            borderColor={'#DCDCDC'}
            borderRadius={0}
            style={style.progress} />
          <Text
            style={[style.text, style.time]}
            numberOfLines={1}
            ellipsizeMode={kts.hardware.tail}>
            {`${parseInt(this.props.duration * 10)} ${text.app.label.second}`}
          </Text>
          <View style={style.buttons}>
            <TouchableOpacity
              style={[style.button, style.cancel]}
              onPressOut={this.props.onCancel}>
              <Text style={[style.tText, style.tCancel]}>
                {text.app.label.cancel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[style.button, style.accept]}
              onPressOut={this.props.onAccept}>
              <Text style={[style.tText, style.tAccept]}>
                {text.app.label.accept}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

module.exports = ModalOrder
