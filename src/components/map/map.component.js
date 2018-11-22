import '../../../UserAgent'
import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Constants } from '../../util'
import Style from './map.style'

const { width, height } = Dimensions.get(Constants.ENUM.WINDOW)
const ASPECT_RATIO = width / height

const latitudeDelta = Constants.ENUM.DELTA
const longitudeDelta = latitudeDelta * ASPECT_RATIO
const latitude = Constants.ENUM.LATITUDE
const longitude = Constants.ENUM.LONGITUDE

export default class Map extends Component {
    getIcon (type) {
        switch (type) {
        case Constants.ICON.TYPE.CAB:
            return require('../../assets/cab.png')
        case Constants.ICON.TYPE.USER:
            return require('../../assets/user.png')
        case Constants.ICON.TYPE.RECHAR:
            return require('../../assets/rechar.png')
        default:
            return require('../../assets/taxitura.png')
        }
    }

    renderMarkers (markers) {
        return markers.map((marker, index) => (
            <MapView.Marker
                key={ `${index}_marker` }
                image={ this.getIcon(marker.type) }
                coordinate={ {
                    latitude: parseFloat(marker.latitude),
                    longitude: parseFloat(marker.longitude)
                } }
                title={ marker.title || '' }
                description={ marker.description || '' }/>
        ))
    }

    render () {
        const { markers = [], position = { latitude, longitude } } = this.props

        return (
            <MapView
                style={ Style.container }
                provider={ PROVIDER_GOOGLE }
                region={ {
                    latitude: position.latitude,
                    longitude: position.longitude,
                    latitudeDelta,
                    longitudeDelta
                } }>
                { this.renderMarkers(markers) }
            </MapView>
        )
    }
}
