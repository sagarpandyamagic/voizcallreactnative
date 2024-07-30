/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
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

function App() {
  const Stack = createStackNavigator();

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='SplashScreen'>
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
      </NavigationContainer>
  );
}
export default App;
