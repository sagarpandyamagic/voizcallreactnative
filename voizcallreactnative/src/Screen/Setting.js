import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions
} from 'react-native';
import { React, useState } from 'react';
import { AppCommon_Font, THEME_COLORS } from '../HelperClass/Constant';
import RegisteredVw from '../components/settingscreen/RegisteredVw';
import ActivationSwitch from '../components/settingscreen/ActivationSwitch';
import SettingItemList from '../components/settingscreen/SettingItemList';

const Setting = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { height: screenHeight } = Dimensions.get('window');
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={[style.mainViewContain]}>
        <View style={style.TopView}>
          <Text style={{ fontSize: 28, color: 'white', left: 20, bottom: 30, position: 'absolute', fontFamily: AppCommon_Font.Font }}>Setting</Text>
        </View>
        <View style={[style.DownView]}>
          <RegisteredVw />
          <ActivationSwitch />
          <SettingItemList naviagion={navigation} />
        </View>
      </View >
    </ScrollView >
  )
}
const style = StyleSheet.create({
  mainViewContain: {
    flex: 1,
    backgroundColor: THEME_COLORS.black,
  },
  TopView: {
    backgroundColor: THEME_COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    flexDirection: 'row',
  },
  DownView: {
    backgroundColor: '#FFFF',
    flex: 2,
    borderTopLeftRadius: 60,
  },



})
export default Setting