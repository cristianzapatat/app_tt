'use strict'

module.exports = {
  getMeters: (meters) => {
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
  }
}
