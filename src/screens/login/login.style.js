import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    all: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    shadowLogo: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: '#ffaf18'
    },
    logo: {
        width: '100%',
        height: '100%'
    },
    form: {
        backgroundColor: 'transparent'
    },
    formContainer: {
        marginTop: 50
    },
    shadowInput: {
        marginTop: 10
    },
    textInput: {
        fontSize: 20,
        width: 290,
        height: 45,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        color: '#2b2a2a',
        marginBottom: 10,
        borderRadius: 30,
        textDecorationColor: 'transparent',
        textDecorationLine: 'none'
    },
    shadowIn: {
        marginTop: 30
    },
    login: {
        backgroundColor: '#ffaf18',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        width: 290,
        borderRadius: 30
    },
    textIn: {
        fontSize: 22,
        textAlign: 'center',
        color: '#FFF'
    }
})
