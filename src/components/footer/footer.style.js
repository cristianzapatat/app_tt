import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 20
    },
    buttonsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-around',
        width: 350
    },
    buttonInfo: {
        width: 170,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    numberFooter: {
        width: 70,
        fontSize: 36,
        color: '#000',
        marginRight: 4,
        textAlign: 'center'
    },
    text: {
        fontSize: 14,
        color: '#B6B6B6'
    }
})
