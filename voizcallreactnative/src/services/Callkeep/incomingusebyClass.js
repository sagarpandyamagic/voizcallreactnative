import { AppRegistry, AppState, PermissionsAndroid, Platform } from "react-native";
import RNCallKeep from "react-native-callkeep";
import uuid from 'react-native-uuid';
import BackgroundTimer from 'react-native-background-timer';

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

  outgoingCallStart = ({ handle }) => {
    console.log('Starting outgoing call...');

    // Inform the system of the outgoing call
    RNCallKeep.startCall(this.getCurrentCallId(), handle, handle);

    // Set the call as active after a short delay
    BackgroundTimer.setTimeout(() => {
      RNCallKeep.setCurrentCallActive(this.getCurrentCallId());
    }, 1000);

    // Bring the app to the foreground if it's in the background
    AppState.currentState === 'background' && AppRegistry.runApplication();
  };

  outgoingCallEnd = () => {
    console.log('Ending outgoing call...');

    // End the call using the UUID
    RNCallKeep.endCall(this.getCurrentCallId());

    // Any other cleanup you need to do
    SipUA.hangupCall();
  };

  // Setting up RNCallKeep with event listeners
  setupOutgoingCallHandlers = () => {
    RNCallKeep.addEventListener('didDisplayIncomingCall', outgoingCallStart);
    RNCallKeep.addEventListener('endCall', outgoingCallEnd);
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
          additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
          okButton: "Ok",
        },
      });
    } catch (error) {
      console.error("initializeCallKeep error:", error?.message);
    }
  };
  // Use startCall to ask the system to start a call - Initiate an outgoing call from this point
  startCall = ({ handle, localizedCallerName }) => {
    console.log("Start Call")
    RNCallKeep.startCall(this.getCurrentCallId(), handle, localizedCallerName);
    RNCallKeep.setCurrentCallActive(this.getCurrentCallId());

  };

  // IncomingCallPikcup = () => {
  //   RNCallKeep.startCall(this.getCurrentCallId(), handle, localizedCallerName);
  // }

  reportEndCallWithUUID = (callUUID, reason) => {
    RNCallKeep.reportEndCallWithUUID(callUUID, reason);
  };

  endIncomingcallAnswer = () => {
    console.log("endIncomingCall1");
    RNCallKeep.endAllCalls()
    this.currentCallId = null;
    this.removeEvents();
  };

  removeEvents = () => {
    RNCallKeep.removeEventListener("answerCall");
    RNCallKeep.removeEventListener("endCall");
  };

  displayIncomingCall = (callerName) => {
    console.log('displayIncomingCall', callerName);

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

  backToForeground = () => {
    RNCallKeep.backToForeground();
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

export default IncomingAudioCall = new IncomingCall();
