import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import qrcode from '../../../Assets/qrcode.json';
import LottieView from 'lottie-react-native';
import { THEME_COLORS } from '../../HelperClass/Constant';
import backarrowR from '../../../Assets/backarrowR.png';

const QrCode = ({navigation}) => {
    return (
        <>
            <View style={{height:200,width:200,alignSelf:'center',marginTop:20}}>
                <LottieView
                    source={qrcode}
                    autoPlay
                    loop
                    style={styles.animation}
                />
            </View>
            <View style={[styles.InputTextView, { borderWidth: 0 }]} >
                <TouchableOpacity style={styles.linearGradient} onPress={() => {
                   
                   navigation.navigate('QrScanScreen')    

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
const styles = StyleSheet.create ({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      animation: {
        width: '100%', // Set the width as per your requirement
        height: '100%', // Set the height as per your requirement
      },
      InputTextView: {
        borderBlockColor: THEME_COLORS.black,
        borderWidth: 0.5,
        marginTop: 20,
        marginHorizontal: 20,
        flexDirection: 'row',
        height: 50,
        borderRadius: 5
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
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },

})

export default QrCode;
