module.exports = {
  serverSock: 'https://taxituraserver.herokuapp.com',
  loginService: (id, pass) => {
    return `http://www.taxitura.com/auth?user=${id}&password=${pass}`
  },
  getDirections: (start, end) => { // Google Maps Direcctions API
    return `https://maps.googleapis.com/maps/api/directions/json?origin=
      ${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}
      &key=AIzaSyCdfv97tfARuqVhwIN1p-J-M0CDykFTOw0`
  },
  getDistanceMatrix: (start, end) => { // Google Maps Distance Matrix API
    let startLoc = `${start.latitude},${start.longitude}`
    let endLoc = `${end.latitude},${end.longitude}`
    return `https://maps.googleapis.com/maps/api/distancematrix/json?units=
      imperial&origins=${startLoc}&destinations=${endLoc}
      &key=AIzaSyCPDys-IZuq1CqhFr6cVEc-rMeT5Z33iKE&units=metric`
  },
  apiKeyGeocoding: 'AIzaSyCuixa1UeWyGrleFN_w7ceAJE9oYYmz1lU', // Google Maps Geocodign API
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
  btnClose: 'Cerrar',
  btnAccept: 'Aceptar',

  persistenceFile: '/persistence',
  fileLogin: '/login.txt',

  user: null,
  message: null,
  position: null,
  waitCanceled: false,
  socket: null
}
