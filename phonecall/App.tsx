/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/HomeScreen';
import ForgotPassword from './src/ForgotPassword';
import { NavigationContainer } from '@react-navigation/native';
import TabBar from './src/TabBar';
import LoginWithOTP from './src/LoginWithOTP';
import ContactDetailScreen from './src/ContactScreen/ContactDetailScreen';
import BlockContact from './src/BlockContact';
import ContactsList from './src/ContactScreen/ContactsList';
import { CallTimerDuraionProvider } from './src/CallTimer';
import CallLogDetails from './src/CallLogDetails';
import CallLogs from './src/CallLogs';
import uuid from 'uuid';
import RNCallKeep from 'react-native-callkeep';
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import VoipPushNotification from 'react-native-voip-push-notification';
import NotifService from './src/NotifService';
import usecreateUA from './src/hook/usecreateUA';
import { useDispatch } from 'react-redux';
import { updateSipState } from './src/redux/sipSlice';
import { LoginUserExist } from './src/redux/LoginDateStore';
import SplashScreen from './src/SplashScreen';
import AddNewContact from './src/AddNewContact';


BackgroundTimer.start();

const hitSlop = { top: 10, left: 10, right: 10, bottom: 10 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
  callButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    width: '100%',
  },
  logContainer: {
    flex: 3,
    width: '100%',
    backgroundColor: '#D9D9D9',
  },
  log: {
    fontSize: 10,
  }
});

RNCallKeep.setup({
  ios: {
    appName: 'CallKeepDemo',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
  },
});

const getNewUuid = () => "cb499f3e-1521-4467-a51b-ceea76ee92b6"

const format = uuid => uuid.split('-')[0];

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

const isIOS = Platform.OS === 'ios';

console.log("uuid", uuid)

function App() {
  const [logText, setLog] = useState('');
  const [heldCalls, setHeldCalls] = useState({}); // callKeep uuid: held
  const [mutedCalls, setMutedCalls] = useState({}); // callKeep uuid: muted
  const [calls, setCalls] = useState({}); // callKeep uuid: number

  const dispatch = useDispatch()



  const log = (text) => {
    console.info(text);
    setLog(logText + "\n" + text);
  };

  const addCall = (callUUID, number) => {
    setHeldCalls({ ...heldCalls, [callUUID]: false });
    setCalls({ ...calls, [callUUID]: number });
  };

  const removeCall = (callUUID) => {
    const { [callUUID]: _, ...updated } = calls;
    const { [callUUID]: __, ...updatedHeldCalls } = heldCalls;

    setCalls(updated);
    setHeldCalls(updatedHeldCalls);
  };

  const setCallHeld = (callUUID, held) => {
    setHeldCalls({ ...heldCalls, [callUUID]: held });
  };

  const setCallMuted = (callUUID, muted) => {
    setMutedCalls({ ...mutedCalls, [callUUID]: muted });
  };

  const displayIncomingCall = (number) => {
    const callUUID = getNewUuid();
    addCall(callUUID, number);

    log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);

    RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
  };

  const displayIncomingCallNow = () => {
    displayIncomingCall(getRandomNumber());
  };

  const displayIncomingCallDelayed = () => {
    BackgroundTimer.setTimeout(() => {
      displayIncomingCall(getRandomNumber());
    }, 3000);
  };

  const answerCall = ({ callUUID }) => {
    const number = calls[callUUID];
    log(`[answerCall] ${format(callUUID)}, number: ${number}`);

    RNCallKeep.startCall(callUUID, number, number);

    BackgroundTimer.setTimeout(() => {
      log(`[setCurrentCallActive] ${format(callUUID)}, number: ${number}`);
      RNCallKeep.setCurrentCallActive(callUUID);
    }, 1000);
  };

  const didPerformDTMFAction = ({ callUUID, digits }) => {
    const number = calls[callUUID];
    log(`[didPerformDTMFAction] ${format(callUUID)}, number: ${number} (${digits})`);
  };

  const didReceiveStartCallAction = ({ handle }) => {
    if (!handle) {
      // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
      return;
    }
    const callUUID = getNewUuid();
    addCall(callUUID, handle);

    log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);

    RNCallKeep.startCall(callUUID, handle, handle);

    BackgroundTimer.setTimeout(() => {
      log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
      RNCallKeep.setCurrentCallActive(callUUID);
    }, 1000);
  };

  const didPerformSetMutedCallAction = ({ muted, callUUID }) => {
    const number = calls[callUUID];
    log(`[didPerformSetMutedCallAction] ${format(callUUID)}, number: ${number} (${muted})`);

    setCallMuted(callUUID, muted);
  };

  const didToggleHoldCallAction = ({ hold, callUUID }) => {
    const number = calls[callUUID];
    log(`[didToggleHoldCallAction] ${format(callUUID)}, number: ${number} (${hold})`);

    setCallHeld(callUUID, hold);
  };

  const endCall = ({ callUUID }) => {
    const handle = calls[callUUID];
    log(`[endCall] ${format(callUUID)}, number: ${handle}`);

    removeCall(callUUID);
  };

  const hangup = (callUUID) => {
    RNCallKeep.endCall(callUUID);
    removeCall(callUUID);
  };

  const setOnHold = (callUUID, held) => {
    const handle = calls[callUUID];
    RNCallKeep.setOnHold(callUUID, held);
    log(`[setOnHold: ${held}] ${format(callUUID)}, number: ${handle}`);

    setCallHeld(callUUID, held);
  };

  const setOnMute = (callUUID, muted) => {
    const handle = calls[callUUID];
    RNCallKeep.setMutedCall(callUUID, muted);
    log(`[setMutedCall: ${muted}] ${format(callUUID)}, number: ${handle}`);

    setCallMuted(callUUID, muted);
  };

  const updateDisplay = (callUUID) => {
    const number = calls[callUUID];
    // Workaround because Android doesn't display well displayName, se we have to switch ...
    if (isIOS) {
      RNCallKeep.updateDisplay(callUUID, 'New Name', number);
    } else {
      RNCallKeep.updateDisplay(callUUID, number, 'New Name');
    }

    log(`[updateDisplay: ${number}] ${format(callUUID)}`);
  };

  const state = {}
  let onRegister = []
  let onNotif = []

  const { connect } = usecreateUA()


  VoipPushNotification.addEventListener('register', (token) => {
    // --- send token to your apn provider server
    console.log("register", token)
  });

  // ===== Step 2: subscribe `notification` event =====
  // --- this.onVoipPushNotificationiReceived
  VoipPushNotification.addEventListener('notification', (notification) => {
    console.log("when receive remote voip push", notification)

    displayIncomingCallNow()

    // --- when receive remote voip push, register your VoIP client, show local notification ... etc
    // this.doSomething();

    // --- optionally, if you `addCompletionHandler` from the native side, once you have done the js jobs to initiate a call, call `completion()`
    // VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
  });

  // ===== Step 3: subscribe `didLoadWithEvents` event =====
  VoipPushNotification.addEventListener('didLoadWithEvents', (events) => {
    console.log("didLoadWithEvents", events)
    // displayIncomingCallNow()
    // --- this will fire when there are events occured before js bridge initialized
    // --- use this event to execute your event handler manually by event type

    if (!events || !Array.isArray(events) || events.length < 1) {
      return;
    }
    for (let voipPushEvent of events) {
      let { name, data } = voipPushEvent;
      if (name === VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent) {
        console.log("name", name)
        // onVoipPushNotificationRegistered(data);
      } else if (name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent) {
        // onVoipPushNotificationiReceived(data);
        console.log("name", name)
      }
    }
  });

  // ===== Step 4: register =====
  // --- it will be no-op if you have subscribed before (like in native side)
  // --- but will fire `register` event if we have latest cahced voip token ( it may be empty if no token at all )
  VoipPushNotification.registerVoipToken(); // --- register token
  
  useEffect(() => {
    // PushNotification.requestPermissions();
    console.log("Received")

    // setUser( )
    RNCallKeep.addEventListener('answerCall', answerCall);
    RNCallKeep.addEventListener('didPerformDTMFAction', didPerformDTMFAction);
    RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
    RNCallKeep.addEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
    RNCallKeep.addEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
    RNCallKeep.addEventListener('endCall', endCall);

    return () => {
      RNCallKeep.removeEventListener('answerCall', answerCall);
      RNCallKeep.removeEventListener('didPerformDTMFAction', didPerformDTMFAction);
      RNCallKeep.removeEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
      RNCallKeep.removeEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
      RNCallKeep.removeEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
      RNCallKeep.removeEventListener('endCall', endCall);
    }
  }, []);

  const Stack = createStackNavigator();
  return (

    <NavigationContainer>
      <CallTimerDuraionProvider>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="SplashScreen" component={SplashScreen} />
          <Stack.Screen
            name="TabBar"
            component={TabBar}
            options={{ headerShown: false }} />

          <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
          <Stack.Screen options={{ headerShown: false }} name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen options={{ headerShown: false }} name="LoginWithOTP" component={LoginWithOTP} />
          <Stack.Screen options={{ headerShown: true, title: 'Contact Detail' }} name="ContactDetailScreen" component={ContactDetailScreen} />
          <Stack.Screen options={{ title: 'Contact' }} name="ContactsAddConfrence" component={ContactsList} />
          <Stack.Screen options={{ headerShown: true, title: 'Block Contact' }} name="BlockContact" component={BlockContact} />
          <Stack.Screen options={{ headerShown: true, title: 'CallLogDetails' }} name="CallLogDetails" component={CallLogDetails} />
        </Stack.Navigator>
      </CallTimerDuraionProvider>
    </NavigationContainer>

    //   <View style={styles.container}>
    //   <TouchableOpacity onPress={displayIncomingCallNow} style={styles.button} hitSlop={hitSlop}>
    //     <Text>Display incoming call now</Text>
    //   </TouchableOpacity>

    //   <TouchableOpacity onPress={displayIncomingCallDelayed} style={styles.button} hitSlop={hitSlop}>
    //     <Text>Display incoming call now in 3s</Text>
    //   </TouchableOpacity>

    //   {Object.keys(calls).map(callUUID => (
    //     <View key={callUUID} style={styles.callButtons}>
    //       <TouchableOpacity
    //         onPress={() => setOnHold(callUUID, !heldCalls[callUUID])}
    //         style={styles.button}
    //         hitSlop={hitSlop}
    //       >
    //         <Text>{heldCalls[callUUID] ? 'Unhold' : 'Hold'} {calls[callUUID]}</Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity
    //         onPress={() => updateDisplay(callUUID)}
    //         style={styles.button}
    //         hitSlop={hitSlop}
    //       >
    //         <Text>Update display</Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity
    //         onPress={() => setOnMute(callUUID, !mutedCalls[callUUID])}
    //         style={styles.button}
    //         hitSlop={hitSlop}
    //       >
    //         <Text>{mutedCalls[callUUID] ? 'Unmute' : 'Mute'} {calls[callUUID]}</Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity onPress={() => hangup(callUUID)} style={styles.button} hitSlop={hitSlop}>
    //         <Text>Hangup {calls[callUUID]}</Text>
    //       </TouchableOpacity>
    //     </View>
    //   ))}

    //   <ScrollView style={styles.logContainer}>
    //     <Text style={styles.log}>
    //       {logText}
    //     </Text>
    //   </ScrollView>
    // </View>
  );
}

export default App;
