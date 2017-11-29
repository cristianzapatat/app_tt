let urlServer = 'http://www.taxitura.com' // Url del servidor
let urlInterface = 'https://taxituraserver.herokuapp.com' // Url de la intefaz o mediador
let keyDirections = 'AIzaSyCdfv97tfARuqVhwIN1p-J-M0CDykFTOw0' // Google Maps Direcctions API
let keyDistanceMatrix = 'AIzaSyCPDys-IZuq1CqhFr6cVEc-rMeT5Z33iKE' // Google Maps Distance Matrix API
let keyGeocoding = 'AIzaSyCuixa1UeWyGrleFN_w7ceAJE9oYYmz1lU' // Google Maps Geocodign API

module.exports = {
  urlServer,
  urlInterface,
  keyDirections,
  keyDistanceMatrix,
  keyGeocoding,
  meService: `${urlServer}/api/v1/me`,
  loginService: (id, pass) => {
    return `${urlServer}/auth?user=${id}&password=${pass}`
  },
  updatePasswordService: (id) => {
    return `${urlServer}/api/v1/password_update/${id}`
  },
  getDirections: (start, end) => { // Google Maps Direcctions API
    return `https://maps.googleapis.com/maps/api/directions/json?origin=
      ${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}
      &key=${keyDirections}`
  },
  getDistanceMatrix: (start, end) => { // Google Maps Distance Matrix API
    let startLoc = `${start.latitude},${start.longitude}`
    let endLoc = `${end.latitude},${end.longitude}`
    return `https://maps.googleapis.com/maps/api/distancematrix/json?units=
      imperial&origins=${startLoc}&destinations=${endLoc}
      &key=${keyDistanceMatrix}&units=metric`
  },
  getGeocoding: (pos) => { // Google Api obtener dirección
    return `https://maps.google.com/maps/api/geocode/json?
      key=${keyGeocoding}&latlng=${encodeURI(`${pos.latitude},${pos.longitude}`)}`
  },
  getUrlPhoto: (url) => { // url de la foto de los taxistas
    return `${urlServer}${url}`
  },
  getListWaitingServices: (id) => {
    return `${urlInterface}/get_services_canceled/${id}`
  }
}
