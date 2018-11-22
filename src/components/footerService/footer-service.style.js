import { StyleSheet } from 'react-native'
import StyleGlobal from '../../global/style'

export default StyleSheet.create({
    ...StyleGlobal,
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20
    },
    containerInfo: {
        width: 350,
        alignItems: 'center',
        alignContent: 'center'
    },
    button: {
        width: 290,
        height: 45,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnCancel: {
        backgroundColor: '#EA7121'
    }
})
