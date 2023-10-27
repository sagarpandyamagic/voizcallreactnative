import React from 'react'
import { useDispatch } from 'react-redux';
import usecreateUA from './usecreateUA';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'uuid';
import { PermissionsAndroid } from 'react-native';
import { updateSipState } from '../redux/sipSlice';
import { callhaupCall } from '../CallScreen';

export function setupCallKeep() {
     const options = {
        ios: {
          appName: "AwesomeProject",
        },
        android: {
          alertTitle: "Permissions required",
          alertDescription:
            "This application needs to access your phone accounts",
          cancelButton: "Cancel",
          okButton: "ok",
          imageName: "phone_account_icon",
        },
      };
      RNCallKeep.setup(options);
      RNCallKeep.setAvailable(true);
}


// export const getNewUuid = () => "cb499f3e-1521-4467-a51b-ceea76ee92b6"

// const format = uuid => uuid.split('-')[0];

// const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

// export const isIOS = Platform.OS === 'ios';

// console.log("uuid", uuid)

// const useLogger = (moduleName) => {
//     const info = (message, data = {}) => {
//         console.log(`[${moduleName}] INFO: ${message}`, data);
//     };

//     const error = (message, data = {}) => {
//         console.error(`[${moduleName}] ERROR: ${message}`, data);
//     };

//     return { info, error };
// };

// function usecallkeep() {
//     const logger = useLogger('CallKeep');
//     const dispatch = useDispatch()
//     const { connect, makeCall, Callhangup } = usecreateUA()

//     const answerCall = ({ callUUID }) => {
//         logger.info("Call recieved, answering call...")
//         try {
//             logger.info("Starting Callkeep call")
//             if (Platform.OS === 'ios') {
//                 RNCallKeep.startCall(callUUID, '123445', "123445", 'number', false);
//             } else {
//                 //   RNCallKeep.answerIncomingCall("cb499f3e-1521-4467-a51b-ceea76ee92b6")
//             }
//             logger.info("Call started successfully")
//         } catch (e) {
//             logger.error("Failed to start callkeep call")
//         }

//         setTimeout(() => {
//             logger.info("Setting current active call...")
//             try {
//                 RNCallKeep.setCurrentCallActive(callUUID);
//                 dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
//                 dispatch(updateSipState({ key: "incomingcall", value: false }))
//                 logger.info("Current active call set");
//             } catch (e) {
//                 logger.error("Failed to set current call", { error: e });
//             }
//         }, 1000);
//         logger.info("Call started successfully, setting active call")


//         // On Android display the app when answering a video call
//         if (!isIOS) {
//             console.log('bringing app to foreground');
//             RNCallKeep.backToForeground();
//         }

//         logger.info("Setting current call UUID")
//         // dispatch(setCurrentCallUUID(callUUID))
//         logger.info("Navigating to call screen")
//     };

//     const endCall = ({ callUUID }) => {
//         logger.info("Ending call")
//         logger.info("Test Ending call")
//         try {
//             hangup({ callUUID })
//             logger.info("Call ended")
//         } catch (e) {
//             logger.error("Failed to end call", { error: e })
//         }
//     };

//     const didDisplayIncomingCall = async ({ callUUID, payload, handle, }) => {
//         try {
//             logger.info('Recieved call with data', { payload, callUUID, handle });
//             logger.info('Call displayed with data', { payload, callUUID, handle });
//         } catch (e) {
//             logger.error('Failed to save call data', { payload, callUUID, handle });
//         }
//     }

//     const handlePreJSEvents = (events) => {
//         logger.info('PreJS events', { events });
//         for (let event of events) {
//             if (event.name == "RNCallKeepDidDisplayIncomingCall") {
//                 logger.info('PreJS events: didDisplayIncomingCall', { event });
//                 didDisplayIncomingCall(event.data)
//             } else if (event.name == 'RNCallKeepAnswerCall') {
//                 logger.info('PreJS events: answerCall', { event });
//                 answerCall(event.data)
//             } else if (event.name == 'RNCallKeepEndCall') {
//                 logger.info('PreJS events: endCall', { event });
//                 endCall(event.data)
//             }
//         }
//     }

//     const didReceiveStartCallAction = ({ handle }) => {
//         if (!handle) {
//           // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
//           return;
//         }
//         const callUUID = getNewUuid();
//         addCall(callUUID, handle);
    
//         log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);
    
//         RNCallKeep.startCall(callUUID, handle, handle);
    
//         BackgroundTimer.setTimeout(() => {
//           log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
//           RNCallKeep.setCurrentCallActive(callUUID);
//         }, 1000);
//       };


//     const initializeCallKeep = () => {
//         connect()
//         setTimeout(() => {
//             try {
//                 logger.info('Call keep initiated successfully');
//                 RNCallKeep.setAvailable(true);
//                 RNCallKeep.addEventListener('answerCall', answerCall);
//                 RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
//                 RNCallKeep.addEventListener('endCall', endCall);
//                 RNCallKeep.addEventListener('didDisplayIncomingCall', didDisplayIncomingCall);

//                 if (isIOS) {
//                     RNCallKeep.addEventListener('didLoadWithEvents', handlePreJSEvents);
//                 }
//             } catch (err) {
//                 logger.error('Failed to initialize call keep', {
//                     error: err,
//                     msg: err.message,
//                 });
//                 console.error('initializeCallKeep error:', err.message);
//             }
//         }, 2000);
//     };

//     const hangup = (callUUID) => {
//         RNCallKeep.endCall(callUUID);
//         removeCall(callUUID);
//     };

//     return { answerCall, initializeCallKeep, handlePreJSEvents, didDisplayIncomingCall, endCall, hangup }
// }

// export default usecallkeep
