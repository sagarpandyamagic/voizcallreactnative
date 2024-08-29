/**
 * @format
 */

import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { AppRegistry, AppState, NativeModules, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider, connect, useSelector } from 'react-redux';
import store from './src/store/store';
import RNCallKeep from "react-native-callkeep";
import SipUA, { getContactTableData } from "./src/services/call/SipUA";
import incomingusebyClass from "./src/services/Callkeep/incomingusebyClass";
import BackgroundTimer from 'react-native-background-timer';
import CallKeepDelegate from "./src/services/Callkeep/CallkeepSeup";
import { setInitTimeValue } from "./src/services/setInitVlaue";
import { updateSipState } from "./src/store/sipSlice";
import { AppStoreData } from "./src/components/utils/UserData";
import { StorageKey } from "./src/HelperClass/Constant";

setInitTimeValue()
const { MyNativeModule } = NativeModules;


const openNativeLayouta = () => {
  if (MyNativeModule) {
    MyNativeModule.openNativeLayout();
  } else {
    console.error('MyNativeModule is not available');
  }
};


const firebaseListener = async (remoteMessage) => {
  // BackgroundTimer.start();
  console.log('Message handled in the foreground!11', remoteMessage);

  await AppStoreData(StorageKey.CallKeepORNot, true);

  // NativeModules.openNotificationService();
  try {
   MyNativeModule.applyFlags()
  }catch (error) {
    console.error('Error calling applyFlags:', error);
  }
  //  openNativeLayouta()
 
  try {
    openNativeLayouta()
   }catch (error) {
     console.error('Error calling applyFlags:', error);
   }
  

  // BackgroundTimer.setTimeout(() => {
  //   openNativeLayouta()
  // }, 2000);

  


  // const incomingCallAnswer = ({ callUUID }) => {
  //   console.log('session accept1->');
  //   SipUA.accepctCall()
  //   RNCallKeep.setCurrentCallActive(callUUID);
  //   // incomingusebyClass.endIncomingcallAnswer(callUUID);
  //   BackgroundTimer.setTimeout(() => {
  //      incomingusebyClass.backToForeground();
  //   },1000);
  // };

  // RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
  //   console.log('Answering call with UUID:', callUUID);
  //   AppState.currentState === 'background' && AppRegistry.runApplication();
  // });

  // const endIncomingCall = () => {
  //   SipUA.hangupCall()
  //   incomingusebyClass.endIncomingcallAnswer();
  // };

  // store.dispatch(updateSipState({ key: "IncomingScrrenOpen", value: false }))

  // // setInitTimeValue();
  // incomingusebyClass.configure(incomingCallAnswer, endIncomingCall);
  // incomingusebyClass.displayIncomingCall(remoteMessage.from);
  // incomingusebyClass.backToForeground();

  //store.dispatch(updateSipState({ key: "IncomingScrrenOpen", value: true }))
  // console.log("ContactName:",getContactTableData(remoteMessage.from))

};

messaging().onMessage(async (remoteMessage) => {

  console.log('Message handled in the foreground!ee', remoteMessage);

  await AppStoreData(StorageKey.CallKeepORNot, true);

  // NativeModules.openNotificationService();
  //  MyNativeModule.applyFlags()
  //  openNativeLayouta()
 
  openNativeLayouta()
  
  // BackgroundTimer.start();
  // console.log('Message handled in the foreground!ee', remoteMessage);

  // const incomingCallAnswer = ({ callUUID }) => {
  //   console.log('session accept1->');
  //   SipUA.accepctCall()
  //   RNCallKeep.setCurrentCallActive(callUUID);

  //   // incomingusebyClass.endIncomingcallAnswer(callUUID);
  //   BackgroundTimer.setTimeout(() => {
  //      incomingusebyClass.backToForeground();
  //   },1000);
  // };

  // // RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
  // //   console.log('Answering call with UUID:', callUUID);
  // //   AppState.currentState === 'background' && AppRegistry.runApplication();
  // // });

  // const endIncomingCall = () => {
  //   SipUA.hangupCall()
  //   incomingusebyClass.endIncomingcallAnswer();
  // };

  // // setInitTimeValue();
  // // store.dispatch(updateSipState({ key: "IncomingScrrenOpen", value: false }))
  //  incomingusebyClass.configure(incomingCallAnswer, endIncomingCall);
  //  incomingusebyClass.displayIncomingCall(remoteMessage.from);
  //  incomingusebyClass.backToForeground();

});

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

AppRegistry.registerComponent(appName, () => appRedux);
