import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  load: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgLoading: {
    width: 180,
    height: 180,
    borderRadius: 90
  },
  loading: {
    marginTop: 15
  }
})
