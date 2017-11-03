import React, { Component } from 'react'
import {View, TouchableOpacity, Text} from 'react-native'

import '../../UserAgent'
import styles from '../style/miniMap.style'
import Modal from 'react-native-modal'
import MapView from 'react-native-maps'
import consts from '../constant/constant'

class MiniMap extends Component {
  render () {
    return (
      <Modal isVisible={this.props.isVisible}>
        <View style={styles.content}>
          <View style={styles.enter}>
            <View style={styles.enterMap}>
              <MapView style={styles.map}
                loadingEnabled
                region={consts.position}>
                <MapView.Marker
                  coordinate={{latitude: consts.position.latitude, longitude: consts.position.longitude}}
                  title={'Tú'}
                  image={require('../../img/cab.png')} />
                <MapView.Marker
                  coordinate={{latitude: this.props.latitudeOrder, longitude: this.props.longitudeOrder}}
                  title={'Cliente'}
                  image={require('../../img/user.png')} />
              </MapView>
            </View>
            <TouchableOpacity onPress={this.props.hideMap}>
              <View style={styles.btnCancel}>
                <Text style={[styles.text, styles.close]}>Cerrar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

module.exports = MiniMap
