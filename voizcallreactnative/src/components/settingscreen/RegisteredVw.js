import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import accounticon from '../../../Assets/accounticon.png';
import ic_next_arrow from '../../../Assets/ic_next_arrow.png';
import store from '../../store/store';
import { useSelector } from 'react-redux';

const RegisteredVw = () => {
    const { soketConnect } = useSelector((state) => state.sip)

    return (
        <>
            <View style={styles.maincontainer}> 
                    <View style={{width:20}}>
                    </View>
                    <View style={styles.usericon}>
                        <Image style={{width:35,height:35,resizeMode: 'contain'}} source={accounticon}></Image>
                        {
                            soketConnect == true 
                            ?   <View style={{width: 10, height: 10, backgroundColor:'#4caf50',position:'absolute',left:22,top:25,borderRadius:10}}/>
                            :   <View style={{width: 10, height: 10, backgroundColor:'red',position:'absolute',left:22,top:25,borderRadius:10}}/>
                        }
                        </View>
                    <View style={{width:30}}></View>
                    <View style={styles.detailcontainer}>
                        <Text style={styles.text}> {store.getState().sip.UserName} </Text>
                        {
                            soketConnect == true 
                            ?  <Text style={[styles.text,{fontSize:15}]}> Registered </Text> 
                            :  <Text style={[styles.text,{fontSize:15}]}> UnRegistered </Text>
                        }
                    </View>
                    {/* <View style={{right:25,position:'absolute'}}>
                         <Image style={{width:25,height:25,resizeMode: 'contain'}} source={ic_next_arrow}></Image>
                    </View> */}
            </View>
        </>
    );
};
const styles = StyleSheet.create ({
    maincontainer: {
        height:80,
        marginTop:10,
        flexDirection:'row',
        alignContent:'center',
        alignItems:'center',
    },
    detailcontainer:{
        flexDirection:'column',
    },
    usericon: {
        left:25
    },
    text:{
        color: THEME_COLORS.black,
        fontFamily:AppCommon_Font.Font,
        fontSize:17
    }
})

export default RegisteredVw;
