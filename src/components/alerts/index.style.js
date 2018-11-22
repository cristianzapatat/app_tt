import { StyleSheet } from 'react-native'

const button = {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 200,
    borderRadius: 30
}

const text = {
    fontSize: 15,
    textAlign: 'center',
    color: '#FFF'
}

export default StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    contentContainer: {
        borderRadius: 30
    },
    cancelButton: {
        ...button,
        backgroundColor: '#E57373'
    },
    cancelText: {
        ...text
    },
    warningButton: {
        ...button,
        backgroundColor: '#FF8A65'
    },
    okButton: {
        ...button,
        backgroundColor: '#81C784'
    },
    warningText: {
        ...text
    },
    message: {
        fontSize: 16,
        textAlign: 'center'
    }
})
