import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, SectionList, Button, RefreshControl, SafeAreaView, ScrollView, Modal, Image } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import ListItem from './ListItem';
import SQLite from 'react-native-sqlite-storage';
import ic_Search from '../../../Assets/ic_Search.png'
import gradiant_border from '../../../Assets/gradiant_border.png'
import AddContactButton from './AddContactButton';
import LodingJson from '../../HelperClass/LodingJson';

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
  const [loading, setLoading] = useState(false);

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

  const getContactTableData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM ContactList',
        [],
        (tx, results) => {
          const rows = results.rows;
          const dbContacts = [];

          for (let i = 0; i < rows.length; i++) {
            const contact = rows.item(i);
            dbContacts.push(contact);
          }

          setContacts(dbContacts);
        },
        (error) => {
          console.error('Error retrieving data:', error);
        }
      );
    });
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

  const updateDatabaseWithNewContacts = (contacts) => {
    db.transaction((tx) => {
      contacts.forEach(contact => {
        tx.executeSql(
          'SELECT * FROM ContactList WHERE recordid = ?',
          [contact.recordID],
          (tx, results) => {
            if (results.rows.length === 0) {
              // New contact, insert it
              tx.executeSql(
                'INSERT INTO ContactList (name, number, recordid, thumbnail, thumbnailpath, isfavourite) VALUES (?, ?, ?, ?, ?, ?)',
                [contact.givenName, contact.phoneNumbers[0]?.number, contact.recordID, contact.thumbnailPath, contact.thumbnailPath, '0'],
                () => { console.log('New contact inserted successfully.'); },
                (error) => { console.error('Error inserting new contact:', error); }
              );
            }
          },
          (error) => { console.error('Error checking contact:', error); }
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

  useEffect(() => {
    createContactTable();
    if (Platform.OS === 'android') {
      checkContactPermission()
    } else {
      loadContacts();
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


  const loadContacts = () => {
    setLoading(true)
    Contacts.getAll()
      .then(contacts => {
        if (contacts.length === 0) {
          console.log('No contacts found');
        } else {
          contacts = contacts.filter(contact => contact.givenName);

          // Sort contacts by givenName
          contacts.sort((a, b) => {
            const nameA = a.givenName.toLowerCase();
            const nameB = b.givenName.toLowerCase();
            return nameA.localeCompare(nameB);
          });
  
          saveContactsToDatabase(contacts);
          setContacts(contacts);
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false)
        // alert('Permission to access contacts was denied',e);
        Alert.alert('Error', 'Failed to load contacts');
        console.warn('Error loading contacts:', error.message);
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
              style={styles.input}
            />
          </View>
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

export default ContactsList;


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