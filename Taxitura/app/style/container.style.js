import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center' // cambiar para el resto de vistas
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  children: {
    backgroundColor: 'transparent'
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
