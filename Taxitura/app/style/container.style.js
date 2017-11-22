import { StyleSheet } from 'react-native'

var styleSheet = Object.freeze({
  app: {
    container: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    map: {
      ...StyleSheet.absoluteFillObject
    },
    children: {
      backgroundColor: 'transparent'
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
    headerLogo: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#ffaf18'
    },
    headerTitle: {
      backgroundColor: 'rgba(34, 33, 33, 0.7)',
      height: 35
    },
    menu: {
      position: 'absolute',
      left: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    logo: {
      width: 80,
      height: 70
    },
    title: {
      color: 'rgb(255, 255, 255)',
      fontSize: 18,
      textAlign: 'center'
    },
    icon: {
      width: 25,
      height: 25
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      alignItems: 'center',
      justifyContent: 'center'
    },
    button: {
      backgroundColor: '#ffaf18',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: 290,
      borderRadius: 30
    },
    text: {
      fontSize: 22,
      textAlign: 'center',
      color: '#FFF'
    },
    contentFooter: {
      width: 335,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    itemFooter: {
      width: 137,
      height: 50,
      borderRadius: 30,
      backgroundColor: '#ffffff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    tNumber: {
      fontSize: 36,
      color: '#000',
      marginRight: 2
    },
    tText: {
      fontSize: 14,
      color: '#B6B6B6'
    },
    ButtonGraphic: {
      width: 50,
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center'
    },
    iconGraphic: {
      width: 30,
      height: 30
    }
  },
  login: {
    container: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center'
    },
    map: {
      ...StyleSheet.absoluteFillObject
    },
    children: {
      backgroundColor: 'transparent'
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    logo: {
      width: 70,
      height: 70
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
  }
})

module.exports = styleSheet
