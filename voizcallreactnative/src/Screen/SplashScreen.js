import {
  View,
  Text,
  LogBox,
} from 'react-native';
import { React, useEffect, useState } from 'react';
import { getSwitchConfig, POSTAPICALL } from '../services/auth';
import LottieView from 'lottie-react-native';
import { AppStoreData, getStorageData } from '../components/utils/UserData';
import { AndroidVersion, IOSVersion, StorageKey, THEME_COLORS, userprofilealias } from '../HelperClass/Constant';
import { getConfigParamValue } from '../data/profileDatajson';
import store from '../store/store';
import SipUA from '../services/call/SipUA';
import { APIURL } from '../HelperClass/APIURL';
import { inticalluserData } from '../store/sipSlice';
import UpdateApp from '../components/loginscreen/UpdateApp';
import LodingJsonFistScreen from '../HelperClass/LodingJsonFistScreen';
import LoginTopSideVw from '../components/loginscreen/LoginTopSideVw';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const SplashScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [appUpdate, setappUpdate] = useState(false);

  const usedValue = async () => {    
    await AppStoreData(StorageKey.CallKeepORNot,false);
    try {
      const value = await getStorageData(StorageKey.isLogin);
      if (value == true) {
        setLoading(true);
        const pram = {
          "app_version":  Platform.OS === 'ios' ? IOSVersion : AndroidVersion
        }
        const versionCheck = await POSTAPICALL(APIURL.VersionNotify,pram)
        console.log("versionCheck",versionCheck)
        if (versionCheck.data.is_updated == "0") {
        //   const ProfileConfigData = await POSTAPICALL(APIURL.ProfileConfigData,pram)
        //   console.log("ProfileConfigData", ProfileConfigData.data)
        //   console.log("versionCheck.success", versionCheck.success)

          // if (versionCheck.success) {
            // const sipusername = await getConfigParamValue(userprofilealias.sip_username)
            // const password = await getConfigParamValue(userprofilealias.sip_password)
            // const sipserver = await getConfigParamValue(userprofilealias.sip_sipServer)
            // const sipport = "7443"
            // store.dispatch(inticalluserData({ sipusername, password, sipserver, sipport }))
            // SipUA.connect()
            setLoading(false);
            navigation.navigate('TabBar')
          // }        
        }else{
          setLoading(false);
          setappUpdate(true)
        }
       
      } else {
        await AppStoreData(StorageKey.UserActive,true)
        await AppStoreData(StorageKey.UserDND,false)
        setLoading(true);
        const configInfo = await getSwitchConfig()
        setLoading(false);
        if (configInfo.success) {
          navigation.navigate('Login', { configData: configInfo.data })
        }
      }
    }
    catch (error){
      console.log(error)
    }
  }


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      usedValue()
    });
    return () => {
      unsubscribe();
    };
  }, [navigation])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:THEME_COLORS.black }}>
      {
        <LodingJsonFistScreen loading={loading} setLoading={setLoading} />
      }
      {
        appUpdate ? <UpdateApp/> : <></>
      }
       <LoginTopSideVw />
      {/* <Text style={{ fontSize: 25, textAlign: 'center' }}>Voiz Call</Text> */}
    </View>
  )
}
export default SplashScreen