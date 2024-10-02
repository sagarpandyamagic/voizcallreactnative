import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { React, useState } from 'react';


import PhoneOrEmailLogin from '../components/loginscreen/PhoneOrEmailLogin';
import OTPScreen from '../components/loginscreen/OTPScreen';
import QrCode from '../components/loginscreen/QrCode';
import { AppCommon_Font, StorageKey, THEME_COLORS } from '../HelperClass/Constant';
import Footer from '../components/loginscreen/Footer';
import LoginTabBar from '../components/loginscreen/LoginTabBar';
import LoginTopSideVw from '../components/loginscreen/LoginTopSideVw';
import { AppStoreData, getStorageData } from '../components/utils/UserData';
import { getProfile } from '../services/auth';
import { getConfigParamValue } from '../data/profileDatajson';
import { inticalluserData } from '../store/sipSlice';
import store from '../store/store';
import { PushSubScribeNotificaion } from '../services/PushSubScribeNotificaion';

const Login = ({ navigation, route }) => {
  const { configData } = route.params || {};
  console.log(configData)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { height: screenHeight } = Dimensions.get('window');

  const LoginQrCode = async (e) => { 
    try {

      if (loading == true) {
        return
      }

      setLoading(true);

      await AppStoreData(StorageKey.instance_id, deviceId)
      const Instanceid = await getStorageData(StorageKey.instance_id)
      const FcmTokan = await getStorageData(StorageKey.FCM)

      const pram = {
        "qr_code": e.data,
        "instance_id": Instanceid,
        "device_type": Platform.OS,
        "device_model": deviceModel,
        "device_os": systemName,
        "device_token": FcmTokan
      }

      console.log(pram)

      setLoading(true);
      const configInfo = await Qr_login(pram)
      console.log(configInfo.data.access_token)
      console.log(configInfo.data.data)

      if (configInfo.success) {
        await AppStoreData(StorageKey.userData, configInfo.data.data)
        await AppStoreData(StorageKey.access_token, configInfo.data.access_token)
        await AppStoreData(StorageKey.auth_type, configInfo.data.data.auth_type)
        await AppStoreData(StorageKey.isLogin, true)

        const value = await getStorageData(StorageKey.isLogin)
        const profileInfo = await getProfile()
        console.log("profileInfo", profileInfo)
        if (profileInfo.success) {
          await AppStoreData(StorageKey.userprofiledata, profileInfo.data.account_properties)
          const sipusername = await getConfigParamValue(userprofilealias.sip_username)
          const password = await getConfigParamValue(userprofilealias.sip_password)
          const sipserver = await getConfigParamValue(userprofilealias.sip_sipServer)
          const sipport = "7443"
          store.dispatch(inticalluserData({ sipusername, password, sipserver, sipport }))

          await PushSubScribeNotificaion(configInfo.data.data)

          SipUA.connect()
          navigation.navigate('TabBar')
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS == "android" ? "height" : "padding"}>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{height:screenHeight, flexGrow: 1, justifyContent: 'center' }}>
          <View style={[style.mainViewContain, {}]}>
            <LoginTopSideVw />
            <View style={[style.DownView]}>
              <View style={{ alignContent: 'center', alignSelf: 'center', padding: 20 }}>
                {
                  selectedIndex == 2 ? <Text style={style.hederText}>Scan to Login</Text> : <Text style={style.hederText}> Login Your Account </Text>
                }
              </View>
              <LoginTabBar selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} configData={configData} />
              {
                selectedIndex == 0 ?
                  <PhoneOrEmailLogin navi={navigation} />
                  : <>
                    {
                      selectedIndex == 2 ? <QrCode  navigation={navigation}  LoginQrCode={LoginQrCode} /> : < OTPScreen navigation={navigation} configData={configData} />
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