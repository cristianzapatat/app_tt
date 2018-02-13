import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  item: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#AFAFAF',
    padding: 10,
    paddingLeft: 18,
    paddingRight: 18,
    height: 90,
    width: '100%'
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    height: 25
  },
  place: {
    fontSize: 21,
    color: '#ABABAB',
    width: 234,
    height: '100%',
    textAlignVertical: 'center'
  },
  date: {
    fontSize: 13,
    width: 70,
    height: '100%',
    color: '#ABABAB',
    textAlignVertical: 'bottom'
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 45
  },
  value: {
    height: '100%',
    width: 140,
    marginRight: 4
  },
  price: {
    fontSize: 34,
    color: '#000',
    textAlign: 'left'
  },
  description: {
    height: '100%',
    width: 160,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  package: {
    fontSize: 14
  },
  info: {
    fontSize: 13
  }
})
