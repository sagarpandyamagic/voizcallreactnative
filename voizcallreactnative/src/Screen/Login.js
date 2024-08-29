import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { React, useState } from 'react';


import PhoneOrEmailLogin from '../components/loginscreen/PhoneOrEmailLogin';
import OTPScreen from '../components/loginscreen/OTPScreen';
import QrCode from '../components/loginscreen/QrCode';
import { AppCommon_Font, THEME_COLORS } from '../HelperClass/Constant';
import Footer from '../components/loginscreen/Footer';
import LoginTabBar from '../components/loginscreen/LoginTabBar';
import LoginTopSideVw from '../components/loginscreen/LoginTopSideVw';

const Login = ({ navigation, route }) => {
  const { configData } = route.params || {};
  console.log(configData)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { height: screenHeight } = Dimensions.get('window');

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS == "android" ? "height" : "padding"}>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{height:screenHeight, flexGrow: 1, justifyContent: 'center' }}>
          <View style={[style.mainViewContain, {}]}>
            <LoginTopSideVw />
            <View style={[style.DownView]}>
              <View style={{ alignContent: 'center', alignSelf: 'center', padding: 20 }}>
                {
                  selectedIndex == 2 ? <Text style={style.hederText}> Scan to Login </Text> : <Text style={style.hederText}> Login Your Account </Text>
                }
              </View>
              <LoginTabBar selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} configData={configData} />
              {
                selectedIndex == 0 ?
                  <PhoneOrEmailLogin navi={navigation} />
                  : <>
                    {
                      selectedIndex == 2 ? <QrCode  navigation={navigation} /> : < OTPScreen navigation={navigation} configData={configData} />
                    }
                  </>
              }
            </View>
            <Footer />

          </View >
        </ScrollView >

      </KeyboardAvoidingView>
    </>
  )
}
const style = StyleSheet.create({
  mainViewContain: {
    flex: 1,
    backgroundColor: THEME_COLORS.black,
  },
  hederText: {
    color: 'black',
    alignContent: 'center',
    fontSize: 20,
    fontFamily: AppCommon_Font.Font,
  },
  DownView: {
    backgroundColor: '#FFFF',
    flex: 2,
    borderTopLeftRadius: 50,
  },
})
export default Login