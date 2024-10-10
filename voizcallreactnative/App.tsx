/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Component, useCallback, useEffect, useState } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/Screen/Login';
import SplashScreen from './src/Screen/SplashScreen';
import TabBar from './src/Screen/TabBar';
import LanguagesSelecaion from './src/components/settingscreen/LanguagesSelecaion';
import { THEME_COLORS, userprofilealias } from './src/HelperClass/Constant';
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
import SipUA from './src/services/call/SipUA';
import { getConfigParamValue } from './src/data/profileDatajson';
import VideoCallScreen from './src/components/dialscreen/VideoCallScreen';
import WebSocketTest from './src/components/settingscreen/WebSocketTest';
import inCallManager from 'react-native-incall-manager';
import { findContactByNumber } from './src/HelperClass/FatchNameUseingNumber';
import { getNameByPhoneNumber } from './src/HelperClass/ContactNameGetCallTime';
import XmppUSerList from './src/Screen/XmppUSerList';
import ChatScreen from './src/components/xmppchatscrren/ChatScreen';
import { XMPPProvider } from './src/components/xmppchatscrren/XMPPProvider';
import GroupChatScreen from './src/components/xmppchatscrren/GroupChatScreen';


function App() {
  const Stack = createStackNavigator();
  const { MyNativeModule } = NativeModules;
  const [hasPermission, setHasPermission] = useState(false);
  const [isNotifcionCome, setisNotifcionCome] = useState("TabBar");
  const { AppOpenTimeRootChange, IncomingCallNumber, soketConnect } = useSelector((state) => state.sip);
  const myNativeModuleEmitter = MyNativeModule ? new NativeEventEmitter(MyNativeModule) : null;
  const [userName, setUsername] = useState('Unknown');

  const NavigateToNativeLayout = (name, phoneNumber) => {
    if (MyNativeModule) {
      MyNativeModule.openNativeLayout(name, phoneNumber, THEME_COLORS.black);
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
    if (AppOpenTimeRootChange === 'TabBar') {
      NativeLayout()
    }
  }, [AppOpenTimeRootChange]);

  const NativeLayout = async () => {
    const userName = await getNameByPhoneNumber(IncomingCallNumber);
    console.log("userNameApp", userName);
    NavigateToNativeLayout(userName, IncomingCallNumber);
    applyFlags();
  };

  useEffect(() => {
    if (Platform.OS == 'android') {
      const subscription = myNativeModuleEmitter.addListener(
        'onCallAccepted',
        (event) => {
          try {
            inCallManager.startProximitySensor();
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
    }

  }, []);


  useEffect(() => {
    if (Platform.OS == 'android') {
      const subscription = myNativeModuleEmitter.addListener(
        'onCallDeclined',
        (event) => {
          try {
            console.log('Call Declined');
            SipUA.hangupCall()
          } catch (error) {
            console.error('Error handling onCallDeclined event:', error);
          }
        }
      );

      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    }
  }, []);


  useEffect(() => {
    // Call this in your main component or app entry point
    permissionSetup()
  }, [])

  const permissionSetup = async () => {
    await requestUserPermission()
    if (Platform.OS != "android") {
      voipConfig();
      VoipPushNotification.registerVoipToken();
      console.log("Platform.OS", Platform.OS)
    } else {
      await checkPermission();
      setTimeout(() => {
        Splash.hide()
      }, 2000);
    }
  }



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
      <XMPPProvider>
        <CallTimerDuraionProvider>
          <NavigationContainer>
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
              <Stack.Screen name="WebSocket Test" component={WebSocketTest} options={{
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

              <Stack.Screen name="XmppUSerList" component={XmppUSerList} options={{
                title: "User Xmpp List",
                headerStyle: {
                  backgroundColor: THEME_COLORS.black, // Change the background color
                  shadowColor: THEME_COLORS.transparent, // Remove the shadow
                  elevation: 0
                },
                headerTintColor: '#fff', // Change the header text color if needed
              }} />

              <Stack.Screen name="ChatScreen" component={ChatScreen} options={{
                title: "Qr Code Scanner",
                headerStyle: {
                  backgroundColor: THEME_COLORS.black, // Change the background color
                  shadowColor: THEME_COLORS.transparent, // Remove the shadow
                  elevation: 0
                },
                headerTintColor: '#fff', // Change the header text color if needed
              }} />
              <Stack.Screen name="GroupChatScreen" component={GroupChatScreen} />




            </Stack.Navigator>
            <View>
              <IncomingCall />
            </View>
            <View>
              <AudioCallingScreen />
            </View>
            {/* <View>
            <VideoCallScreen />
          </View> */}
            {/* <View>
            <XmppChat navigation={undefined}/>
          </View>  */}
          </NavigationContainer>
        </CallTimerDuraionProvider>
      </XMPPProvider>
    </SafeAreaProvider>
  );
}
export default App;
