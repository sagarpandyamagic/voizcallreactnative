/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Component, useEffect, useState } from 'react';
import {
  AppState,
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/Screen/Login';
import SplashScreen from './src/Screen/SplashScreen';
import TabBar from './src/Screen/TabBar';
import LanguagesSelecaion from './src/components/settingscreen/LanguagesSelecaion';
import { THEME_COLORS } from './src/HelperClass/Constant';
import privacyPoilcyScreen from './src/components/settingscreen/privacyPoilcyScreen';
import ContactDetailScreen from './src/components/contactscreen/ContactDetailScreen';
import ContactsList from './src/components/contactscreen/ContactsList';
import AddNewContact from './src/components/contactscreen/AddNewContact';
import AudioCallingScreen from './src/Screen/AudioCallingScreen';
import ForgotPasswordScreen from './src/Screen/ForgotPasswordScreen';
import PickYourCountyCode from './src/components/loginscreen/PickYourCountyCode';
import OTPFillScreen from './src/components/loginscreen/OTPFillScreen';
import QrScanScreen from './src/components/loginscreen/QrScanScreen';
import IncomingCall from './src/Screen/IncomingCall';
import { FCMDelegateMethod, requestPermissions, requestUserPermission } from './src/services/FirebaseConfig';
import { setupCallKeep } from './src/services/Callkeep/CallkeepSeup';
import { CallTimerDuraionProvider } from './src/hook/CallTimer';
import { voipConfig } from './src/services/voipConfig';
import VoipPushNotification from "react-native-voip-push-notification";
import Splash from 'react-native-splash-screen'
import { useDispatch, useSelector } from 'react-redux';
import { updateSipState } from './src/store/sipSlice';
import { hasOverlayPermission, requestOverlayPermission } from './src/HelperClass/OverlayPermission';
import store from './src/store/store';
import { setInitTimeValue } from './src/services/setInitVlaue';
import messaging from '@react-native-firebase/messaging';
import { firebaseListener, showCallNotification } from './index';
import { useNavigation } from '@react-navigation/native';

function App() {
  const Stack = createStackNavigator();
  const { MyNativeModule } = NativeModules;
  const myNativeModuleEmitter = new NativeEventEmitter(MyNativeModule);
  const [hasPermission, setHasPermission] = useState(false);
  const [isNotifcionCome, setisNotifcionCome] = useState("TabBar");
  const {AppOpenTimeRootChange} = useSelector((state) => state.sip);


  const openNativeLayouta = () => {
    if (MyNativeModule) {
      MyNativeModule.openNativeLayout();
      //  showCallNotification("John Doe");
    } else {
      console.error('MyNativeModule is not available');
    }
  };

  const applyFlags = () => {
    if (MyNativeModule) {
      MyNativeModule.applyFlags();
    } else {
      console.error('MyNativeModule is not available');
    }
  };


  useEffect(() => {
    if(AppOpenTimeRootChange === 'TabBar'){
      openNativeLayouta();
      applyFlags();
    }
  }, [AppOpenTimeRootChange]);

  useEffect(() => {
    const subscription = myNativeModuleEmitter.addListener(
      'onCallAccepted',
      (event) => {
        try {
          console.log('Call accepted');
          store.dispatch(updateSipState({ key: "CallScreenOpen", value: true }));
          store.dispatch(updateSipState({ key: "CallAns", value: false }));
        } catch (error) {
          console.error('Error handling onCallAccepted event:', error);
        }
      }
    );

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);



  useEffect(() => {
    requestUserPermission()
    FCMDelegateMethod()
    requestPermissions()
    if (Platform.OS != "android") {
      console.log("Platform.OS", Platform.OS)
      Platform.OS == "ios" && VoipPushNotification.registerVoipToken();
      Platform.OS == "ios" && voipConfig();
    } else {
      checkPermission();
      // openNativeLayouta()
      // MyNativeModule.removeFlags()
      Splash.hide()
    }
  }, [])



  const checkPermission = async () => {
    const result = await hasOverlayPermission();
    setHasPermission(result);
    if (result == false) {
      handleRequestPermission();
    }
  };

  const handleRequestPermission = async () => {
    try {
      const result = await requestOverlayPermission();
      setHasPermission(result);
    } catch (error) {
      console.error('Error requesting overlay permission:', error);
    }
  };


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <CallTimerDuraionProvider>
          <Stack.Navigator initialRouteName={AppOpenTimeRootChange}>
            <Stack.Screen options={{ headerShown: false }} name="SplashScreen" component={SplashScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
            <Stack.Screen
              name="TabBar"
              component={TabBar}
              options={{ headerShown: false }} />
            <Stack.Screen name="App language" component={LanguagesSelecaion} options={{
              headerStyle: {
                backgroundColor: THEME_COLORS.black, // Change the background color
                shadowColor: THEME_COLORS.transparent, // Remove the shadow
                elevation: 0
              },
              headerTintColor: '#fff', // Change the header text color if needed
            }} />
            <Stack.Screen name="Privacy & Policy" component={privacyPoilcyScreen} options={{
              headerStyle: {
                backgroundColor: THEME_COLORS.black, // Change the background color
                shadowColor: THEME_COLORS.transparent, // Remove the shadow
                elevation: 0
              },
              headerTintColor: '#fff', // Change the header text color if needed
            }} />
            <Stack.Screen name="Contact Detail" component={ContactDetailScreen} options={{
              headerStyle: {
                backgroundColor: THEME_COLORS.black, // Change the background color
                shadowColor: THEME_COLORS.transparent, // Remove the shadow
                elevation: 0
              },
              headerTintColor: '#fff', // Change the header text color if needed
            }} />
            <Stack.Screen name="AddNewContact" component={AddNewContact} options={{
              headerStyle: {
                backgroundColor: THEME_COLORS.black, // Change the background color
                shadowColor: THEME_COLORS.transparent, // Remove the shadow
                elevation: 0
              },
              headerTintColor: '#fff', // Change the header text color if needed
            }} />

            {/* <Stack.Screen name="AudioCallingScreen" component={AudioCallingScreen} options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: THEME_COLORS.black, // Change the background color
              shadowColor: THEME_COLORS.transparent, // Remove the shadow
              elevation: 0
            },
            headerTintColor: '#fff', // Change the header text color if needed
          }} /> */}
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{
              title: "",
              headerStyle: {
                backgroundColor: THEME_COLORS.black, // Change the background color
                shadowColor: THEME_COLORS.transparent, // Remove the shadow
                elevation: 0
              },
              headerTintColor: '#fff', // Change the header text color if needed
            }} />
            <Stack.Screen name="Pick Your County" component={PickYourCountyCode} options={{
              headerStyle: {
                backgroundColor: THEME_COLORS.black, // Change the background color
                shadowColor: THEME_COLORS.transparent, // Remove the shadow
                elevation: 0
              },
              headerTintColor: '#fff', // Change the header text color if needed
            }} />
            <Stack.Screen name="OTPFillScreen" component={OTPFillScreen} options={{
              title: "",
              headerStyle: {
                backgroundColor: THEME_COLORS.black, // Change the background color
                shadowColor: THEME_COLORS.transparent, // Remove the shadow
                elevation: 0
              },
              headerTintColor: '#fff', // Change the header text color if needed
            }} />
            <Stack.Screen name="QrScanScreen" component={QrScanScreen} options={{
              title: "Qr Code Scanner",
              headerStyle: {
                backgroundColor: THEME_COLORS.black, // Change the background color
                shadowColor: THEME_COLORS.transparent, // Remove the shadow
                elevation: 0
              },
              headerTintColor: '#fff', // Change the header text color if needed
            }} />
          </Stack.Navigator>
          <View>
            <IncomingCall />
          </View>
          <View>
            <AudioCallingScreen />
          </View>
        </CallTimerDuraionProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default App;
