import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import ic_correct from '../../../Assets/ic_correct.png';
import { getCountyCode } from '../../services/auth';
import LodingJson from '../../HelperClass/LodingJson';
import { SearchBar } from 'react-native-screens';
import SearchBarCustom from '../../HelperClass/SearchBarCustom';


const PickYourCountyCode = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [arrayLanguages, setarrayLanguages] = useState(null);
    const [filterData, sefilterData] = useState(null);

    const [selectedId, setSelectedId] = useState(null);

    const fatchCountycode = async () => {
        setLoading(true);
        const configInfo = await getCountyCode()
        setarrayLanguages(configInfo.data)
        sefilterData(configInfo.data)
        setLoading(false);
    }

    const handleSearch =  (text) => {
        const filteredData = arrayLanguages.filter(item => 
            item.country_code.toLowerCase().includes(text.toLowerCase())
         );
         if (text == "") {
            sefilterData(arrayLanguages)
         }else{
            sefilterData(filteredData)
         }
    }

    useEffect(() => {
        fatchCountycode();
    }, [])

    const renderItem = ({ item }) => {
        const isSelected = item.is_default == 'Y';
        return (
            <TouchableOpacity
                style={[styles.imageContainer, isSelected && styles.selectedImage]}
                onPress={() => setSelectedId(item.id)} >
                <Image source={{uri: item.country_flag}} style={styles.imag}></Image>
                <Text style={{ fontSize: 20,color:'black' }}>{item.country_code}  (+{item.country_phonecode})</Text>
                <View style={{ position: 'absolute', right: 10, height: 25, width: 25 }}>
                    {
                        isSelected ? <Image style={{ width: "100%", height: "100%" }} source={ic_correct} resizeMode="contain" ></Image> :
                            <></>
                    }
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            {
                <LodingJson loading = {loading} setLoading = {setLoading} />
            }
            <SearchBarCustom onSearch={handleSearch} />
            <FlatList
                data={filterData}
                renderItem={renderItem}
                keyExtractor={(item) => item.country_id}
                extraData={selectedId}
            />
        </>
    );
};
const styles = StyleSheet.create({
    imageContainer: {
        margin: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
        overflow: 'hidden',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedImage: {
        // borderWidth: 2,
        backgroundColor: '#e8efff',
    },
    imag:{
        height:25,
        width:25,
        marginLeft:20 ,
        marginRight:20,
        borderRadius:2
    },
    
})

export default PickYourCountyCode;
