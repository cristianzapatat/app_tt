import { StyleSheet, Dimensions } from 'react-native'

const {height} = Dimensions.get('window')

export default StyleSheet.create({
  all: {
    flexDirection: 'column',
    position: 'absolute',
    height: height,
    right: 0,
    zIndex: 20
  },
  iconSide: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuSide: {
    backgroundColor: 'rgb(252, 110, 8)',
    height: (height / 4),
    width: 100,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  icon: {
    width: 30,
    height: 30
  }
})
