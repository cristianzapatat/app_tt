import { StyleSheet } from 'react-native'
import { Constants } from '../util'

export default StyleSheet.create({
    btnText: {
        fontSize: 22,
        textAlign: 'center',
        color: '#FFF'
    },
    activeBackground: {
        backgroundColor: Constants.COLOR.TAXITURA
    },
    inactiveBackground: {
        backgroundColor: Constants.COLOR.INACTIVE
    }
})
