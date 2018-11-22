import Firebase from 'react-native-firebase'

const requestPermission = async () => {
    return Firebase.messaging().requestPermission()
}

export const auth = async () => {
    return Firebase.auth().signInAnonymously()
}

export const hasPermission = async () => {
    const enabled = await Firebase.messaging().hasPermission()
    try {
        if (!enabled) {
            await requestPermission()

            return true
        }

        return enabled
    } catch (error) {
        return false
    }
}

export const getToken = async () => {
    return Firebase.messaging().getToken()
}

export const onTokenRefresh = async () => {
    return Firebase.messaging().onTokenRefresh()
}

export const subscribeToTopic = topic => {
    Firebase.messaging().subscribeToTopic(topic)
}

export const unsubscribeToTopic = topic => {
    Firebase.messaging().unsubscribeFromTopic(topic)
}

export const onMessage = async callBack => {
    Firebase.messaging().onMessage(message => {
        callBack(message)
    })
}

export const onNotificationOpened = async callBack => {
    Firebase.messaging().onNotificationOpened(notification => {
        callBack(notification)
    })
}

export const cancelAllNotifications = () => {
    Firebase.notifications().cancelAllNotifications()
}

export const deleteAllNotifications = () => {
    Firebase.notifications().removeAllDeliveredNotifications()
}
