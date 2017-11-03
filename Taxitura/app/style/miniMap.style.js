import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  content: {
    backgroundColor: 'white',
    height: 400,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  enter: {
    flex: 1,
    flexDirection: 'column'
  },
  enterMap: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#95a5a6',
    marginTop: 10
  },
  map: {
    flex: 1
  },
  img: {
    width: 24,
    height: 24
  },
  btnCancel: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: 280,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  close: {
    fontSize: 18,
    color: '#e74c3c'
  }
})
