import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55
  },
  text: {
    textAlign: 'center'
  },
  name: {
    fontSize: 23,
    color: '#000'
  },
  distance: {
    fontSize: 15,
    color: '#7c7979'
  },
  address: {
    fontSize: 19,
    color: '#110f0f',
    marginTop: 16
  },
  reference: {
    paddingVertical: 5,
    height: 180,
    maxHeight: 180,
    width: 270
  },
  title_reference: {
    fontSize: 15,
    color: '#7c7979',
    textAlign: 'left',
    width: '100%',
    marginBottom: 5
  },
  text_reference: {
    fontSize: 15,
    color: '#7c7979',
    width: '100%'
  },
  progress: {
    width: 270,
    height: 20,
    backgroundColor: '#DCDCDC',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    marginTop: 22
  },
  animated: {
    height: '100%',
    backgroundColor: '#AFAFAF',
    width: '100%'
  },
  time: {
    fontSize: 18,
    color: '#AFAFAF'
  },
  buttons: {
    width: 270,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 40,
    borderRadius: 30
  },
  accept: {
    backgroundColor: '#ffaf18'
  },
  cancel: {
    backgroundColor: '#F2F2F2'
  },
  tText: {
    fontSize: 22,
    textAlign: 'center'
  },
  tCancel: {
    color: '#000'
  },
  tAccept: {
    color: '#FFF'
  }
})
