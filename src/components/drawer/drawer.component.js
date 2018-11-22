import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { DrawerItems } from 'react-navigation'
import { Constants, LocalStorage } from '../../util'
import { unsubscribeToTopic } from '../../services/firebase.service'
import Header from './header/header.element'
import Footer from './footer/footer.element'
import Style from './drawer.style'

export default class Drawer extends Component {
    constructor (props) {
        super(props)
        this.state = {
            user: null
        }
    }

    componentDidMount () {
        LocalStorage.getObject(Constants.LOCALSTORAGE.USER,
            result => this.setState({ user: result }),
            () => this.setState({ user: null }))
    }

    logout () {
        unsubscribeToTopic('order')
        LocalStorage.remove(Constants.LOCALSTORAGE.USER)
        this.props.navigation.navigate(Constants.ROUTES.SWITCH.AUTH)
    }

    closeMenu () {
        this.props.navigation.navigate(Constants.NAVIGATION.NAVIGATE.OPEN_MENU)
    }

    render () {
        const { items, ...restProps } = this.props

        return (
            <View style={ Style.all }>
                <Header
                    user={ this.state.user }
                    closeMenu={ this.closeMenu.bind(this) }
                    style={ Style.header }/>
                <View style={ Style.content }>
                    <ScrollView>
                        <DrawerItems items={ items } { ...restProps }/>
                    </ScrollView>
                </View>
                <Footer
                    logout={ this.logout.bind(this) }
                    style={ Style.footer }/>
            </View>
        )
    }
}
