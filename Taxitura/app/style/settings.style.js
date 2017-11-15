import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  enter: {
    flex: 1,
    flexDirection: 'column'
  },
  title: {
    height: 40,
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  titleText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    backgroundColor: '#2980b9',
    width: 280,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  text: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold'
  }
})
