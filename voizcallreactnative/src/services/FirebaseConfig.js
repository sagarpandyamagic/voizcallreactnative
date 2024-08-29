import { PermissionsAndroid, Platform } from "react-native";
import messaging from '@react-native-firebase/messaging';
import { POSTAPICALL } from "./auth";
import { APIURL } from "../HelperClass/APIURL";
import { StorageKey, userprofilealias } from "../HelperClass/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppStoreData, getStorageData } from "../components/utils/UserData";
import SipUA from "./call/SipUA";
import RNCallKeep from "react-native-callkeep";


export const requestUserPermission = async () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        console.log('FCM token:', token);
        try {
            await AppStoreData(StorageKey.FCM, token);
        } catch (e) {
            console.log('error', e);
        }

        
    }else{
        console.log('Authorization status:', authStatus);
    }

    
};
export const FCMDelegateMethod = async () => {

    // const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    //     console.log('Foreground message:', remoteMessage);
    //     // Show a local notification or update UI
    //     let type = "CALL_INITIATED"
    //     let callerInfo = remoteMessage.from
    //     console.log("remoteMessage", remoteMessage)
    //     switch (type) {
    //         case "CALL_INITIATED":
    //             console.log("remoteMessage", remoteMessage)
    //             const incomingCallAnswer = ({ callUUID }) => {
    //                 // updateCallStatus({
    //                 //     callerInfo,
    //                 //     type: "ACCEPTED",
    //                 // });
    //                 SipUA.accepctCall()
    //                 console.log('session accept3->');
    //                 RNCallKeep.setCurrentCallActive(callUUID);
    //                 setisCalling(false);
    //             };

    //             const endIncomingCall = () => {
    //                 setShowCallRunning(false)
    //                 skoectbyclass.hangupCall()
    //                 console.log("endIncomingCall ttttt");
    //                 incomingusebyClass.endIncomingcallAnswer();
    //             };
    //             incomingusebyClass.configure(incomingCallAnswer, endIncomingCall);
    //             incomingusebyClass.displayIncomingCall(remoteMessage.from);
    //             break;
    //         case "ACCEPTED":
    //             console.log("ACCEPTED");
    //             setisCalling(false);
    //             // navigation.navigate(SCREEN_NAMES.Meeting, {
    //             //     name: "Person B",
    //             //     token: videosdkTokenRef.current,
    //             //     meetingId: videosdkMeetingRef.current,
    //             // });
    //             break;
    //         case "REJECTED":
    //             console.log("Call Rejected");
    //             setisCalling(false);
    //             break;
    //         case "DISCONNECT":
    //             Platform.OS === "ios"
    //                 ? incomingusebyClass.endAllCall()
    //                 : incomingusebyClass.endIncomingcallAnswer();
    //             break;
    //         default:
    //             console.log("Call Could not placed");
    //     }

    // });

    // // Handle initial notification
    // const handleInitialNotification = async () => {
    //     const initialNotification = await messaging().getInitialNotification();
    //     if (initialNotification) {
    //         console.log('Initial notification:', initialNotification);
    //         // Handle the initial notification (e.g., navigate to a specific screen)
    //     }
    // };

    // handleInitialNotification();

    // // Cleanup on unmount
    // return () => {
    //     unsubscribeOnMessage();
    // };
}



export const requestPermissions = async () => {
  try {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
          {
              title: "Phone Answer Permission",
              message: "This app needs access to your phone calls to answer them.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
          }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can answer the call");
      } else {
          console.log("Answer call permission denied");
      }
  } catch (err) {
      console.warn(err);
  }
}