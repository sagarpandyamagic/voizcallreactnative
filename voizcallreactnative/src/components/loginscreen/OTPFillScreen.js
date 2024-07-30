import {
    View,
    StyleSheet,
    Image,
    Text,
    ScrollView,
    Dimensions
} from 'react-native';
import { React, useEffect, useState } from 'react';

import LoginTopSideVw from './LoginTopSideVw';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import Footer from './Footer';
import OTPTextInput from 'react-native-otp-textinput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import OTPTimer from './OTPTimer';
import ic_verify from '../../../Assets/ic_verify.png'


const OTPFillScreen = ({ navigation, route }) => {
    const { OTPInfo } = route.params || {};
    const [otp, setOtp] = useState('');

    const handleTimeUp = () => {
        console.log('Time is up!');
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={[style.mainViewContain, {}]}>
                <LoginTopSideVw />
                <View style={[style.DownView]}>
                    <View style={{ alignContent: 'center', alignSelf: 'center', padding: 20 }}>
                        <Text style={style.hederText}> OTP Verificaion </Text>
                    </View>
                    <Text style={[style.hederText, { marginLeft: 20, fontSize: 15 }]}> Enter the verificaion code we just send on your email address </Text>
                    <View style={style.otpVw}>
                        <OTPTextInput
                            handleTextChange={(text) => setOtp(text)}
                            inputCount={OTPInfo.otp_length}
                            containerStyle={style.otpContainer}
                            textInputStyle={style.otpInput}
                            tintColor='#3E5DA3'
                            keyboardType="numeric"
                            offTintColor="#CCCCCC"
                        />
                    </View>
                    <View style={[style.btn]} >
                        <TouchableOpacity style={style.linearGradient} onPress={() => {
                        }}>
                            <View style={{ justifyContent: 'center',flex:1,alignItems: 'center', }}>
                                <Text style={[style.buttonText, { alignSelf: 'center' }]}>
                                    Verify
                                </Text>
                            </View>
                            <View style={style.imageContainer}>
                                <Image
                                    style={{ width: 20, marginRight: 10 }}
                                    resizeMode="contain"
                                    source={ic_verify} 
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <OTPTimer duration={OTPInfo.otp_expiry_time} onTimeUp={handleTimeUp} />
                </View>
                <Footer />
            </View >
        </ScrollView >
    )
}
const style = StyleSheet.create({
    mainViewContain: {
        flex: 1,
        backgroundColor: THEME_COLORS.black,
    },
    hederText: {
        color: 'black',
        alignContent: 'center',
        fontSize: 20,
        fontFamily: AppCommon_Font.Font,
    },
    DownView: {
        backgroundColor: '#FFFF',
        flex: 2,
        borderTopLeftRadius: 50,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        borderWidth: 0
    },
    otpInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
        marginHorizontal: 5, 
        borderRadius: 10
    },
    otpVw: {
        alignItems: 'center',
        padding: 20,
        marginTop: 25,
    },
    btn: {
        marginTop: 20,
        marginHorizontal: 20,
        height: 50,
        borderRadius: 5,
        fontFamily: AppCommon_Font.Font,
    },
    linearGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        backgroundColor: THEME_COLORS.black,
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
        fontFamily: AppCommon_Font.Font,
        marginLeft:20
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:20
    }
})
export default OTPFillScreen