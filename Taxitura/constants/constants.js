module.exports = {
  serverSock: 'https://taxitura-server.herokuapp.com',
  loginService: (id, pass) => {
    return `http://www.taxitura.com/auth?user=${id}&password=${pass}`
  },
  apiKeyGeocoder: 'AIzaSyCuixa1UeWyGrleFN_w7ceAJE9oYYmz1lU',
  apiDistanceAndTime: 'AIzaSyCPDys-IZuq1CqhFr6cVEc-rMeT5Z33iKE',
  disconnect: 'Desconetado',
  connect: 'Connectado',
  order: 'order',
  arrive: 'Llegué!',
  colorArrive: '#4edb1d',
  actionArrive: 'arrive',
  endService: 'Llegamos!',
  actionEnd: 'end',
  offGPS: 'Favor encender su GPS',
  deniedGPS: 'Taxitura no cuenta con permisos de GPS',
  deniedAccess: 'acceso_denegado',

  persistenceFile: '/persistence',
  fileLogin: '/login.txt',

  user: null,
  message: null
}
