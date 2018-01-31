import { StyleSheet } from 'react-native'

export default StyleSheet.create({
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
  msn: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 130,
    backgroundColor: 'rgba(113, 112, 110, 0.79)',
    width: 260,
    height: 45,
    borderRadius: 10
  },
  mText: {
    fontSize: 17,
    color: '#FFF',
    width: 190,
    textAlign: 'center'
  },
  mButton: {
    marginRight: 5,
    marginTop: 3,
    height: '100%',
    justifyContent: 'flex-start'
  },
  mClose: {
    width: 20,
    height: 20
  },
  mIcon: {
    marginLeft: 5,
    width: 25,
    height: 25
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoView: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#ffaf18'
  },
  logo: {
    width: 70,
    height: 70
  },
  help: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 130
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
    width: 16,
    height: 24
  }
})
