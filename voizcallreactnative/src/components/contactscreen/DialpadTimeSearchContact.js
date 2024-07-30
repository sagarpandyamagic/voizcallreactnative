import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
        name: 'myDatabase.db',
        location: 'default',
    },
    () => { console.log('Database opened.'); },
    error => { console.log(error) }
);


const DialpadTimeSearchContact = (props) => {
    const { searchtext, setCode } = props
    let [contacts, setContacts] = useState([]);
    let [tempContacts, tempSetContacts] = useState([]);

    const  createContactTable = () => {
        db.transaction((tx) => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS ContactList (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number TEXT,recordid TEXT, thumbnail TEXT, thumbnailpath TEXT,isfavourite TEXT)',
            [],
            () => {
              console.log('Table created successfully.');
            },
            (error) => { console.error('Error creating table:', error); }
          );
        });
      }

    const getContactTableData = () => {
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
                    tempSetContacts(users)
                },
                (error) => {
                    console.error('Error retrieving data:', error);
                }
            );
        });
    }



    useEffect(() => {
        createContactTable()

        if (tempContacts.length == 0) {
            getContactTableData()
        }

        search(searchtext)
    }, [searchtext]);

    const search = (text) => {
        const number = text.join('')
        number.toString()
        console.log("Mydata->", number)

        if (number == "") {
            setContacts([])
            return
        } else {
            let reaminBlockContact = tempContacts.filter((data) => {
                console.log("data->", data.number.replace(/[^a-z0-9,. ]/gi, '').replace(/ /g, ''))
                if (data.number.replace(/[^a-z0-9,. ]/gi, '').replace(/ /g, '').includes(number)) {
                    return data
                }
            })
            console.log("data->", reaminBlockContact)
            setContacts(reaminBlockContact)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <FlatList
                    data={contacts}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            onPress={() => {
                                setCode(Array.from(item.number.replace(/[^a-z0-9,. ]/gi, '').replace(/ /g, '').toString()))
                            }
                            }
                        >
                            <View style={{ flex: 1, flexDirection: 'row', margin: 8 }}>
                                <View style={{ flex: 1, paddingLeft: 15 }}>
                                    <Text>{item.name}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text>{item.number}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }

                    keyExtractor={item => item.id}
                />
            </View>
        </SafeAreaView>
    );
};

export default DialpadTimeSearchContact;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

