import React, { Component } from 'react'
import { View, PermissionsAndroid } from 'react-native'
import GPSState from 'react-native-gps-state'
import Geolocation from 'react-native-geolocation-service'
import { getDistanceMatrix, getRouteToPoint, updateAction, cancelOrder, getServiceCurrent } from '../../services/interface.service'
import { getPhotoCabman } from '../../services/server.service'
import { Utilities, Constants, Texts, LocalStorage } from '../../util'
import { Footer, FooterService, GenericAlert, GpsOff, Header, Map, NewOrder, OpenPermission } from '../../components'
import * as FirebaseService from '../../services/firebase.service'
import Style from './main.style'

export default class Main extends Component {
    constructor (props) {
        super(props)
        this.state = {
            user: {},
            userMarker: {},
            routeUser: [],
            order: null,
            newOrder: null,
            isNewOrder: false,
            isCredit: false,
            position: {
                latitude: 3.8804178377998277,
                longitude: -77.02326726168394
            },
            initFirebase: false,
            renderFooter: true,
            isOpenPermission: false,
            generic: {
                show: false,
                title: '',
                message: ''
            },
            gps: {
                show: false,
                text: null,
                action: null
            }
        }
    }

    componentDidMount () {
        LocalStorage.getObject(Constants.LOCALSTORAGE.USER,
            result =>  {
                const { credito = 0, credito_ganancia = 0 } = result
                this.setState({ user: result, isCredit: parseInt(credito + credito_ganancia) > 0 })
            },
            () => this.props.navigation.navigate(Constants.ROUTES.SWITCH.AUTH))
        this.initGeolocalization()
        GPSState.addListener(() => this.initGeolocalization())
    }

    componentWillUnmount () {
        GPSState.removeListener()
    }

    async getServicesCurrent () {
        try {
            if (this.state.user) {
                const serviceCurrent = await getServiceCurrent(this.state.user.id)
                if (serviceCurrent.status === 200) {
                    const order = await serviceCurrent.json()
                    this.setState({ order, renderFooter: false })
                }
            }
        } catch (error) {
            this.setState({
                generic: {
                    message: Texts.LABEL.WITHOUT_ORDERS.MESSAGE,
                    title: Texts.LABEL.WITHOUT_ORDERS.TITLE,
                    show: true
                }
            })
        }
    }

    async initGeolocalization () {
        this.setState({ isOpenPermission: false, gps: { show: false, text: null, action: null } })
        if (await Utilities.isInternet()) {
            GPSState.getStatus().then(status => {
                if (status === GPSState.RESTRICTED) {
                    this.setState({ gps: { show: true, text: null, action: null } })
                } else if (status === GPSState.DENIED) {
                    this.requestPermissionsGPS()
                } else {
                    this.initPosition()
                    if (!this.state.order) {
                        this.getServicesCurrent()
                    }
                }
            })
        }
    }

    requestPermissionsGPS () {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(granted => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.initPosition()
                } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                    this.setState({ gps: {
                        text: Texts.LABEL.GPS_UNPERMISSION,
                        action: Texts.LABEL.GPS_ON_PERMISSION,
                        show: true
                    } })
                } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    this.setState({ isOpenPermission: true })
                }
            })
    }

    validateGpsPermission () {
        this.setState({
            isOpenPermission: false,
            gps: {
                text: Texts.LABEL.PERMISSION.PERMISSION_ON,
                action: Texts.ACTIONS.VALIDATE_PERMISSION,
                show: true
            }
        })
    }

    initPosition () {
        Geolocation.getCurrentPosition(position => {
            this.drawPosition(position.coords)
        }, () => {}, Constants.GET_CURRENT_POSITION)

        this.watchId = Geolocation.watchPosition(position => {
            this.drawPosition(position.coords)
        }, () => {}, Constants.WATCH_POSITION)
        if (!this.state.initFirebase) {
            this.setState({ initFirebase: true })
            this.initFirebase()
        }
    }

    drawPosition (position) {
        this.setState({ position })
    }

    initFirebase () {
        this.subscribeToTopicOrder()
        FirebaseService.onMessage(message => {
            const { _from, _data: { order } } = message
            if (_from === Constants.FIREBASE.NEW_ORDER) {
                this.openModalNewOrder(JSON.parse(order))
            }
        })
    }

    subscribeToTopicOrder () {
        this.cancelSubscribeTopicOrder()
        FirebaseService.subscribeToTopic('order')
    }

    cancelSubscribeTopicOrder () {
        FirebaseService.unsubscribeToTopic('order')
    }

    async openModalNewOrder (order) {
        this.cancelSubscribeTopicOrder()
        const distanceMatrix = await getDistanceMatrix(this.state.position, order.position_user)
        if (distanceMatrix.status === Constants.RESPONSE.STATUS.OK) {
            const { status, distance, duration } = await distanceMatrix.json()
            if (status === Constants.RESPONSE.OK) {
                const { latitude, longitude } = this.state.position
                const { id, nombre, foto: { url: photo }, taxis, telefono } = this.state.user
                const [{ placa }] = taxis
                order.cabman = {
                    id,
                    token: await FirebaseService.getToken(),
                    name: nombre,
                    photo: getPhotoCabman(photo),
                    phone: telefono,
                    placa
                }
                order.position_cabman = {
                    latitude,
                    longitude,
                    distance: distance.value,
                    duration: duration.value
                }
                this.setState({ renderFooter: null, newOrder: order, isNewOrder: true })
            }
        } else {
            this.subscribeToTopicOrder()
        }
    }

    cancelNewOrder () {
        this.setState({ renderFooter: true, newOrder: null, isNewOrder: false })
        this.subscribeToTopicOrder()
    }

    async acceptNewOrder () {
        try {
            const accepOrderService = await updateAction(this.state.newOrder)
            this.setState({ newOrder: null, isNewOrder: false })
            if (accepOrderService.status === 200) {
                const accepOrder = await accepOrderService.json()
                const { position_user } = accepOrder
                const route = await this.getRouteToUser(position_user)
                this.setState({
                    userMarker: {
                        type: Constants.ICON.TYPE.USER,
                        latitude: position_user.latitude,
                        longitude: position_user.longitude,
                        title: Texts.MAP.USER.USER
                    },
                    order: accepOrder,
                    routeUser: route,
                    renderFooter: false
                })
            } else {
                this.alertOrderInProcess()
            }
        } catch (err) {
            this.alertOrderInProcess()
        }
    }

    async getRouteToUser (positionUser) {
        let route = [
            this.state.position,
            positionUser
        ]
        try {
            const routeService = await getRouteToPoint(this.state.position, positionUser)
            if (routeService.status === 200) {
                const { coords } = await routeService.json()
                route = coords
            }
        } catch (error) {
            return route
        }

        return route
    }

    async proccessOrder () {
        try {
            this.setState({ routeUser: [], renderFooter: null })
            if (this.state.order) {
                const proccessOrderService = await updateAction(this.state.order)
                if (proccessOrderService.status === 200) {
                    const order = await proccessOrderService.json()
                    this.validateActionOrder(order)

                    return
                }
            }
            this.alertOrderInProcess()
        } catch (err) {
            this.alertOrderInProcess()
        }
    }

    validateActionOrder (order) {
        const { action = '' } = order
        if (action === Constants.STATUS_ORDER.END || action === Constants.STATUS_ORDER.COMPLETE) {
            this.setState({ renderFooter: true, userMarker: {}, order: null })
            this.subscribeToTopicOrder()
        } else {
            this.setState({ order, renderFooter: false })
            if (action === Constants.STATUS_ORDER.ABOARD) this.setState({ userMarker: {} })
        }
    }

    async cancelOrder () {
        try {
            this.setState({ renderFooter: null })
            if (this.state.order) {
                const cancelOrderService = await cancelOrder(this.state.order)
                if (cancelOrderService.status === 200) {
                    this.setState({
                        renderFooter: true,
                        routeUser: [],
                        userMarker: {},
                        order: null
                    })
                    this.subscribeToTopicOrder()

                    return
                }
            }
            this.setState({ renderFooter: false })
        } catch (error) {
            this.setState({ renderFooter: false })
        }
    }

    alertOrderInProcess () {
        this.setState({
            generic: {
                message: Texts.LABEL.ORDER_PROCCESSING.MESSAGE,
                title: Texts.LABEL.ORDER_PROCCESSING.TITLE,
                show: true
            }
        })
    }

    orderProcessed () {
        this.setState({
            renderFooter: true,
            userMarker: {},
            order: null,
            newOrder: null,
            isNewOrder: false,
            generic: {
                show: false,
                message: '',
                title: ''
            }
        })
        this.subscribeToTopicOrder()
    }

    render () {
        const { navigation } = this.props

        return (
            <View style={ Style.all }>
                <Map
                    position={ this.state.position }
                    markers={ [{
                        type: Constants.ICON.TYPE.CAB,
                        latitude: this.state.position.latitude,
                        longitude: this.state.position.longitude,
                        title: Texts.MAP.CAB.YOU
                    }, this.state.userMarker] }
                    route={ this.state.routeUser }/>
                <Header navigation={ navigation }/>
                { this.renderFooter() }
                <NewOrder
                    isVisible={ this.state.isNewOrder }
                    isCredit={ this.state.isCredit }
                    order={ this.state.newOrder }
                    onCancel={ this.cancelNewOrder.bind(this) }
                    onAccept={ this.acceptNewOrder.bind(this) }/>
                <GenericAlert
                    show={ this.state.generic.show }
                    title={ this.state.generic.title }
                    message={ this.state.generic.message }
                    onAction={ this.orderProcessed.bind(this) }/>
                <GpsOff
                    show={ this.state.gps.show }
                    message={ this.state.gps.text }
                    textButton={ this.state.gps.action }
                    onAction={ this.initGeolocalization.bind(this) }/>
                <OpenPermission
                    show={ this.state.isOpenPermission }
                    onCancel={ this.initGeolocalization.bind(this) }
                    onAction={ this.validateGpsPermission.bind(this) }/>
            </View>
        )
    }

    renderFooter () {
        if (this.state.renderFooter !== null) {
            if (this.state.renderFooter) {
                return (
                    <Footer render={ this.state.renderFooter }/>
                )
            } else {
                return (
                    <FooterService
                        render={ !this.state.renderFooter }
                        btnCancelRender={ Utilities.isActiveBtnCancelService(this.state.order) }
                        btnText={ Texts.LABEL.BTN_ACTIONS_SERVICE[Utilities.getActionOrder(this.state.order)] }
                        onAccept={ this.proccessOrder.bind(this) }
                        onCancel={ this.cancelOrder.bind(this) }/>
                )
            }
        }

        return null
    }
}
