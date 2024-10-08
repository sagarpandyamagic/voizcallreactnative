import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import backarrowR from '../../../Assets/backarrowR.png';
import { THEME_COLORS, AppCommon_Font } from '../../HelperClass/Constant';
import { SendOTPAPI } from '../../services/auth';
import LodingJson from '../../HelperClass/LodingJson';
import { useSelector } from 'react-redux';

const OTPScreen = ({ navigation, configData }) => {
    const [otpnumber, setotpnumber] = useState();
    const [loading, setLoading] = useState(false);
    const { CountyCode } = useSelector((state) => state.sip)


    const GetOTPAPICall = async () => {
        setLoading(true)
        const data = {
            "user_type": "mobile",
            "user_data": otpnumber,
            "usr_country_phonecode": CountyCode //configData.default_country.country_phonecode
        }
        const OptApiData = await SendOTPAPI(data)
        console.log("OptApiData", OptApiData)
        if (OptApiData.success) {
            setLoading(false)
            navigation.navigate('OTPFillScreen', { OTPInfo: configData.otp, OptApiData: OptApiData })
        }else{
            setLoading(false)
        }
    }

    return (
        <>
            {
                <LodingJson loading={loading} setLoading={setLoading} />
            }
            <View style={styles.InputTextView}>
                <TouchableOpacity style={styles.InputTextSideImgView} onPress={() => {
                    navigation.navigate('Pick Your County')
                }}>
                    <Text style={styles.Text} >+{CountyCode}</Text>
                </TouchableOpacity>
                <TextInput style={styles.InpuText} keyboardType='number-pad' placeholder='Enter mobile number'  placeholderTextColor={THEME_COLORS.black} onChangeText={(text) => setotpnumber(text)}>
                    {otpnumber}
                </TextInput>
            </View>
            <View style={[styles.InputTextView, { borderWidth: 0 }]} >
                <TouchableOpacity style={styles.linearGradient} onPress={() => {
                    GetOTPAPICall()
                }}>
                    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center', }}>
                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>
                            Continue
                        </Text>
                    </View>
                    <View style={[styles.imageContainer, { top: 15 }]}>
                        <Image
                            style={{ width: 20, tintColor: '#fff' }}
                            resizeMode="contain"
                            source={backarrowR}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    InputTextView: {
        borderBlockColor: THEME_COLORS.black,
        borderWidth: 0.5,
        marginTop: 20,
        marginHorizontal: 20,
        flexDirection: 'row',
        height: 50,
        borderRadius: 5
    },
    InpuText: {
        marginLeft: 15, height: "100%", color: THEME_COLORS.black, flex: 1,
        fontFamily: AppCommon_Font.Font,
        fontSize: 18
    },
    InputTextSideImgView: {
        backgroundColor: '#E8F1FF',
        width: "18%",
        height: "99%",
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },
    linearGradient: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: THEME_COLORS.black
    },
    imageContainer: {
        position: 'absolute',
        right: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Text: {
        fontSize: 15,
        color: THEME_COLORS.black,
        fontFamily: AppCommon_Font.Font
    }
});
export default OTPScreen;
