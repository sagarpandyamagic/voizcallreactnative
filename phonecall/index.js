/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { Provider } from 'react-redux';
import store from './src/redux/store';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";



// AppRegistry.registerComponent(appName, () => App);

const appRedux = ()=>(
    <Provider store={store}>
        <App/>
    </Provider>
)


  
AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
    // Make your call here
    
    return Promise.resolve();
  });
  
AppRegistry.registerComponent(appName, () => appRedux);
