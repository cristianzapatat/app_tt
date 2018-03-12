import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  content: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column'
  },
  bar: {
    height: 30,
    backgroundColor: 'rgba(59, 59, 59, 0.7)'
  },
  back: {
    position: 'absolute',
    left: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30
  },
  icon: {
    width: 20,
    height: 20
  }
})
