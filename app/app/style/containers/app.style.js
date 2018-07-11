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
    justifyContent: 'center'
  },
  headerTitle: {
    backgroundColor: 'rgba(34, 33, 33, 0.7)',
    height: 35
  },
  reference: {
    backgroundColor: 'rgba(34, 32, 32, 0.4)',
    width: '100%'
  },
  minRef: {
    height: 30
  },
  scrollRef: {
    height: 120
  },
  ref_text: {
    color: 'rgb(245, 245, 245)',
    fontSize: 18,
    paddingLeft: 5,
    paddingRight: 5
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
  load: {
    position: 'absolute',
    right: 10
  },
  notification: {
    position: 'absolute',
    right: 0,
    width: 185,
    height: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    borderColor: '#ffaf18',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5
  },
  onMyWay: {
    top: 125
  },
  otherAccept: {
    top: 190
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5
  },
  infoNoti: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center'
  },
  textNoti: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    fontWeight: '300'
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
    width: 350,
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
  msn: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    bottom: 110,
    backgroundColor: 'rgba(113, 112, 110, 0.79)',
    width: 260,
    height: 70,
    borderRadius: 10
  },
  contenMsn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4
  },
  mIcon: {
    position: 'absolute',
    left: 5,
    width: 25,
    height: 25
  },
  mText: {
    fontSize: 17,
    color: '#FFF',
    width: 190,
    textAlign: 'center'
  },
  buttonTry: {
    backgroundColor: '#ffaf18',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 170,
    borderRadius: 30,
    marginTop: 5,
    marginBottom: 5
  },
  textTry: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#FFF'
  },
  contentFooter: {
    width: 350,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  itemFooter: {
    width: 170,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tNumber: {
    width: 70,
    fontSize: 36,
    color: '#000',
    marginRight: 4,
    textAlign: 'center'
  },
  tText: {
    fontSize: 14,
    color: '#B6B6B6'
  }
})
