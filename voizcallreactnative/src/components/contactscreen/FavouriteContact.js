import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, SectionList, RefreshControl, SafeAreaView, ScrollView, Image, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import ListItem from './ListItem';
import SQLite from 'react-native-sqlite-storage';
import ic_Search from '../../../Assets/ic_Search.png'
import gradiant_border from '../../../Assets/gradiant_border.png'
import AddContactButton from './AddContactButton';
import debounce from 'lodash.debounce'; // If you’re using lodash, consider adding this for debouncing.
import { THEME_COLORS } from '../../HelperClass/Constant';

const db = SQLite.openDatabase(
  {
    name: 'myDatabase.db',
    location: 'default',
  },
  () => { console.log('Database opened.'); },
  error => { console.log(error) }
);

const FavouriteContact = ({ navigation }) => {

  let [contacts, setContacts] = useState([]);
  const headerArray = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const [refreshing, setRefreshing] = useState(false);
  const favoriteIds = new Set();

  useEffect(() => {
    // createContactTable();
    getFavoriteContactsFromDatabase()
  }, []);


  const fetchData = () => {
    setTimeout(() => {
      getFavoriteContactsFromDatabase()
      setRefreshing(false);
    }, 1500);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getData = () => {
    return headerArray.map(letter => {
      const filteredContacts = contacts.filter(contact =>
        contact.givenName?.toUpperCase().startsWith(letter)
      );

      if (filteredContacts.length > 0) {
        return {
          title: letter,
          data: filteredContacts.sort((a, b) => a.givenName.localeCompare(b.givenName)),
        };
      }
      return null;
    }).filter(section => section !== null);
  };

  const getFavoriteContactsFromDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM ContactList WHERE isfavourite = "1.0"',
        [],
        (tx, results) => {
          const rows = results.rows;
          favoriteIds.clear();
          for (let i = 0; i < rows.length; i++) {
            favoriteIds.add(rows.item(i).recordid);
          }
          if (Platform.OS === 'android') {
            requestAndroidPermissions().then(loadContacts);
          } else {
            loadContacts();
          }
          console.log('favoriteContacts', favoriteIds);
        },
        (error) => {
          console.error('Error retrieving data:', error);
        }
      );
    });
  }

  const updateDatabaseWithNewFavoriteContacts = (contacts) => {
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
                [contact.givenName, contact.phoneNumbers[0]?.number, contact.recordID, contact.thumbnailPath, contact.thumbnailPath, '1'],
                () => { console.log('New favorite contact inserted successfully.'); },
                (error) => { console.error('Error inserting new contact:', error); }
              );
            }
          },
          (error) => { console.error('Error checking contact:', error); }
        );
      });
    });
  }

  // const createContactTable = () => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       'CREATE TABLE IF NOT EXISTS ContactList (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number TEXT, recordid TEXT, thumbnail TEXT, thumbnailpath TEXT, isfavourite TEXT)',
  //       [],
  //       () => {
  //         console.log('Table created successfully.');
  //       },
  //       (error) => { console.error('Error creating table:', error); }
  //     );
  //   });
  // }

  const requestAndroidPermissions = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app needs access to your contacts.',
      });
    } catch (error) {
      console.warn('Permission to access contacts was denied', error);
    }
  };

  const loadContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        if (contacts.length === 0) {
          console.log('No contacts found');
        } else {
          contacts = contacts.filter(contact => contact.givenName && favoriteIds.has(contact.recordID));

          // Sort contacts by givenName
          contacts.sort((a, b) => {
            const nameA = a.givenName.toLowerCase();
            const nameB = b.givenName.toLowerCase();
            return nameA.localeCompare(nameB);
          });
          
          setContacts(contacts);
        }
      })
      .catch(e => {
        alert('Permission to access contacts was denied');
        console.warn('Permission to access contacts was denied');
      });
  };

  const search = debounce((text) => {
    if (!text) {
      loadContacts();
      return;
    }

    const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then(setContacts);
    } else {
      Contacts.getContactsMatchingString(text).then(setContacts);
    }
  }, 300);

  const openContact = (contact) => {
    const contactdetail = JSON.stringify(contact)
    console.log(JSON.stringify(contact));
    console.log(contactdetail)
    navigation.navigate('Contact Detail', { data: contact });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <View style={styles.containerSearch}>
            <Image size={20} color="#000" style={styles.icon} source={ic_Search}></Image>
            <TextInput
              onChangeText={search}
              placeholder="Search Contact"
              placeholderTextColor={THEME_COLORS.black}
              style={styles.input}
            />
          </View>
          {
            getData().length > 0 ? (
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
            ) : (
              <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Data not found</Text>
              </View>
            )}
        </View>
      </ScrollView>
      <AddContactButton navigation={navigation} />
    </SafeAreaView>
  );
};

export default FavouriteContact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: 'white',
    fontSize: 15,
    paddingLeft: 10,
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: "100%", // Adjust this value to center the text better
  },
  notFoundText: {
    fontSize: 18,
    color: 'gray',
    position: 'absolute'
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
