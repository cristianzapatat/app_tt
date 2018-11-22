import { StyleSheet, Dimensions } from 'react-native'
import { Constants } from '../../util'

const { height } = Dimensions.get(Constants.ENUM.WINDOW)
const window = {
    header: 185,
    footer: 40
}
window.content = height - (window.header + window.footer + 25)

export default StyleSheet.create({
    all: {
        flex: 1,
        flexDirection: 'column'
    },
    header: {
        height: window.header,
        width: '100%'
    },
    content: {
        height: window.content,
        width: '100%'
    },
    footer: {
        height: window.footer,
        width: '100%'
    }
})
