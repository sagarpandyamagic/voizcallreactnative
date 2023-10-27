/**
 * @format
 */

import { AppRegistry, DeviceEventEmitter, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider, connect } from 'react-redux';
import store from './src/redux/store';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';
import incomingusebyClass, { SoketConnect } from './src/incomingusebyClass';
import skoectcall from './src/skoectbyclass';
import setInitVlaue from './src/setInitVlaue';
import skoectbyclass from './src/skoectbyclass';

setInitVlaue.usedValue()

const firebaseListener = async (remoteMessage) => {
  console.log("remoteMessage", remoteMessage)
  
  // if (type === "CALL_INITIATED") {
  const incomingCallAnswer = ({ callUUID }) => {
    skoectcall.accepctCall()
    RNCallKeep.setCurrentCallActive(callUUID);
  };

  const endIncomingCall = () => {
    skoectbyclass.hangupCall()
    incomingusebyClass.endIncomingcallAnswer();
  };

  incomingusebyClass.configure(incomingCallAnswer, endIncomingCall);
  incomingusebyClass.displayIncomingCall(remoteMessage.from);
  incomingusebyClass.backToForeground();
  // }
};

Platform.OS == "android" && messaging().setBackgroundMessageHandler(firebaseListener);


const appRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
  // Make your call here
  return Promise.resolve();
});

Platform.OS == "android" ? AppRegistry.registerComponent("AwesomeProject", () => appRedux) :  AppRegistry.registerComponent(appName, () => appRedux)
