import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { FlatList } from 'react-native-gesture-handler';

import ic_correct from '../../../Assets/ic_correct.png';


const LanguagesSelecaion = ({ navigation }) => {
    const arrayLanguages = [
        { id: '1', languageName: 'English (en)' },
        { id: '2', languageName: 'Espagnole (es)' },
        { id: '3', languageName: 'Francails (fr)' },
        { id: '4', languageName: 'Deutsch (de)' },
    ];
    const [selectedId, setSelectedId] = useState(null);
    const renderItem = ({ item }) => {
        const isSelected = item.id === selectedId;
        return (
            <TouchableOpacity
                style={[styles.imageContainer, isSelected && styles.selectedImage]}
                onPress={() => setSelectedId(item.id)} >
                <Text style={{ fontSize: 18,position:'absolute',left:15 }}>{item.languageName}</Text>
                <View  style={{ position:'absolute',right:10 ,height:25,width:25}}>
                 {
                    isSelected ? <Image style={{width: "100%", height: "100%"}} source={ic_correct} resizeMode="contain" ></Image> :
                    <></>
                 }
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <>
            <FlatList
                data={arrayLanguages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
            />
        </>
    );
};
const styles = StyleSheet.create({
    imageContainer: {
        // flex:1,
        // backgroundColor:'red',
        margin: 10,
        marginLeft:25,
        marginRight:25,
        borderRadius: 10,
        overflow: 'hidden',
        height:50,
        flexDirection:'row',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    selectedImage: {
        // borderWidth: 2,
        backgroundColor: '#e8efff',
    },
})

export default LanguagesSelecaion;
