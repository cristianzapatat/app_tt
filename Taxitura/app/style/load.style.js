import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  loading: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textLoading: {
    fontSize: 20
  }
})
