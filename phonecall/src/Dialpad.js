import {
    View,
    StyleSheet,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { React, useEffect, useRef, useState } from 'react';
const { width } = Dimensions.get('window')
import phoneLogo from '../Assets/phone-call.png';
import removeLogo from '../Assets/ic_remove_number.png';
import IncomingCall from './IncomingCall';
import usecreateUA from './hook/usecreateUA';
import CallScreen from './CallScreen';
import { useSelector, useDispatch } from 'react-redux';
import { updateSipState } from './redux/sipSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DialpadTimeSearchContact from './ContactScreen/DialpadTimeSearchContact';
import messaging from '@react-native-firebase/messaging';
import VoipPushNotification from "react-native-voip-push-notification";
import incomingusebyClass from './incomingusebyClass';
import store from './redux/store';
import RNCallKeep from 'react-native-callkeep';
import skoectbyclass from './skoectbyclass';
import { updateCallStatus } from './API';
import { SessionState } from 'sip.js/lib/core';
import { useCallTimerContext } from './hook/useCallTimer';
import InCallManager from 'react-native-incall-manager';
import setInitVlaue from './setInitVlaue';

const pinLength = 3
const pinContainersize = width / 2;
const pinMaxSize = pinContainersize / pinLength
const pinSpacing = 7
const pinSize = pinMaxSize - pinSpacing * 1.8

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#', '', 'call', 'del']
const dinlPadAlphabat = ['', 'A B C', "D E F", "G H I", "J K L", "M N O", "P Q R S", "T U V", "W X Y Z", "", "+", "", "", "", ""]
const dialPadSize = width * .2
const dialPadTextSize = dialPadSize * .38
const _spacing = 20;

function Number({ onPress }: { onPress: (item: typeof dialPad[number]) => void }) {
    return (
        <FlatList
            numColumns={3}
            data={dialPad}
            style={{ flexGrow: 0 }}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: _spacing }}
            contentContainerStyle={{ gap: _spacing }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        disabled={item === ''}
                        onPress={() => {
                            onPress(item)
                        }} >
                        <View style={[style.DialPadNumber, { borderWidth: item === '' ? 0 : item === 'call' ? 0 : item === 'del' ? 0 : 1 }]} >
                            {
                                item === 'del' ?
                                    <Image style={{
                                        width: dialPadSize / 2,
                                        height: dialPadSize / 3, resizeMode: 'contain',
                                    }} source={removeLogo} />
                                    : (item === 'call'
                                        ? <Image style={{
                                            width: dialPadSize - 5,
                                            height: dialPadSize - 5
                                        }} source={phoneLogo} />
                                        : <Text style={{ fontSize: dialPadTextSize }}>{item}</Text>
                                    )
                            }
                            {
                                item === '' ? null : <Text style={{ fontSize: dialPadTextSize / 3, color: 'black', fontStyle: "normal" }}>{dinlPadAlphabat[item - 1]}</Text>
                            }
                        </View>
                    </TouchableOpacity>
                )
            }}
        >
        </FlatList>

    )
}

const Dialpad = ({ navigation }) => {
    const incomeingCall = false
    const [code, setCode] = useState([]);
    const { CallScreenOpen, soketConnect,sesstionState,session ,CallType,phoneNumber} = useSelector((state) => state.sip)
    const dispatch = useDispatch()
    const [firebaseUserConfig, setfirebaseUserConfig] = useState(null);
    const [isCalling, setisCalling] = useState(false);
    const { TimerAction, callTimer, seconds } = useCallTimerContext()

    useEffect(()=>{
        switch(sesstionState){
            case 'Established':
                TimerAction('start')
                break;
             case 'Terminated':
                TimerAction('stop')
                break;   
        }
        
    },[sesstionState])

    useEffect(() => {
        getFCMtoken()
    }, []);

    useEffect(()=>{
        console.log("CallType===",CallType)
        console.log("sesstionState===",sesstionState)
        if(CallType == "OutGoComingCall" && sesstionState == 'Establishing') {
            const endIncomingCall = () => {
                skoectbyclass.hangupCall()
                InCallManager.setSpeakerphoneOn(false);
                InCallManager.stop();
                console.log("endIncomingCall ttttt");
                incomingusebyClass.endIncomingcallAnswer();
            };
            incomingusebyClass.configureendcall(endIncomingCall);
        }
    },[sesstionState])
    

    useEffect(() => {
        const unsubscribe = messaging().onMessage((remoteMessage) => {
            // const { callerInfo, videoSDKInfo, type } = JSON.parse(
            //     remoteMessage.data.info
            // );

            let type = "CALL_INITIATED"
            let callerInfo = remoteMessage.from

            console.log("remoteMessage", remoteMessage)
            switch (type) {
                case "CALL_INITIATED":
                    const incomingCallAnswer = ({ callUUID }) => {
                        updateCallStatus({
                            callerInfo,
                            type: "ACCEPTED",
                        });
                        skoectbyclass.accepctCall()
                        RNCallKeep.setCurrentCallActive(callUUID);
                        // incomingusebyClass.endIncomingcallAnswer(callUUID);
                        setisCalling(false);
                    };

                    const endIncomingCall = () => {
                        skoectbyclass.hangupCall()
                        console.log("endIncomingCall ttttt");
                        incomingusebyClass.endIncomingcallAnswer();
                    };

                    incomingusebyClass.configure(incomingCallAnswer, endIncomingCall);
                    incomingusebyClass.displayIncomingCall(remoteMessage.from);
                    break;
                case "ACCEPTED":
                    console.log("ACCEPTED");
                    setisCalling(false);
                    // navigation.navigate(SCREEN_NAMES.Meeting, {
                    //     name: "Person B",
                    //     token: videosdkTokenRef.current,
                    //     meetingId: videosdkMeetingRef.current,
                    // });
                    break;
                case "REJECTED":
                    console.log("Call Rejected");
                    setisCalling(false);
                    break;
                case "DISCONNECT":
                    Platform.OS === "ios"
                        ? incomingusebyClass.endAllCall()
                        : incomingusebyClass.endIncomingcallAnswer();
                    break;
                default:
                    console.log("Call Could not placed");
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        VoipPushNotification.addEventListener("register", (token) => {
          console.log("Voip Token->", token)
        });
    
        VoipPushNotification.addEventListener("notification", (notification) => {
        //   const { callerInfo, videoSDKInfo, type } = notification;
           console.log("notification",notification.aps.alert.subtitle)
           let type = "CALL_INITIATED"
           let callerInfo = notification.from
          if (type === "CALL_INITIATED") {
            const incomingCallAnswer = ({ callUUID }) => {
                updateCallStatus({
                    callerInfo,
                    type: "ACCEPTED",
                });
                skoectbyclass.accepctCall()
                // RNCallKeep.setCurrentCallActive(callUUID);
                setisCalling(false);
            };

            const endIncomingCall = () => {
                skoectbyclass.hangupCall()
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
            setInitVlaue.usedValue()

            let type = "CALL_INITIATED"
            let callerInfo = events

            const incomingCallAnswer = ({ callUUID }) => {
                updateCallStatus({
                  callerInfo,
                  type: "ACCEPTED",
                });
                skoectbyclass.accepctCall()
              };
              const endIncomingCall = () => {
                incomingusebyClass.endAllCall();
                updateCallStatus({ callerInfo, type: "REJECTED" });
              };
              incomingusebyClass.configure(incomingCallAnswer, endIncomingCall);
        });
    
        return () => {
          VoipPushNotification.removeEventListener("didLoadWithEvents");
          VoipPushNotification.removeEventListener("register");
          VoipPushNotification.removeEventListener("notification");
        };
      }, []);

     const questPermission=async ()=> {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION, // or POST_NOTIFICATIONS
            {
              'title': 'TEST',
              'message': I18n.t('permissions.locationPermissionMessage')
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            
          } else {
          }
        } catch (err) {
         
        }
    }

    


    const getFCMtoken = async () => {
        console.log("GETFCMTOKEN")
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        Platform.OS === "ios" && VoipPushNotification.registerVoipToken();
        console.log("GETFCMTOKEN1")

        if (Platform.OS === 'android') {
            try {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
            } catch (error) {
            }
        }

        if (enabled) {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log('FCM Token:', fcmToken);
                // Send the token to your server or use it for notifications
            } else {
                console.error('Unable to get FCM Token');
            }
        }

    }


    const handleMakeCall = (code) => {
        const number = code.join('')
        number.toString()
        console.log(number)

        skoectbyclass.makeCall(number)
        dispatch(updateSipState({ key: "Caller_Name", value: number }))
        dispatch(updateSipState({ key: "CallScreenOpen", value: true }))

     
    };

    const callPick = () => {
        navigation.navigate('CallScreen', { number, navigation })
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: 'row'
                        , gap: pinSpacing * 2
                        , height: pinSize * 1
                        , justifyContent: 'center'
                        , alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 20, }}>{code}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <DialpadTimeSearchContact searchtext={code} setCode={setCode} />
                </View>
            </View>

            <View style={style.container}>
                <View style={{ height: 20 }}>

                </View>
                <View >
                    <Number code={code.length ? {} : code} onPress={(item) => {
                        if (item.toString() == 'del') {
                            const updatedWords = [...code];
                            updatedWords.pop();
                            setCode(updatedWords);
                        } else if (item.toString() == "call") {
                            handleMakeCall(code)
                        } else if (item.toString() == '*' || item.toString() == '#') {
                        } else {
                            const newNumbers = code.length === 0 ? [item.toString()] : [...code, item.toString()];
                            setCode(newNumbers)
                        }
                    }} />
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
        borderColor: 'grey',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10
    },
    DialPadNumber: {
        width: dialPadSize,
        height: dialPadSize,
        borderRadius: dialPadSize,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',

    }
})

export default Dialpad