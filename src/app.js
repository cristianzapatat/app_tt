import { DrawerNavigator, StackNavigator, SwitchNavigator } from 'react-navigation'
import Router from './routes/routes'
import { Drawer, SwitchRoute } from './components'
import Login from './screens/login'
import { Constants } from './util'

const RootDrawer = DrawerNavigator({
    ...Router
},
{
    contentComponent: Drawer
})

const SignIn = StackNavigator({
    login: {
        screen: Login
    }
},
{
    mode: Constants.NAVIGATION.CONFIG.CARD,
    headerMode: Constants.NAVIGATION.CONFIG.NONE,
    initialRouteName: Constants.ROUTES.SCREEN.LOGIN
})

const SwitchApp = SwitchNavigator({
    switch: SwitchRoute,
    app: RootDrawer,
    auth: SignIn
},
{
    initialRouteName: Constants.ROUTES.SWITCH.SWITCH
})

export default SwitchApp
