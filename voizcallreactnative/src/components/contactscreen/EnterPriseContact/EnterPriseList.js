import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, SectionList, RefreshControl, SafeAreaView, ScrollView, Image, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import ic_Search from '../../../../Assets/ic_Search.png'
import gradiant_border from '../../../../Assets/gradiant_border.png'
import AddContactButton from '../AddContactButton';
import ListItem from '../ListItem';
import { getStorageData } from '../../utils/UserData';
import { GETAPICALL } from '../../../services/auth';
import { APIURL } from '../../../HelperClass/APIURL';
import LodingJson from '../../../HelperClass/LodingJson';

const db = SQLite.openDatabase(
    {
        name: 'myDatabase.db',
        location: 'default',
    },
    () => { console.log('Database opened.'); },
    error => { console.log(error) }
);

const EnterPriseList = ({ navigation }) => {
    const [contacts, setContacts] = useState([]);
    const headerArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        setTimeout(() => {
            loadContacts();
            setRefreshing(false);
        }, 1500);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const getData = () => {
        let contactsarray = []
        let aCode = "A".charCodeAt(0);
        for (let i = 0; i < 26; i++) {
            let currChat = String.fromCharCode(aCode + i);
            let obj = {
                title: currChat,
            };
            let currContacts = contacts.filter(item => item.givenName[0] === currChat);
            if (currContacts.length > 0) {
                currContacts.sort((a, b) => a.givenName.localeCompare(b.givenName));
                obj.data = currContacts;
                contactsarray.push(obj);
            }
        }
        return contactsarray;
    };

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
    };

    const insertContact = (contact) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO ContactList (name, number, recordid, thumbnail, thumbnailpath, isfavourite) VALUES (?, ?, ?, ?, ?, ?)',
                [contact.givenName, contact.phoneNumbers.map(p => p.number).join(','), contact.recordID, contact.thumbnailPath, '', contact.isfavourite],
                (tx, results) => { console.log('Contact inserted successfully:', results.insertId); },
                (error) => { console.error('Error inserting contact:', error); }
            );
        });
    };


    useEffect(() => {
        createContactTable();
        EnterPriceListAPI();
    }, []);

    const EnterPriceListAPI = async () => {
        const value = await GETAPICALL(APIURL.GETENTERPRISEDIC);
        if(value.success) {
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

            setContacts(transformedContacts)
            setLoading(false)
        }
       

        console.log("transformedContacts->", transformedContacts);
    };

    const loadContacts = () => {
        // Replace the dynamic loading of contacts with static contacts
        setLoading(true)
        EnterPriceListAPI()
    };

    const search = (text) => {
        const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
        if (text === '' || text === null) {
            loadContacts();
        } else if (phoneNumberRegex.test(text)) {
            const filteredContacts = contacts.filter(contact => contact.phoneNumbers.some(pn => pn.number.includes(text)));
            filteredContacts.sort((a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase());
            setContacts(filteredContacts);
        } else {
            const filteredContacts = contacts.filter(contact => contact.givenName.toLowerCase().includes(text.toLowerCase()));
            filteredContacts.sort((a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase());
            setContacts(filteredContacts);
        }
    };

    const openContact = (contact) => {
        navigation.navigate('Contact Detail', { data: contact });
    };

    return (
        <SafeAreaView style={styles.container}>
            {
                <LodingJson loading = {loading} setLoading = {setLoading} />
            }
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View>
                    <View style={styles.containerSearch}>
                        <Image size={20} color="#000" style={styles.icon} source={ic_Search} />
                        <TextInput
                            onChangeText={search}
                            placeholder="Search Contact"
                            style={styles.input}
                        />
                    </View>
                    <SectionList
                        sections={getData()}
                        renderItem={({ item }) => (
                            <ListItem
                                key={item.recordID}
                                item={item}
                                onPress={openContact}
                            />
                        )}
                        keyExtractor={item => item.recordID}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={{ justifyContent: 'center' }}>
                                <Image style={{ resizeMode: 'contain' }} source={gradiant_border} />
                                <Text style={styles.header}>{title}</Text>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
            <AddContactButton navigation={navigation} />
        </SafeAreaView>
    );
};

export default EnterPriseList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        color: 'white',
        fontSize: 15,
        paddingLeft: 10,
        position:'absolute',
        justifyContent:'center'
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
        width: 20
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
