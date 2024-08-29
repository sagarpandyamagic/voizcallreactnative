import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { Dropdown } from 'react-native-element-dropdown';

import down_arrow from '../../../Assets/ic_dwon_arrow.png';


const CallIdShow = ({callIDShow,setCallerID}) => {
    const local_data = [
        {
            value: '1',
            lable: 'Country 1',
        },
        {
            value: '2',
            lable: 'Country 2',
        },
        {
            value: '3',
            lable: 'Country 3',
        },
        {
            value: '4',
            lable: 'Country 4',
        },
        {
            value: '5',
            lable: 'Country 5',
        },
    ];

    const [country, setCountry] = useState('1');
    const [showIDList, setshowIDList] = useState(true);


    const hundelCallerID = () => {
        setshowIDList(!showIDList)
        setCallerID(showIDList)
    }

    return (
        <>
        <View style={styles.CallId}>
            <TouchableOpacity style={{flex:1, flexDirection: 'row', alignItems: 'center',marginLeft:15}} onPress={hundelCallerID}>
                <Text style={{ alignSelf: 'center', fontSize: 15, fontFamily: AppCommon_Font.Font }}>Caller ID</Text>
                <View style={{alignItems:'flex-end',flex:1,marginRight:10}}>
                <Image
                    style={{ height: 15, width: 15 }}
                    source={down_arrow}
                >
                </Image>
                </View>
            </TouchableOpacity>
        </View>
       
        </>

        // <View style={styles.CallId}>
        //     <Dropdown
        //         style={[styles.dropdown]}
        //         selectedTextStyle={styles.selectedTextStyle}
        //         placeholderStyle={styles.placeholderStyle}
        //         iconStyle={styles.iconStyle}
        //         maxHeight={200}
        //         value={country}
        //         data={local_data}
        //         searchStyle={styles.searchStyle} // Add this line
        //         valueField="value"
        //         labelField="lable"
        //         imageField="image"
        //         placeholder="Select country"
        //         searchPlaceholder="Search..."
        //         onChange={e => {
        //             setCountry(e.value);
        //         }}
        //     />
        // </View>

    );
};
const styles = StyleSheet.create({
    CallId: {
        height: 40,
        width: '50%',
        backgroundColor: '#fff',
        marginTop: -20,
        borderRadius: 20,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 4, // Shadow radius
        elevation: 5, // Elevation level for Android
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
