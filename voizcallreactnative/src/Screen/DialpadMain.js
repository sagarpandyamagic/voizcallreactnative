import {
    View,
    StyleSheet,
} from 'react-native';
import { React, useEffect, useRef, useState } from 'react';
import { THEME_COLORS } from '../HelperClass/Constant';
import CallButton from '../components/dialscreen/CallButton';
import SeparatorLine from '../HelperClass/SeparatorLine';
import CallIdShow from '../components/dialscreen/CallIdShow';
import NumberShowVw from '../components/dialscreen/NumberShowVw';
import DialPad from '../components/dialscreen/DialPad';
import { IncomingcallPermission } from '../services/call/IncomingcallPermission';
import { useSelector } from 'react-redux';
import { useCallTimerContext } from '../hook/useCallTimer';
import DialpadContactSearch from '../components/contactscreen/DialpadContactSearch';
import CallingShowInfo from '../components/dialscreen/CallingShowInfo';

const DialpadMain = ({ navigation }) => {
    const incomeingCall = false
    const [code, setCode] = useState([]);
    const [callStart, setcallStart] = useState(false);
    const { CallScreenOpen, soketConnect, sesstionState, session, CallType, phoneNumber,Caller_Name } = useSelector((state) => state.sip)
    const { TimerAction, callTimer, seconds } = useCallTimerContext()

    const handleRemove = () => {
        if (code.length > 0) {
            const updatedWords = [...code];
            updatedWords.pop();
            setCode(updatedWords);
        }
    };

    useEffect(()=>{
        if (CallType == "OutGoComingCall" && sesstionState == 'Establishing') {
            IncomingcallPermission()
        }

        switch (sesstionState) {
            case 'Established':
                console.log("Established...........")
                TimerAction('start')
                setcallStart(true)
                break;
            case 'Terminated':
                console.log("Terminated...........")
                TimerAction('stop')
                setcallStart(false)
                break;
        }

    },[sesstionState])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: THEME_COLORS.black }}>
               {
                callStart == false ? <DialpadContactSearch search={code}/> : <CallingShowInfo />
               } 
            </View>
            <View style={style.container}>
                <CallIdShow /> 
                <NumberShowVw number = {code} />
                <SeparatorLine />
                <DialPad dialnumber = {code} addNumber={setCode} />
            </View>
               <CallButton onRemove={handleRemove} navigation={navigation} setCode={code} code={code} /> 
        </View>
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