import React, {Component} from 'react'
import {View, Image, Text, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal'
import * as Progress from 'react-native-progress'

import styles from '../style/ordenModal.style'
import util from '../util/util'

let idSet

class OrdenModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      duration: 1,
      nameUser: '',
      uri: ''
    }
    this.state.nameUser = this.props.nameUser || ''
    this.state.uri = this.props.uri || 'https://scontent.feoh3-1.fna.fbcdn.net/v/t1.0-1/p50x50/17903408_1044586812340472_7176591297268243543_n.png?oh=20bc54a7ec0faffce536dfa16eff5388&oe=5AA9803D'
    this.state.duration = this.props.duration || 1
  }

  reductionduration () {
    idSet = setInterval(() => {
      let duration = this.state.duration
      if (duration <= 0.0) {
        this.setState({ duration: 1 })
        clearInterval(idSet)
        this.props.cancel()
      } else {
        duration = duration - 0.025
        this.setState({duration})
      }
    }, 250)
  }

  _cancel () {
    clearInterval(idSet)
    this.props.cancel()
  }

  _accept () {
    clearInterval(idSet)
    this.props.accept()
  }

  componentDidMount () {
    this.reductionduration()
  }

  render () {
    return (
      <Modal isVisible={this.props.isVisible}>
        <View style={styles.modalContent}>
          <Image
            style={styles.imageOrder}
            source={{uri: this.state.uri}} />
          <View style={styles.nameUser}>
            <Text style={styles.textLarge}>
              { this.state.nameUser }
            </Text>
            <Text style={styles.textSmall}>
              A {util.getMeters(this.props.distance || 0)}
            </Text>
          </View>
          <View style={styles.stateUser}>
            <Text style={styles.textState}>
              Usuario Recurrente
            </Text>
          </View>
          <TouchableOpacity onPress={() => { this._accept() }}>
            <View style={styles.buttonAccept}>
              <Text style={styles.textAccept}>Aceptar servicio</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this._cancel() }}>
            <View style={styles.buttonCancel}>
              <Text style={styles.textCancel}>Cancelar</Text>
            </View>
          </TouchableOpacity>
          <Progress.Bar
            progress={this.state.duration}
            width={280}
            color={'rgb(163, 153, 167)'}
            borderColor={'rgb(163, 153, 167)'}
            style={styles.progress} />
        </View>
      </Modal>
    )
  }
}

module.exports = OrdenModal
