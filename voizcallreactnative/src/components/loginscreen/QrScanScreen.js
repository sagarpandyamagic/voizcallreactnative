import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
  Alert,
  Platform,
  Image
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { StorageKey, THEME_COLORS, userprofilealias } from '../../HelperClass/Constant';
import flashbtn from '../../../Assets/flash-btn.png';
import DeviceInfo from 'react-native-device-info';
import { getProfile, Qr_login } from '../../services/auth';
import LottieView from 'lottie-react-native';
import loadinganimaion from '../../../Assets/animation.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { access_token, AppStoreData, getStorageData, isLogin, LoginUser } from '../utils/UserData';
import { getConfigParamValue } from '../../data/profileDatajson';
import { inticalluserData } from '../../store/sipSlice';
import store from '../../store/store';
import SipUA from '../../services/call/SipUA';
import { generateUniqueId } from '../../HelperClass/InstanceID';

const QrScanScreen = ({ navigation }) => {
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  const [deviceId, setdeviceId] = useState('');
  const [deviceModel, setdeviceModel] = useState('');
  const [systemName, setsystemName] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getDeviceId()
  }, [])

  


  const toggleFlashlight = () => {
    setFlashMode((prevFlashMode) =>
      prevFlashMode === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.torch
        : RNCamera.Constants.FlashMode.off
    );
  };

  async function getDeviceId() {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const deviceModel = DeviceInfo.getModel(); // Get the device model
      const systemName = DeviceInfo.getSystemName();

      setdeviceId(deviceId)
      setdeviceModel(deviceModel)
      setsystemName(systemName)
      // console.log('Device ID:', deviceId);
    } catch (error) {
      console.error('Error getting device ID:', error);
    }
  }

  const onBarCodeRead = async (e) => {
    console.log(e.data)
    try {

      if (loading == true) {
        return
      }

      setLoading(true);

      await AppStoreData(StorageKey.instance_id,generateUniqueId())
       
      const pram = {
        "qr_code": e.data,
        "instance_id": await getStorageData(StorageKey.instance_id),
        "device_token": deviceId,
        "device_type": (Platform.IOS) ? "ios" : "android",
        "device_model": deviceModel,
        "device_os": systemName
      }
      console.log(pram)

      setLoading(true);
      const configInfo = await Qr_login(pram)
      console.log(configInfo.data.access_token)
      console.log(configInfo.data.data)

      if (configInfo.success) {
        await AppStoreData(StorageKey.userData, configInfo.data.data)
        await AppStoreData(StorageKey.access_token, configInfo.data.access_token)
        await AppStoreData(StorageKey.isLogin, true)
        const value = await getStorageData(StorageKey.isLogin)
        // console.log(value)
        const profileInfo = await getProfile()
        if (profileInfo.success) {
           await AppStoreData(StorageKey.userprofiledata, profileInfo.data.account_properties)
           const sipusername = await getConfigParamValue(userprofilealias.sip_username)
           const password = await getConfigParamValue(userprofilealias.sip_password)
           const sipserver = await getConfigParamValue(userprofilealias.sip_sipServer)
           const sipport = "7443"
           store.dispatch(inticalluserData({sipusername,password,sipserver,sipport}))
           SipUA.connect()
           navigation.navigate('TabBar')
        }
        setLoading(false);
      } else {
        navigation.navigate.pop(1)
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>
      {
        loading ?
          <LottieView
            source={loadinganimaion}
            autoPlay
            loop
            style={{ width: '100%', height: '100%', position: 'absolute', top: 20, alignItems: 'center', zIndex: 1, }}
          /> : <></>
      }

      <View style={{ flex: 1 }}>
        <RNCamera
          style={styles.preview}
          onBarCodeRead={onBarCodeRead}
          captureAudio={false}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          flashMode={flashMode}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <Text style={styles.text}>Scan the QR Code</Text>
            </View>
          </View>
        </RNCamera>
        <View style={{ backgroundColor: 'white', flex: 1, alignContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginTop: 25, fontSize: 18, color: 'black' }} >Scan a code to login</Text>
          <TouchableOpacity onPress={toggleFlashlight}
          >
            <Image style={{ height: 50, width: 50, marginTop: 25 }} source={flashbtn}>
            </Image>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    height: '70%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: THEME_COLORS.black,
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 20,
  },
});

export default QrScanScreen;
