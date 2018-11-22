import { StyleSheet } from 'react-native'
import { Constants } from '../../util'

export default StyleSheet.create({
    container: {
        backgroundColor: Constants.COLOR.TAXITURA,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
        height: 80
    },
    menu: {
        position: 'absolute',
        left: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: 30,
        height: 30
    },
    icon: {
        width: 21,
        height: 14
    },
    logo: {
        width: 80,
        height: 65
    }
})
