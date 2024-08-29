import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import { React, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ic_answer_call from '../../../Assets/ic_answer_call.png'
import ic_decline_call from '../../../Assets/ic_decline_call.png'
import store from '../../store/store';
import SipUA from '../../services/call/SipUA';
import { updateSipState } from '../../store/sipSlice';
import incomingusebyClass from '../../services/Callkeep/incomingusebyClass';

const IncomeScreenBtnVw = () => {
    const { phoneNumber, Caller_Name,session } = useSelector((state) => state.sip)
    return (
        <View style={style.CallingIcon}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <TouchableOpacity style={{ marginRight: 50 }} onPress={() => {
                    store.dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
                    // session.accept()
                    // incomingusebyClass.startCall();;
                    store.dispatch(updateSipState({ key: "IncomingScrrenOpen", value: false }))
                }} >
                    <Image style={{ width: 70, height: 70 }}
                        source={ic_answer_call} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    SipUA.hangupCall()
                    store.dispatch(updateSipState({ key: "IncomingScrrenOpen", value: false }))
                }}>
                    <Image style={{ width: 70, height: 70 }}
                        source={ic_decline_call} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    CallingIcon: {
        flex: 1,
    }
})
export default IncomeScreenBtnVw