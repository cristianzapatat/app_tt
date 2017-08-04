import React, { Component } from 'react'

import MapView from 'react-native-maps'
import Polyline from '@mapbox/polyline'

export default class Root extends Component {
  constructor (props) {
    super(props)
    this.state = {
      coords: []
    }
  }

  componentDidMount () {
    this.getDirections()
  }

  async getDirections () {
    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.props.startLoc.latitude},${this.props.startLoc.longitude}&destination=${this.props.endLoc.latitude},${this.props.endLoc.longitude}`)
      let respJson = await resp.json()
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points)
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      this.setState({coords: coords})
    } catch (error) {
      return error
    }
  }

  render () {
    return (
      <MapView.Polyline
        coordinates={this.state.coords}
        strokeWidth={3}
        strokeColor='#007AFF' />
    )
  }
}
