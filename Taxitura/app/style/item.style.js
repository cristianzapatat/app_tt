import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  enter: {
    flexDirection: 'column',
    borderBottomWidth: 1.5,
    borderBottomColor: '#95a5a6'
  },
  item: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center'
  },
  photo: {
    height: 70,
    width: 70,
    borderRadius: 35,
    marginLeft: 5
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    marginLeft: 7
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  headerText: {
    fontSize: 17,
    color: '#000000'
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#2e2e2e'
  },
  buttons: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 5,
    width: 60
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 30,
    borderRadius: 10
  },
  btnAccept: {
    backgroundColor: '#2980b9',
    marginBottom: 5
  },
  btnMap: {
    backgroundColor: '#27ae60'
  }
})
