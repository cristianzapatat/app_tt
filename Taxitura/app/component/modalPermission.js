import React, {Component} from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal'
import OpenSettings from 'react-native-open-settings'
import { EventRegister } from 'react-native-event-listeners'

import style from '../style/modalPermission.style'

import kts from '../util/kts'
import text from '../util/text'

class ModalPermission extends Component {
  render () {
    return (
      <Modal
        animationInTiming={200}
        animationOutTiming={200}
        isVisible={this.props.isVisible}
        callBack={this.props.onClose} >
        <View style={style.modalContent}>
          <Image
            style={style.img}
            source={require('../../img/settings64.png')} />
          <Text style={[style.text, style.large]}>
            { text.permission.require }
          </Text>
          <Text style={[style.text, style.small]}>
            { text.permission.cause }
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={() => { EventRegister.emit(kts.event.onShow) }}
            onPressOut={() => {
              this.props.onPreview()
              OpenSettings.openSettings()
            }}>
            <View style={[style.btn]}>
              <Text style={[style.text, style.go]}>{text.permission.go}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={() => { EventRegister.emit(kts.event.onShow) }}
            onPressOut={this.props.onClose}>
            <View style={[style.btn]}>
              <Text style={[style.text, style.close]}>{text.permission.close}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

module.exports = ModalPermission
