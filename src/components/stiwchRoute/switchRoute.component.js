import React, { Component } from 'react'
import { View } from 'react-native'
import { Splash, Warning } from '..'
import { me } from '../../services/server.service'
import { servicesPerformedToday } from '../../services/interface.service'
import { Constants, LocalStorage, Utilities, Texts } from '../../util'
import Style from './switchRoute.style'

export default class SwitchRoutes extends Component {
    constructor (props) {
        super(props)
        this.state = {
            warningMessage: '',
            warning: false
        }
    }

    componentDidMount () {
        this.switchRoutes()
    }

    async switchRoutes () {
        if (await Utilities.isInternet()) {
            LocalStorage.getObject(Constants.LOCALSTORAGE.USER,
                async res => {
                    try {
                        const json = await me(res.token)
                        const { activo, ...user } = await json.json()
                        if (activo) {
                            const services = await servicesPerformedToday(user.id)
                            const { cant } = await services.json()
                            LocalStorage.setObject(Constants.LOCALSTORAGE.USER, { cant, ...user },
                                () => this.props.navigation.navigate(Constants.ROUTES.SWITCH.APP),
                                () => this.props.navigation.navigate(Constants.ROUTES.SWITCH.AUTH))

                            return
                        }
                        LocalStorage.remove(Constants.LOCALSTORAGE.USER)
                        throw ''
                    } catch (error) {
                        this.props.navigation.navigate(Constants.ROUTES.SWITCH.AUTH)
                    }
                },
                () => this.props.navigation.navigate(Constants.ROUTES.SWITCH.AUTH))

            return
        }
        this.setState({ warningMessage: Texts.DEFAULT.INTERNET.WITHOUT, warning: true })

        return
    }

    closeWarning () {
        this.setState({ warning: false, warningMessage: '' })
        setInterval(() => this.switchRoutes(), 1500)
    }

    render () {
        return (
            <View style={ Style.all }>
                <Splash
                    warning={ this.state.warning }
                    warningMessage={ this.state.warningMessage }
                    closeWarning={ this.closeWarning.bind(this) }/>
                <Warning
                    show={ this.state.warning }
                    message={ this.state.warningMessage }
                    textButton={ Texts.DEFAULT.GLOBAL.REFRESH }
                    onAction={ this.closeWarning.bind(this) }/>
            </View>
        )
    }
}
