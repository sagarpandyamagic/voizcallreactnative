import React from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView } from 'react-native';
import { THEME_COLORS } from '../../HelperClass/Constant';
import voizLogo from '../../../Assets/voizcall_logo.png'
import voizLogoicon from '../../../Assets/voizcall_icon.png'

const LoginTopSideVw = () => {
    return (
        <View style={styles.TopView}>
        <Image style={{ width: "10%", height: "10%", padding: 20 }}
          source={voizLogoicon} />
        <View style={{ width: 15 }}>
        </View>
        <Image style={{ width: "50%", height: "30%", padding: 20 }} resizeMode="contain"
          source={voizLogo} />
      </View>
    );
};

const styles = StyleSheet.create({
    TopView: {
        backgroundColor: THEME_COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        flexDirection: 'row',
      },
});
export default LoginTopSideVw;
