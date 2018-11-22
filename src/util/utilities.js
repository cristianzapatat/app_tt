import Env from './environment'
import Constants from './constants'
import { isInternet as validateInternet } from '../services/interface.service'

const _isEmpty = field => (field === '' || field.length === 0 || field === null || field === undefined)

export const isEmptyMultiple = fields => {
    for (let index = 0; index < fields.length; index++) {
        let bool = _isEmpty(fields[index])
        if (bool) return true
    }

    return false
}

export const isEmpty = _isEmpty

export const isInternet = async () => {
    try {
        const { status } = await validateInternet()

        return status === 200
    } catch (error) {
        return false
    }
}

export const getUrlPhoto = image => {
    return `${Env.URL.SERVER}/${image}`
}

export const getValueText = (value, item = 0, add = 0) => {
    const val = parseInt(value + item) - (add)
    if (val < 0) return '000'
    else if (val < 10) return `00${val}`
    else if (val < 100) return `0${val}`
    else if (val === undefined || val === null || isNaN(val)) return '---'

    return val
}

export const getMeters = meters => {
    if (meters !== null && meters !== undefined && !isNaN(meters)) {
        if (meters < 1000) {
            if (meters === 1) {
                return 'un metro'
            }

            return `${meters} metros`
        } else {
            let value = `${parseFloat(meters / 1000)}`
            let mts = value.split('.')
            let decimal = 0
            if (mts[1] && mts[1].length >= 2) {
                decimal = mts[1].substring(0, 2)
            }

            return `${mts[0]}.${decimal} Km`
        }
    }

    return 'Distacia indefinida'
}

export const getActionOrder = order => {
    if (order && order.action && Constants.STATUS_ORDER[order.action.toUpperCase()]) {
        return order.action.toUpperCase()
    }

    return Constants.STATUS_ORDER.ACCEPT.toUpperCase()
}

export const isActiveBtnCancelService = order => {
    return order && order.action && Constants.STATUS_FOR_CANCEL.includes(order.action)
}