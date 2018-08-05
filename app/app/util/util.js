/* global fetch:true */
import kts from './kts'
import text from './text'
import urls from './urls'

module.exports = {
  isInternet: async () => {
    try {
      let json = await fetch(urls.isInternet)
      let status = await json.json()
      if (status.status) return true
      return false
    } catch (err) {
      return false
    }
  },
  getValueText: (value, item = 0, add = 0) => {
    let val = parseInt(value + item) - (add)
    if (val < 0) return '000'
    else if (val < 10) return `00${val}`
    else if (val < 100) return `0${val}`
    else if (val === undefined || val === null || isNaN(val)) return '---'
    return val
  },
  getAction: (action) => {
    if (!action) return kts.action.accept
    if (action === kts.action.accept) return kts.action.arrive
    if (action === kts.action.arrive) return kts.action.aboard
    if (action === kts.action.aboard) return kts.action.end
  },
  getTextButton: (action) => {
    if (!action) return text.app.label.iArrived
    if (action === kts.action.accept) return text.app.label.iArrived
    if (action === kts.action.arrive) return text.app.label.aboard
    if (action === kts.action.aboard) return text.app.label.weArrived
  },
  getIsMap: () => {
    let date = new Date()
    if (date.getHours() >= 5 && date.getHours() < 18) {
      return true
    }
    return false
  },
  getDateFormat: (value) => {
    let date = new Date(value)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  },
  getTextServiceCommission: (item) => {
    let cantSer = parseInt(item.cantidad_de_carreras)
    if (isNaN(cantSer)) cantSer = 0
    let cantComm = parseInt(parseInt(item.ganancia_taxista) / parseInt(item.valor_de_carrera))
    if (isNaN(cantComm)) cantComm = 0
    return `${cantSer} ${text.item.label.services} ${text.item.label.symbolMore} ${cantComm} ${text.item.label.commission}`
  },
  separatorComa: (value) => {
    let num = value.replace(/\./g, '')
    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1,')
    num = num.split('').reverse().join('').replace(/^[\\.]/, '')
    return num
  },
  getMeters: (meters) => {
    if (meters !== null && meters !== undefined && !isNaN(meters)) {
      if (meters < 1000) {
        if (meters === 1) {
          return `un metro`
        }
        return `${meters} metros`
      } else {
        let value = `${parseFloat(meters / 1000)}`
        let mts = value.split('.')
        return `${mts[0]}.${mts[1].substring(0, 2)} Km`
      }
    } else {
      return `Distacia indefinida`
    }
  },
  decode: (str, precision) => {
    let index = 0
    let lat = 0
    let lng = 0
    let coordinates = []
    let shift = 0
    let result = 0
    let byte = null
    let latitudeChange
    let longitudeChange
    let factor = Math.pow(10, precision || 5)

    while (index < str.length) {
      byte = null
      shift = 0
      result = 0
      do {
        byte = str.charCodeAt(index++) - 63
        result |= (byte & 0x1f) << shift
        shift += 5
      } while (byte >= 0x20)

      latitudeChange = ((result & 1) ? ~(result >> 1) : (result >> 1))
      shift = result = 0
      do {
        byte = str.charCodeAt(index++) - 63
        result |= (byte & 0x1f) << shift
        shift += 5
      } while (byte >= 0x20)

      longitudeChange = ((result & 1) ? ~(result >> 1) : (result >> 1))

      lat += latitudeChange
      lng += longitudeChange
      coordinates.push([lat / factor, lng / factor])
    }
    return coordinates
  }
}
