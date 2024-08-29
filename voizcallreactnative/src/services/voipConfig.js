import VoipPushNotification from "react-native-voip-push-notification";
import { AppStoreData } from "../components/utils/UserData";
import { StorageKey } from "../HelperClass/Constant";
import SipUA from "./call/SipUA";
import incomingusebyClass from "./Callkeep/incomingusebyClass";
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from "react-native-callkeep";

export const voipConfig = () => {
    VoipPushNotification.addEventListener("register", async (token) => {
        console.log("Voip Token->", token)
        try {
            await AppStoreData(StorageKey.VOIP, token);
        } catch (e) {
            console.log('Voip error', e);
        }
    });

    VoipPushNotification.addEventListener("notification", (notification) => {
        //   const { callerInfo, videoSDKInfo, type } = notification;
        console.log("notification", notification.aps.alert.subtitle)
        let type = "CALL_INITIATED"
        let callerInfo = notification.from
        console.log("events.push.call.name",notification.from)

        if (type === "CALL_INITIATED") {
            const incomingCallAnswer = ({ callUUID }) => {
                SipUA.accepctCall()
                RNCallKeep.setCurrentCallActive(callUUID);
            };
            const endIncomingCall = () => {
                SipUA.hangupCall()
                InCallManager.setSpeakerphoneOn(false);
                InCallManager.stop();
                console.log("endIncomingCall ttttt");
                incomingusebyClass.endIncomingcallAnswer();
            };
            incomingusebyClass.configure(incomingCallAnswer, endIncomingCall);
            VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
        }
        else if (type === "DISCONNECT") {
            incomingusebyClass.endAllCall();
        }
        VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
    });

    VoipPushNotification.addEventListener("didLoadWithEvents", (events) => {
        let type = "CALL_INITIATED"
        console.log("events",events.push.call.name)
        let callerInfo = events
        const incomingCallAnswer = ({ callUUID }) => {
            SipUA.accepctCall()
            RNCallKeep.setCurrentCallActive(callUUID);
        };
        const endIncomingCall = () => {
            SipUA.hangupCall()
            InCallManager.setSpeakerphoneOn(false);
            InCallManager.stop();
            console.log("endIncomingCall ttttt");
            incomingusebyClass.endAllCall();
            // updateCallStatus({ callerInfo, type: "REJECTED" });
        };
        incomingusebyClass.configure(incomingCallAnswer, endIncomingCall);
    });

    return () => {
        VoipPushNotification.removeEventListener("didLoadWithEvents");
        VoipPushNotification.removeEventListener("register");
        VoipPushNotification.removeEventListener("notification");
    };

}

