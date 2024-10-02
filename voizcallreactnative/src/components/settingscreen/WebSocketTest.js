import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Dimensions } from 'react-native';

import ic_socket_connection from '../../../Assets/ic_socket_connection.png';
import ic_tick_blue from '../../../Assets/ic_tick_blue.png';

import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import SipUA from '../../services/call/SipUA';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window')

const WebSocketTest = ({ navigation }) => {
    const [currentDateTime, setCurrentDateTime] = useState('');
    const { soketConnect } = useSelector((state) => state.sip)

  

    useEffect(() => {
        setTimeout(() => {
            SipUA.connect()
        }, 2000);

        updateDateTime();
    }, []);

    const updateDateTime = () => {
        const now = new Date();
        const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()} GMT${now.getTimezoneOffset() / -60}`;
        setCurrentDateTime(formattedDateTime);
    };


    return (
        <>
            <View style={{ height: 150, width: 150, alignSelf: 'center', marginTop: 50 }}>
                {
                    soketConnect == false ? <Image source={ic_socket_connection} style={{ width: "100%", height: "100%", alignSelf: 'center' }} /> : <Image source={ic_tick_blue} style={{ width: "100%", height: "100%", alignSelf: 'center' }} />
                }
            </View>
            {
                soketConnect ? <Text style={{ alignSelf: 'center', marginTop: 25, fontWeight: 'bold',fontFamily:AppCommon_Font.Font }}>Connected</Text> :
                    <Text style={{ alignSelf: 'center', marginTop: 25, fontWeight: 'bold',fontFamily:AppCommon_Font.Font }}>Connecting to web socket</Text>
            }

            <View style={{ height: 50, width: width * 0.9, alignSelf: 'center', marginTop: 15, backgroundColor: THEME_COLORS.black, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ alignSelf: 'center', fontWeight: 'bold', color: 'white' }}>{currentDateTime}</Text>
            </View>

        </>
    );
};
const styles = StyleSheet.create({

})

export default WebSocketTest;
