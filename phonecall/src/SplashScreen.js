import {
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
    LogBox
  } from 'react-native';
  import { React, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { updateSipState } from './redux/sipSlice';

  
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();

  const SplashScreen = ({ navigation }) => {

    const dispatch = useDispatch()

    const usedValue = async () => {
        try {
          const value = await AsyncStorage.getItem("is_live");
          if (value !== null) {
            console.warn(value)
          }
          
          if(value == "true") {
           
            try {
              const value = await AsyncStorage.getItem("CallData");
              if (value !== null) {
                console.warn(value)
              }
              let CallData = value
              CallData = JSON.parse(CallData)
              console.log("CallData", CallData)
              if(CallData == null) {
                navigation.navigate('Home')

              }else{
                dispatch(updateSipState({ key: "UserName", value: CallData.UserName }))
                dispatch(updateSipState({ key: "Password", value: CallData.Password }))
                dispatch(updateSipState({ key: "Server", value: CallData.Server }))
                dispatch(updateSipState({ key: "Port", value: CallData.Port }))
                
                navigation.navigate('TabBar')
              }
             
              
            } catch (e) {
            }
           

          }else{
            navigation.navigate('Home')
          }
          console.log("value", value)
        } catch (e) {
        }
      }
    
      useEffect(() => {
        usedValue()
      },[])
      
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:25}}>SplshScreen</Text>
        </View>
    )
  }

  
  export default SplashScreen