import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { updateSipState } from '../../store/sipSlice';
import phoneLogo from '../../../Assets/phone-call.png';
import ArrowGoCall from '../../../Assets/ic_next_arrow.png';
import { useDispatch, useSelector } from 'react-redux';


const CallingShowInfo = () => {
    const { Caller_Name,SessionCount,phoneNumber } = useSelector((state) => state.sip)
    const dispatch = useDispatch()
    
    return (
        <View style={{
            height: 50
            , width: "60%"
            , backgroundColor: '#4F6EB4'
            , alignSelf: 'center'
            , marginTop: 10
            , justifyContent: 'center'
            , borderRadius: 5
        }}>
            <TouchableOpacity onPress={() => {
                dispatch(updateSipState({ key: "ISCallTransfer", value: false }))
                dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ height: 25, width: 25, marginLeft: 15 }} source={phoneLogo} />
                    <Text style={{ color: '#fff', marginLeft: 15, flex: 1 }}> 
                        {/* {Caller_Name} */}
                     { SessionCount >= 2 ? "Confrence" : (Caller_Name == "") ? phoneNumber[0] : Caller_Name }
                    </Text>
                    <View>
                        <Image style={{ height: 25, width: 25, marginRight: 15, tintColor: 'white' }} source={ArrowGoCall} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
export default CallingShowInfo;
