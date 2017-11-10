import React, {Component} from 'react'
import {View, Image, Text, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal'
import OpenSettings from 'react-native-open-settings'

import styles from '../style/openSettingsModal.style'
import consts from '../constant/constant'

class OpenSettingsModal extends Component {
  render () {
    return (
      <Modal isVisible={this.props.isVisible}>
        <View style={styles.modalContent}>
          <Image
            style={styles.img}
            source={require('../../img/settings.png')} />
          <Text style={[styles.text, styles.large]}>
            { consts.requierePermissions }
          </Text>
          <Text style={[styles.text, styles.small]}>
            { consts.causedBlock }
          </Text>
          <TouchableOpacity onPressOut={() => {
            this.props.onClose()
            OpenSettings.openSettings()
          }}>
            <View style={[styles.btn]}>
              <Text style={[styles.text, styles.go]}>{consts.btnGoSettings}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPressOut={this.props.onClose}>
            <View style={[styles.btn]}>
              <Text style={[styles.text, styles.close]}>{consts.btnClose}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

module.exports = OpenSettingsModal
