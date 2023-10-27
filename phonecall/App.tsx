/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  Platform,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import TabBar from './src/TabBar';
import ContactDetailScreen from './src/ContactScreen/ContactDetailScreen';
import BlockContact from './src/BlockContact';
import ContactsList from './src/ContactScreen/ContactsList';
import { CallTimerDuraionProvider } from './src/CallTimer';
import VoipPushNotification from 'react-native-voip-push-notification';
import CallLogDetails from './src/CallLog/CallLogDetails';
import LoginWithOTP from './src/Login/LoginWithOTP';
import SplashScreen from './src/SplashScreen/SplashScreen';
import ForgotPassword from './src/Login/ForgotPassword';
import IncomingCall from './src/IncomingCall';
import CallScreen from './src/CallScreen';
import HomeScreen from './src/Login/HomeScreen';
import { setupCallKeep } from './src/hook/usecallkeep';

function App() {

  useEffect(() => {
    setupCallKeep();
  }, []);

  const Stack = createStackNavigator();
  return (

    <NavigationContainer>
      <CallTimerDuraionProvider>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="SplashScreen" component={SplashScreen} />
          <Stack.Screen
            name="TabBar"
            component={TabBar}
            options={{ headerShown: false }} />
          <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
          <Stack.Screen options={{ headerShown: false }} name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen options={{ headerShown: false }} name="LoginWithOTP" component={LoginWithOTP} />
          <Stack.Screen options={{ headerShown: true, title: 'Contact Detail' }} name="ContactDetailScreen" component={ContactDetailScreen} />
          <Stack.Screen options={{ title: 'Contact' }} name="ContactsAddConfrence" component={ContactsList} />
          <Stack.Screen options={{ headerShown: true, title: 'Block Contact' }} name="BlockContact" component={BlockContact} />
          <Stack.Screen options={{ headerShown: true, title: 'CallLogDetails' }} name="CallLogDetails" component={CallLogDetails} />
        </Stack.Navigator>
        <View>
          <IncomingCall />
        </View>
        <View>
          <CallScreen />
        </View>
      </CallTimerDuraionProvider>
    </NavigationContainer>
  );
}

export default App;
