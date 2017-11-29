import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#AFAFAF',
    padding: 10,
    height: 90,
    width: '100%'
  },
  photo: {
    height: 50,
    width: 50,
    borderRadius: 25
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  text: {
    textAlign: 'left',
    width: 150,
    marginLeft: 8,
    marginRight: 8
  },
  name: {
    fontSize: 18,
    color: '#000'
  },
  address: {
    fontSize: 14,
    color: '#110f0f',
    marginTop: 3
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#ffaf18'
  },
  textButton: {
    fontSize: 20,
    color: '#FFF'
  }
})
