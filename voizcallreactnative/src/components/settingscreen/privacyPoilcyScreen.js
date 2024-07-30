import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import WebView from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

const privacyPoilcyScreen = ({ naviagion }) => {
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <WebView
                    source={{ uri: 'https://www.google.com/' }}
                    onLoad={() => console.log('WebView loaded')}
                    onLoadEnd={() => console.log('WebView loading ended')}
                />           
             </SafeAreaView>
        </>
    );
};
const styles = StyleSheet.create({

})

export default privacyPoilcyScreen;
