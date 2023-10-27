import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Setting from './Setting';
import Dialpad from './Dialpad';
import ContactsList from './ContactScreen/ContactsList';
import { Button, Pressable, View ,Text,Image} from 'react-native';
import { useSelector } from 'react-redux';

import ic_PhoneBook from '../Assets/ic_Tab_phoneBook.png'
import ic_CallHistroy from '../Assets/ic_Tab_call_info.png'
import ic_Dialpad from '../Assets/ic_Tab_DialPad.png'
import ic_Setting from '../Assets/ic_Tab_setting.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import CallLogs from './CallLog/CallLogs';
import setInitVlaue from './setInitVlaue';


const TabBar=()=> {
  const { soketConnect} = useSelector((state) => state.sip)

  const Tab = createBottomTabNavigator();
    return (
      <Tab.Navigator  initialRouteName="Dialpad"

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ContactsList') {
            iconName = focused ? ic_PhoneBook : ic_PhoneBook;
          } else if (route.name === 'CallLogs') {
            iconName = focused ? ic_CallHistroy : ic_CallHistroy;
          }  else if (route.name === 'Dialpad') {
            iconName = focused ? ic_Dialpad : ic_Dialpad;
          }  else if (route.name === 'Setting') {
            iconName = focused ? ic_Setting : ic_Setting;
          }
          return <Image source={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue', // Color for the active tab
        inactiveTintColor: 'gray', // Color for inactive tabs
      }}

      >
        <Tab.Screen name="ContactsList" component={ContactsList} />
        <Tab.Screen name="CallLogs" component={CallLogs} />
        <Tab.Screen options={{
           headerRight: () => (
            <View style={{paddingRight:10}}>
              <Pressable onPress={() => setInitVlaue.usedValue()}>
              <Text style={{color:((soketConnect == true)? "blue" : "red" )}}>Connect</Text>
            </Pressable>
            </View>
          ),
        }
        } name="Dialpad" component={Dialpad} />
        <Tab.Screen options={{
          headerShown: false,
          }} name="Setting" component={Setting} />
      </Tab.Navigator>
    );

  }
export default TabBar