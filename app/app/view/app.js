/* global fetch,Headers:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {
    PermissionsAndroid,
    AsyncStorage,
    DeviceEventEmitter,
    BackHandler,
    Platform
} from 'react-native'
import io from 'socket.io-client'
import GPSState from 'react-native-gps-state'
import { EventRegister } from 'react-native-event-listeners'
import Gps from '../../native/taxitura-gps'

import global from '../util/global'
import kts from '../util/kts'
import urls from '../util/urls'
import text from '../util/text'
import util from '../util/util'

import Container from '../component/container'
import Menu from '../component/menu'
import ModalOrder from '../component/modalOrder'
import ModalPermission from '../component/modalPermission'
import ModalCancelService from '../component/modalCancelService'
import ConfirmCancelService from '../component/confirmCancelService'
import Score from '../component/score'

const socket = io(urls.urlInterface, {
    path: '/client',
    transports: [kts.main.websocket]
})

let coords = []
let permissionsStatus = false
let isServiceInMemory = false
let __setTimeOut

export default class Taxitura extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isModalPermission: false,
            isMenu: false,
            isModalOrder: false,
            isConfirmCancel: false,
            isScore: false,
            isButton: false,
            isMns: false,
            isCredit: true,
            load: true,
            loadService: false,
            loadIsService: true,
            disabledBtn: false,
            serviceCancel: null,
            title: text.app.label.sessionStarting,
            addressReference: '',
            message: text.intenet.without,
            typeMessage: kts.enum.WITHOUT
        }
    }

    componentWillMount () {
        if (Platform.OS === kts.platform.android) {
            BackHandler.addEventListener(kts.hardware.backPress, () => {
                const { navigation } = this.props
                if (navigation.state.routeName === kts.app.id) {
                    BackHandler.exitApp()
                }
                return false
            })
        }
        this.appEventAcceptCancel = EventRegister.addEventListener(kts.event.appAcceptCancel, (service) => {
            socket.emit(kts.socket.acceptCancel, service)
            this.setState({isButton: null, loadService: true})
            EventRegister.emit(kts.event.changeState, {state: false, case: 0})
        })
        this.appEventSessionEnd = EventRegister.addEventListener(kts.event.sessionEnd, () => {
            this.sessionEnd()
            EventRegister.emit(kts.event.loginSessionEnd)
        })
    }

    componentDidMount () {
        this.validateConection(false)
    }

    componentWillUnmount () {
        Gps.stopLocation()
        if (Platform.OS === kts.platform.android) {
            BackHandler.removeEventListener(kts.hardware.backPress)
        }
        EventRegister.removeEventListener(this.appEventAcceptCancel)
        EventRegister.removeEventListener(this.appEventSessionEnd)
    }

    validateConection (state) {
        if (state) {
            this.setState({isMns: false, title: text.app.label.sessionStarting, load: true, loadIsService: true})
        }
        util.isInternet().then(status => {
            if (status) {
                this.onSocket(true)
            } else {
                this.setState({title: '', load: false, loadService: false, loadIsService: false, isMns: true})
            }
        })
    }

    onSocket (status) {
        socket.open()
        socket.on(kts.socket.connect, () => {
            socket.emit(kts.socket.changeSocket, global.user.id)
        })
        socket.on(kts.socket.sessionEnd, (id, token) => {
            if (global.user.id === id && global.user.token !== token) {
                this.sessionEnd()
                EventRegister.emit(kts.event.loginSessionEnd)
            }
        })
        socket.emit(kts.socket.sessionStart, global.user.id, global.user.token)
        socket.on(kts.socket.isServiceInMemory, order => {
            if (order) {
                global.service = order
                isServiceInMemory = true
            } else {
                this.setState({loadIsService: false})
            }
            socket.on(kts.socket.receiveService, order => {
                const { navigation } = this.props
                if (global.state && navigation.state.routeName === kts.app.id &&
                    global.position !== null && !global.waitCanceled && global.isSession &&
                    order.action === kts.action.order && global.service === null &&
                    global.waitId === null && (parseInt(global.user.credito + global.user.credito_ganancia)) > 0) {
                    global.service = order
                    this.openModalOrder(global.position, global.service.position_user, true) 
                } else if ((parseInt(global.user.credito + global.user.credito_ganancia)) <= 0) { 
                    // Si el usuario no tiene creditos 
                    global.service = order 
                    this.openModalOrder(global.position, global.service.position_user, false)
                }
            })
            socket.on(kts.socket.orderCanceled, order => {
                if (order) {
                    const { navigation } = this.props
                    if (navigation.state.routeName === kts.app.id && global.position !== null &&
                        global.waitCanceled && order.action === kts.action.accept && global.isSession &&
                        global.service === null && global.waitId === null && (parseInt(global.user.credito + global.user.credito_ganancia)) > 0) {
                        global.service = order
                        this.getInfoOrder()
                    }
                } else { this.cleanService() }
            })
            socket.on(kts.socket.acceptService, order => {
                if (order !== null) {
                    if (order.service.id === global.waitId && global.service === null) {
                        global.service = order
                        this.getInfoOrder()
                    } else { this.cleanService() }
                } else {
                    this.cleanService()
                    EventRegister.emit(kts.event.showOtherAccept, true)
                }
            })
            socket.on(kts.socket.processService, order => {
                clearTimeout(__setTimeOut)
                global.service = order
                if (global.service.action === kts.action.arrive) {
                    coords = []
                    this.setState({
                        textButton: text.app.label.aboard,
                        typeButton: kts.action.arrive,
                        isService: false,
                        disabledBtn: false,
                        isButton: true,
                        loadService: false
                    })
                } else if (global.service.action === kts.action.aboard) {
                    this.setState({
                        textButton: text.app.label.weArrived,
                        typeButton: kts.action.aboard,
                        disabledBtn: false,
                        isButton: true,
                        loadService: false
                    })
                } else if (global.service.action === kts.action.end) {
                    EventRegister.emit(kts.event.addServiceToday)
                    this.cleanService()
                }
            })
            socket.on(kts.socket.deleteService, idService => {
                if (global.service && global.service.service.id === idService) {
                    this.cancelOrder(false)
                    this.cleanService()
                }
            })
            socket.on(kts.socket.onMyWay, (data) => {
                if (global.service && global.service.service.id === parseInt(data.service.id)) {
                    EventRegister.emit(kts.event.showOnMyWay, true)
                }
            })
            socket.on(kts.socket.cancelService, (data) => {
                if (global.service && global.service.service.id === data.service.id) {
                    this.cleanService()
                    this.setState({
                        serviceCancel: data
                    })
                }
            })
            socket.on(kts.socket.responseCancelServiceCab, data => {
                clearTimeout(__setTimeOut)
                if (data && global.service && global.service.service.id === data.service.id) {
                    this.cleanService()
                } else {
                    this.setState({
                        title: text.app.label.inService,
                        disabledBtn: false,
                        loadService: false,
                        isButton: true,
                    })
                }
            })
            socket.on(kts.socket.scoreCab, order => {
                if (!this.state.isModalOrder) {
                    this.setState({
                        isMenu: false,
                        isConfirmCancel: false,
                        infoScore: {
                            uri: order.user.url_pic,
                            name: order.user.name,
                            score: order.quality.value
                        },
                        isScore: true
                    })
                }
            })
            if (status) this.getStatus(true)
        })
    }

    async getStatus (action) {
        if (!action) this.setState({load: true})
        GPSState.getStatus().then(status => {
            if (status === GPSState.RESTRICTED) {
                this.setState({isNoGps: true, textNoGps: text.app.gps.offGps, title: '', load: false})
            } else if (status === GPSState.DENIED) {
                this.setState({load: false})
                this.getPermissions()
            } else {
                this.analitycPosition()
            }
        })
    }

    getPermissions () {
        if (!permissionsStatus) {
            permissionsStatus = true
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                .then(granted => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.setState({load: true})
                        this.analitycPosition()
                    } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                        this.setState({isNoGps: true, textNoGps: text.app.gps.withoutPermission, title: '', load: false})
                    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                        this.setState({isNoGps: false, title: '', isModalPermission: true, load: false})
                    }
                })
        }
    }

    analitycPosition () {
        this.setState({title: text.app.get.position})
        if (global.position !== null) {
            this.drawPosition(global.position)
        }
        Gps.getLocation(Gps.NETWORK, kts.time.TIME_GPS, kts.time.DISTANCE_GPS)
        Gps.getLocation(Gps.GPS, kts.time.TIME_GPS, kts.time.DISTANCE_GPS)
        DeviceEventEmitter.removeListener(Gps.GET_LOCATION)
        DeviceEventEmitter.addListener(Gps.GET_LOCATION, (location) => {
            global.position = location
            this.drawPosition(global.position)
        })
    }

    drawPosition (position) {
        this.sendPosition(position)
        if (this.state.title !== text.app.label.waitService) {
            this.setState({
                title: text.app.label.waitService,
                load: false
            })
        }
        EventRegister.emit(kts.event.changePosition, position)
        this.setState({
            latitude: position.latitude,
            longitude: position.longitude
        })
        if (isServiceInMemory) {
            isServiceInMemory = false
            EventRegister.emit(kts.event.changeState, {state: false, case: 0})
            this.getInfoOrder()
        }
    }

    async sendPosition (position) {
        if (position) {
            socket.emit(kts.socket.savePositionCab, {
                id: global.user.id,
                service: global.service !== null ? global.service.service.id : null,
                action: global.service !== null ? global.service.action : '',
                position: {
                    latitude: position.latitude,
                    longitude: position.longitude
                }
            })
        }
    }

    openModalOrder (start, end, _isCredit) {
        EventRegister.emit(kts.event.onShow)
        fetch(urls.getDistanceMatrix(start, end))
            .then(result => result.json())
            .then(json => {
                if (json.rows[0]) {
                    this.setState({
                        serviceCancel: null,
                        distance: json.rows[0].elements[0].distance.value,
                        time: json.rows[0].elements[0].duration.value,
                        uri: global.service.user.url_pic,
                        name: global.service.user.name,
                        address: global.service.position_user.address,
                        reference: global.service.position_user.ref,
                        isMenu: false,
                        isScore: false,
                        isCredit: _isCredit,
                        isModalOrder: true
                    })
                }
            })
    }

    cancelOrder (status) {
        this.setState({isModalOrder: false})
        this.setState({isButton: false, loadService: false})
        if (status) {
            util.isInternet().then(status => {
                if (status) {
                    global.service[kts.json.cabman] = {id: global.user.id}
                    socket.emit(kts.socket.addServiceCanceled, global.service)
                } else {
                    this.setState({isMns: true})
                }
                global.service = null
                global.waitId = null
            })
        }
    }

    acceptOrder () {
        this.setState({isModalOrder: false})
        this.setState({isButton: null, loadService: true})
        util.isInternet().then(status => {
            if (status) {
                if (!global.isApp) {
                    global.isApp = true
                    EventRegister.emit(kts.event.appIsApp)
                }
                if (global.service) {
                    global.service.action = kts.action.accept
                    global.service[kts.json.cabman] = {
                        id: global.user.id,
                        name: global.user.nombre,
                        photo: urls.getUrlPhoto(global.user.foto.url),
                        placa: global.user.taxis[0].placa
                    }
                    global.service[kts.json.position_cabman] = {
                        distance: this.state.distance,
                        time: this.state.time,
                        latitude: this.state.latitude,
                        longitude: this.state.longitude
                    }
                    global.tempState = true
                    EventRegister.emit(kts.event.changeState, {state: false, case: 0})
                    socket.emit(kts.socket.responseService, global.service)
                    global.waitId = global.service.service.id
                    global.service = null
                }
            } else {
                this.cleanService()
                this.setState({isMns: true})
            }
        })
    }

    cleanService () {
        global.service = null
        global.waitId = null
        coords = []
        global.waitCanceled = false
        EventRegister.emit(kts.event.changeState, {state: true, case: 0, temp: true})
        this.setState({
            disabledBtn: false,
            title: text.app.label.waitService,
            isButton: false,
            isConfirmCancel: false,
            typeButton: '',
            isService: false,
            loadService: false,
            addressReference: '',
            reference: ''
        })
    }

    async getInfoOrder () {
        if (global.service.action === kts.action.accept) {
            try {
                let resp = await fetch(urls.getDirections(global.position, global.service.position_user))
                let respJson = await resp.json()
                let points = util.decode(respJson.routes[0].overview_polyline.points, 5)
                coords = points.map((point, index) => {
                    return {
                        latitude: point[0],
                        longitude: point[1]
                    }
                })
            } catch (err) {
                coords = [
                    {latitude: global.position.latitude, longitude: global.position.longitude},
                    {latitude: global.service.position_user.latitude, longitude: global.service.position_user.longitude}
                ]
            }
        }
        this.setState({
            latitudeService: global.service.position_user.latitude,
            longitudeService: global.service.position_user.longitude,
            addressReference: global.service.action === kts.action.accept ? global.service.position_user.ref : '',
            address: global.service.position_user.address,
            title: text.app.label.inService,
            textButton: util.getTextButton(global.service.action),
            typeButton: global.service.action,
            isService: global.service.action === kts.action.accept,
            loadService: false,
            loadIsService: false,
            disabledBtn: false,
            isButton: true
        })
    }

    processService () {
        util.isInternet().then(status => {
            if (status) {
                global.service.action = util.getAction(global.service.action)
                socket.emit(kts.socket.responseService, global.service)
                __setTimeOut = setTimeout(() => {
                    this.setState({
                        disabledBtn: false,
                        loadService: false,
                        isButton: true,
                    })
                }, 20000);
                this.setState({
                    disabledBtn: true,
                    isButton: true,
                    addressReference: '',
                    loadService: true,
                    isMns: false
                })
            } else {
                this.setState({isMns: true})
            }
        })
    }

    cancelService() {
        util.isInternet().then(status => {
            if (status) {
                socket.emit(kts.socket.cancelServiceCab, global.service, global.position)
                __setTimeOut = setTimeout(() => {
                    this.setState({
                        disabledBtn: false,
                        loadService: false,
                        isButton: true,
                    })
                }, 20000);
                this.setState({
                    disabledBtn: true,
                    isConfirmCancel: false,
                    isButton: true,
                    addressReference: '',
                    loadService: true,
                    isMns: false
                })
            } else {
                this.setState({isMns: true})
            }
        })
    }

    navigate (id) {
        this.setState({isMenu: false})
        setTimeout(() => {
            global.isApp = false
            this.props.navigation.navigate(id)
        }, 400)
    }

    closeSession () {
        global.isSession = false
        global.isApp = false
        this.setState({isMenu: false})
        setTimeout(() => {
            let myHeaders = new Headers()
            myHeaders.append(kts.key.userToken, global.user.token)
            let init = {
                method: kts.method.post,
                headers: myHeaders
            }
            fetch(urls.logoutService, init)
            this.sessionEnd()
        }, 400)
    }

    sessionEnd () {
        socket.close()
        Gps.stopLocation()
        this.setState({title: text.app.label.sessionEnding, load: true})
        global.isSession = false
        global.isApp = false
        AsyncStorage.removeItem(kts.key.user, () => {
            this.setState({load: false, title: ''})
            this.props.navigation.navigate(kts.login.id)
        })
    }

    render () {
        return (
            <Container.ContainerApp
                load={this.state.load || this.state.loadService || this.state.loadIsService}
                title={this.state.title}
                onPressMenu={() => { this.setState({isMenu: true}) }}
                isService={this.state.isService}
                disabledBtn={this.state.disabledBtn}
                isButton={this.state.isButton}
                typeButton={this.state.typeButton}
                latitude={this.state.latitude}
                longitude={this.state.longitude}
                latitudeService={this.state.latitudeService}
                longitudeService={this.state.longitudeService}
                address={this.state.address}
                addressReference={this.state.addressReference}
                coords={coords}
                textButton={this.state.textButton}
                onProcess={() => { this.processService() }}
                onCancelService={() => { this.setState({isConfirmCancel: true}) }}
                isNoGps={this.state.isNoGps}
                textNoGps={this.state.textNoGps}
                isMns={this.state.isMns}
                typeMessage={this.state.typeMessage}
                message={this.state.message}
                closeMns={() => { this.validateConection(true) }}
                getStatus={() => {
                    this.setState({isNoGps: false})
                    if (!permissionsStatus) {
                        this.setState({isNoGps: false})
                    } else {
                        permissionsStatus = false
                    }
                    this.getStatus()
                }}>
                <Menu
                    isVisible={this.state.isMenu}
                    onClose={() => { this.setState({isMenu: false}) }}
                    navigate={this.navigate.bind(this)}
                    closeSession={() => { this.closeSession() }} />
                <ModalCancelService
                    service={this.state.serviceCancel} 
                    close={() => { this.setState({serviceCancel: null}) }}/>
                <ModalOrder
                    isCredit={this.state.isCredit}
                    isVisible={this.state.isModalOrder}
                    uri={this.state.uri}
                    name={this.state.name}
                    distance={this.state.distance}
                    address={this.state.address}
                    reference={this.state.reference}
                    onCancel={() => { this.cancelOrder(true) }}
                    onAccept={() => { this.acceptOrder() }} />
                <ConfirmCancelService
                    isVisible={this.state.isConfirmCancel} 
                    onClose={() => { this.setState({isConfirmCancel: false}) }} 
                    onCancel={() => { this.cancelService() }} />
                <ModalPermission
                    isVisible={this.state.isModalPermission}
                    onClose={() => {
                        permissionsStatus = false
                        this.setState({isModalPermission: false, isNoGps: true, textNoGps: text.app.gps.withoutPermission})
                    }}
                    onPreview={() => {
                        permissionsStatus = false
                        this.setState({isModalPermission: false})
                    }} />
                <Score 
                    isVisible={this.state.isScore} 
                    info={this.state.infoScore}
                    onClose={() => { this.setState({isScore: false, infoScore: null}) }} />
            </Container.ContainerApp>
        )
    }
}