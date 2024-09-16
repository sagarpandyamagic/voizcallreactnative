import React from 'react';
import { View, Image, StyleSheet,TouchableOpacity, Alert } from 'react-native';

import ic_CallT_shuffle from '../../../Assets/ic_CallT_shuffle.png';
import ic_remove_number from '../../../Assets/ic_remove_number.png';
import { THEME_COLORS } from '../../HelperClass/Constant';
import { useDispatch } from 'react-redux';
import { updateSipState } from '../../store/sipSlice';
import SipUA from '../../services/call/SipUA';
import { showAlert } from '../../HelperClass/CommonAlert';
import store from '../../store/store';


const AttendedTransferButton = ({ navigation,setCode,code }) => {
    const dispatch = useDispatch()

    const handleMakeCall = async (code) => {
        
        const number = code.join('')
        if (number == "") {
            showAlert('Empty Number!',"please enter phonenumber")
        }else{
            number.toString()
            console.log(number)
            store.dispatch(updateSipState({ key: "ISAttendedTransfer", value: false }))
        }    
    };
    return (
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 80, justifyContent: 'center' }} >
            <View style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.callBtn, { borderRadius: 10}]} onPress={()=>{
                     handleMakeCall(code)
                }} >
                    <Image
                        source={ic_CallT_shuffle}
                        resizeMode="center"
                        style={styles.callBtnImage}></Image>
                </TouchableOpacity>
            </View>

            {/* {
                setCode.length > 0 ? <TouchableOpacity style={[styles.callBtn, { width:60,borderRadius:20, backgroundColor: THEME_COLORS.black, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 20 }]}
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
        height: 45, width: 70, marginLeft: 2, backgroundColor: THEME_COLORS.black, justifyContent: 'center', alignItems: 'center'
    },
    callBtnImage: {
        tintColor: '#fff', height: 20, width: 20,
    }
});
export default AttendedTransferButton;
