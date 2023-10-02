import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, SectionList, Button, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import ListItem from './ListItem';
import Avatar from './Avatar';
import ContactDetailScreen from './ContactDetailScreen';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'myDatabase.db',
    location: 'default',
  },
  () => { console.log('Database opened.'); },
  error => { console.log(error) }
);

const ContactsList = ({ navigation }) => {
  let [contacts, setContacts] = useState([]);
  const headerArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    setTimeout(() => {
      loadContacts()
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
      let currChat = String.fromCharCode(aCode + i)
      let obj = {
        title: currChat,
      }
      let currContacs = contacts.filter(item => {
        return item.givenName[0]&&JSON.stringify(item.givenName[0]).toUpperCase() == JSON.stringify(currChat);

      })
      if (currContacs.length > 0) {
        currContacs.sort((a, b) => JSON.stringify(a.givenName).localeCompare(JSON.stringify(b.givenName)));
        obj.data = currContacs
        contactsarray.push(obj)
      }
    }
    return contactsarray
  }

  const createContactTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ContactList (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number TEXT,recordid TEXT, thumbnail TEXT, thumbnailpath TEXT,isfavourite TEXT)',
        [],
        () => { 
          console.log('Table created successfully.'); 
        setContactUpdateTableData(item)
      },
        (error) => { console.error('Error creating table:', error); }
      );
    });
  }


  useEffect(() => {   
    createContactTable()
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        loadContacts();
      }
      );
    } else {
      loadContacts();
    }
  }, []);

  const loadContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        contacts.sort((a, b) =>
          a.givenName.toLowerCase() > b.givenName.toLowerCase()
        );
        setContacts(contacts);
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
        setContacts(contacts);
      });
    } else {
      Contacts.getContactsMatchingString(text).then(contacts => {
        contacts.sort(
          (a, b) =>
            a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      });
    }
  };

  const getAvatarInitials = (textString) => {
    if (!textString) return '';
    const text = textString.trim();
    const textSplit = text.split(' ');
    if (textSplit.length <= 1) return text.charAt(0);
    const initials =
      textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
    return initials;
  };

  const openContact = (contact) => {
    const contactdetail = JSON.stringify(contact)
    console.log(JSON.stringify(contact));
    console.log(contactdetail)
    navigation.navigate('ContactDetailScreen', { data: contact });
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View >
          <TextInput
            onChangeText={search}
            placeholder="Search"
            style={styles.searchBar}
          />
          <SectionList
            sections={getData()}
            renderItem={(contact) => {
              return (
                <ListItem
                  key={contact.item.recordID}
                  item={contact.item}
                  onPress={openContact}
                />
              );
            }}

            keyExtractor={item => item.recordID}
            renderSectionHeader={({ section: { title } }) => (
              <View>
                <Text style={styles.header} >{title}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4591ed',
    color: 'white',
    paddingVertical: 5,
    fontSize: 15,
    paddingLeft: 18
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
  }
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