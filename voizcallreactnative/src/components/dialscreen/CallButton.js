import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';

import phoneLogo from '../../../Assets/ic_call.png';
import ic_videoCall from '../../../Assets/ic_videoCall.png';
import ic_remove_number from '../../../Assets/ic_remove_number.png';
import { THEME_COLORS } from '../../HelperClass/Constant';
import { useSelector, useDispatch } from 'react-redux';
import { storeContactNumber, updateSipState } from '../../store/sipSlice';
import SipUA from '../../services/call/SipUA';
import { showAlert } from '../../HelperClass/CommonAlert';
import voicemailicon from '../../../Assets/voicemailicon.png';

const { width } = Dimensions.get('window')

const CallButton = ({ navigation, setCode, code, voizmailAcation }) => {
    const dispatch = useDispatch()
    const { ISConfrenceTransfer, phoneNumber, allSession, UserDND,soketConnect } = useSelector((state) => state.sip)
    const [videoCall, setVideoCall] = useState(false);
    const [btnEnable, setbtnEnable] = useState(false);

    const handleMakeCall = async (code) => {
        if(soketConnect == false){
            showAlert('Sokcet is not connected!', "Call is not Going")    
            return
        }
        const number = code.join('')
        if (number == "") {
            showAlert('Empty Number!', "please enter phonenumber")
        } else {
            number.toString()
            console.log(number)
            dispatch(updateSipState({ key: "Caller_Name", value: number }))
            dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
            console.log("SessionCount", allSession)
            if (Object.keys(allSession).length > 0) {
                dispatch(updateSipState({ key: "ISConfrenceTransfer", value: true }))
                console.log("ISConfrenceTransfer", ISConfrenceTransfer)
                SipUA.toggelHoldCall(true)
            } else {
                dispatch(updateSipState({ key: "phoneNumber", value: [] }))
            }
            console.log("ISConfrenceTransfer", ISConfrenceTransfer)
            SipUA.makeCall(number, false)
            navigation.navigate('AudioCallingScreen')
        }
    };

    const handleMakeVideoCall = async (code) => {
        SipUA.makeCall("777777", true)

        return
        const number = code.join('')
        if (number == "") {
            showAlert('Empty Number!', "please enter phonenumber")
        } else {
            number.toString()
            console.log(number)
            dispatch(updateSipState({ key: "Caller_Name", value: number }))
            // dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
            console.log("SessionCount", allSession)
            if (Object.keys(allSession).length > 0) {
                dispatch(updateSipState({ key: "ISConfrenceTransfer", value: true }))
                console.log("ISConfrenceTransfer", ISConfrenceTransfer)
                SipUA.toggelHoldCall(true)
            } else {
                dispatch(updateSipState({ key: "phoneNumber", value: [] }))
            }
            console.log("ISConfrenceTransfer", ISConfrenceTransfer)
            SipUA.makeCall(number, true)
        }
    };

    useEffect(() => {
        getConfigParamValue
    }, [UserDND])

    const getConfigParamValue = async () => {
        setVideoCall(await getConfigParamValue(userprofilealias.video_enableVideo))
        console.log("UserDND->", UserDND)
        setbtnEnable(UserDND)
    }


    return (
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 80, justifyContent: 'center' }} >
            <TouchableOpacity onPress={() => voizmailAcation()} style={[styles.callBtn, { width: 60, borderRadius: 20, backgroundColor: '#E8EFFF', justifyContent: 'center', alignSelf: 'center', position: 'absolute', left: width * 0.15 }]}
            >
                <Image
                    source={voicemailicon}
                    resizeMode="cover"
                    style={[styles.callBtnImage, { tintColor: THEME_COLORS.black, height: 25, width: 25, resizeMode: 'contain' }]}></Image>
            </TouchableOpacity>

            <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.callBtn, { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRadius: videoCall ? 0 : 10 }]} onPress={() => {
                    handleMakeCall(code)
                }} disabled={btnEnable} >
                    <Image
                        source={phoneLogo}
                        resizeMode="cover"
                        style={[styles.callBtnImage, { opacity: btnEnable ? 0.5 : 1 }]}></Image>
                </TouchableOpacity>
                {
                // videoCall &&
                    <TouchableOpacity style={[styles.callBtn, { borderTopRightRadius: 10, borderBottomRightRadius: 10 }]} disabled={btnEnable} onPress={() => {
                        handleMakeVideoCall(code)
                    }}>
                        <Image
                            source={ic_videoCall}
                            resizeMode="cover"
                            style={[styles.callBtnImage, { opacity: btnEnable ? 0.5 : 1 }]}></Image>
                    </TouchableOpacity>
                }
            </View>
            {/* {
                setCode.length > 0 ? <TouchableOpacity style={[styles.callBtn, { width: 60, borderRadius: 20, backgroundColor: THEME_COLORS.black, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 20 }]}
                    onPress={onRemove}
                >
                    <Image
                        source={ic_remove_number}
                        resizeMode="cover"
                        style={[styles.callBtnImage]}></Image>
                </TouchableOpacity> : <></>
            } */}
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        height: 70,
        backgroundColor: '#fff',
        marginBottom: -1,
    },
    footerImage: {
        height: '100%',
        width: '100%',
    },
    callBtn: {
        height: 40, width: 60, marginLeft: 2, backgroundColor: THEME_COLORS.black, justifyContent: 'center', alignItems: 'center'
    },
    callBtnImage: {
        tintColor: '#fff', height: 20, width: 20,
    }
});
export default CallButton;
