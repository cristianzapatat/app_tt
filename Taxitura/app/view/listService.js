/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {View, Text, FlatList} from 'react-native'
import * as Progress from 'react-native-progress'

import styles from '../style/listService.style'
import Container from '../component/container'
import Item from '../component/item'
import PhotoModal from '../component/photoModal'
import MiniMap from '../component/miniMap'
import consts from '../constant/constant'
import fs from '../util/fs'

export default class ListService extends Component {
  constructor (props) {
    super(props)
    consts.view = 'listService'
    this.state = {
      isVisiblePhoto: false,
      isVisibleMap: false,
      isMap: false,
      nameUser: '',
      uri: null,
      loading: true,
      latitudeOrder: 0,
      longitudeOrder: 0,
      data: []
    }
    fetch(`${consts.serverSock}/get_services_canceled/${consts.user.cedula}`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({
          data: json,
          loading: false
        })
      })
  }

  goMap () {
    const { goBack } = this.props.navigation
    goBack()
  }

  logout () {
    this.props.navigation.state.params.destroy()
    this.props.navigation.navigate('login')
    fs.deleteFile(`${consts.persistenceFile}${consts.fileLogin}`)
  }

  _showPhoto (item) {
    this.setState({
      nameUser: item.user.name,
      uri: item.user.url_pic,
      isVisiblePhoto: true
    })
  }

  _hidePhoto () {
    this.setState({
      isVisiblePhoto: false
    })
  }

  _viewMap (item) {
    this.setState({
      isVisibleMap: true,
      latitudeOrder: item.position_user.latitude,
      longitudeOrder: item.position_user.longitude
    })
  }

  _hideMap () {
    this.setState({
      isVisibleMap: false
    })
  }

  _acceptService (service) {
    consts.view = 'app'
    consts.waitCanceled = true
    service['cabman'] = {
      id: consts.user.cedula,
      name: consts.user.nombre,
      photo: 'https://thumbs.dreamstime.com/b/taxista-14436793.jpg'
    }
    service['position_cabman'] = {
      distance: null,
      time: null,
      latitude: consts.position.latitude,
      longitude: consts.position.longitude
    }
    const { goBack } = this.props.navigation
    consts.socket.emit('acceptCancel', service)
    goBack()
  }

  _keyExtractor (item, index) {
    return item.service.id
  }

  _drawModals () {
    let status = consts.position
    if (status) {
      return (
        <View>
          <PhotoModal
            isVisible={this.state.isVisiblePhoto}
            nameUser={this.state.nameUser}
            uri={this.state.uri}
            hidePhoto={() => { this._hidePhoto() }} />
          <MiniMap
            isVisible={this.state.isVisibleMap}
            hideMap={() => { this._hideMap() }}
            latitudeOrder={this.state.latitudeOrder}
            longitudeOrder={this.state.longitudeOrder} />
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  render () {
    return (
      <Container
        renderMenu
        isMap
        goMap={() => { this.goMap() }}
        onPress={() => { this.logout() }} >
        <View style={styles.enter}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Lista de Servicios</Text>
            <Progress.CircleSnail
              style={[{display: this.state.loading ? 'flex' : 'none'}, styles.loading]}
              size={30}
              color={['#2980b9']}
              strokeCap={'round'}
              animating={this.state.loading} />
          </View>
          <FlatList
            style={styles.list}
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            renderItem={({item, index}) =>
              <Item
                item={item}
                index={index}
                showPhoto={() => { this._showPhoto(item) }}
                hidePhoto={() => { this._hidePhoto() }}
                viewMap={() => { this._viewMap(item) }}
                acceptService={() => { this._acceptService(item) }} />
          } />
          <View style={[{display: this.state.loading ? 'flex' : 'none'}, styles.over]} />
        </View>
        { this._drawModals() }
      </Container>
    )
  }
}
