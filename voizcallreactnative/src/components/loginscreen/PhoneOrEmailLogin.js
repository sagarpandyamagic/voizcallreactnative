import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Platform } from 'react-native';
import icUser from '../../../Assets/ic_user.png';
import LoginPlane from '../../../Assets/LoginPlane.png';
import ic_padlock from '../../../Assets/ic_padlock.png';
import { AppCommon_Font, StorageKey, THEME_COLORS, userprofilealias } from '../../HelperClass/Constant';
import { getProfile, POSTAPICALL, POSTAPICALLAllData } from '../../services/auth';
import { APIURL } from '../../HelperClass/APIURL';
import DeviceInfo from 'react-native-device-info';
import { AppStoreData, getStorageData } from '../utils/UserData';
import { generateUniqueId } from '../../HelperClass/InstanceID';
import { getConfigParamValue } from '../../data/profileDatajson';
import LottieView from 'lottie-react-native';
import store from '../../store/store';
import SipUA from '../../services/call/SipUA';
import { inticalluserData } from '../../store/sipSlice';
import { PushSubScribeNotificaion } from '../../services/PushSubScribeNotificaion';
import LodingJson from '../../HelperClass/LodingJson';
import { showAlert } from '../../HelperClass/CommonAlert';

const PhoneOrEmailLogin = ({ navi }) => {
    const [deviceId, setdeviceId] = useState('');
    const [deviceModel, setdeviceModel] = useState('');
    const [systemName, setsystemName] = useState('');
    const [username, setusername] = useState('voizCallS1@123');
    const [userpassword, setuserpassword] = useState('voizCallS1@123');
    const [loading, setLoading] = useState(false);
    const [currentLanguage,setLanguage] =useState('en');

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
        } catch (error) {
            console.error('Error getting device ID:', error);
        }
    }

    const LoginAPICall = async () => {
        try {
            await AppStoreData(StorageKey.instance_id, deviceId)
            const Instanceid = await getStorageData(StorageKey.instance_id)
            const FcmTokan = await getStorageData(StorageKey.FCM)
            const pram = {
                "usr_username": username,
                "usr_password": userpassword,
                "instance_id": Instanceid,
                "device_token": FcmTokan,
                "device_type": Platform.OS,
                "device_model": deviceModel,
                "device_os": systemName
            }
            console.log(pram)
            setLoading(true);
            const configInfo = await POSTAPICALLAllData(APIURL.LoginPhoneNumber, pram)
            console.log("configInfo", configInfo)

            if (configInfo.success) {
                console.log("configInfo.access_token",configInfo.data.access_token)
                console.log("configInfo.data.data",configInfo.data.data)
                await AppStoreData(StorageKey.userData, configInfo.data.data)
                await AppStoreData(StorageKey.access_token, configInfo.data.access_token)
                await AppStoreData(StorageKey.auth_type, configInfo.data.data.auth_type)
                await AppStoreData(StorageKey.isLogin, true)
                const value = await getStorageData(StorageKey.isLogin)
                const profileInfo = await getProfile()
                if (profileInfo.success) {
                    await AppStoreData(StorageKey.userprofiledata, profileInfo.data.account_properties)
                    const sipusername = await getConfigParamValue(userprofilealias.sip_username)
                    const password = await getConfigParamValue(userprofilealias.sip_password)
                    const sipserver = await getConfigParamValue(userprofilealias.sip_sipServer)
                    const sipport = "7443"
                    store.dispatch(inticalluserData({ sipusername, password, sipserver, sipport }))
                    const PushSubScribe = await PushSubScribeNotificaion(configInfo.data.data)
                    SipUA.connect()
                    navi.navigate('TabBar')
                }
                setLoading(false);
            } else {

            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {
                <LodingJson loading={loading} setLoading={setLoading} />
            }
            <View style={styles.InputTextView}>
                <View style={styles.InputTextSideImgView}>
                    <Image style={{ height: "45%", width: "40%" }}
                        source={icUser} />
                </View>
                <TextInput style={styles.InpuText} placeholder='Enter user name' defaultValue={username} placeholderTextColor={"#4F6EB4"} onChangeText={(text) => setusername(text)} te>
                </TextInput>
            </View>
            <View style={styles.InputTextView}>
                <View style={styles.InputTextSideImgView}>
                    <Image style={{ height: "45%", width: "40%" }}
                        source={ic_padlock} />
                </View>
                <TextInput style={styles.InpuText} placeholder='Password' defaultValue={userpassword} placeholderTextColor={"#4F6EB4"} onChangeText={(text) => setuserpassword(text)}>
                </TextInput>
            </View>
            <View style={[styles.InputTextView, { borderWidth: 0 }]} >
                <TouchableOpacity style={styles.linearGradient} onPress={LoginAPICall}>
                    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center', }}>
                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>
                            Login
                        </Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            style={{ width: 20, marginRight: 10, tintColor: '#fff' }}
                            resizeMode="contain"
                            source={LoginPlane} // Replace with the path to your image
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.InputTextView, { borderWidth: 0, justifyContent: 'flex-end', marginTop: 5 }]} onPress={() => {
                navi.navigate('ForgotPasswordScreen')
            }}>
                <Text style={{ paddingRight: 5, fontSize: 15 }}>Forgot Password?</Text>
            </TouchableOpacity>
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
        borderRadius: 5,
        fontFamily: AppCommon_Font.Font,
    },
    InpuText: {
        marginLeft: 15, height: "100%", color: THEME_COLORS.black, flex: 1,
        fontFamily: AppCommon_Font.Font,
        fontSize: 18 // Specify the custom font here
    },
    InputTextSideImgView: {
        backgroundColor: '#E8F1FF',
        width: "12%",
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
        fontFamily: AppCommon_Font.Font,
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
    }
});
export default PhoneOrEmailLogin;
