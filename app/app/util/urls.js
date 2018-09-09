let urlServer = 'https://taxituraapi.herokuapp.com'
let urlInterface = 'http://192.168.1.53:3001'
let keyDirections = 'AIzaSyCopllJ-78HCuKxGQZA64EtHrFC8rKGRGs' // Google Maps Direcctions API
let keyDistanceMatrix = 'AIzaSyCANmSq518IoL2OU_Itx-U6qgy1sPN2Q1c' // Google Maps Distance Matrix API

module.exports = {
    urlServer,
    serverHelp: `${urlServer}/#QUESTIONS`,
    urlInterface,
    keyDirections,
    keyDistanceMatrix,
    isInternet: `${urlInterface}/isInternet`,
    meService: `${urlServer}/api/v1/me`,
    loginService: (id, pass) => {
        return `${urlServer}/auth?user=${id}&password=${pass}`
    },
    logoutService: `${urlServer}/api/v1/logout`,
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
    getUrlPhoto: (url) => { // url de la foto de los taxistas
        return `${urlServer}${url}`
    },
    getListWaitingServices: (id) => {
        return `${urlInterface}/get_services_canceled/${id}`
    },
    getShoppingHistory: (id) => {
        return `${urlServer}/api/v1/recharges?user_id=${id}`
    },
    getRechargePoints: () => {
        return `${urlServer}/api/v1/recharge_homes`
    },
    getCantServiceFact: (id) => `${urlInterface}/service_fact_today/${id}`
}
