'use strict'
import React, {Component} from 'react'
import {View, Text} from 'react-native'
import * as Progress from 'react-native-progress'

import styles from '../style/load.style'

class Load extends Component {
  render () {
    return (
      <View style={styles.loading}>
        <Progress.CircleSnail
          size={50}
          color={['#2980b9']}
          animating
          thickness={4}
          duration={800}
          spinDuration={3000}
        />
        <Text style={styles.textLoading}>{this.props.text}</Text>
      </View>
    )
  }
}

module.exports = Load
