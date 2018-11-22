import { ENV, Constants } from '../util'

const URL_INTERFACE = ENV.URL.INTERFACE
const PATH_INTERFACE = `${URL_INTERFACE}/interface`

export const isInternet = async () => {
    return fetch(URL_INTERFACE)
}

export const servicesPerformedToday = async idCab => {
    const headers = new Headers()
    headers.append(Constants.ENUM.AUTHORIZATION, 'Bearer token')
    const init = {
        method: 'GET',
        headers
    }

    return fetch(`${PATH_INTERFACE}/service/finished-today/${idCab}/driver`, init)
}

export const getDistanceMatrix = async ({ latitude: lat, longitude: long }, { latitude, longitude }) => {
    const headers = new Headers()
    headers.append(Constants.ENUM.AUTHORIZATION, 'Bearer token')
    const init = {
        method: 'GET',
        headers
    }
    const locationCabman = `${lat}/${long}`
    const locationUser = `${latitude}/${longitude}`

    return fetch(`${PATH_INTERFACE}/util/calculate-distance/${locationCabman}/${locationUser}`, init)
}

export const getRouteToPoint = async ({ latitude: lat, longitude: long }, { latitude, longitude }) => {
    const headers = new Headers()
    headers.append(Constants.ENUM.AUTHORIZATION, 'Bearer token')
    const init = {
        method: 'GET',
        headers
    }
    const locationCabman = `${lat}/${long}`
    const locationUser = `${latitude}/${longitude}`

    return fetch(`${PATH_INTERFACE}/util/route/${locationCabman}/${locationUser}`, init)
}

export const updateAction = async order => {
    const init = {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
            'authorization': 'Bearer token',
            'content-type': 'application/json'
        }
    }

    return fetch(`${PATH_INTERFACE}/service/update-action`, init)
}

export const cancelOrder = async order => {
    const init = {
        method: 'DELETE',
        headers: {
            'authorization': 'Bearer token',
            'content-type': 'application/json'
        }
    }

    return fetch(`${PATH_INTERFACE}/service/cancel/${order.service.id}/cab`, init)
}

export const getServiceCurrent = cabmanId => {
    const headers = new Headers()
    headers.append(Constants.ENUM.AUTHORIZATION, 'Bearer token')
    const init = {
        method: 'GET',
        headers
    }

    return fetch(`${PATH_INTERFACE}/service/last-service/${cabmanId}/driver`, init)
}
