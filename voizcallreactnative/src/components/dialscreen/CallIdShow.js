import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { Dropdown } from 'react-native-element-dropdown';

import down_arrow from '../../../Assets/ic_dwon_arrow.png';


const CallIdShow = ({setCallerIDShow,callID}) => {
    const [showIDList, setshowIDList] = useState(true);

    const hundelCallerID = () => {
        setshowIDList(!showIDList)
        setCallerIDShow(showIDList)
    }

    return (
        <>
        <View style={styles.CallIdContainer}>
            <TouchableOpacity style={{flex:1, flexDirection: 'row', alignItems: 'center',justifyContent:'center'}} onPress={hundelCallerID}>
                <Text style={styles.callIdText}>{callID}</Text>
                <View style={{position:'absolute',right:15}}>
                <Image
                    style={{ height: 15, width: 15 }}
                    source={down_arrow}
                >
                </Image>
                </View>
            </TouchableOpacity>
        </View>
        </>
    );
};
const styles = StyleSheet.create({
    CallIdContainer: {
        height: 35,
        width: '45%',
        backgroundColor: '#fff',
        marginTop: -15,
        borderRadius: 20,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 4, // Shadow radius
        elevation: 5, // Elevation level for Android
        justifyContent: 'center',
    },
    callIdText: {
        fontSize: 18,
        fontFamily: AppCommon_Font.Font,
        marginRight: 10, // Add some space between text and arrow
    },
    dropdown: {
        height: 40,
        width: 140,
        borderRadius: 22,
        paddingHorizontal: 8,
    },
    imageStyle: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    searchStyle: {
        width: 300, // Ensure the search bar width matches the dropdown width
    },
});
export default CallIdShow;
