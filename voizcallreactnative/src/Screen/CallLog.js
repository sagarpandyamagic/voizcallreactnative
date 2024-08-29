import {
    StyleSheet,
} from 'react-native';
import { React } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import QrCode from '../components/loginscreen/QrCode';
import { AppCommon_Font, THEME_COLORS } from '../HelperClass/Constant';
import Calllog from '../components/calllogscreen/Calllog';

const CallLog = ({ navigation }) => {
    const Tab = createMaterialTopTabNavigator();
    return (
        <Tab.Navigator
        screenOptions={{
            tabBarLabelStyle: { fontSize: 13,fontFamily:AppCommon_Font.Font }, // Adjust the font size of the tab label
            tabBarStyle: { height: 40 , elevation: 0, shadowOpacity: 0 ,marginLeft: 20,backgroundColor:THEME_COLORS.transparent  },
            tabBarItemStyle: { width: 'auto', paddingHorizontal: 5 }, 
            tabBarActiveTintColor: THEME_COLORS.black, // Change the text color of the selected tab
            tabBarInactiveTintColor: 'gray', // Change the text color of the unselected tabs
            tabBarIndicatorStyle: {
                borderBottomColor: THEME_COLORS.black,
                borderRadius:15 // Change the border color of the selected tab
              },
             // Adjust the height of the tab bar
          }}
        >
            <Tab.Screen name="All" component={(props) => <Calllog {...props} navigation={navigation} DataType={""} /> } />
            <Tab.Screen name="Missed" component={(props) => <Calllog {...props} navigation={navigation} DataType={"missedCall"} /> } />


        </Tab.Navigator>
    )
}
const style = StyleSheet.create({

})
export default CallLog