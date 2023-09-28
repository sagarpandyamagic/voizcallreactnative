import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    Linking,
    Modal, Pressable, FlatList, Alert
} from 'react-native';
import { React, useEffect, useState } from 'react';
import { SectionList } from 'react-native';

import ic_Block from '../Assets/ic_block.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window')

const Logowidth = width * 0.18
const SettingLogowidth = width * 0.1


const BlockContact = ({ navigation }) => {

    const [blockData, setblockData] = useState([])

    useEffect(() => {
        numberCheckBlockORNot()
    }, [])

    const numberCheckBlockORNot = async () => {
        try {
            const value = await AsyncStorage.getItem("block_contact");
            if (value !== null) {
                console.warn(value)
            }
            let block_contact = value
            block_contact = JSON.parse(block_contact)
            setblockData(block_contact)
            console.log("block_contact", block_contact)
        } catch (e) {
        }
    }

    const FistLetter = (data) => {

        let fullName = ""
        if (Platform.OS === 'android') {
            fullName = data.data.displayName;
        } else {
            fullName = data.data.givenName + " " + data.data.familyName;
        }

        const nameParts = fullName.split(" ");
        if (nameParts.length > 1) {
            const surname = nameParts[nameParts.length - 1];
            const surnameFirstLetter = fullName.charAt(0) + surname.charAt(0)
            console.log("First letter of surname:", surnameFirstLetter);
            return <Text style={{ color: '#FFFF', fontSize: 18 }}>{surnameFirstLetter}</Text>
        } else {
            const surnameFirstLetter = fullName.charAt(0);
            console.log("No surname found.");
            return <Text style={{ color: '#FFFF', fontSize: 18 }}>{surnameFirstLetter}</Text>
        }
    }

    const UnBlockContactPopup = (data) => {
        let fullName = ""
        if (Platform.OS === 'android') {
            fullName = data.displayName;
        } else {
            fullName = data.givenName + " " + data.familyName;
        }
        Alert.alert(
            "UnBlock - " + `${fullName}`, "",
            [
                {
                    text: 'cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        unBlockNumber(data)
                    },
                },
            ],
        );
    };

    const unBlockNumber = async (data) => {
        try {
            const value = await AsyncStorage.getItem("block_contact");
            if (value !== null) {
                console.warn(value)
            }
            console.log("unBlockNumber", value)

            let block_contact = value
            block_contact = JSON.parse(block_contact)
            let reaminBlockContact = block_contact.filter((his) => {
                console.log("his", his)
                if (!data.recordID.includes(his.recordID)) {
                    return his
                }
            })
            console.log("reaminBlockContact", reaminBlockContact)
            try {
                await AsyncStorage.setItem("block_contact", JSON.stringify(reaminBlockContact));
                numberCheckBlockORNot()
            } catch (e) {
            }
        } catch (e) {
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {
                blockData && blockData.length > 0 ?
                    <View>
                        <FlatList
                            data={blockData}
                            renderItem={({ item }) =>
                                <View style={{ backgroundColor: 'rgb(233,240,250)', margin: 5, borderRadius: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#4591ed', marginLeft: 10, height: 40, width: 40, borderRadius: 20 }}>
                                            < FistLetter style={{ flex: 1 }} data={item} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, color: 'black', marginTop: 10, marginLeft: 15 }}>{item.familyName + " " + item.givenName}</Text>
                                            <Text style={{ fontSize: 12, color: 'black', marginTop: 5, marginLeft: 15, marginBottom: 10 }}>{item.phoneNumbers[0].number} </Text>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 5, height: 40, width: 40, borderRadius: 20, resizeMode: 'contain' }}>
                                            <TouchableOpacity onPress={() => UnBlockContactPopup(item)}>
                                                <Image style={{ resizeMode: 'contain', height: 25, width: 25 }} tintColor={'black'} source={ic_Block}></Image>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            }
                        />
                    </View> :
                    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}> Data Not Found </Text>
                    </View>
            }


        </View>
    )
}

const style = StyleSheet.create({
    container: {
        // flex: 1,
        marginHorizontal: 16
    },
    item: {
        padding: 5,
        marginVertical: 0,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header: {
        fontSize: 12,
        backgroundColor: "#d3d3d3",
        padding: 5,
        fontWeight: 'normal',
        paddingLeft: 15
    },
    title: {
        fontSize: 13,
        marginLeft: 15
    }
})

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "60%",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginHorizontal: 15,
        fontSize: 15,
    },
    buttonOpen: {
        backgroundColor: '#ffff',
        borderRadius: 10,
        borderColor: 'rgba(16,94,174,1)',
        borderWidth: 1,
        width: "50%",
    },
    buttonClose: {
        backgroundColor: '#fff',
        elevation: 0,
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});


export default BlockContact