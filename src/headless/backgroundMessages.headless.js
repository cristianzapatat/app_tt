import { Vibration } from 'react-native'
import firebase from 'react-native-firebase'

export default async message => {
    firebase.notifications().removeAllDeliveredNotifications()
    // handle your message
    Vibration.vibrate(500)
    // Build your notification
    const notification = new firebase.notifications.Notification()
        .setTitle(message.data.toke)
        .setBody(message.data.date)
        .setNotificationId('taxitura_notification_id')
        .setSound('notification.mp3')
        .android.setChannelId('taxitura_default_channel')
        .android.setPriority(firebase.notifications.Android.Priority.Max)
        .android.setSmallIcon('notification')
        .android.setColor('#FFAF18')
        .android.setColorized(true)
        .setData(message.data)
        .android.setShowWhen(true)
        .android.setWhen(Date.now())
    // Display the notification

    firebase.notifications().displayNotification(notification);
    console.log('**************************')
    console.log('este es el mensaje')
    console.log(message)
    console.log('**************************')
    
    return Promise.resolve();
}
