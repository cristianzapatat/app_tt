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
    quality: {
        fontSize: 15,
        color: '#7c7979'
    },
    star: {
        fontSize: 22,
        color: '#FF9955',
        marginTop: 12
    },
    legend: {
        fontSize: 14,
        color: '#7c7979',
        marginTop: 12
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 40,
        borderRadius: 30,
        backgroundColor: '#ffaf18'
    },
    tText: {
        fontSize: 22,
        textAlign: 'center',
        color: '#FFF'
    }
})