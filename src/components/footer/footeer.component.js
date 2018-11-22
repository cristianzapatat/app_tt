import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import Shadow from '../shadow/shadow.component'
import { Constants, LocalStorage, Texts, Utilities } from '../../util'
import Style from './footer.style'

export default class Footer extends Component {
    constructor (props) {
        super(props)
        this.state = {
            servicesAvailable: '---',
            servicesToday: '---'
        }
    }

    componentDidMount () {
        LocalStorage.getObject(Constants.LOCALSTORAGE.USER, async ({ credito, credito_ganancia, cant }) => {
            this.setState({
                servicesAvailable: Utilities.getValueText(credito, credito_ganancia),
                servicesToday: Utilities.getValueText(cant)
            })
        })
    }

    render () {
        return (
            <View style={ Style.container }>
                { this.renderComponent() }
            </View>
        )
    }

    renderComponent () {
        const { render } = this.props
        if (render === false) {
            return (
                <View style={ Style.buttonsInfo }>
                    { this.renderItemInfo(Texts.LABEL.SERVICES_AVAILABLE, this.state.servicesAvailable) }
                    { this.renderItemInfo(Texts.LABEL.SERVICES_TODAY, this.state.servicesToday) }
                </View>
            )
        }

        return null
    }

    renderItemInfo (text, value) {
        return (
            <TouchableOpacity
                activeOpacity={ Constants.ENUM.ACTIVE_OPACITY }>
                <Shadow>
                    <View style={ Style.buttonInfo }>
                        <Text style={ Style.numberFooter }>{ value }</Text>
                        <Text
                            style={ Style.text }
                            numberOfLines={ 2 }
                            ellipsizeMode={ Constants.ENUM.TAIL }>
                            { text }
                        </Text>
                    </View>
                </Shadow>
            </TouchableOpacity>
        )
    }
}
