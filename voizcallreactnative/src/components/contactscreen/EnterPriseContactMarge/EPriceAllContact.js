import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, SectionList, Button, RefreshControl, SafeAreaView, ScrollView, Modal, Image } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import ListItem from '../ListItem';
import SQLite from 'react-native-sqlite-storage';
import ic_Search from '../../../../Assets/ic_Search.png'
import gradiant_border from '../../../../Assets/gradiant_border.png'
import AddContactButton from '../AddContactButton';
import { GETAPICALL } from '../../../services/auth';
import { APIURL } from '../../../HelperClass/APIURL';
import LodingJson from '../../../HelperClass/LodingJson';
import { THEME_COLORS } from '../../../HelperClass/Constant';

const db = SQLite.openDatabase(
    {
        name: 'myDatabase.db',
        location: 'default',
    },
    () => { console.log('Database opened.'); },
    error => { console.log(error) }
);

const EPriceAllContact = ({ navigation }) => {
    let [contactsphone, setContactsphone] = useState([]);
    const headerArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const [refreshing, setRefreshing] = useState(false);
    let [EpriceC, setEpriceC] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        // setTimeout(() => {
        //     loadContacts()
        //     setRefreshing(false);
        // }, 1500);
    };

    const onRefresh = () => {
        //setRefreshing(true);
        //fetchData();
    };

    useEffect(() => {
        createContactTable();
        if (Platform.OS === 'android') {
            checkContactPermission()
        } else {
            loadContacts()
        }
    }, []);


    const checkContactPermission = async () => {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
            if (granted) {
                console.log('Permission granted');
                loadContacts();
            } else {
                const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                    title: 'Contacts',
                    message: 'This app would like to view your contacts.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });

                if (result === PermissionsAndroid.RESULTS.GRANTED) {
                    loadContacts();
                } else {
                    Alert.alert('Permission Denied', 'Permission to access contacts was denied');
                }
            }
        } catch (error) {
            console.warn('Permission check or request failed', error);
        }
    };



    const getData = () => {
        let contactsarray = []
        let aCode = "A".charCodeAt(0);
        for (let i = 0; i < 26; i++) {
            let currChat = String.fromCharCode(aCode + i)
            let obj = {
                title: currChat,
            }
            let currContacs = contactsphone.filter(item => {
                return JSON.stringify(item.givenName[0]) == JSON.stringify(currChat);
            })
            if (currContacs.length > 0) {
                currContacs.sort((a, b) => JSON.stringify(a.givenName).localeCompare(JSON.stringify(b.givenName)));
                obj.data = currContacs
                contactsarray.push(obj)
            }
        }
        return contactsarray
    }

    const saveContactsToDatabase = (contacts) => {
        db.transaction((tx) => {
            contacts.forEach(contact => {
                tx.executeSql(
                    'INSERT INTO ContactList (name, number, recordid, thumbnail, thumbnailpath, isfavourite) VALUES (?, ?, ?, ?, ?, ?)',
                    [contact.givenName, contact.phoneNumbers[0]?.number, contact.recordID, contact.thumbnailPath, contact.thumbnailPath, '0'],
                    () => { console.log('Contact inserted successfully.'); },
                    (error) => { console.error('Error inserting contact:', error); }
                );
            });
        });
    }

    const createContactTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS ContactList (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number TEXT, recordid TEXT, thumbnail TEXT, thumbnailpath TEXT, isfavourite TEXT)',
                [],
                () => {
                    console.log('Table created successfully.');
                },
                (error) => { console.error('Error creating table:', error); }
            );
        });
    }

    const EnterPriceListAPI = async () => {
        const value = await GETAPICALL(APIURL.GETENTERPRISEDIC);
        if (value.success) {
            // console.log("transformedContacts->", value.data);
            const transformedContacts = value.data.map(contact => {
                // Ensure contact fields are not undefined
                const fullName = `${contact.ed_first_name || ''} ${contact.ed_last_name || ''}`;
                const mobile = contact.ed_mobile || '';
                const landline = contact.ed_landline || '';
                const extension = contact.ed_extension || '';
                const familyName = ""

                return {
                    givenName: fullName.trim(),
                    displayName: fullName.trim(),
                    familyName: familyName,
                    recordID: contact.ed_id ? contact.ed_id.toString() : '0',
                    phoneNumbers: [
                        { number: mobile, label: 'mobile' },
                        { number: landline, label: 'landline' },
                        { number: extension, label: 'extension' }
                    ].filter(phone => phone.number), // Filter out any empty numbers
                    thumbnailPath: "", // Or assign a default path if needed
                    isfavourite: "0" // Or determine based on some logic
                };
            });

            console.log("EPriceAllContact transformedContacts", transformedContacts)
            setContactsphone(prevContacts => [...prevContacts, ...transformedContacts]);
            setEpriceC(transformedContacts)
            console.log("EPriceAllContact contacts", contactsphone)
            setLoading(false)

            //    loadContacts();
        }else{
            setLoading(false)
        }
    };



    const EnterPriceList = async () => {
        await EnterPriceListAPI()
    }

    const loadContacts = () => {
        setLoading(true)
        Contacts.getAll()
            .then(phonecontacts => {
                // phonecontacts.sort((a, b) =>
                //     a.givenName.toLowerCase() > b.givenName.toLowerCase()
                // );

                phonecontacts = phonecontacts.filter(contact => contact.givenName);

                // Sort contacts by givenName
                phonecontacts.sort((a, b) => {
                    const nameA = a.givenName.toLowerCase();
                    const nameB = b.givenName.toLowerCase();
                    return nameA.localeCompare(nameB);
                });


                // saveContactsToDatabase(phonecontacts);
                console.log("EPriceAllContact contacts", contactsphone)

                // setContactsphone([...contactsphone,...phonecontacts]);
                setContactsphone(prevContacts => [...prevContacts, ...phonecontacts]);

                console.log("EPriceAllContact 1")
                EnterPriceList()

            })
            .catch(e => {
                alert('Permission to access contacts was denied');
                console.warn('Permission to access contacts was denied');
            });
    };

    const search = (text) => {
        const phoneNumberRegex =
            /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
        if (text === '' || text === null) {
            loadContacts();
        } else if (phoneNumberRegex.test(text)) {
            Contacts.getContactsByPhoneNumber(text).then(contacts => {
                contacts.sort(
                    (a, b) =>
                        a.givenName.toLowerCase() > b.givenName.toLowerCase(),
                );
                setContactsphone(contacts);
            });
        } else {
            Contacts.getContactsMatchingString(text).then(contacts => {
                contacts.sort(
                    (a, b) =>
                        a.givenName.toLowerCase() > b.givenName.toLowerCase(),
                );
                setContactsphone(contacts);
            });
        }
    };


    const openContact = (contact) => {
        const contactdetail = JSON.stringify(contact)
        console.log(JSON.stringify(contact));
        console.log(contactdetail)
        navigation.navigate('Contact Detail', { data: contact });
    };

    return (
        <SafeAreaView style={styles.container}>
            {
                <LodingJson loading={loading} setLoading={setLoading} />
            }
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View >
                    <View style={styles.containerSearch}>
                        <Image size={20} color="#000" style={styles.icon} source={ic_Search}></Image>
                        <TextInput
                            onChangeText={search}
                            placeholder="Search Contact"
                            placeholderTextColor={THEME_COLORS.black}
                            style={styles.input}
                        />
                    </View>
                    <SectionList
                        sections={getData()}
                        renderItem={(contactsphone) => {
                            return (
                                <ListItem
                                    key={contactsphone.item.recordID}
                                    item={contactsphone.item}
                                    onPress={openContact}
                                />
                            );
                        }}
                        keyExtractor={item => item.recordID}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={{ justifyContent: 'center', }}>
                                <Image style={{ resizeMode: 'contain' }} source={gradiant_border}></Image>
                                <Text style={styles.header} >{title}</Text>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
            <AddContactButton navigation={navigation} />
        </SafeAreaView>
    );
};

export default EPriceAllContact;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        color: 'white',
        fontSize: 15,
        paddingLeft: 10,
        // marginTop: -22
        position: 'absolute',
        justifyContent: 'center'
    },
    searchBar: {
        backgroundColor: '#f0eded',
        paddingHorizontal: 30,
        paddingVertical: Platform.OS === 'android' ? undefined : 15,
        marginTop: 15
    },
    contactList: {
        fontSize: 12,
        paddingLeft: 10,
        paddingVertical: 5,
    },
    containerSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        padding: 5,
        backgroundColor: '#e8efff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        marginLeft: 10,
        marginRight: 10,
        height: 20,
        width: 20,
        tintColor: THEME_COLORS.black,

    },
    input: {
        height: 40,
        paddingHorizontal: 10,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


const sizes = {
    itemHeight: 40,
    headerHeight: 30,

    spacing: {
        regular: 15,
    },
};

const colors = {
    background: {
        light: 'white',
        dark: '#8e8e93',
    },

    seperatorLine: '#e6ebf2',

    text: {
        dark: '#1c1b1e',
    },

    primary: '#007aff',
};