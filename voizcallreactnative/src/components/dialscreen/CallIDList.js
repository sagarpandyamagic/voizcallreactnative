import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { AppCommon_Font, StorageKey, THEME_COLORS, userprofilealias } from '../../HelperClass/Constant';
import ic_correct_CallerID from '../../../Assets/ic_correct_CallerID.png';
import { getConfigParamValue } from '../../data/profileDatajson';



const CallIDList = ({addCallerID}) => {
    const [data,setdata] = useState([])
    

    const getsipCallerid = async () => {
        const value =  await getConfigParamValue(userprofilealias.sip_callerid)
        console.log("getsipCallerid",value)
        setdata([value])
    }

    useEffect(()=>{
        getsipCallerid()
    },[])

    const handleItemPress = (item) => {
        // Set the selected item when tapped
        // setSelectedItem(item);
        console.log('Selected item:', item);

        addCallerID(item)
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
            <Text style={styles.title}>{item}</Text>
            <View style={{height:20,width:20}}>
              <Image style={{height:"100%",width:"100%"}} source={ic_correct_CallerID}></Image>
            </View>
        </TouchableOpacity>
    );

    

    return (
        <View style={styles.mainContain}>
            <Text style={{ alignSelf: 'center', color: 'black', fontSize: 12, padding: 10 }}>Select the caller ID you would like to use now</Text>
            <View style={{height:0.5,backgroundColor:'gray'}}></View>
            <View style={{height:40}}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    mainContain:{
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        height: 80,
        width: '80%',
        overflow: 'hidden',
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        // Android shadow
        elevation: 5,
        borderWidth: 1, // Adjust the width of the border
        borderColor: '#ccc', // Adjust the color of the border
        position:'absolute',
        top:20,
        zIndex:9
    },
    item: {
        backgroundColor: '#f6f6f6',
        padding: 10,
        marginVertical: 1,
        borderRadius: 10,
        shadowColor: '#000',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:15,
        paddingRight:15
    },
    title: {
        fontSize: 18,
        color:'black'
    },
});
export default CallIDList;
