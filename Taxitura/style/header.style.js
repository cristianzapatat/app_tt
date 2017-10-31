import { StyleSheet, Dimensions } from 'react-native'

const {width, height} = Dimensions.get('window')

export default StyleSheet.create({
  all: {
    height: height,
    backgroundColor: 'transparent'
  },
  nav: {
    height: 50,
    backgroundColor: '#ffaf18',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...StyleSheet.absoluteFillObject
  },
  menu: {
    height: '100%'
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 50,
    height: (height - 50),
    width: width
  }
})
