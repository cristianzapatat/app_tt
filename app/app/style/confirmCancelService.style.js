import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000'
  },
  btns: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 280
  },
  btnCancel: {
    backgroundColor: '#ffaf18',
    width: 120,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnClose: {
    backgroundColor: '#cccccc',
    width: 120,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancel: {
    fontWeight: 'bold',
    color: '#fff'
  },
  close: {
    fontWeight: 'bold',
    color: '#fff'
  }
})
