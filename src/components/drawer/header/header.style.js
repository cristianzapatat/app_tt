import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    all: {
        backgroundColor: '#FFAF18',
        flexDirection: 'column',
        alignContent: 'flex-start',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#AFAFAF'
    },
    headerPhoto: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#FF9400',
        justifyContent: 'center',
        alignItems: 'center'
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    headerName: {
        backgroundColor: '#FF9400',
        width: '80%',
        height: 30,
        maxHeight: 30,
        borderRadius: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        paddingHorizontal: 6
    },
    name: {
        fontSize: 16,
        width: '100%',
        color: '#FFF',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    headerPlaca: {
        backgroundColor: '#FFF',
        width: '80%',
        height: 25,
        maxHeight: 30,
        borderRadius: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 6
    },
    placa: {
        fontSize: 18,
        width: '100%',
        fontWeight: 'bold',
        color: '#858585',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    out: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 15,
        height: 18
    },
    outIcon: {
        width: 15,
        height: 18
    }
})
