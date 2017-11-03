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
    width: 160,
    height: 160,
    borderRadius: 80
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginTop: 10
  },
  btnCancel: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: 280,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  large: {
    fontSize: 17,
    color: '#000000'
  },
  small: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#2e2e2e'
  },
  close: {
    fontSize: 18,
    color: '#e74c3c'
  }
})
