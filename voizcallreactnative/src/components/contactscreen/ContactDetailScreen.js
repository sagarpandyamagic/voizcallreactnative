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
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';
import ic_Heart from '../../../Assets/heart.png';
import ic_Edit from '../../../Assets/pencil.png';
import ic_Delete from '../../../Assets/deleteS.png';
import ic_Block from '../../../Assets/ic_block_user.png';
import ic_Call from '../../../Assets/ic_call.png';
import ic_Email from '../../../Assets/ic_email_dtl.png';
import ic_favourite_S from '../../../Assets/ic_favourite_S.png';
import { THEME_COLORS } from '../../HelperClass/Constant';
import { updateSipState } from '../../store/sipSlice';
import { useDispatch, useSelector } from 'react-redux';
import SipUA from '../../services/call/SipUA';

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
    console.log("data", data.recordID)
    const { allSession } = useSelector((state) => state.sip)

    const [userBlock, setUserBlock] = useState(false)
    const [favourite, setfavourite] = useState(0)
    const dispatch = useDispatch()

    const FistLetter = () => {
        console.log("data", data.thumbnailPath)

        if (data.hasThumbnail == true) {
            return <Image style={{
                overflow: 'hidden',
                justifyContent: 'center',
                height: 100,
                width: 100
                , borderRadius: Math.round(100 + 100) / 2
            }}
                source={{ uri: data.thumbnailPath }} />
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
                return <Text style={{ color: '#fff', fontSize: 50 }}>{surnameFirstLetter}</Text>
            } else {
                const surnameFirstLetter = fullName.charAt(0);
                console.log("No surname found.");
                return <Text style={{ color: '#fff', fontSize: 50 }}>{surnameFirstLetter}</Text>
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

        return <Text style={{ color: '#000', fontSize: 15, marginTop: 5 }}>{
            fullName
        }</Text>

    }

    function showToast() {
        ToastAndroid.show('Add updated successfully!', ToastAndroid.SHORT);
    }

    const AudioCall = (number) => {
        dispatch(updateSipState({ key: "Caller_Name", value: data.callee }))
        dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
        // console.log("SessionCount",allSession)
        if(Object.keys(allSession).length > 0){
            dispatch(updateSipState({ key: "ISConfrenceTransfer", value: true }))
            SipUA.toggelHoldCall(true) 
        }else{
            dispatch(updateSipState({ key: "phoneNumber", value: [] }))
        }
        SipUA.makeCall(number, false)
        navigation.navigate('AudioCallingScreen')
    }

    useEffect(() => {
        getFavoriteContactsFromDatabase()
    }, [])


    const getFavoriteContactsFromDatabase = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM ContactList WHERE isfavourite = 1.0', // Updated query
                [],
                (tx, results) => {
                    const rows = results.rows;
                    const favoriteContacts = [];
                    for (let i = 0; i < rows.length; i++) {
                        console.log('favoriteContacts', rows.item(i))
                        const contact = rows.item(i);
                        console.log("dataf", contact.recordID)
                        favoriteContacts.push(contact);
                        if (contact.recordid == data.recordID) {
                            setfavourite(1)
                        }
                    }
                },
                (error) => {
                    console.error('Error retrieving data:', error);
                }
            );
        });
    }


    const setContactAddORRemoveInFavourite = () => {
        console.log("data.recordID", data.recordID)
        const RecordID = data.recordID
        let sql = 'UPDATE ContactList SET isfavourite = ? WHERE recordid = ?';
        let params = [(favourite == 1) ? 0 : 1, RecordID];
        setfavourite((favourite == 1) ? 0 : 1)
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
                <View style={{ backgroundColor: THEME_COLORS.black, height: 100, width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 100 / 2 }}>
                    <FistLetter />
                </View>
                <NameUser />
                <Text style={{ color: '#000', fontSize: 15, marginTop: 5 }}>{data.phoneNumbers[0]?.number}</Text>
            </View>
            <View style={style.viewList}>
                <View>
                    <FlatList
                        data={data.phoneNumbers}
                        renderItem={({ item }) =>
                            <View style={{ backgroundColor: '#BED2CE', margin: 5, borderRadius: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ fontSize: 15, color: 'black', marginTop: 10, marginLeft: 15 }}>{item.label}</Text>
                                        <Text style={{ fontSize: 12, color: 'black', marginTop: 5, marginLeft: 15, marginBottom: 10 }}>{item.number} </Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, height: 40, width: 40, borderRadius: 20, flexDirection: 'row' }}>
                                        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => {
                                            const str = item.number.replace(/[^a-z0-9,. ]/gi, '');
                                            navigation.navigate('Dialpad')
                                            AudioCall(str.replace(/ /g, ''))
                                            
                                        }}>
                                            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                                <Image style={{ height: 20, width: 20 }} source={ic_Call}></Image>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginRight: 30 }} onPress={() => {
                                            setContactAddORRemoveInFavourite()
                                        }}>
                                            <Image style={{ height: 20, width: 20, tintColor: THEME_COLORS.black }} source={favourite == 1 ? ic_favourite_S : ic_Heart}></Image>
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
                            <View style={{ backgroundColor: '#BED2CE', margin: 5, borderRadius: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View>
                                        <Text style={{ fontSize: 15, color: 'black', marginTop: 10, marginLeft: 15 }}>{item.label}</Text>
                                        <Text style={{ fontSize: 12, color: 'black', marginTop: 5, marginLeft: 15, marginBottom: 10 }}>{item.email} </Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', right: 10, height: 40, width: 40, borderRadius: 20, position: 'absolute' }}>
                                        <Image style={{ tintColor: THEME_COLORS.black }} source={ic_Email}></Image>
                                    </View>
                                </View>
                            </View>
                        }
                    />
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
        height: 150,
        backgroundColor: THEME_COLORS.transparent,
        margin: 15,
        paddingTop: 15,
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