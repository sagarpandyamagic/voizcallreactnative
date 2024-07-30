import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Dimensions
} from 'react-native';
import { React, useState } from 'react';
import { AppCommon_Font, THEME_COLORS } from '../HelperClass/Constant';
import Footer from '../components/loginscreen/Footer';
import LoginTopSideVw from '../components/loginscreen/LoginTopSideVw';
import FUserTextFiled from '../components/forgotpasswordscrren/FUserTextFiled';

const ForgotPasswordScreen = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { height: screenHeight } = Dimensions.get('window');
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={[style.mainViewContain, {}]}>
        <LoginTopSideVw />
        <View style={[style.DownView]}>
          <View style={{ alignContent: 'center', alignSelf: 'center', padding: 20 }}>
            <Text style={style.hederText}> Reset Password</Text>
          </View>
          <Text style={[style.hederText, { fontSize: 12, marginLeft: 15, color: 'gray' }]}> Enter the associated Username with this acccount</Text>
          <FUserTextFiled navigation={navigation} />
        </View>
        <Footer />

      </View >
    </ScrollView >
  )
}
const style = StyleSheet.create({
  mainViewContain: {
    flex: 1,
    backgroundColor: THEME_COLORS.black,
  },
  hederText: {
    color: 'black',
    alignContent: 'center',
    fontSize: 20,
    fontFamily: AppCommon_Font.Font,
  },
  DownView: {
    backgroundColor: '#FFFF',
    flex: 1,
    borderTopLeftRadius: 50,
  },
})
export default ForgotPasswordScreen