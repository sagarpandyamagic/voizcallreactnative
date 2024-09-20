import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import setting from '../../../Assets/setting-icon.png';
import ic_translate from '../../../Assets/ic_translate.png';
import ic_information from '../../../Assets/ic_information.png';
import privacyicon from '../../../Assets/privacyicon.png';
import voicemailicon from '../../../Assets/voicemailicon.png';
import logout from '../../../Assets/logout.png';
import SettingdetailList from './SettingdetailList';
import SeparatorLine from '../../HelperClass/SeparatorLine';
import ic_websocketicon from '../../../Assets/ic_websocketicon.png';



const SettingItemList = ({naviagion}) => {
    return (
        <>
            <SettingdetailList title='Pull Configration' image={setting} navigation={naviagion} />
            <SeparatorLine marginVertical={0}/>
            <SettingdetailList title='App languages' image={ic_translate} navigation={naviagion} />
            <View style={{backgroundColor:THEME_COLORS.black,height:15}}>
            </View> 
            <SettingdetailList title='About' image={ic_information} navigation={naviagion} />
            <SeparatorLine marginVertical={0}/>
            <SettingdetailList title='Privacy Policy' image={privacyicon} navigation={naviagion}  />
            {/* <SeparatorLine marginVertical={0}/>
            <SettingdetailList title='On Touch Voicemail' image={voicemailicon} navigation={naviagion} /> */}
            <SeparatorLine marginVertical={0}/>
            <SettingdetailList title='WebSocket Test' image={ic_websocketicon} navigation={naviagion} />
            <SeparatorLine marginVertical={0}/>
            <SettingdetailList title='Logout' image={logout} navigation={naviagion} />
        </>
    );
};
const styles = StyleSheet.create({
   
})

export default SettingItemList;
