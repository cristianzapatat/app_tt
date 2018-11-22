import React, { Component } from 'react'
import { View, PermissionsAndroid } from 'react-native'
import GPSState from 'react-native-gps-state'
import Geolocation from 'react-native-geolocation-service'
import { Utilities, Constants, Texts } from '../../util'
import { Footer, Header, Map } from '../../components'
import * as FirebaseService from '../../services/firebase.service'
import Style from './main.style'

export default class Main extends Component {
    constructor (props) {
        super(props)
        this.state = {
            position: {
                latitude: 3.8804178377998277,
                longitude: -77.02326726168394
            },
            renderFooter: false
        }
    }

    componentDidMount () {
        this.initGeolocalization()
    }

    async initGeolocalization () {
        if (await Utilities.isInternet()) {
            GPSState.getStatus().then(status => {
                if (status === GPSState.RESTRICTED) {
                    // TODO Alerta de GPS deshabilitado
                } else if (status === GPSState.DENIED) {
                    this.requestPermissionsGPS()
                } else {
                    this.initPosition()
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
                    // TODO Alerta por respuesta denegada
                } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    // TODO alerta por respuesta denegada y no volver a preguntar.
                }
            })
    }

    initPosition () {
        Geolocation.getCurrentPosition(position => {
            this.drawPosition(position.coords)
            this.initFirebase()
        }, () => {}, Constants.GET_CURRENT_POSITION)

        this.watchId = Geolocation.watchPosition(position => {
            this.drawPosition(position.coords)
            this.initFirebase()
        }, () => {}, Constants.WATCH_POSITION)
    }

    drawPosition (position) {
        this.setState({ position })
    }

    initFirebase () {
        FirebaseService.subscribeToTopic('order')
        FirebaseService.onMessage(message => {})
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
                    }] }/>
                <Header navigation={ navigation }/>
                <Footer render={ this.state.renderFooter }/>
            </View>
        )
    }
}
