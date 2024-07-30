import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AppCommon_Font, StorageKey, THEME_COLORS } from '../../HelperClass/Constant';
import LogoutModal from './LogoutModal';
import { RemoveStorageData } from '../utils/UserData';
import SipUA from '../../services/call/SipUA';
import LottieView from 'lottie-react-native';
import loadinganimaion from '../../../Assets/animation.json';
import { useSelector } from 'react-redux';

const SettingdetailList = ({ title, image, navigation }) => {
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { soketConnect } = useSelector((state) => state.sip)

    const handlenavigation = () => {
        if (title == "Pull Configration") {
            setLoading(true)
            SipUA.disconnectSocket()
            SipUA.connect()
            console.log(title)
        }
        else if (title == "App languages") {
            navigation.navigate('App language')
            console.log(title)
        }
        else if (title == "About") {
            console.log(title)
        }
        else if (title == "Privacy Policy") {
            navigation.navigate('Privacy & Policy')
            console.log(title)
        }
        else if (title == "On Touch Voicemail") {
            console.log(title)
        }
        else if (title == "Logout") {
            setLogoutModalVisible(true)
            console.log(title)
        }
    };

    const handleLogout = async () => {
        RemoveStorageData(StorageKey.isLogin)
        setLogoutModalVisible(false);
        navigation.navigate('SplashScreen')
    };

    useEffect(()=>{
        setLoading(false)
    },[soketConnect])

    return (
        <>
            {
                loading ?
                    <LottieView
                        source={loadinganimaion}
                        autoPlay
                        loop
                        style={{ width: '100%', height: '100%', position: 'absolute', top: 20, alignItems: 'center', zIndex: 1, }}
                    /> : <></>
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
