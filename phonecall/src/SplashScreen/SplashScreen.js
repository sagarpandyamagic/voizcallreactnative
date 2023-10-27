import {
    View,
    Text,
    LogBox
  } from 'react-native';
  import { React, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';

  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();

  const SplashScreen = ({ navigation }) => {


    const usedValue = async () => {
        try {
          const value = await AsyncStorage.getItem("is_live");
          if (value !== null) {
            console.warn(value)
          }
          if(value == "true") {
            navigation.navigate('TabBar')
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