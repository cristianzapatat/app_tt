/* global fetch:true */
/* eslint handle-callback-err: ["error", "error"] */
import React, { Component } from 'react'
import {View, Text, FlatList, TouchableOpacity, PermissionsAndroid} from 'react-native'
import * as Progress from 'react-native-progress'

import styles from '../style/listService.style'
import Container from '../component/container'
import Item from '../component/item'
import PhotoModal from '../component/photoModal'
import MiniMap from '../component/miniMap'
import consts from '../constant/constant'
import fs from '../util/fs'

let idSet
let status = true

export default class ListService extends Component {
  constructor (props) {
    super(props)
    clearInterval(idSet)
    this.state = {
      isVisiblePhoto: false,
      isVisibleMap: false,
      isMap: false,
      nameUser: '',
      uri: null,
      latitudeOrder: 0,
      longitudeOrder: 0,
      loading: true,
      render: false,
      textView: consts.textProcess,
      data: []
    }
    this.state.textView = consts.textProcess
  }

  componentWillMount () {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(granted => {
        if (granted) {
          status = true
          if (consts.position !== null) {
            this.getList()
          } else {
            this.setState({textView: consts.getPositionText})
            this.UpdateView()
          }
        } else {
          this.setState({loading: false, textView: consts.requierePermissions})
        }
      })
  }

  componentWillUnmount () {
    clearInterval(idSet)
    if (status) {
      consts.socket.emit('nextService', consts.user.cedula)
    }
  }

  getList () {
    fetch(`${consts.serverSock}/get_services_canceled/${consts.user.cedula}`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({
          data: json,
          render: true,
          loading: false
        })
      })
  }

  UpdateView () {
    idSet = setInterval(() => {
      if (consts.position !== null) {
        this.setState({textView: consts.textProcess})
        this.getList()
        clearInterval(idSet)
      }
    }, 3000)
  }

  goMap () {
    const { goBack } = this.props.navigation
    goBack()
  }

  logout () {
    clearInterval(idSet)
    status = false
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
      latitudeOrder: item.position_user.latitude,
      longitudeOrder: item.position_user.longitude,
      isVisibleMap: true
    })
  }

  _hideMap () {
    this.setState({
      isVisibleMap: false
    })
  }

  _acceptService (service) {
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
    status = false
    const { goBack } = this.props.navigation
    consts.socket.emit('acceptCancel', service)
    goBack()
  }

  _keyExtractor (item, index) {
    return item.service.id
  }

  _drawList () {
    if (this.state.render) {
      if (this.state.data.length > 0) {
        return (
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
        )
      } else {
        return (
          <View style={styles.empty}>
            <Text style={styles.textEmpty}>No hay servicios pendientes</Text>
            <TouchableOpacity onPressOut={() => { this.goMap() }}>
              <View style={styles.btnBack}>
                <Text style={[styles.back]}>Volver</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      }
    } else {
      return (
        <View style={styles.empty}>
          <Text style={styles.textEmpty}>{this.state.textView}</Text>
          <TouchableOpacity onPressOut={() => { this.goMap() }}>
            <View style={styles.btnBack}>
              <Text style={[styles.back]}>Volver</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }

  _drawModals () {
    if (consts.position !== null) {
      return (
        <View>
          <PhotoModal
            isVisible={this.state.isVisiblePhoto}
            onBack
            nameUser={this.state.nameUser}
            uri={this.state.uri}
            hidePhoto={() => { this._hidePhoto() }} />
          <MiniMap
            isVisible={this.state.isVisibleMap}
            onBack
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
            <Text style={styles.titleText}>Lista de Servicios Cancelados</Text>
            <Progress.CircleSnail
              style={[{display: this.state.loading ? 'flex' : 'none'}, styles.loading]}
              size={30}
              color={['#2980b9']}
              strokeCap={'round'}
              animating={this.state.loading} />
          </View>
          { this._drawList() }
        </View>
        { this._drawModals() }
      </Container>
    )
  }
}
