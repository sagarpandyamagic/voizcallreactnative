import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Dimensions, Platform,Switch } from 'react-native';
import { AppCommon_Font, StorageKey, THEME_COLORS } from '../../HelperClass/Constant';
import LinearGradient from 'react-native-linear-gradient';
import moonsleep from '../../../Assets/moonsleep.png'
import { AppStoreData, getStorageData } from '../utils/UserData';
import SipUA from '../../services/call/SipUA';
import { setInitTimeValue } from '../../services/setInitVlaue';
import { useSelector } from 'react-redux';
import store from '../../store/store';

const ActivationSwitch = () => {
    const { UserActive,UserDND} = useSelector((state) => state.sip)
    const [isEnabledActive, setIsEnabledActive] = useState(UserActive);
    const [isEnabledDND, setIsEnabledDND] = useState(UserDND);
    const toggleSwitchActive = () => setIsEnabledActive(previousState => !previousState);
    const toggleSwitchDND = () => setIsEnabledDND(previousState => !previousState);
    const { width: screenWidth } = Dimensions.get('window');

    useEffect(() => {
        MangeSipconnectOrDisconnect()
    }, [isEnabledActive])

    useEffect(() => {
        MangeDND()
    }, [isEnabledDND])


    useEffect(() => {
        MangeSwitch()
    },[])

    const MangeSipconnectOrDisconnect = async () => {
        const value = await AppStoreData(StorageKey.UserActive,isEnabledActive);
        if(isEnabledActive){
            setInitTimeValue()
        }else{
            SipUA.disconnectSocket()
        } 
        store.dispatch(updateSipState({ key: "UserActive", value: isEnabledActive }))

    }

    const MangeSwitch = async () => {
        const value = await getStorageData(StorageKey.UserActive);
        console.log("setIsEnabledActive",value)
        setIsEnabledActive(value)
        const valueDND = await getStorageData(StorageKey.UserDND);
        console.log("valueDND",valueDND)
        setIsEnabledDND(valueDND)
    }

    const MangeDND = async () => {
        console.log("isEnabledDND",isEnabledDND)
        const value = await AppStoreData(StorageKey.UserDND,isEnabledDND);
        store.dispatch(updateSipState({ key: "UserDND", value: isEnabledDND }))
    }

    return (
        <>
            <View style={styles.maincontainer}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={[THEME_COLORS.black, '#4c669f']}
                    style={{ height: 130, width: screenWidth * 0.42, borderRadius: 10 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                        <View style={{ width: 15 }}></View>
                        <Text style={{ fontSize: 16, color: 'white', paddingTop: 15,fontFamily: AppCommon_Font.Font,fontWeight:'bold' }}>Active</Text>
                        <View style={styles.switchContainer}>
                            <Switch
                                trackColor={{ false: '#767577', true: 'white' }}
                                thumbColor={isEnabledActive ? '#005CA3' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchActive}
                                value={isEnabledActive}
                                style={[styles.switch]}
                            />
                        </View>

                    </View>
                    <Text style={[styles.Text, { paddingTop: 15, }]}>
                        Disable the user account;
                    </Text>
                    <Text style={styles.Text}>it stop calls.</Text>
                </LinearGradient>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={[THEME_COLORS.black, '#4c669f']}
                    style={{ height: 130, width: screenWidth * 0.42, borderRadius: 10, position: 'absolute', right: 45 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                        <View style={{ width: 15 }}></View>
                        <View style={{ height: 25, width: 25, marginTop: 15, marginRight: 5 }}>
                            <Image source={moonsleep} style={{ height: '100%', width: '100%' }} ></Image>
                        </View>
                        <Text style={{ fontSize: 16, color: 'white', paddingTop: 15,fontFamily: AppCommon_Font.Font,fontWeight:'bold' }}>DND</Text>
                        <View style={styles.switchContainer}>
                            <Switch
                                trackColor={{ false: '#767577', true: 'white' }}
                                thumbColor={isEnabledDND ? '#005CA3' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchDND}
                                value={isEnabledDND}
                                style={styles.switch}
                            />
                        </View>
                    </View>
                    <Text style={[styles.Text, { paddingTop: 15, }]}>
                        All incoming call will be
                    </Text>
                    <Text style={styles.Text}>silenced</Text>
                </LinearGradient>
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    maincontainer: {
        height: 150,
        left: 25,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    switchContainer: {
        flex: 1,// Adjust the width
        paddingTop: 15,
        alignItems: 'flex-end',
        paddingRight: 10
    },
    switch: {
        transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    },
    Text: {
        fontSize: 10,
        color: 'white',
        paddingLeft: 15,
        fontFamily: AppCommon_Font.Font,
        fontWeight: 'semibold'
    }
})

export default ActivationSwitch;
