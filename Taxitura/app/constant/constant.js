let urlService = 'http://www.taxitura.com'
let keyDirections = 'AIzaSyCdfv97tfARuqVhwIN1p-J-M0CDykFTOw0' // Google Maps Direcctions API
let keyDistanceMatrix = 'AIzaSyCPDys-IZuq1CqhFr6cVEc-rMeT5Z33iKE' // Google Maps Distance Matrix API
let keyGeocoding = 'AIzaSyCuixa1UeWyGrleFN_w7ceAJE9oYYmz1lU' // Google Maps Geocodign API

module.exports = {
  keyDirections,
  keyDistanceMatrix,
  keyGeocoding,
  serverSock: 'https://taxituraserver.herokuapp.com',
  meService: `${urlService}/api/v1/me`,
  loginService: (id, pass) => {
    return `${urlService}/auth?user=${id}&password=${pass}`
  },
  updatePasswordService: (id) => {
    return `${urlService}/api/v1/password_update/${id}`
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
  getUrlPhoto: (url) => {
    return `${urlService}${url}`
  },
  order: 'order',
  actionEnd: 'end',
  actionArrive: 'arrive',

  arrive: 'Llegué!',
  endService: 'Llegamos!',
  offGPS: 'Favor encender su GPS',
  deniedGPS: 'Taxitura no cuenta con permisos de GPS',
  getPositionText: 'Obteniendo posición',
  requierePermissions: 'Taxitura requiere permisos de ubicación.',
  causedBlock: 'Debido a que se bloqueó la ventana de permisos el proceso debe ser manual',
  btnGoSettings: 'Ir a proceso manual',
  textProcess: 'Procesando',
  password: 'Contraseña actual',
  newPassword: 'Contraseña nueva',
  repeatNewpassword: 'Repetir constraseña nueva',
  errorNewPassword: 'La nueva contraseña debe coincidir cuando se repite',
  btnClose: 'Cerrar',
  btnAccept: 'Aceptar',
  btnUpdate: 'Actualizar',

  persistenceFile: '/persistence',
  fileLogin: '/login.txt',

  user: null,
  message: null,
  position: null,
  waitCanceled: false,
  socket: null
}
