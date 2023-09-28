import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  LogBox,
  ScrollView
} from 'react-native';
import { React, useEffect, useState } from 'react';
import voizLogo from '../Assets/voizcall_logo.png'
import icUser from '../Assets/ic_user.png';
import ickey from '../Assets/ic_key.png';
import icqr from '../Assets/ic_qr.png';
import icicon from '../Assets/voizcall_icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { updateSipState } from '../src/redux/sipSlice';
import { CallDataStore, LoginUser } from './redux/LoginDateStore';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const HomeScreen = ({ navigation }) => {

  const dispatch = useDispatch()

  const [username, setusername] = useState("1382941496")
  const [userpassword, setuserpassword] = useState("5Jk$$#t@")
  // const [username, setusername] = useState("9876543210")
  // const [userpassword, setuserpassword] = useState("123456")
  const [server, setserver] = useState("s2.netcitrus.com")
  const [port, setport] = useState("7443")


  const userDataRemvoe = async () => {
    try {
      const value = await AsyncStorage.removeItem("is_live");
      console.log("is_live", value)

      try {
        const valuelog = await AsyncStorage.removeItem("callLog");
        console.log("callLog", valuelog)
      } catch (e) {
      }
    } catch (e) {
    }
  }

  useEffect(() => {
    userDataRemvoe()
  },[navigation])



  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={style.mainViewContain}>
        <View style={style.TopView}>
          <Image style={{ width: "70%", height: "35%", padding: 20 }}
            source={voizLogo} />
        </View>
        <View style={style.DownView}>
          <View style={style.InputTextView}>
            <View style={style.InputTextSideImgView}>
              <Image style={{ height: "45%", width: "40%" }}
                source={icUser} />
            </View>
            <TextInput style={style.InpuText} placeholder='Username' placeholderTextColor={"#4F6EB4"} onChangeText={(text) => setusername(text)}>
            </TextInput>
          </View>
          <View style={style.InputTextView}>
            <View style={style.InputTextSideImgView}>
              <Image style={{ height: "45%", width: "40%" }}
                source={icUser} />
            </View>
            <TextInput style={style.InpuText} placeholder='Password' placeholderTextColor={"#4F6EB4"} onChangeText={(text) => setuserpassword(text)}>
            </TextInput>
          </View>
          <View style={style.InputTextView}>
            <View style={style.InputTextSideImgView}>
              <Image style={{ height: "45%", width: "40%" }}
                source={icUser} />
            </View>
            <TextInput style={style.InpuText} placeholder='Server' placeholderTextColor={"#4F6EB4"} onChangeText={(text) => setserver(text)}>
            </TextInput>
          </View>
          <View style={style.InputTextView}>
            <View style={style.InputTextSideImgView}>
              <Image style={{ height: "45%", width: "40%" }}
                source={icUser} />
            </View>
            <TextInput style={style.InpuText} placeholder='Port' placeholderTextColor={"#4F6EB4"} onChangeText={(text) => setport(text)}>
            </TextInput>
          </View>
          <View style={[style.InputTextView, { borderWidth: 0 }]} >
            <TouchableOpacity style={style.linearGradient} onPress={() => {
              dispatch(updateSipState({ key: "UserName", value: username }))
              dispatch(updateSipState({ key: "Password", value: userpassword }))
              dispatch(updateSipState({ key: "Server", value: server }))
              dispatch(updateSipState({ key: "Port", value: port }))

              const callData = {
                "UserName": username,
                "Password": userpassword,
                "Server": server,
                "Port": port,
              }

              CallDataStore(JSON.stringify(callData))

              LoginUser("is_live", true)
              navigation.navigate('TabBar')
            }}>
              <Text style={style.buttonText}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[style.InputTextView, { borderWidth: 0, justifyContent: 'center', alignItems: 'center', marginTop: 10, flexDirection: 'row' }]}>
            <Text style={{ paddingRight: 8 }}>Forgot Password?</Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate('ForgotPassword')
            }}>
              <Text style={{ color: '#4F6EB4' }}>Click Here</Text>
            </TouchableOpacity>
          </View>
          <View style={[style.InputTextView, { borderWidth: 0 }]} >
            <TouchableOpacity style={style.linearGradient} onPress={() => {
              navigation.navigate('LoginWithOTP')
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <Image style={{ width: 23, height: 12.5, resizeMode: 'contain' }}
                  source={ickey} />
                <Text style={style.buttonText}>
                  Login With OTP
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[style.InputTextView, { borderWidth: 0 }]} >
            <TouchableOpacity style={style.linearGradient} onPress={() => {
              navigation.navigate('QRCodeScan')
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <Image style={{ width: 23, height: 18, resizeMode: 'contain' }}
                  source={icqr} />
                <Text style={style.buttonText}>
                  Login With QR Code
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={style.DownSideIconVW}>
          <View style={{ justifyContent: "center", alignItems: 'center' }}>
            <Image style={{ width: 45, height: 45, marginBottom: 5 }}
              source={icicon} />
          </View>
          <View style={{ marginBottom: 15, flexDirection: "row", justifyContent: "center" }}>
            <Text >
              Powered by
            </Text>
            <Text style={{ paddingLeft: 5, color: "#4F6EB4", fontWeight: 'bold' }}>
              Voizcall
            </Text>
          </View>
        </View>
        <View style={{ height: 6, backgroundColor: "#4F6EB4", marginBottom: -1 }}></View>
        <View style={{ height: 5, backgroundColor: "#82B6E1" }}></View>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  mainViewContain: {
    flex: 1,
  },
  TopView: {
    backgroundColor: '#4F6EB4',
    justifyContent: 'center',
    alignItems: 'center',
    height: 180
  },
  DownView: {
    flex: 2,
    backgroundColor: '#FFFF'
  },
  InputTextView: {
    borderBlockColor: '#4F6EB4',
    borderWidth: 0.5,
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    height: 50,
    borderRadius: 5
  },
  InpuText: {
    marginLeft: 15, height: "100%", color: "#4F6EB4"
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
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: "#4F6EB4"
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },
  DownSideIconVW: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
})


export default HomeScreen