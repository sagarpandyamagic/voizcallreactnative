import {
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Text,
    Pressable,
    ScrollView,
    Button
  } from 'react-native';
  import { React } from 'react';
  import voizLogo from '../Assets/voizcall_logo.png';
  import icqr from '../Assets/ic_qr.png';
  import icicon from '../Assets/voizcall_icon.png';
  
  const LoginWithOTP = ({ navigation }) => {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={style.mainViewContain}>
          <View style={style.TopView}>
            <Image style={{ width: "70%", height: "35%" }}
              source={voizLogo} />
          </View>
          <View style={style.DownView}>
          <Text style={{fontSize:22,marginLeft:20,marginTop:25}}>
            Login With OTP
          </Text>
          <Text style={{fontSize:15,marginLeft:20,marginTop:10,marginLeft:20}}>
          Your OTP will be sent to this mobile number
          </Text>
            <View style={style.InputTextView}>
              <View style={style.InputTextSideImgView}>
                <Text style={{fontSize:15,color:'#4F6EB4'}}>
                    +91
                </Text>
              </View>
              <TextInput style={style.InpuText} placeholder='Enter your mobile number' placeholderTextColor={"#4F6EB4"} keyboardType='number-pad' >
              </TextInput>
            </View>
            <View style={[style.InputTextView, { borderWidth: 0 }]} >
              <TouchableOpacity style={style.linearGradient} onPress={()=>{
                  navigation.navigate('LoginWithOTP')
            }}>
                <Text style={style.buttonText}>
                Continue
                </Text>
                </TouchableOpacity>
            </View>
            <View style={[style.InputTextView, { borderWidth: 0 }]} >
              <TouchableOpacity style={style.linearGradient} onPress={()=>{
                  navigation.pop(1) // android 
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <Text style={style.buttonText}>
                    Login With Username
                  </Text>
                </View>
                </TouchableOpacity>
            </View>
            <View style={[style.InputTextView, { borderWidth: 0 }]} >
              <TouchableOpacity style={style.linearGradient} onPress={()=>{
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
            <View style={{justifyContent:"center",alignItems:'center'}}>
            <Image style={{ width: 45, height: 45,marginBottom:5}}
             source={icicon} /> 
             </View>
             <View style={{marginBottom:15 ,flexDirection: "row",justifyContent:"center"}}>
             <Text>
              Powered by
            </Text>
            <Text style={{ paddingLeft: 5, color: "#4F6EB4", fontWeight: 'bold' }}>
              Voizcall
            </Text>
            </View> 
            </View>
            <View style={{height:6,backgroundColor:"#4F6EB4",marginBottom:-1}}></View>
            <View style={{height:5,backgroundColor:"#82B6E1"}}></View>
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
      height:180
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
      backgroundColor: '#E8F1FF', width: "12%", height: "99%", alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderBottomLeftRadius: 5
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
    DownSideIconVW:{
       height:100 ,
       width:'100%',
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: '#fff',
    }
  })
  
  export default LoginWithOTP