import React from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import emailusericon from '../../../Assets/emailusericon.png'
import otpicon from '../../../Assets/otpicon.png'
import qrcode from '../../../Assets/qrcode.png'
import { THEME_COLORS } from '../../HelperClass/Constant';

const LoginTabBar = ({ selectedIndex, setSelectedIndex, configData }) => {

    return (
        <View style={styles.container}>
            {
                configData.username_status &&
                <TouchableOpacity style={[styles.Btn, { marginLeft: 10, backgroundColor: selectedIndex == 0 ? THEME_COLORS.black : THEME_COLORS.transparent }]} onPress={() =>
                    setSelectedIndex(0)
                }>
                    <Text style={[styles.Text, { color: selectedIndex == 0 ? 'white' : THEME_COLORS.black }]}>
                        Email or UserName
                    </Text>
                    {
                        selectedIndex == 0 ?
                            <View style={styles.imgeVw}>
                                <Image style={styles.image} source={emailusericon}>
                                </Image>
                            </View> : <></>
                    }
                </TouchableOpacity>
            }

            {
                configData.otp_status &&
                <TouchableOpacity style={[styles.Btn, { marginLeft: 10, marginRight: 10, backgroundColor: selectedIndex == 1 ? THEME_COLORS.black : THEME_COLORS.transparent }]} onPress={() =>
                    setSelectedIndex(1)
                }>
                    <Text style={[styles.Text, { color: selectedIndex == 1 ? 'white' : THEME_COLORS.black }]}>
                        OTP
                    </Text>
                    {
                        selectedIndex == 1 ?
                            <View style={styles.imgeVw}>
                                <Image style={styles.image} source={otpicon}>
                                </Image>
                            </View> : <></>
                    }
                </TouchableOpacity>
            }

            {
                configData.qr_code_status &&
                <TouchableOpacity style={[styles.Btn, { marginRight: 10, backgroundColor: selectedIndex == 2 ? THEME_COLORS.black : THEME_COLORS.transparent }]} onPress={() =>
                    setSelectedIndex(2)
                }>
                    <Text style={[styles.Text, { color: selectedIndex == 2 ? 'white' : THEME_COLORS.black }]}>
                        QR Code
                    </Text>
                    {
                        selectedIndex == 2 ?
                            <View style={styles.imgeVw}>
                                <Image style={styles.image} source={qrcode}>
                                </Image>
                            </View> : <></>
                    }
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: 50,
        backgroundColor: '#E8EFFF',
        flexDirection: 'row',
        borderRadius: 10
    },
    imgeVw: {
        height: 15,
        width: 15,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    Btn: {
        padding: 5,
        flexDirection: 'row',
        borderRadius: 10,
        alignSelf: 'center'
    },
    Text: {
        marginRight: 5,
        alignSelf: 'center'
    }
});
export default LoginTabBar;
