import React, { Component } from 'react'
import {View, Image, Text, TouchableOpacity} from 'react-native'

import styles from '../style/photoModal.style'
import Modal from 'react-native-modal'

class PhotoModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: 'https://scontent.feoh3-1.fna.fbcdn.net/v/t1.0-1/p50x50/17903408_1044586812340472_7176591297268243543_n.png?oh=20bc54a7ec0faffce536dfa16eff5388&oe=5AA9803D'
    }
  }

  render () {
    return (
      <Modal isVisible={this.props.isVisible}>
        <View style={styles.content}>
          <Image
            style={styles.image}
            source={{uri: this.props.uri || this.state.uri}} />
          <View style={styles.info}>
            <Text
              style={[styles.text, styles.large]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              { this.props.nameUser }
            </Text>
            <Text
              style={[styles.text, styles.small]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              Usuario Recurrente
            </Text>
          </View>
          <TouchableOpacity onPress={this.props.hidePhoto}>
            <View style={styles.btnCancel}>
              <Text style={[styles.text, styles.close]}>Cerrar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

module.exports = PhotoModal
