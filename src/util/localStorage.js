import AsyncStorage from '@react-native-community/async-storage'
import { encrypt, decrypt } from 'react-native-simple-encryption'
import Constants from './constants'

export default class LocalStorage {
    static set (key, value, success = null, error = null) {
        const cipherKey = encrypt(Constants.CHIPER.KEY, key)
        const cipherValue = encrypt(Constants.CHIPER.KEY, value)
        if (success && error) {
            AsyncStorage.setItem(cipherKey, cipherValue, err => {
                if (error) error(err)
                success()
            })
        } else {
            AsyncStorage.setItem(cipherKey, cipherValue)
        }
    }

    static get (key, result, error) {
        const cipherkey = encrypt(Constants.CHIPER.KEY, key)
        AsyncStorage.getItem(cipherkey, (err, res) => {
            if (err) error(err)
            else {
                if (res) result(decrypt(Constants.CHIPER.KEY, res))
                else error('')
            }
        })
    }

    static setObject (key, value, success = null, error = null) {
        const cipherKey = encrypt(Constants.CHIPER.KEY, key)
        const cipherValue = encrypt(Constants.CHIPER.KEY, JSON.stringify(value))
        if (success && error) {
            AsyncStorage.setItem(cipherKey, cipherValue, err => {
                if (error) error(err)
                success()
            })
        } else {
            AsyncStorage.setItem(cipherKey, cipherValue)
        }
    }

    static getObject (key, result, error) {
        const cipherkey = encrypt(Constants.CHIPER.KEY, key)
        AsyncStorage.getItem(cipherkey, (err, res) => {
            if (err) error(err)
            else {
                if (res) result(JSON.parse(decrypt(Constants.CHIPER.KEY, res)))
                else error('')
            }
        })
    }

    static remove (key, success = null, error = null) {
        const cipherKey = encrypt(Constants.CHIPER.KEY, key)
        if (success && error) {
            AsyncStorage.removeItem(cipherKey, err => {
                if (error) error(err)
                success()
            })
        } else {
            AsyncStorage.removeItem(cipherKey)
        }
    }

    static removeAll () {
        AsyncStorage.clear()
    }
}
