import React, {Component} from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal'
import OpenSettings from 'react-native-open-settings'

import style from '../style/modalPermission.style'

import text from '../util/text'

class ModalPermission extends Component {
  render () {
    return (
      <Modal
        animationInTiming={100}
        animationOutTiming={100}
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
          <TouchableOpacity onPressOut={() => {
            this.props.onPreview()
            OpenSettings.openSettings()
          }}>
            <View style={[style.btn]}>
              <Text style={[style.text, style.go]}>{text.permission.go}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPressOut={this.props.onClose}>
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
