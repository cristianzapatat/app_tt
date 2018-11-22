import { StyleSheet } from 'react-native'
import Style from '../index.style'

const textCustom = {
    textAlign: 'center',
    fontSize: 20
}

export default StyleSheet.create({
    ...Style,
    containerCustom: {
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    btnCustom: {
        width: 130
    },
    image: {
        width: 60,
        height: 60,
        marginTop: -14,
        marginBottom: 8
    },
    large: {
        ...textCustom,
        color: '#000',
        marginBottom: 8
    },
    small: {
        ...textCustom,
        fontSize: 14
    }
})
