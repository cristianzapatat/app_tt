import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  img: {
    width: 60,
    height: 60,
    marginBottom: 8
  },
  text: {
    textAlign: 'center',
    fontSize: 20
  },
  large: {
    fontSize: 20,
    color: '#000',
    marginBottom: 8
  },
  small: {
    fontSize: 14,
    marginBottom: 15
  },
  btn: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: 280,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },
  go: {
    fontWeight: 'bold',
    color: '#ffaf18'
  },
  close: {
    fontWeight: 'bold',
    color: '#e74c3c'
  }
})
