import React, { Component } from 'react'
import {
    Keyboard,
    View,
    Image,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Text
} from 'react-native'
import { login as LoginValidate } from '../../services/server.service'
import { servicesPerformedToday } from '../../services/interface.service'
import { Warning, Loading, Map, Shadow } from '../../components'
import { Constants, Texts, Utilities, LocalStorage } from '../../util'
import Style from './login.style'

export default class Login extends Component {
    constructor (props) {
        super(props)
        this.state = {
            userKey: '',
            password: '',
            isNext: true,
            loading: false,
            warning: false,
            warningTitle: null,
            warningMessage: ''
        }
    }

    async login () {
        Keyboard.dismiss()
        if (!Utilities.isEmptyMultiple([this.state.userKey, this.state.password])) {
            if (await Utilities.isInternet()) {
                this.setState({ isNext: true, loading: true })
                try {
                    const json = await LoginValidate(this.state.userKey, this.state.password)
                    const { message, token, ...user } = await json.json()
                    if (!message && token) {
                        if (user.activo) {
                            const services = await servicesPerformedToday(user.id)
                            const { cant } = await services.json()
                            if (this.state.isNext) {
                                LocalStorage.setObject(Constants.LOCALSTORAGE.USER, { token, cant, ...user },
                                    () => {
                                        this.cancelLogin()
                                        this.props.navigation.navigate(Constants.ROUTES.SWITCH.APP)
                                    }, () => {
                                        this.generateWarning(Texts.LOGIN.ERROR)
                                    })

                                return
                            }
                            this.setState({ userKey: '', password: '' })

                            return
                        }
                        this.generateWarning(Texts.LOGIN.USER_INACCTIVE)

                        return
                    }
                    if (message === Constants.ENUM.ACCESS_DENIED) {
                        this.generateWarning(Texts.LOGIN.VALIDATE_USER, Texts.LOGIN.ACCESS_DENIED)
                    } else {
                        this.generateWarning(message || Texts.LOGIN.IMPOSSIBLE_ACCESS)
                    }

                    return
                } catch (error) {
                    this.generateWarning(Texts.LOGIN.ERROR)

                    return
                }
            }
            this.setState({ warningMessage: Texts.DEFAULT.INTERNET.WITHOUT, warning: true })

            return
        }
        this.setState({ warningMessage: Texts.LOGIN.FORM_INCOMPLETE, warning: true })
    }

    cancelLogin () {
        this.setState({ isNext: false, loading: false })
    }

    closeWarning () {
        this.setState({ warning: false, warningMessage: '', warningTitle: null })
    }

    generateWarning (message, title = null) {
        this.setState({
            warningTitle: title,
            warningMessage: message,
            userKey: '',
            password: '',
            loading: false,
            warning: true
        })
    }

    render () {
        return (
            <View style={ Style.all }>
                <Map/>
                <View style={ Style.container }>
                    <Shadow>
                        <View style={ Style.shadowLogo }>
                            <Image
                                style={ Style.logo }
                                source={ require('../../assets/taxitura.png') }/>
                        </View>
                    </Shadow>
                </View>
                <View style={ Style.form }>
                    <KeyboardAvoidingView behavior={ Constants.ENUM.PADDING } style={ Style.container }>
                        <View style={ Style.formContainer }>
                            <Shadow style={ Style.shadowInput }>
                                <TextInput
                                    style={ Style.textInput }
                                    placeholder={ Texts.LOGIN.USER_KEY }
                                    placeholderTextColor={ Constants.COLOR.PLACE_HOLDER }
                                    autoCorrect={ false }
                                    autoCapitalize={ Constants.ENUM.NONE }
                                    underlineColorAndroid={ Constants.ENUM.TRANSPARENT }
                                    onChangeText={ text => this.setState({ userKey: text }) }
                                    value={ this.state.userKey }/>
                            </Shadow>
                            <Shadow style={ Style.shadowInput }>
                                <TextInput
                                    style={ Style.textInput }
                                    placeholder={ Texts.LOGIN.PASSWORD }
                                    placeholderTextColor={ Constants.COLOR.PLACE_HOLDER }
                                    secureTextEntry
                                    autoCorrect={ false }
                                    autoCapitalize={ Constants.ENUM.NONE }
                                    underlineColorAndroid={ Constants.ENUM.TRANSPARENT }
                                    onChangeText={ text => this.setState({ password: text }) }
                                    value={ this.state.password }/>
                            </Shadow>
                            <Shadow style={ Style.shadowIn }>
                                <TouchableOpacity
                                    style={ Style.login }
                                    activeOpacity={ Constants.ENUM.ACTIVE_OPACITY }
                                    onPressOut={ this.login.bind(this) }>
                                    <Text style={ Style.textIn }>
                                        { Texts.LOGIN.IN }
                                    </Text>
                                </TouchableOpacity>
                            </Shadow>
                        </View>
                    </KeyboardAvoidingView>
                </View>
                <Loading
                    show={ this.state.loading }
                    onCancel={ this.cancelLogin.bind(this) }/>
                <Warning
                    show={ this.state.warning }
                    title={ this.state.warningTitle }
                    message={ this.state.warningMessage }
                    onAction={ this.closeWarning.bind(this) }/>
            </View>
        )
    }
}
