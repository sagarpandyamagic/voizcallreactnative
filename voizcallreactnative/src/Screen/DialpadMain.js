import {
    View,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    Text,
    FlatList,
    AppState
} from 'react-native';

import { React, useEffect, useRef, useState } from 'react';
import { THEME_COLORS } from '../HelperClass/Constant';
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

const DialpadMain = ({ navigation }) => {
    const incomeingCall = false
    const [code, setCode] = useState([]);
    const [callStart, setcallStart] = useState(false);
    const { ISAttendedTransfer, sesstionState, CallType, ISCallTransfer, allSession, AppISBackGround } = useSelector((state) => state.sip)
    const { TimerAction, callTimer, seconds } = useCallTimerContext()
    const [callIDShow, setcallIDShow] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);
    const dispatch = useDispatch()
    useEffect(() => {

        console.log("AppState.currentState", AppState.currentState)

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

    // useEffect(() => {
    //     requestUserPermission()
    //     FCMDelegateMethod()
    // }, [])

    useEffect(() => {
        setupCallKeep();
        inCallManager.stopProximitySensor(); // Disable
    }, []);


    const handleRemove = () => {
        if (code.length > 0) {
            const updatedWords = [...code];
            updatedWords.pop();
            setCode(updatedWords);
        }
    };

    useEffect(() => {
        if (CallType == "OutGoComingCall" && sesstionState == 'Establishing') {
            IncomingcallPermission()
        }
        if (Object.keys(allSession).length == 1) {
            const session = allSession[Object.keys(allSession)[0]]
            console.log("session.state", session.state)
            switch (session.state) {
                case 'Established':
                    console.log("Established...........")
                    if (!callStart) {
                        TimerAction('start')
                        setcallStart(true)
                    }
                    break;
                case 'Terminated':
                    console.log("Terminated...........")
                    TimerAction('stop')
                    setcallStart(false)
                    break;
            }
        }
        else if (Object.keys(allSession).length == 0) {
            TimerAction('stop')
            setcallStart(false)
        }

    }, [allSession, sesstionState])

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: THEME_COLORS.black }}>
                <View style={{ flex: 1, backgroundColor: THEME_COLORS.black }}>
                    {
                        callStart == false
                            ? <DialpadContactSearch search={code} />
                            : <CallingShowInfo />
                    }
                </View>
                <View style={style.container}>
                    <CallIdShow callIDShow={callIDShow} setCallerID={setcallIDShow} />
                    {callIDShow && <CallIDList />}
                    <NumberShowVw number={code} />
                    <SeparatorLine />
                    <DialPad dialnumber={code} addNumber={setCode} />
                </View>
                {
                    ISCallTransfer
                        ? <CallTransferButton onRemove={handleRemove} navigation={navigation} setCode={code} code={code} />
                        : ISAttendedTransfer ? <AttendedTransferButton onRemove={handleRemove} navigation={navigation} setCode={code} code={code} />
                            : <CallButton onRemove={handleRemove} navigation={navigation} setCode={code} code={code} />
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