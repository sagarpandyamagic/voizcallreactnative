import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, SectionList, Button, RefreshControl, SafeAreaView, ScrollView, Modal, Image } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import ListItem from './ListItem';
import { ro } from 'date-fns/locale';

const DialpadContactSearch = ({ search }) => {

    let [contacts, setContacts] = useState([]);
    let [tempcontacts, settempContacts] = useState([]);

    useEffect(() => {
        // if (Platform.OS === 'android') {
        //     PermissionsAndroid.request(
        //         PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        //         title: 'Contacts',
        //         message: 'This app would like to view your contacts.',
        //     }).then(() => {
        //         loadContacts();
        //     }
        //     );
        // } else {
        //     loadContacts();
        // }
    }, []);

    const getData = () => {
        let contactsarray = []
        if (search.toString() != "") {
            let aCode = "A".charCodeAt(0);
            for (let i = 0; i < 26; i++) {
                let currChat = String.fromCharCode(aCode + i)
                let obj = {
                    title: currChat,
                }
                let currContacs = contacts.filter(item => {
                    return JSON.stringify(item.givenName[0]) == JSON.stringify(currChat);
                })
                if (currContacs.length > 0) {
                    currContacs.sort((a, b) => JSON.stringify(a.givenName).localeCompare(JSON.stringify(b.givenName)));
                    obj.data = currContacs
                    contactsarray.push(obj)
                }
            }
        }
        return contactsarray
    }

    const loadContacts = () => {
        Contacts.getAll()
            .then(contacts => {
                const simplifiedContacts = contacts.map(contact => ({
                    recordID: contact.recordID, // Keep the ID for key extraction
                    givenName: contact.givenName,
                    familyName: contact.familyName,
                    phoneNumbers: contact.phoneNumbers, // Include only phone numbers
                }));
                simplifiedContacts.sort((a, b) => a.givenName.toLowerCase().localeCompare(b.givenName.toLowerCase()));
                setContacts(simplifiedContacts);
                settempContacts(simplifiedContacts)
            })
            .catch(e => {
                alert('Permission to access contacts was denied');
                console.warn('Permission to access contacts was denied');
            });

    };

    useEffect(() => {
        setContacts([]);
        setContacts(tempcontacts)
        searchContact(search.join(''))
        console.log("Search->",search.join(''))
    }, [search]);


    const searchContact = (text) => {
        console.log("text->",text)
        const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
        if (text === '' || text === null) {
            setContacts([]);
        } else {
            // If search text is not a phone number, search by name
            if (contacts && contacts.length > 0) {
                let filteredContacts = tempcontacts.filter((contact) => {
                    const lowerText = text.toLowerCase();
                    const fullName = `${contact.givenName} ${contact.familyName}`.toLowerCase();
                    const matchesName = fullName.includes(lowerText);
                    const matchesPhone = contact.phoneNumbers.some(phone => phone.number.includes(text));
    
                    return matchesName || matchesPhone;
                });
                setContacts(filteredContacts);
                // console.log("Filtered contacts:", filteredContacts);
            }
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
            >
                <View >
                    <SectionList
                        sections={getData()}
                        renderItem={(contact) => {
                            return (
                                <ListItem
                                    key={contact.item.recordID}
                                    item={contact.item}
                                    textColor={'W'}
                                />
                            );
                        }}
                        keyExtractor={item => item.recordID}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DialpadContactSearch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        color: 'white',
        fontSize: 15,
        paddingLeft: 10,
        marginTop: -18
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