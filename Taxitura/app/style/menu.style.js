import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  all: {
    position: 'absolute',
    right: 0,
    flexDirection: 'column',
    zIndex: 2
  },
  iconSide: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e89b0a'
  },
  menuSide: {
    backgroundColor: '#e89b0a',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 50,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 10,
    height: 32,
    width: 110
  },
  element: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 30,
    height: 30
  },
  iconMargin: {
    marginLeft: 10
  },
  text: {
    fontSize: 18,
    color: '#000000',
    marginLeft: 5
  }
})
