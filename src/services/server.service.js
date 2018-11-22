import { ENV, Constants } from '../util'

export const login = async (userKey, password) => {
    return fetch(`${ENV.URL.SERVER}/auth?user=${userKey}&password=${password}`)
}

export const me = async token => {
    const headers = new Headers()
    headers.append(Constants.ENUM.USER_TOKEN, token)
    const init = {
        method: 'GET',
        headers
    }

    return fetch(`${ENV.URL.SERVER}/api/v1/me`, init)
}
