/**
 * @format
 */

import messaging from "@react-native-firebase/messaging";
import { AppRegistry, AppState, NativeEventEmitter, NativeModules, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider, connect, useDispatch, useSelector } from 'react-redux';
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
import PushNotification from 'react-native-push-notification';
import { getNameByPhoneNumber } from "./src/HelperClass/ContactNameGetCallTime";

setInitTimeValue()
const { MyNativeModule } = NativeModules;
try {
  const appOpenTime = new Date().getTime();
  store.dispatch(updateSipState({ key: "terminationTime", value: appOpenTime }));
} catch (error) {
  console.error('Error updating SIP state:', error);
}

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('NOTIFICATIONcheck:', notification);
    console.log("ACTION:", JSON.parse(notification.actions));
    const actions = JSON.parse(notification.actions);
    if (actions.includes("Answer")) {
      console.log("Call answered");
      const dispatch = store.dispatch();
      dispatch(updateSipState({ key: "CallScreenOpen", value: true }));
      dispatch(updateSipState({ key: "CallAns", value: false }));
      PushNotification.cancelAllLocalNotifications();
    } else if (actions.includes("Decline")) {
      console.log("Call declined");
      PushNotification.cancelAllLocalNotifications();
    }
  },
  onNotification: (notification) => {
    console.log('Notification received:', notification);
    // Automatically open the app when a notification is received
    console.log("ACTION:", JSON.parse(notification.actions));

    PushNotification.invokeApp(notification);
    const actions = JSON.parse(notification.actions);
    if (actions.includes("Answer")) {
      console.log("Call answered");
    }
  },
  popInitialNotification: true,
  requestPermissions: true,
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

})

PushNotification.createChannel(
  {
    channelId: "call-channel",
    channelName: "Call Notifications",
    channelDescription: "Notifications for incoming calls",
    playSound: true,
    soundName: "default",
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`CreateChannel returned '${created}'`)
);

export const showCallNotification = (callerName) => {
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "call-channel",
    ticker: "Incoming Call",
    autoCancel: true,
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    bigText: `Incoming call from ${callerName}`,
    subText: "Tap to open",
    vibrate: true,
    vibration: 300,
    tag: "incoming_call",
    group: "call",
    ongoing: true,

    /* iOS and Android properties */
    title: "Incoming Call",
    message: callerName,
    playSound: true,
    soundName: "default",
    number: 10,
    actions: JSON.stringify(["Answer", "Decline"]),
  });
};

const NavigateToNativeLayout = (name,phoneNumber) => {
  console.log("NavigateToNativeLayout", name, phoneNumber)
  if (MyNativeModule) {
    const lastOpenTime = store.getState().sip.terminationTime || 0;
    console.log("lastOpenTime", lastOpenTime)
    const CurrntTime  = new Date().getTime();
    console.log("currentTime", CurrntTime)
    if (CurrntTime - lastOpenTime > 2000) { // 5000 milliseconds = 5 seconds
      console.log("NavigateToNativeLayout", "ActiveApp")
      MyNativeModule.openNativeLayout(name,phoneNumber);
    } else {
      console.log("NavigateToNativeLayout", "Terminated")
      MyNativeModule.showSplashScreen();
      store.dispatch(updateSipState({ key: "AppOpenTimeRootChange", value: "TabBar" }));
    }
  } else {
    console.error('MyNativeModule is not available');
  }
};

const applyFlags = () => {
  if (MyNativeModule) {
    MyNativeModule.applyFlags();
  } else {
    console.error('MyNativeModule is not available');
  }
};


const firebaseListener = async (remoteMessage) => {
  BackgroundTimer.start();
  console.log('Message handled in the foreground!11', remoteMessage);
  
  await AppStoreData(StorageKey.CallKeepORNot, true);

  if (AppState.currentState == 'active' || AppState.currentState == 'background') {
    try {
      applyFlags()
    } catch (error) {
      console.error('Error calling applyFlags:', error);
    }
  }

  try {
    NavigateToNativeLayout("Test",remoteMessage.from)
  } catch (error) {
    console.error('Error calling applyFlags:', error);
  }

};

messaging().onMessage(async (remoteMessage) => {
  console.log('Message handled in the foreground!ee', remoteMessage);
  await AppStoreData(StorageKey.CallKeepORNot, true);

  try {
    applyFlags()
  } catch (error) {
    console.error('Error calling applyFlags:', error);
  }

 
  try {
    NavigateToNativeLayout("Test",remoteMessage.from)
  } catch (error) {
    console.error('Error calling applyFlags:', error);
  }
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
