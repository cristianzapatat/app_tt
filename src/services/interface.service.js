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
