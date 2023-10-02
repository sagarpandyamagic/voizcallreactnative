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
import { NavigationContainer } from '@react-navigation/native';
import TabBar from './src/TabBar';
import ContactDetailScreen from './src/ContactScreen/ContactDetailScreen';
import BlockContact from './src/BlockContact';
import ContactsList from './src/ContactScreen/ContactsList';
import { CallTimerDuraionProvider } from './src/CallTimer';
import uuid from 'uuid';
import RNCallKeep from 'react-native-callkeep';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from "react-native-push-notification";
import VoipPushNotification from 'react-native-voip-push-notification';
import usecreateUA from './src/hook/usecreateUA';
import { useDispatch, useSelector } from 'react-redux';
import { updateSipState } from './src/redux/sipSlice';
import CallLogDetails from './src/CallLog/CallLogDetails';
import LoginWithOTP from './src/Login/LoginWithOTP';
import SplashScreen from './src/SplashScreen/SplashScreen';
import ForgotPassword from './src/Login/ForgotPassword';
import IncomingCall from './src/IncomingCall';
import CallScreen from './src/CallScreen';
import HomeScreen from './src/Login/HomeScreen';
import { Notifications } from 'react-native-notifications';
import { useNavigation } from '@react-navigation/native';


BackgroundTimer.start();

const hitSlop = { top: 10, left: 10, right: 10, bottom: 10 };



function setupCallKeep() {
  const options = {
    android: {
      alertTitle: 'Permissions Required',
      alertDescription:
        'This application needs to access your phone calling accounts to make calls',
      cancelButton: 'Cancel',
      okButton: 'ok',
      imageName: 'ic_launcher',
      // additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
    },
  };

  try {
    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true); // Only used for Android, see doc above.
  } catch (err) {
    console.error('initializeCallKeep error:', err.message);
  }
}

setupCallKeep();

const getNewUuid = () => "cb499f3e-1521-4467-a51b-ceea76ee92b6"

const format = uuid => uuid.split('-')[0];

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

const isIOS = Platform.OS === 'ios';

console.log("uuid", uuid)

const useLogger = (moduleName) => {
  const info = (message, data = {}) => {
    console.log(`[${moduleName}] INFO: ${message}`, data);
  };

  const error = (message, data = {}) => {
    console.error(`[${moduleName}] ERROR: ${message}`, data);
  };

  return { info, error };
};

function App() {
  const logger = useLogger('CallKeep');
  const dispatch = useDispatch()
  const { connect, makeCall ,Callhangup} = usecreateUA()

  const answerCall = ({ callUUID }) => {
    logger.info("Call recieved, answering call...")
    // AsyncStorage.setItem('currentCallUUID', callUUID);
    try {
      logger.info("Starting Callkeep call")
      RNCallKeep.startCall(callUUID, '7728733596', "7728733596", 'number', false);
      logger.info("Call started successfully")
    } catch (e) {
      logger.error("Failed to start callkeep call")
    }

    setTimeout(() => {
      logger.info("Setting current active call...")
      try {
        RNCallKeep.setCurrentCallActive(callUUID);
        dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
        dispatch(updateSipState({ key: "incomingcall", value: false }))
        logger.info("Current active call set");
      } catch (e) {
        logger.error("Failed to set current call", { error: e });
      }
    }, 1000);
    logger.info("Call started successfully, setting active call")


    // On Android display the app when answering a video call
    if (!isIOS) {
      console.log('bringing app to foreground');
      RNCallKeep.backToForeground();
    }

    logger.info("Setting current call UUID")
    // dispatch(setCurrentCallUUID(callUUID))

    logger.info("Navigating to call screen")


  };

  const endCall = ({ callUUID }) => {
    logger.info("Ending call")
    logger.info("Test Ending call")

    try {
      // dispatch(endCallWithUUID(callUUID));
      dispatch(updateSipState({ key: "CallkeepCall", value: true }))
      RNCallKeep.endAllCalls();
      logger.info("Call ended")
    } catch (e) {
      logger.error("Failed to end call", { error: e })
    }
  };

  const didDisplayIncomingCall = async ({ callUUID, payload, handle, }) => {
    try {
      logger.info('Recieved call with data', { payload, callUUID, handle });
      // dispatch(
      //   startVideoChatWithouActivating({
      //     token: payload.token,
      //     room_name: payload.room_name,
      //     call_id: payload.call_id,
      //     friend: payload.friend,
      //     callUUID,
      //     call_uuid: callUUID,
      //     // location: JSON.parse(data.location ?? '{}'),
      //   })
      // );
      logger.info('Call displayed with data', { payload, callUUID, handle });
    } catch (e) {
      logger.error('Failed to save call data', { payload, callUUID, handle });
    }
  }

  const handlePreJSEvents = (events) => {
    logger.info('PreJS events', { events });
    for (let event of events) {
      if (event.name == "RNCallKeepDidDisplayIncomingCall") {
        logger.info('PreJS events: didDisplayIncomingCall', { event });
        didDisplayIncomingCall(event.data)
      } else if (event.name == 'RNCallKeepAnswerCall') {
        logger.info('PreJS events: answerCall', { event });
        answerCall(event.data)
      } else if (event.name == 'RNCallKeepEndCall') {
        logger.info('PreJS events: endCall', { event });
        endCall(event.data)
      }
    }
  }

  const initializeCallKeep = () => {
    connect()
    setTimeout(() => {
      try {
        logger.info('Call keep initiated successfully');
        RNCallKeep.setAvailable(true);
  
        RNCallKeep.addEventListener('answerCall', answerCall);
        RNCallKeep.addEventListener('didReceiveStartCallAction', answerCall);
        RNCallKeep.addEventListener('endCall', endCall);
        RNCallKeep.addEventListener('didDisplayIncomingCall', didDisplayIncomingCall);
        
        if (isIOS) {
          RNCallKeep.addEventListener('didLoadWithEvents', handlePreJSEvents);
        }
      } catch (err) {
        logger.error('Failed to initialize call keep', {
          error: err,
          msg: err.message,
        });
        console.error('initializeCallKeep error:', err.message);
      }
    }, 2000);
   
  };

  useEffect(() => {
    initializeCallKeep();

    VoipPushNotification.addEventListener('register', (token) => {
      // --- send token to your apn provider server
      console.log("register", token)
    });

    // ===== Step 2: subscribe `notification` event =====
    // --- this.onVoipPushNotificationiReceived
    VoipPushNotification.addEventListener('notification', (notification) => {
      console.log("when receive remote voip push title", notification.aps.alert.title)
      console.log("when receive remote voip push subtitle", notification.aps.alert.subtitle)
      console.log("when receive remote voip push body", notification.aps.alert.body)

      connect()
      // displayIncomingCallNow(notification.aps.alert.subtitle)

      // --- optionally, if you `addCompletionHandler` from the native side, once you have done the js jobs to initiate a call, call `completion()`
      VoipPushNotification.onVoipNotificationCompleted(getNewUuid());
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
          //  onVoipPushNotificationRegistered(data);
        } else if (name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent) {
          // onVoipPushNotificationiReceived(data);
          console.log("name", name)
        }
      }
    });


    

    return () => {
      RNCallKeep.removeEventListener('answerCall', answerCall);
      RNCallKeep.removeEventListener('didReceiveStartCallAction', answerCall);
      RNCallKeep.removeEventListener('endCall', endCall);
      RNCallKeep.removeEventListener('didDisplayIncomingCall', didDisplayIncomingCall);
      if (isIOS) {
        RNCallKeep.removeEventListener('didLoadWithEvents', handlePreJSEvents);
      }
    };
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
        <View>
          <IncomingCall />
        </View>
        <View>
          <CallScreen />
        </View>

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
