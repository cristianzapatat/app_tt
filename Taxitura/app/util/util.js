module.exports = {
  getMeters: (meters) => {
    if (meters !== null && meters !== undefined) {
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
