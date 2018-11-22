import { ENV, Constants } from '../util'

const URL_SERVER = ENV.URL.SERVER

export const login = async (userKey, password) => {
    return fetch(`${URL_SERVER}/auth?user=${userKey}&password=${password}`)
}

export const me = async token => {
    const headers = new Headers()
    headers.append(Constants.ENUM.USER_TOKEN, token)
    const init = {
        method: 'GET',
        headers
    }

    return fetch(`${URL_SERVER}/api/v1/me`, init)
}

export const getPhotoCabman = photo => `${URL_SERVER}/${photo}`
