import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  all: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column'
  },
  nav: {
    backgroundColor: '#d29714',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'column'
  },
  title: {
    fontSize: 22,
    color: '#242525',
    textAlign: 'center'
  },
  connection: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7d7e7e'
  },
  container: {
    flex: 2,
    backgroundColor: '#14aad2'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  radius: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20 / 2,
    overflow: 'hidden',
    backgroundColor: '#007AFF'
  },
  markerOrder: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20 / 2,
    overflow: 'hidden',
    backgroundColor: '#ff9100'
  },
  order: {
    flex: 1
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  imageOrder: {
    width: 200,
    height: 200
  },
  nameUser: {
    backgroundColor: '#d29714',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'column'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  }
})
