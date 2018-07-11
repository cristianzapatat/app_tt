/**
 * Libreria de soporte de cambio de estilo de mapa para Android.
 *
 * @providesModule TaxituraChangeMapDesign
 * @author: Cristian Camilo Zapata Torres <cristianzapatat@gmail.com>
 */
'use strict'
import { NativeModules, DeviceEventEmitter } from 'react-native'
let ChangeMap = NativeModules.TaxituraChangeMapDesign

class Change {
    static LISTEN = ChangeMap.LISTEN

    static stop () {
        ChangeMap.stopListen()
        DeviceEventEmitter.removeListener(ChangeMap.LISTEN)
    }

    static active(callBack = Function, activation = Boolean(false)) {
        if (activation) {
            ChangeMap.activeListen()
        }
        DeviceEventEmitter.addListener(ChangeMap.LISTEN, (data) => {
            if (callBack) callBack(data)
          })
    }
}

module.exports =  Change;