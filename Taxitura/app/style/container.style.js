import { StyleSheet, Dimensions } from 'react-native'

const {width, height} = Dimensions.get('window')

export default StyleSheet.create({
  all: {
    height: height,
    backgroundColor: 'transparent'
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 50,
    height: (height - 50),
    width: width
  }
})
