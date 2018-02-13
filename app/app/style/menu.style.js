import { StyleSheet, Dimensions } from 'react-native'

import kts from '../util/kts'

const { width, height } = Dimensions.get(kts.hardware.window)

export default StyleSheet.create({
  modal: {
    margin: 0,
    flexDirection: 'row'
  },
  container: {
    width: 210,
    height: height,
    backgroundColor: '#FFF',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  vClose: {
    width: (width - 210),
    height: height
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
    top: 20,
    width: 15,
    height: 18
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 6
  },
  name: {
    fontSize: 16,
    width: '100%',
    color: '#FFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 5
  },
  headerPlaca: {
    backgroundColor: '#FFF',
    width: 166,
    height: 25,
    maxHeight: 30,
    borderRadius: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
    paddingHorizontal: 6
  },
  placa: {
    fontSize: 18,
    width: '100%',
    fontWeight: 'bold',
    color: '#858585',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 2
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%'
  },
  close: {
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    bottom: 15
  },
  ItemClose: {
    borderTopWidth: 1,
    borderTopColor: '#DCDCDC'
  }
})
