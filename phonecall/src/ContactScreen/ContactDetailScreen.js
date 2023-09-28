import {
    View,
    StyleSheet,
    Image,
    TextInput,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import { React, useState, useEffect } from 'react';
const { width, height } = Dimensions.get('window')
import Contacts from 'react-native-contacts';

import usecreateUA from '../hook/usecreateUA';
import { BlockContactSave } from '../redux/LoginDateStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';


import ic_Heart from '../../Assets/heart.png';
import ic_Edit from '../../Assets/pencil.png';
import ic_Delete from '../../Assets/deleteS.png';
import ic_Block from '../../Assets/ic_block_user.png';
import ic_Call from '../../Assets/ic_contact_dtl.png';
import ic_Email from '../../Assets/ic_email_dtl.png';
import ic_CallDirect from '../../Assets/ic_call1.png';
import ic_favourite_S from '../../Assets/ic_favourite_S.png';


const db = SQLite.openDatabase(
    {
        name: 'myDatabase.db',
        location: 'default',
    },
    () => { console.log('Database opened.'); },
    error => { console.log(error) }
);

const ContactDetailScreen = ({ route, navigation }) => {
    const data = route.params?.data
    const {connect, makeCall } = usecreateUA()
    const [userBlock, setUserBlock] = useState(false)
    const [favourite, setfavourite] = useState(0)


    console.log(data.phoneNumbers[0].number)

    const FistLetter = () => {
        console.log("data", data.thumbnailPath)

        if (data.hasThumbnail == true) {
        return  <Image style={{ overflow: 'hidden',
                            justifyContent: 'center',
                             height: 100,
                             width: 100
                             ,borderRadius: Math.round( 100 +  100) / 2}} 
                             source={{uri: data.thumbnailPath}} />
        } else {
            let fullName = ""
            if (Platform.OS === 'android') {
                fullName = data.displayName;
            } else {
                fullName = data.givenName + " " + data.familyName;
            }
            console.log(fullName)

            const nameParts = fullName.split(" ");
            if (nameParts.length > 1) {
                const surname = nameParts[nameParts.length - 1];
                const surnameFirstLetter = fullName.charAt(0) + surname.charAt(0)
                console.log("First letter of surname:", surnameFirstLetter);
                return <Text style={{ color: '#4F6EB4', fontSize: 50 }}>{surnameFirstLetter}</Text>
            } else {
                const surnameFirstLetter = fullName.charAt(0);
                console.log("No surname found.");
                return <Text style={{ color: '#4F6EB4', fontSize: 50 }}>{surnameFirstLetter}</Text>
            }
        }


    }

    const NameUser = () => {
        let fullName = ""
        if (Platform.OS === 'android') {
            fullName = data.displayName;
        } else {
            fullName = data.givenName + " " + data.familyName;
        }

        return <Text style={{ color: '#FFFFFF', fontSize: 15, marginTop: 5 }}>{
            fullName
        }</Text>

    }

    const deleteItem = () => {
        let fullName = ""
        if (Platform.OS === 'android') {
            fullName = data.displayName;
        } else {
            fullName = data.givenName + " " + data.familyName;
        }
        Alert.alert(
            'The record will be deleted!',
            `${fullName} The record will be deleted. Are you sure ?`,
            [
                {
                    text: 'cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        const resp = await Contacts.deleteContact({ recordID: data.recordID });
                        navigation.pop(1)
                    },
                },
            ],
        );
    };

    const BlockContact = () => {
        let fullName = ""
        if (Platform.OS === 'android') {
            fullName = data.displayName;
        } else {
            fullName = data.givenName + " " + data.familyName;
        }

        Alert.alert(
            "Block - " + `${fullName}`,
            `You will no longer receive calls from this number`,
            [
                {
                    text: 'cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        AddToBlockContact()
                        setUserBlock(true)
                    },
                },
            ],
        );
    };

    const AddToBlockContact = async () => {
        try {
            const value = await AsyncStorage.getItem("block_contact");
            if (value !== null) {
                console.warn(value)
            }
            let block_contact = value
            block_contact = JSON.parse(block_contact)
            console.log("block_contact", block_contact)
            if (block_contact && block_contact.length > 0) {
                block_contact.push(data)
                BlockContactSave(JSON.stringify(block_contact))
            } else {
                BlockContactSave("block_contact", JSON.stringify([data]))
            }
        } catch (e) {
        }

    }

    const UnBlockContactPopup = () => {
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
                        unBlockNumber()
                    },
                },
            ],
        );
    };

    const unBlockNumber = async () => {
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
                setUserBlock(false)
            } catch (e) {
            }
        } catch (e) {
        }
    }

    function showToast() {
        ToastAndroid.show('Add updated successfully!', ToastAndroid.SHORT);
    }

    useEffect(() => {
        console.log("data.phoneNumbers[0].number",data.phoneNumbers[0].number)
        getContactTableData(data.phoneNumbers[0].number)
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

            let findIndex = block_contact.findIndex((item) => {
                return item.recordID === data.recordID
            })

            console.log("findIndex", findIndex)

            if (findIndex != -1) {
                setUserBlock(true)
            } else {
                setUserBlock(false)
            }

        } catch (e) {
        }
    }

    const getContactTableData = (userNumber) => {
        console.log("userNumber", userNumber)
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM ContactList',
                [],
                (tx, results) => {
                    const rows = results.rows;
                    const users = [];
                    for (let i = 0; i < rows.length; i++) {
                        const user = rows.item(i);
                        users.push(user);
                    }
                    let nameAdd = false
                    console.log("users->", users)

                    Object.keys(users).map(async (key) => {
                        const str = users[key].number.replace(/[^a-z0-9,. ]/gi, '');
                        console.log("key->", str)
                        if (userNumber.replace(/[^a-z0-9,. ]/gi, '').replace(/ /g, '').includes(str.replace(/ /g, ''))) {
                            console.log("key->", users[key].isfavourite)
                            setfavourite(users[key].isfavourite)
                        }
                    })
                },
                (error) => {
                    console.error('Error retrieving data:', error);
                }
            );
        });
    }

    const setContactAddORRemoveInFavourite = () => {
        const RecordID = data.recordID
        let sql = 'UPDATE ContactList SET isfavourite = ? WHERE recordid = ?';
        let params = [(favourite == 1)?0:1, RecordID];
        setfavourite((favourite == 1)?0:1)
        db.executeSql(sql, params, (resultSet) => {
            console.log('Record updated successfully')
            showToast()
        }, (error) => {
            console.log(error);
        });
    }

    return (
        <View style={style.mainViewContain}>
            <View style={style.viewInfo}>
                <View style={{ backgroundColor: '#FFFFFF', height: 100, width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 100 / 2 }}>
                    <FistLetter />
                </View>
                <NameUser />
                <Text style={{ color: '#FFFFFF', fontSize: 15, marginTop: 5 }}>{data.phoneNumbers[0].number}</Text>
            </View>
            <View style={style.viewList}>
                <View>
                    <FlatList
                        data={data.phoneNumbers}
                        renderItem={({ item }) =>
                            <View style={{ backgroundColor: '#E9F0FA', margin: 5, borderRadius: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                        <Image source={ic_Call}></Image>
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ fontSize: 15, color: 'black', marginTop: 10, marginLeft: 15 }}>{item.label}</Text>
                                        <Text style={{ fontSize: 12, color: 'black', marginTop: 5, marginLeft: 15, marginBottom: 10 }}>{item.number} </Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFF', marginRight: 10, height: 50, width: 50, borderRadius: 25 }}>
                                        <TouchableOpacity onPress={() => {
                                            const str = item.number.replace(/[^a-z0-9,. ]/gi, '');
                                            makeCall(str.replace(/ /g, ''))
                                            navigation.navigate('Dialpad')
                                        }}>
                                            <Image source={ic_CallDirect}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </View>
                <View>
                    <FlatList
                        data={data.emailAddresses}
                        renderItem={({ item }) =>
                            <View style={{ backgroundColor: '#E9F0FA', margin: 5, borderRadius: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                        <Image source={ic_Email}></Image>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 15, color: 'black', marginTop: 10, marginLeft: 15 }}>{item.label}</Text>
                                        <Text style={{ fontSize: 12, color: 'black', marginTop: 5, marginLeft: 15, marginBottom: 10 }}>{item.email} </Text>
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </View>
            </View>
            <View style={style.viewDownSide}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <View style={{ backgroundColor: '#4F6EB4', height: 50, width: 50, justifyContent: 'center', borderRadius: 25 }}>
                            <View style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <TouchableOpacity onPress={() => {
                                    Contacts.openExistingContact(route.params?.data)
                                }
                                }>
                                    <Image style={{ resizeMode: 'contain', height: 25, width: 100 }} tintColor={'#FFFFFF'} source={ic_Edit}  ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text>Edit</Text>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <View style={{ backgroundColor: '#4F6EB4', height: 50, width: 50, justifyContent: 'center', borderRadius: 25 }}>
                            <View style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={()  => setContactAddORRemoveInFavourite()}>
                                <Image style={{ resizeMode: 'contain', height: 25, width: 100 }} tintColor={'#FFFFFF'} source={favourite == 1 ? ic_favourite_S : ic_Heart}  ></Image>
                            </TouchableOpacity>
                            </View>
                        </View>
                        <Text>Favorite</Text>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <View style={{ backgroundColor: '#4F6EB4', height: 50, width: 50, justifyContent: 'center', borderRadius: 25 }}>
                            <View style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => deleteItem()}>
                                    <Image style={{ resizeMode: 'contain', height: 25, width: 100 }} tintColor={'#FFFFFF'} source={ic_Delete}  ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text>Delete</Text>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <View style={{ backgroundColor: '#4F6EB4', height: 50, width: 50, justifyContent: 'center', borderRadius: 25 }}>
                            <View style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => userBlock == true ? UnBlockContactPopup() : BlockContact()}>
                                    <Image style={{ resizeMode: 'contain', height: 25, width: 100 }} tintColor={'#FFFFFF'} source={ic_Block}  ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            userBlock == true ? <Text>UnBlock</Text> : <Text>Block</Text>
                        }

                    </View>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    mainViewContain: {
        flex: 1,
    },
    viewInfo: {
        height: 180,
        backgroundColor: '#4F6EB4',
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    viewList: {
        flex: 1,
        margin: 15,
    },
    viewDownSide: {
        height: 100,
        backgroundColor: '#FFFFFF',
        marginBottom: 5

    }
})

export default ContactDetailScreen