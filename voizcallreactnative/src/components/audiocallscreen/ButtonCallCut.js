import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
    NativeModules,
    Platform,
} from 'react-native';
import { React, useState } from 'react';
import ic_decline_call from '../../../Assets/ic_decline_call.png'
import ic_hold from '../../../Assets/ic_hold.png'
import ic_transfercall from '../../../Assets/ic_transfer-call.png'
import SipUA from '../../services/call/SipUA';
import InCallManager from 'react-native-incall-manager';
import { useSelector } from 'react-redux';
import incomingusebyClass from '../../services/Callkeep/incomingusebyClass';
import RNCallKeep from 'react-native-callkeep';

const { width } = Dimensions.get('window')
const imageSize = width * 0.17; // Example: 10% of screen width
const itemSpacing = 40;      // Space between each Image+Text pair

const ButtonCallCut = () => {
    const { phoneNumber, sessionID, allSession, ISConfrenceTransfer } = useSelector((state) => state.sip)
    const { MyNativeModule } = NativeModules;

    const handelToggleHungup = () => {
        // console.log("ISConfrenceTransfer",ISConfrenceTransfer)
        if (ISConfrenceTransfer) {
            const keys = Object.keys(allSession)
            // console.log("keys",keys)
            const activeseationkey = keys[keys.length - 1]
            // console.log("activeseationkey",activeseationkey)
            SipUA.hangupSession(activeseationkey)
        } else {
            if(Platform.OS  == "ios") {
                incomingusebyClass.endIncomingcallAnswer();
            }
            SipUA.hangupCall(phoneNumber[0])
            InCallManager.setSpeakerphoneOn(false);
            InCallManager.stop();
        }

    }

    return (
        <View style={style.container}>
            <View style={style.item}>
                <TouchableOpacity style={[style.imageVw, { backgroundColor: 'red' }]} onPress={handelToggleHungup}>
                    <Image source={ic_decline_call} style={style.image}>
                    </Image>
                </TouchableOpacity>
                <Text style={[style.text, { color: 'red' }]}>
                    Hangup
                </Text>
            </View>
        </View>


    )
}
const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 20
    },
    image: {
        height: '100%',
        width: '100%',
    },
    imageVw: {
        height: imageSize,
        width: imageSize,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: imageSize / 2,
        shadowColor: '#000',  // Set shadow color to ensure visibility
        shadowOffset: { width: 0, height: 2 },  // Set the offset for the shadow
        shadowOpacity: 0.2,  // Set shadow opacity
        shadowRadius: 4,  // Set shadow blur radius
        elevation: 2,  // Android-specific shadow property

    },
    text: {
        fontSize: 14,
        marginTop: 5, // Set the font size of the text
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginHorizontal: itemSpacing / 2,
        width: imageSize,  // Set the width of the image
        height: imageSize,
    },
})
export default ButtonCallCut