import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, SectionList, SafeAreaView, ScrollView, VirtualizedList } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import ListItem from './ListItem';
import debounce from 'lodash.debounce';

const DialpadContactSearch = ({ search, setNumber, numberMatch }) => {

    let [contacts, setContacts] = useState([]);
    let [tempcontacts, settempContacts] = useState([]);
    const getItemCount = (data) => data.length;
    const getItem = (data, index) => data[index];
    const [page, setPage] = useState(1);
    const CONTACTS_PER_PAGE = 50;

    useEffect(() => {
        GetcontactPermissions();
    }, []);

    const GetcontactPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
            if (!granted) {
                return;
            }
            loadContacts();
        } else {
            loadContacts();
        }
    }

    const loadContacts = async () => {
        try {
            const allContacts = await Contacts.getAll();
            if (allContacts.length > 0) {
              const validContacts = allContacts
                .filter(contact => contact.givenName)
                .sort((a, b) => a.givenName.localeCompare(b.givenName));
              settempContacts(validContacts);
              setContacts(validContacts.slice(0, CONTACTS_PER_PAGE));
            }
          } catch (error) {
            console.warn('Error loading contacts:', error.message);
          }
    };

    const getData = () => {
        let contactsarray = [];
        if (search.toString() !== "") {
            let aCode = "A".charCodeAt(0);
            for (let i = 0; i < 26; i++) {
                let currChat = String.fromCharCode(aCode + i);
                let obj = {
                    title: currChat,
                };
                let currContacts = contacts.filter(item => item.givenName[0].toUpperCase() === currChat);
                if (currContacts.length > 0) {
                    currContacts.sort((a, b) => a.givenName.localeCompare(b.givenName));
                    obj.data = currContacts;
                    contactsarray.push(obj);
                }
            }
        }
        return contactsarray;
    };

    useEffect(() => {
        searchContact(search.join(''));
    }, [search]);

    const searchContact = useCallback((text) => {
        if (text === '' || text === null) {
          setContacts(tempcontacts.slice(0, CONTACTS_PER_PAGE));
          setPage(1);
        } else {
          const filteredContacts = tempcontacts.filter(contact => {
            const lowerText = text.toLowerCase();
            const fullName = `${contact.givenName} ${contact.familyName}`.toLowerCase();
            return fullName.includes(lowerText) || 
                   contact.phoneNumbers.some(phone => phone.number.includes(text));
          }).slice(0, CONTACTS_PER_PAGE);
      
          setContacts(filteredContacts);
          numberMatch(filteredContacts.length === 1 && filteredContacts[0].phoneNumbers.some(phone => 
            phone.number.replace(/[^0-9+]/g, '') === text.replace(/[^0-9+]/g, '')
          ));
        }
      }, [tempcontacts, numberMatch]);

    const renderItem = useCallback(({ item }) => (
        <ListItem
            key={item.recordID}
            item={item}
            textColor={'W'}
            onPress={() => {
                if (item.phoneNumbers && item.phoneNumbers.length > 0) {
                    const number = item.phoneNumbers[0].number.replace(/[^0-9+]/g, '');
                    setNumber([number]);
                }
            }}
        />
    ), [setNumber]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
            >
                <View >
                    {/* <SectionList
                        sections={getData()}
                        renderItem={(contact) => {
                            return (
                                <ListItem
                                    key={contact.item.recordID}
                                    item={contact.item}
                                    textColor={'W'}
                                    onPress={() => {
                                        searchContact(contact.item.givenName);
                                        if (contact.item.phoneNumbers && contact.item.phoneNumbers.length > 0) {
                                            console.log("Phone number:", contact.item.phoneNumbers[0].number);
                                            const number = contact.item.phoneNumbers[0].number.replace(/[^0-9+]/g, '')
                                            const newNumbers = [number.toString()];  
                                            console.log(newNumbers)                  
                                            setNumber(newNumbers);
                                        }
                                    }}
                                />
                            );
                        }}
                        keyExtractor={item => item.recordID}
                    /> */}

                   {
                    search.length > 0 &&  <VirtualizedList
                    data={contacts}
                    renderItem={renderItem}
                    keyExtractor={item => item.recordID}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={50}
                    windowSize={5}
                />
                   } 
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