import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  all: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column'
  },
  container: {
    flex: 1,
    marginTop: 50,
    position: 'relative',
    flexDirection: 'column'
  },
  addreess: {
    height: 40,
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 2
  },
  textAddreess: {
    color: 'rgb(255, 255, 255)',
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  loading: {
    position: 'absolute',
    right: 0,
    marginRight: 5
  },
  over: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.19)'
  },
  notgps: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  textGps: {
    marginTop: 5,
    fontSize: 20,
    textAlign: 'center'
  },
  footer: {
    backgroundColor: '#ffaf18',
    zIndex: 2,
    height: 80,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerAccept: {
    width: 330,
    height: 50,
    borderWidth: 0.8,
    borderColor: 'rgb(255, 255, 255)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textFooter: {
    color: 'rgb(255, 255, 255)',
    fontSize: 24
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
    borderRadius: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  imageOrder: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  nameUser: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    flexDirection: 'column',
    marginTop: 10
  },
  textLarge: {
    fontSize: 22,
    color: '#4d4d4d',
    textAlign: 'center',
    marginBottom: 0
  },
  textSmall: {
    fontSize: 16,
    color: '#4d4d4d',
    textAlign: 'center',
    marginTop: -5
  },
  stateUser: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    flexDirection: 'column',
    marginTop: 30
  },
  textState: {
    fontSize: 18,
    color: '#918c8c',
    textAlign: 'center'
  },
  buttonAccept: {
    backgroundColor: '#ffaf18',
    width: 280,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  textAccept: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgb(255, 255, 255)'
  },
  buttonCancel: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: 280,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18
  },
  textCancel: {
    fontSize: 22,
    color: '#ffaf18'
  },
  progress: {
    marginTop: 15
  },
  imgReload: {
    marginTop: 10
  }
})
