import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55
  },
  text: {
    textAlign: 'center'
  },
  action: {
    fontSize: 19,
    color: '#110f0f',
    marginTop: 16
  },
  name: {
    fontSize: 23,
    color: '#000'
  },
  buttons: {
    width: 270,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 40,
    borderRadius: 30
  },
  accept: {
    backgroundColor: '#ffaf18'
  },
  tText: {
    fontSize: 22,
    textAlign: 'center'
  },
  tAccept: {
    color: '#FFF'
  }
})
