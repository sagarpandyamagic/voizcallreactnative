import React from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView, Dimensions } from 'react-native';
import { THEME_COLORS } from '../../HelperClass/Constant';
import voizLogo from '../../../Assets/voizcall_logo.png'
import voizLogoicon from '../../../Assets/voizcall_icon.png'

const { width } = Dimensions.get('window');

const LoginTopSideVw = () => {
  return (
    <View style={styles.TopView}>
      <Image style={styles.iconImage} resizeMode='contain'
        source={voizLogoicon} />
      <View style={styles.spacer} />
      <Image style={styles.logoImage} resizeMode="contain"
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
  iconImage: {
    width: width * 0.1,
    height: width * 0.1,
    maxWidth: 60,
    maxHeight: 60,
  },
  logoImage: {
    width: width * 0.5,
    height: 60,
    maxWidth: 300,
  },
  spacer: {
    width: 15,
  },
});
export default LoginTopSideVw;
