import { AppRegistry } from 'react-native'
import App from './src/app'
import { name as appName } from './app.json'

import BackgroundMessages from './src/headless/backgroundMessages.headless'

AppRegistry.registerComponent(appName, () => App)

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => BackgroundMessages)
