import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  all: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    alignItems: 'center'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    flex: 0.6,
    marginTop: 60
  },
  response: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 330,
    height: 50,
    borderWidth: 0.3,
    borderRadius: 10,
    backgroundColor: '#2980b9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  text: {
    color: '#2c3e50',
    fontSize: 24
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  error: {
    textAlign: 'center',
    color: '#c0392b'
  }
})
