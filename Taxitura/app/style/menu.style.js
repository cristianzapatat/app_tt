import { StyleSheet, Dimensions } from 'react-native'

import kts from '../util/kts'

const { height } = Dimensions.get(kts.hardware.window)

export default StyleSheet.create({
  modal: {
    margin: 0
  },
  container: {
    width: 210,
    height: height,
    backgroundColor: '#FFF',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  header: {
    height: 210,
    maxWidth: 210,
    width: '100%',
    backgroundColor: '#FFAF18',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#AFAFAF'
  },
  out: {
    position: 'absolute',
    right: 20,
    top: 20
  },
  outIcon: {
    width: 15,
    height: 18
  },
  headerPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF9400',
    justifyContent: 'center',
    alignItems: 'center'
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 45
  },
  headerName: {
    backgroundColor: '#FF9400',
    width: 166,
    height: 30,
    maxHeight: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 6
  },
  name: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center'
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%'
  },
  item: {
    flexDirection: 'row',
    width: '100%',
    height: 55,
    paddingLeft: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    alignItems: 'center'
  },
  iconItem: {
    width: 28,
    height: 35,
    marginRight: 10
  },
  textItem: {
    textAlign: 'left',
    fontSize: 16
  },
  close: {
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    bottom: 15
  },
  ItemClose: {
    flexDirection: 'row',
    width: '100%',
    height: 55,
    paddingLeft: 13,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DCDCDC'
  },
  iconClose: {
    width: 29,
    height: 30,
    marginRight: 10
  }
})
