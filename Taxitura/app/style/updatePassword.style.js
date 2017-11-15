import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  content: {
    backgroundColor: '#ffffff',
    padding: 15,
    flexDirection: 'column',
    borderRadius: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  form: {
    height: 280
  },
  show: {
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  close: {
    color: '#e74c3c'
  },
  update: {
    color: '#ffaf18'
  },
  error: {
    textAlign: 'center',
    fontWeight: 'normal',
    color: '#e74c3c'
  },
  btn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6
  }
})
