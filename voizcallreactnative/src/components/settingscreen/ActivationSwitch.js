import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Dimensions, Platform } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { Switch } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import moonsleep from '../../../Assets/moonsleep.png'

const ActivationSwitch = () => {
    const [isEnabledActive, setIsEnabledActive] = useState(false);
    const [isEnabledDND, setIsEnabledDND] = useState(false);
    const toggleSwitchActive = () => setIsEnabledActive(previousState => !previousState);
    const toggleSwitchDND = () => setIsEnabledDND(previousState => !previousState);
    const { width: screenWidth } = Dimensions.get('window');

    return (
        <>
            <View style={styles.maincontainer}>
                <LinearGradient 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#3b5998', '#4c669f']}
                style={{height:130,width:screenWidth*0.42,borderRadius:10}}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center',paddingTop:5 }}>
                        <View style={{width:15}}></View>
                        <Text style={{ fontSize: 16, color: 'white',paddingTop:15 }}>Active</Text>
                        <View style={styles.switchContainer}>
                            <Switch
                                trackColor={{ false: '#767577', true: 'white' }}
                                thumbColor={isEnabledActive ? '#005CA3' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchActive}
                                value={isEnabledActive}
                                style={[styles.switch]}
                            />
                        </View>
                        
                    </View>
                    <Text style={[styles.Text,{ paddingTop:15,}]}>
                        Disable the user account;
                    </Text>
                    <Text style={styles.Text}>it stop calls.</Text>
                </LinearGradient>

                <LinearGradient 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#3b5998', '#4c669f']}
                style={{height:130,width:screenWidth*0.42,borderRadius:10,position:'absolute',right:45}}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center',paddingTop:5 }}>
                        <View style={{width:15}}></View>
                        <View style={{height:25,width:25,marginTop:15,marginRight:5}}>
                            <Image source={moonsleep} style={{height:'100%',width:'100%'}} ></Image>
                        </View>
                        <Text style={{ fontSize: 16, color: 'white',paddingTop:15 }}>DND</Text>
                        <View style={styles.switchContainer}>
                            <Switch
                                trackColor={{ false: '#767577', true: 'white' }}
                                thumbColor={isEnabledDND ? '#005CA3' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchDND}
                                value={isEnabledDND}
                                style={styles.switch}
                            />
                        </View>
                    </View>
                    <Text style={[styles.Text,{ paddingTop:15,}]}>
                        All incoming call will be
                    </Text>
                    <Text style={styles.Text}>silenced</Text>
                </LinearGradient>
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    maincontainer: {
        height: 150,
        left: 25,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    switchContainer: {
        flex:1,// Adjust the width
        paddingTop:15,
        alignItems:'flex-end',
        paddingRight:10
    },
    switch: {
         transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }], 
    },
    Text:{
        fontSize: 10,
        color: 'white',
        paddingLeft:15,
        fontFamily:AppCommon_Font.Font,
        fontWeight:'semibold'
    }
})

export default ActivationSwitch;
