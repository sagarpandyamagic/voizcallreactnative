import {
    View,
    StyleSheet,
    Image,
    Text,
    ScrollView,
    Dimensions,
    Platform
} from 'react-native';
import { React, useEffect, useState } from 'react';

import LoginTopSideVw from './LoginTopSideVw';
import { AppCommon_Font, StorageKey, THEME_COLORS, userprofilealias } from '../../HelperClass/Constant';
import Footer from './Footer';
import OTPTextInput from 'react-native-otp-textinput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import OTPTimer from './OTPTimer';
import ic_verify from '../../../Assets/ic_verify.png'
import DeviceInfo from 'react-native-device-info';
import LottieView from 'lottie-react-native';
import LodingJson from '../../HelperClass/LodingJson';
import { AppStoreData, getStorageData } from '../utils/UserData';
import { getProfile, POSTAPICALLAllData } from '../../services/auth';
import { PushSubScribeNotificaion } from '../../services/PushSubScribeNotificaion';
import store from '../../store/store';
import { inticalluserData } from '../../store/sipSlice';
import { APIURL } from '../../HelperClass/APIURL';
import { getConfigParamValue } from '../../data/profileDatajson';
import SipUA from '../../services/call/SipUA';


const OTPFillScreen = ({ navigation, route }) => {
    const { OTPInfo,OptApiData } = route.params || {};
    const [otp, setOtp] = useState('');
    const [deviceId, setdeviceId] = useState('');
    const [deviceModel, setdeviceModel] = useState('');
    const [systemName, setsystemName] = useState('');
    const [loading, setLoading] = useState(false);
    const APIDATA =  OptApiData
    useEffect(() => {
        getDeviceId()
    }, [])

    async function getDeviceId() {
        try {
            const deviceId = await DeviceInfo.getUniqueId();
            const deviceModel = DeviceInfo.getModel(); // Get the device model
            const systemName = DeviceInfo.getSystemName();

            const cleanedString = deviceId.replace(/-/g, '');
            setdeviceId(cleanedString)
            console.log('deviceId', deviceId);
            setdeviceModel(deviceModel)
            setsystemName(systemName)
            // console.log('Device ID:', deviceId);
        } catch (error) {
            console.error('Error getting device ID:', error);
        }
    }

    const handleTimeUp = () => {
        console.log('Time is up!');
    };

    const handleresendAPICall = async () => {
        ReSendOTP()
    };

    const onBarCodeRead = async (otpvalue) => {
        try {

            if (loading == true) {
                return
            }

            setLoading(true);

            await AppStoreData(StorageKey.instance_id, deviceId)
            const Instanceid = await getStorageData(StorageKey.instance_id)
            const FcmTokan = await getStorageData(StorageKey.FCM)

            const pram = {
                "otp_value": otpvalue,
                "instance_id": Instanceid,
                "device_type": Platform.OS,
                "device_model": deviceModel,
                "device_os": systemName,
                "device_token": FcmTokan,
                "otp_auth_token":APIDATA.data.otp_auth_token
            }

            console.log(pram)

            setLoading(true);
            const configInfo = await POSTAPICALLAllData(APIURL.VERIFY_OTP, pram)
            console.log(configInfo.data.access_token)
            console.log(configInfo.data.data)

            if (configInfo.success) {
                await AppStoreData(StorageKey.userData, configInfo.data.data)
                await AppStoreData(StorageKey.access_token, configInfo.data.access_token)
                await AppStoreData(StorageKey.auth_type, configInfo.data.data.auth_type)
                await AppStoreData(StorageKey.isLogin, true)

                const value = await getStorageData(StorageKey.isLogin)
                const profileInfo = await getProfile()
                console.log("profileInfo", profileInfo)
                if (profileInfo.success) {
                    await AppStoreData(StorageKey.userprofiledata, profileInfo.data.account_properties)
                    const sipusername = await getConfigParamValue(userprofilealias.sip_username)
                    const password = await getConfigParamValue(userprofilealias.sip_password)
                    const sipserver = await getConfigParamValue(userprofilealias.sip_sipServer)
                    const sipport = "7443"
                    store.dispatch(inticalluserData({ sipusername, password, sipserver, sipport }))

                    await PushSubScribeNotificaion(configInfo.data.data)

                    SipUA.connect()
                    navigation.navigate('TabBar')
                }
                setLoading(false);
            } else {
                navigation.navigate.pop(1)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const ReSendOTP = async () => {
        setLoading(true);
        console.log(APIDATA)
        const pram = {
            "otp_auth_token": APIDATA.data.otp_auth_token,
            "user_type": "mobile",
        }
        console.log(pram)
        try {
            const configInfo = await POSTAPICALLAllData(APIURL.RESETD_OTP, pram)
            if (configInfo.success) {
                console.log(configInfo.data.data)
                console.log(APIDATA)
            }
        } catch (error) {
            console.log(error)
        }
 
        setLoading(false);
    }



    return (
        <>
            {
                <LodingJson loading={loading} setLoading={setLoading} />
            }
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
                                onBarCodeRead({otp})
                            }}>
                                <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center', }}>
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
                        <OTPTimer duration={OTPInfo.otp_expiry_time} onTimeUp={handleTimeUp} resendRequestAPI={handleresendAPICall} />
                    </View>
                    <Footer />
                </View >
            </ScrollView >
        </>
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
        marginLeft: 20
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20
    },
    animation: {
        width: '100%', // Set the width as per your requirement
        height: '100%', // Set the height as per your requirement
    },
})
export default OTPFillScreen