module.exports = {
  time: {
    ZERO: 0,
    MINUTE: 60000, // dato en milisegundos = 1 minuto
    START_NIGHT: 1080, // dato en minutos = 6pm
    MIDDLE_NIGHT: 1440, // dato en minutos = 11:53pm
    END_NIGHT: 360, // dato en minutos = 5am
    FOR_MINUTE: 60
  },
  position: {
    DELTA: 0.015,
    LATITUDE: 3.8804178377998277,
    LONGITUDE: -77.02326726168394
  },
  key: {
    user: 'user_login',
    userToken: 'user_token'
  },
  enum: {
    ERROR: 'error',
    OK: 'ok'
  },
  board: {
    coma: ','
  },
  method: {
    get: 'GET',
    put: 'PUT'
  },
  header: {
    contentType: 'Content-Type',
    multiparFormData: 'multipart/form-data'
  },
  body: {
    currentPassword: 'contrasenia_antigua',
    newPassword: 'contrasenia_nueva',
    repeatPassword: 'confirmacion_contrasenia_nueva'
  },
  platform: {
    android: 'android',
    ios: 'ios'
  },
  socket: {
    serviceInMemory: 'serviceInMemory',
    isServiceInMemory: 'isServiceInMemory',
    receiveService: 'receiveService',
    responseService: 'responseService',
    addServiceCanceled: 'addServiceCanceled',
    acceptService: 'acceptService',
    processService: 'processService',
    savePositionCab: 'savePositionCab',
    deleteService: 'deleteService',
    orderCanceled: 'orderCanceled',
    acceptCancel: 'acceptCancel',
    onMyWay: 'onMyWay'
  },
  event: {
    changeMap: 'changeMap',
    changeState: 'changeState',
    onShow: 'onShow',
    changePosition: 'changePosition',
    showOnMyWay: 'showOnMyWay',
    showOtherAccept: 'showOtherAccept',
    addServiceToday: 'addServiceToday',
    appAcceptCancel: 'appAcceptCancel'
  },
  hardware: {
    backPress: 'hardwareBackPress',
    keyboardDidShow: 'keyboardDidShow',
    keyboardDidHide: 'keyboardDidHide',
    change: 'change',
    background: 'background',
    active: 'active',
    window: 'window',
    tail: 'tail'
  },
  navigation: {
    card: 'card',
    none: 'none',
    initialRouteName: 'initialRouteName'
  },
  main: {
    websocket: 'websocket'
  },
  login: {
    id: 'login'
  },
  app: {
    id: 'app'
  },
  waitingServices: {
    id: 'waitingServices'
  },
  changePassword: {
    id: 'changePassword'
  },
  rechargePoints: {
    id: 'rechargePoints'
  },
  shoppingHistory: {
    id: 'shoppingHistory'
  },
  action: {
    order: 'order',
    accept: 'accept',
    arrive: 'arrive',
    aboard: 'aboard',
    end: 'end'
  },
  json: {
    cabman: 'cabman',
    position_cabman: 'position_cabman',
    ok: 'OK'
  },
  color: {
    inactive: '#B3B3B3',
    active: '#ffaf18',
    black: '#000',
    white: '#FFF'
  },
  help: {
    image: 'https://scontent.feoh3-1.fna.fbcdn.net/v/t1.0-1/p50x50/17903408_1044586812340472_7176591297268243543_n.png?oh=20bc54a7ec0faffce536dfa16eff5388&oe=5AA9803D'
  }
}
