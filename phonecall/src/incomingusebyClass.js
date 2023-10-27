import { Platform } from "react-native";
import RNCallKeep from "react-native-callkeep";
// import uuid from 'uuid';
import VoipPushNotification from "react-native-voip-push-notification";
import { Registerer, RegistererState, UserAgent } from "sip.js";
import { mediaDevices } from "react-native-webrtc";
import skoectbyclass from "./skoectbyclass";
import uuid from 'react-native-uuid';

class IncomingCall {
  constructor() {
    this.currentCallId = null;
  }

  configure = (incomingcallAnswer, endIncomingCall) => {
    try {
      this.setupCallKeep();
      Platform.OS === "android" && RNCallKeep.setAvailable(true);
      RNCallKeep.addEventListener("answerCall", incomingcallAnswer);
      RNCallKeep.addEventListener("endCall", endIncomingCall);
    } catch (error) {
      console.error("initializeCallKeep error:", error?.message);
    }
  };

  configureendcall = (endIncomingCall) => {
    try {
      Platform.OS === "android" && RNCallKeep.setAvailable(true);
      RNCallKeep.addEventListener("endCall", endIncomingCall);
    } catch (error) {
      console.error("initializeCallKeep error:", error?.message);
    }
  };

  setupCallKeep = () => {
    try {
      RNCallKeep.setup({
        ios: {
          appName: "My app name",
          supportsVideo: false,
          maximumCallGroups: "1",
          maximumCallsPerCallGroup: "1",
        },
        android: {
          alertTitle: "Permissions required",
          alertDescription:
            "This application needs to access your phone accounts",
          cancelButton: "Cancel",
          okButton: "Ok",
        },
      });
    } catch (error) {
      console.error("initializeCallKeep error:", error?.message);
    }
  };
  // Use startCall to ask the system to start a call - Initiate an outgoing call from this point
  startCall = ({ handle, localizedCallerName }) => {
    // Your normal start call action
    console.log("Start Call")
    // RNCallKeep.startCall("cb499f3e-1521-4467-a51b-ceea76ee92b6", handle, localizedCallerName);
    RNCallKeep.startCall(this.getCurrentCallId(), handle, localizedCallerName);

  };

  reportEndCallWithUUID = (callUUID, reason) => {
    RNCallKeep.reportEndCallWithUUID(callUUID, reason);
  };

  endIncomingcallAnswer = () => {
    console.log("endIncomingCall1");
    RNCallKeep.endCall(this.getCurrentCallId());
    // RNCallKeep.endCall("cb499f3e-1521-4467-a51b-ceea76ee92b6");
    // RNCallKeep.endAllCalls()
    this.currentCallId = null;
    this.removeEvents();
  };

  removeEvents = () => {
    RNCallKeep.removeEventListener("answerCall");
    RNCallKeep.removeEventListener("endCall");
  };

  displayIncomingCall = (callerName) => {
    Platform.OS === "android" && RNCallKeep.setAvailable(false);
    RNCallKeep.displayIncomingCall(
         this.getCurrentCallId(),
         callerName,
         callerName,
         "number",
         false,
         null
     );
   
  };

  backToForeground = () => {
    RNCallKeep.backToForeground();
  };

  getCurrentCallId = () => {
    if (!this.currentCallId) {
      this.currentCallId = uuid.v4() //"cb499f3e-1521-4467-a51b-ceea76ee92b6";
    }
    return this.currentCallId;
  };

  endAllCall = () => {
    console.log("endIncomingCall2");
    RNCallKeep.endAllCalls();
    this.currentCallId = null;
    this.removeEvents();
  };

  setupEventListeners() {
    if (Platform.OS == "ios") {
      // --- NOTE: You still need to subscribe / handle the rest events as usuall.
      // --- This is just a helper whcih cache and propagate early fired events if and only if for
      // --- "the native events which DID fire BEFORE js bridge is initialed",
      // --- it does NOT mean this will have events each time when the app reopened.
      // ===== Step 1: subscribe `register` event =====
      // --- this.onVoipPushNotificationRegistered
      // ===== Step 4: register =====
      // --- it will be no-op if you have subscribed before (like in native side)
      // --- but will fire `register` event if we have latest cahced voip token ( it may be empty if no token at all )
    }
  }
}

export default Incomingvideocall = new IncomingCall();
