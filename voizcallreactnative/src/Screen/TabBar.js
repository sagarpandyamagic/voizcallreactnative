import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import contact_icon from '../../Assets/contact_icon.png'
import contact_icon_select from '../../Assets/selected_contact_icon.png'

import recent_icon from '../../Assets/recent_icon.png'
import recent_icon_select from '../../Assets/selected_recent_icon.png'

import dialpad_icon from '../../Assets/dialpad_icon.png'
import dialpad_icon_select from '../../Assets/selected_dialpad_icon.png'


import ic_Setting from '../../Assets/setting-icon.png'
import ic_Setting_select from '../../Assets/selected_setting_icon.png'

import { Image } from 'react-native';
import { THEME_COLORS } from '../HelperClass/Constant';
import DialpadMain from '../Screen/DialpadMain';
import CallLog from './CallLog';
import ContactScreen from './ContactScreen';
import Setting from './Setting';


const TabBar = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName="Dialpad"
      barStyle={{ backgroundColor: 'tomato' }}
      
      // tabBarOptions={{
      //   activeBackgroundColor: 'transparent', // Set the background color of active tab to transparent
      // }}
      screenOptions={({ route }) => ({
      
        headerStyle: {
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          backgroundColor:THEME_COLORS.black,  
        },
        headerTintColor: 'white', 
        tabBarStyle: { backgroundColor: THEME_COLORS.black }, // Set background color to transparent
        tabBarInactiveBackgroundColor: THEME_COLORS.transparent,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Contact List') {
            iconName = focused ? contact_icon_select : contact_icon;
          } else if (route.name === 'Call Logs') {
            iconName = focused ? recent_icon_select : recent_icon;
          } else if (route.name === 'Dialpad') {
            iconName = focused ? dialpad_icon_select : dialpad_icon;
          } else if (route.name === 'Setting') {
            iconName = focused ? ic_Setting_select : ic_Setting;
          }
          return focused ? <Image source={iconName} color={color} style={{ height: 30, width: 30, resizeMode: 'contain' }} /> : <Image source={iconName} size={size} color={color} style={{ height: 20, width: 20, resizeMode: 'contain' }} />;
        },
      })}


      tabBarOptions={{
        activeTintColor: '#ffff', // Color for the active tab
        inactiveTintColor: '#ffff',
        // activeBackgroundColor: 'transparent', // Set the background color of active tab to transparent
      }}
    >
      <Tab.Screen name="Contact List" component={ContactScreen} 
       options={({ navigation }) => ({
        // headerLeft: () => (
          // <Button
          //   title="Back to Tab1"
          //   onPress={() => navigation.navigate('Tab1Navigator')}
          // />
        // ),
      })}
      containerStyle={(active) => ({
        backgroundColor: active ? "red" : undefined,
      })} />
      <Tab.Screen name="Call Logs" component={CallLog} />
      <Tab.Screen options={{
        headerShown:false,
        // headerRight: () => (
        //   <View style={{ paddingRight: 10 }}>
        //     <Pressable onPress={() => setInitVlaue.usedValue()}>
        //       {
        //         // (soketConnect == false) ?
        //         // <View style={{flexDirection:"row",alignContent:'center',alignSelf:'center',alignItems:'center'}} >
        //         //    <View style={{height: 10, width: 10,borderRadius: 5,backgroundColor:"red"}}></View>
        //         //    <Text style={{ color: ("red") }}> Connect</Text>
        //         //   </View>
        //         //   :
        //          <View style={{ flexDirection: "row", alignContent: 'center', alignSelf: 'center', alignItems: 'center' }} >
        //           <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: 'green' }}></View>
        //           <Text style={{ color: ("green") }}> Connected</Text>
        //         </View>
        //       }
        //     </Pressable>
        //   </View>
        // ),
      }
      } name="Dialpad" component={DialpadMain} />
      <Tab.Screen options={{
        headerShown: false,
      }} name="Setting" component={Setting} />
    </Tab.Navigator>
  );
}
export default TabBar