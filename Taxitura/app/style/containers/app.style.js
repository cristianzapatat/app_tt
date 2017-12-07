import { StyleSheet, Dimensions } from 'react-native'

import kts from '../../util/kts'

const { height } = Dimensions.get(kts.hardware.window)

export default StyleSheet.create({
  all: {
    ...StyleSheet.absoluteFillObject
  },
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
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30
  },
  icon: {
    width: 21,
    height: 14
  },
  logo: {
    width: 80,
    height: 70
  },
  state: {
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30
  },
  iconstate: {
    width: 5,
    height: 20
  },
  floatState: {
    position: 'absolute',
    right: 5,
    top: 50,
    width: 145,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 2,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10
  },
  tState: {
    fontSize: 15,
    marginLeft: 5
  },
  title: {
    color: 'rgb(255, 255, 255)',
    fontSize: 18,
    textAlign: 'center'
  },
  warning: {
    position: 'absolute',
    top: (height / 2) - 47,
    backgroundColor: 'rgba(113, 112, 109, 0.68)',
    width: 200,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  iconWarning: {
    width: 40,
    height: 40
  },
  textWarning: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8
  },
  buttonWarning: {
    backgroundColor: '#ffaf18',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 100,
    borderRadius: 30,
    marginBottom: 5
  },
  textButtonWarning: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#FFF'
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
    width: 22,
    height: 22
  }
})
