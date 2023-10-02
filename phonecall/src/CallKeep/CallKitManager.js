import React, { useEffect, useState } from "react";
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
import RNCallKeep from "react-native-callkeep";
import { getUniqueId } from "react-native-device-info";
import { useDispatch, useSelector } from "react-redux";

 const CallKitManager = () => {
    const [logText, setLog] = useState('');
    const [heldCalls, setHeldCalls] = useState({}); // callKeep uuid: held
    const [mutedCalls, setMutedCalls] = useState({}); // callKeep uuid: muted
    const [calls, setCalls] = useState({}); // callKeep uuid: number
  
    const dispatch = useDispatch()
    const { session } = useSelector((state) => state.sip)
  
  
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
  
    const displayIncomingCallNow = (subtitle) => {
      // displayIncomingCall(getRandomNumber());
      displayIncomingCall(subtitle);
    };
  
    const displayIncomingCallDelayed = () => {
      BackgroundTimer.setTimeout(() => {
        displayIncomingCall(getRandomNumber());
      }, 3000);
    };
  
    const answerCall = ({ callUUID }) => {
      const number = calls[callUUID];
      console.log("answerCall");
  
      log(`[answerCall] ${format(callUUID)}, number: ${number}`);
  
      // RNCallKeep.startCall(callUUID, number, number);
      RNCallKeep.startCall(callUUID, "1234561234", "1234561234");
  
      BackgroundTimer.setTimeout(() => {
        log(`[setCurrentCallActive] ${format(callUUID)}, number: ${number}`);
        RNCallKeep.setCurrentCallActive(callUUID);
        dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
        dispatch(updateSipState({ key: "incomingcall", value: false }))
      }, 1000);
    };
  
    const didPerformDTMFAction = ({ callUUID, digits }) => {
      const number = calls[callUUID];
      console.log(`[didPerformDTMFAction] ${format(callUUID)}, number: ${number} (${digits})`);
    };
  
    const didReceiveStartCallAction = ({ handle }) => {
      console.log("startCall........")
  
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
        console.log("setCurrentCallActive")
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
      console.log("when receive remote voip push title", notification.aps.alert.title)
      console.log("when receive remote voip push subtitle", notification.aps.alert.subtitle)
      console.log("when receive remote voip push body", notification.aps.alert.body)
  
      displayIncomingCallNow(notification.aps.alert.subtitle)
      
      // displayIncomingCallNow(notification.aps.alert.subtitle)
  
      // RNCallKeep.displayIncomingCall(getNewUuid(), notification.aps.alert.subtitle, notification.aps.alert.subtitle, 'number', false);
  
      // --- when receive remote voip push, register your VoIP client, show local notification ... etc
      // this.doSomething();
      // connect()
  
      // --- optionally, if you `addCompletionHandler` from the native side, once you have done the js jobs to initiate a call, call `completion()`
      VoipPushNotification.onVoipNotificationCompleted(getUniqueId());
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
        PushNotification.requestPermissions();
        console.log("Received")
    
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
      }, [])
  
}

export default CallKitManager;