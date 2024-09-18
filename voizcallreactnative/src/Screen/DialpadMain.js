import {
    View,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    Text,
    FlatList,
    AppState,
    Button
} from 'react-native';

import { React, useEffect, useRef, useState } from 'react';
import { THEME_COLORS, userprofilealias } from '../HelperClass/Constant';
import CallButton from '../components/dialscreen/CallButton';
import SeparatorLine from '../HelperClass/SeparatorLine';
import CallIdShow from '../components/dialscreen/CallIdShow';
import NumberShowVw from '../components/dialscreen/NumberShowVw';
import DialPad from '../components/dialscreen/DialPad';
import { IncomingcallPermission } from '../services/call/IncomingcallPermission';
import { useDispatch, useSelector } from 'react-redux';
import { useCallTimerContext } from '../hook/useCallTimer';
import DialpadContactSearch from '../components/contactscreen/DialpadContactSearch';
import CallingShowInfo from '../components/dialscreen/CallingShowInfo';
import CallTransferButton from '../components/dialscreen/CallTransferButton';
import AttendedTransferButton from '../components/dialscreen/AttendedTransferButton';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CallIDList from '../components/dialscreen/CallIDList';
import { FCMDelegateMethod, requestUserPermission } from '../services/FirebaseConfig';
import { setupCallKeep } from '../services/Callkeep/CallkeepSeup';
import { voipConfig } from '../services/voipConfig';
import { updateSipState } from '../store/sipSlice';
import inCallManager from 'react-native-incall-manager';
import Contacts from 'react-native-contacts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { APIURL } from '../HelperClass/APIURL';
import { getConfigParamValue } from '../data/profileDatajson';
import SipUA from '../services/call/SipUA';

const DialpadMain = ({ navigation }) => {
    const incomeingCall = false
    const [code, setCode] = useState([]);
    const [callStart, setcallStart] = useState(false);
    const [numberMatch, setnumberMatch] = useState(false);
    const [callerID, setCallerID] = useState('');


    const { ISAttendedTransfer, sesstionState, CallType, ISCallTransfer, allSession, AppISBackGround } = useSelector((state) => state.sip)
    const { TimerAction, callTimer, seconds } = useCallTimerContext()
    const [callIDShow, setcallIDShow] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);
    const dispatch = useDispatch()

    // console.log("allSessionState->", allSession)

    useEffect(() => {
        if (CallType == "OutGoComingCall" && sesstionState == 'Establishing') {
            IncomingcallPermission()
        }
        console.log("allSession->", Object.keys(allSession))

        if (Object.keys(allSession).length == 1) {
            const keys = Object.keys(allSession)[0]
            console.log("allSessionkeys->", keys)
            const session = allSession[keys]
            if (session &&  typeof session === "object") {
                if (!callStart) {
                  TimerAction('stop')
                }
                console.log("session.Media", session.state)
                if (session.state === 'Established') {
                    console.log("Established...........");
                    if (!callStart) {
                        try {
                            console.log("Timer...........");
                            TimerAction('start');
                            setcallStart(true);
                        } catch (error) {
                            console.error("Error starting timer:", error);
                        }
                    }
                } else if (session.state === 'Terminated') {
                    console.log("Terminated...........");
                    try {
                        TimerAction('stop');
                        setcallStart(false);
                    } catch (error) {
                        console.error("Error stopping timer:", error);
                    }
                }
            }

        }
        else if (Object.keys(allSession).length == 0) {
            TimerAction('stop')
            setcallStart(false)
        }

    }, [allSession, sesstionState])


    useEffect(() => {
        if (Platform.OS == "ios") {
            setupCallKeep();
        }
        inCallManager.stopProximitySensor(); // Disable
        firstCallerIdSet()
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            setAppState(nextAppState);
            if (nextAppState === "active") {
                dispatch(updateSipState({ key: "AppISBackGround", value: true }))
                console.log("App is in the foreground");
            } else {
                dispatch(updateSipState({ key: "AppISBackGround", value: false }))
                console.log("App is in the background");
            }
        });
        console.log("store.getState().sip.AppISBackGround", AppISBackGround)
        return () => {
            subscription.remove();
        };
    }, []);

    const firstCallerIdSet = async () => {
        const value =  await getConfigParamValue(userprofilealias.sip_callerid)
        console.log("getsipCallerid",value)
        setCallerID(value)
    }


    const addContact = (numberenter) => {
        let newPerson = {
            phoneNumbers: [{
                label: "mobile",
                number: numberenter,
            }],
        };

        Contacts.openContactForm(newPerson).then(contact => {
            if (contact) {
                console.log("Contact saved successfully", contact);
            }
        }).catch(error => {
            console.log("Error opening contact form", error);
        });
    };

    const handleRemove = () => {
        if (code.length > 0) {
            const updatedWords = [...code];
            updatedWords.pop();
            setCode(updatedWords);
        }
    };

    const hendelVoizmail = async () => {
        const number = await getConfigParamValue(userprofilealias.call_voicemailNumber)
        console.log("number", number)
        try {
            dispatch(updateSipState({ key: "Caller_Name", value: "Voicemail" }))
            dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
            // console.log("SessionCount",allSession)
            if (Object.keys(allSession).length > 0) {
                dispatch(updateSipState({ key: "ISConfrenceTransfer", value: true }))
                SipUA.toggelHoldCall(true)
            } else {
                dispatch(updateSipState({ key: "phoneNumber", value: [] }))
            }
            SipUA.makeCall(number, false)
            navigation.navigate('AudioCallingScreen')
        } catch (error) {
            console.log("error", error)
        }
        
    }

    const handleAddCallerID = (id) =>  {
        console.log('Selected id:', id);
        setCallerID(id)
        setcallIDShow(false)
    }
   
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: THEME_COLORS.black }}>
                <View style={{ flex: 1, backgroundColor: THEME_COLORS.black }}>
                    {
                        callStart == false
                            ? <DialpadContactSearch search={code} setNumber={setCode} numberMatch={setnumberMatch} />
                            : <CallingShowInfo />
                    }
                </View>
                <View style={style.container}>
                    <CallIdShow callIDShow={callIDShow} setCallerIDShow={setcallIDShow} callID={callerID} />
                    {
                    callIDShow && <CallIDList addCallerID={(id) => handleAddCallerID(id)} />}
                    <NumberShowVw number={code} onRemove={handleRemove} setNumber={setCode} />
                    {
                        !numberMatch && code.length > 0 ?
                        <TouchableOpacity onPress={
                            () => addContact(code.join(''))}>
                            <Text style={{ color: THEME_COLORS.black, fontWeight: 'bold', fontSize: 12 }}>
                                Add to Contact
                            </Text>
                        </TouchableOpacity>
                        :
                        <View>
                             <Text style={{ color: THEME_COLORS.transparent, fontWeight: 'bold', fontSize: 12 }}>
                                Add to Contact
                            </Text>
                        </View>
                    }
                    <SeparatorLine style={{ marginVertical: 5 }} />
                    <DialPad dialnumber={code} addNumber={setCode} />
                </View>
                {
                    ISCallTransfer
                        ? <CallTransferButton  navigation={navigation} setCode={code} code={code} />
                        : ISAttendedTransfer ? <AttendedTransferButton  navigation={navigation} setCode={code} code={code} />
                            : <CallButton  navigation={navigation} setCode={code} code={code} voizmailAcation={hendelVoizmail} />
                }
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'grey',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10
    },

})
export default DialpadMain