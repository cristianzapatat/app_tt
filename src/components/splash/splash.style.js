import  { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
