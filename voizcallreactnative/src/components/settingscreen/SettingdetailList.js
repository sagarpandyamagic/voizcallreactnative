import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { AppCommon_Font, StorageKey, THEME_COLORS, userprofilealias } from '../../HelperClass/Constant';
import LogoutModal from './LogoutModal';
import { AppStoreData, getStorageData, RemoveStorageData } from '../utils/UserData';
import SipUA from '../../services/call/SipUA';
import LottieView from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DLETEAPICAll, getProfile, POSTAPICALL } from '../../services/auth';
import { APIURL } from '../../HelperClass/APIURL';
import LodingJson from '../../HelperClass/LodingJson';
import DeviceInfo from 'react-native-device-info';
import { updateSipState } from '../../store/sipSlice';
import { getConfigParamValue } from '../../data/profileDatajson';
import store from '../../store/store';
import { PushSubScribeNotificaion } from '../../services/PushSubScribeNotificaion';
import { UpdateConfiguration } from './UpdateConfiguration';

const SettingdetailList = ({ title, image, navigation }) => {
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { soketConnect } = useSelector((state) => state.sip)
    const { allSession } = useSelector((state) => state.sip)
    const dispatch = useDispatch()

    const handlenavigation = async () => {
        console.log(title)

        if (title == "Pull Configration") {
            setLoading(true)
            await UpdateConfiguration()
            setLoading(false)
        }
        else if (title == "App languages") {
            navigation.navigate('App language')
        }
        else if (title == "About") {
        }
        else if (title == "Privacy Policy") {
            navigation.navigate('Privacy & Policy')
        }
        else if (title == "On Touch Voicemail") {
            AudioCall()
        }
        else if (title == "Logout") {
            setLogoutModalVisible(true)
        }
        else if (title == "WebSocket Test") {
            SipUA.disconnectSocket()
            navigation.navigate('WebSocket Test')
        }
    };

    const AudioCall = async () => {
        const number = await getConfigParamValue(userprofilealias.call_voicemailNumber)
        console.log("number", number)
        try {
            dispatch(updateSipState({ key: "Caller_Name", value: "Voicemail" }))
            dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
            // console.log("SessionCount",allSession)
            if (Object.keys(allSession).length > 0) {
                dispatch(updateSipState({ key: "ISConfrenceTransfer", value: true }))
                SipUA.toggelHoldCall(true)
            } else {
                dispatch(updateSipState({ key: "phoneNumber", value: [] }))
            }
            SipUA.makeCall(number, false)
            navigation.navigate('AudioCallingScreen')
        } catch (error) {
            console.log("error", error)
        }
    }


    const handleLogout = async () => {
        try {
            setLoading(true)
            setLogoutModalVisible(false);
           
            console.log(data)
            const pram = {
                "instance_id": await getStorageData(StorageKey.instance_id),
                "device_type": Platform.OS,
                "auth_type": await getStorageData(StorageKey.auth_type),
            }
            console.log(pram)
            const data = await DLETEAPICAll(APIURL.PushSubscribeDelete, pram)
            console.log("PushSubscribeDelete", data)
            if (data.success) {
                await RemoveStorageData(StorageKey.isLogin)
                SipUA.disconnectSocket()
                navigation.navigate('SplashScreen')
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }

    };

    useEffect(() => {
        setLoading(false)
    }, [soketConnect])

    return (
        <>
            {
                <LodingJson loading={loading} setLoading={setLoading} />
            }
            <TouchableOpacity
                onPress={handlenavigation}
                style={styles.copntain}>
                <View style={{ width: 35 }}></View>
                <Image
                    style={{ height: 20, width: 20, tintColor: THEME_COLORS.black, resizeMode: 'contain' }}
                    source={image}
                ></Image>
                <Text style={{ paddingLeft: 10, fontSize: 15, color: 'black' }}>
                    {title}
                </Text>
            </TouchableOpacity>
            < LogoutModal
                visible={isLogoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                onLogout={handleLogout}
            />

        </>
    );
};

const styles = StyleSheet.create({
    copntain: {
        height: 70,
        backgroundColor: '#e8efff',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
})

export default SettingdetailList;
