import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import icUser from '../../../Assets/ic_user.png';
import backarrowR from '../../../Assets/backarrowR.png';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { RESETPOSTAPICALL } from '../../services/auth';
import { APIURL } from '../../HelperClass/APIURL';
import LodingJson from '../../HelperClass/LodingJson';

const FUserTextFiled = ({ navigation }) => {
    const [username, setusername] = useState('');
    const [loading, setLoading] = useState(false);

    const ResetPasswordAPICAll = async () => {
        setLoading(true)
        const prma = {
            "usr_username": username,
            "user_type": "mobile",
        }
        console.log(prma)
        const data = await RESETPOSTAPICALL(APIURL.ResetPassword, prma)
        console.log(data)
        setLoading(false)
        Alert.alert(
            `${data.data.status}`,
            `${data.data.message}`,
            [
                {
                    text: 'Ok',
                    onPress: async () => {
                        navigation.pop(1)
                    },
                },
            ],
        );

    }


    return (
        <>
            {
                <LodingJson loading={loading} setLoading={setLoading} />
            }
            <View style={styles.InputTextView}>
                <View style={styles.InputTextSideImgView}>
                    <Image style={{ height: "45%", width: "40%", tintColor: THEME_COLORS.black }}
                        source={icUser} />
                </View>
                <TextInput style={styles.InpuText} placeholder='Username' defaultValue={username} placeholderTextColor={THEME_COLORS.black} onChangeText={(text) => setusername(text)}>
                </TextInput>
            </View>

            <View style={[styles.InputTextView, { borderWidth: 0 }]} >
                <TouchableOpacity style={styles.linearGradient} onPress={ResetPasswordAPICAll}>
                    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center', }}>
                        <Text style={[styles.buttonText, { alignSelf: 'center', fontWeight: 'bold' }]}>
                            continue
                        </Text>
                    </View>
                    <View style={[styles.imageContainer, { top: 15 }]}>
                        <Image
                            style={{ width: 20, tintColor: '#fff' }}
                            resizeMode="contain"
                            source={backarrowR} // Replace with the path to your image
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
export default FUserTextFiled;
