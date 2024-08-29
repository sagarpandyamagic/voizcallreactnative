import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ic_more from '../../../Assets/ic_more.png';


const NumberShowVw = ({number,showImage=true}) => {
    return (
        <View style={{ height: 80, width: '80%', paddingBottom: 5, justifyContent: 'center' }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'center',
                }}>
                <Text style={{ fontSize: 20, }}>{number}</Text>
            </View> 
            {/* {
                showImage &&   <TouchableOpacity style={{ position: 'absolute', left: -10}}>
                <Image style={{ height: 20, width: 20 }}
                    source={ic_more}
                ></Image>
                </TouchableOpacity>
            } */}
           
        </View>
    );
};
export default NumberShowVw;
