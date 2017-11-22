import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  formContainer: {
    marginTop: 50
  },
  input: {
    fontSize: 20,
    width: 290,
    height: 45,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    color: '#2b2a2a',
    marginBottom: 10,
    borderRadius: 30,
    textDecorationColor: 'transparent',
    textDecorationLine: 'none'
  },
  button: {
    backgroundColor: '#ffaf18',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 290,
    marginTop: 30,
    borderRadius: 30
  },
  text: {
    fontSize: 22,
    textAlign: 'center',
    color: '#FFF'
  },
  help: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90
  },
  ButtonHelp: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconHelp: {
    width: 30,
    height: 30
  }
})
