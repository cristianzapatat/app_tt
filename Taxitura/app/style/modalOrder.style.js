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
  }
})
