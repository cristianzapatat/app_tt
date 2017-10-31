import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  enter: {
    flex: 1,
    flexDirection: 'column'
  },
  addreess: {
    height: 40,
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
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
  footer: {
    backgroundColor: '#ffaf18',
    height: 80,
    width: '100%',
    position: 'absolute',
    bottom: 20,
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
  }
})
