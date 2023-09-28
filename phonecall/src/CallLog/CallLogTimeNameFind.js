import {
    Text,
    StyleSheet
  } from 'react-native';
  import { React, useEffect, useState } from 'react';
  import SQLite from 'react-native-sqlite-storage';


  const db = SQLite.openDatabase(
    {
      name: 'myDatabase.db',
      location: 'default',
    },
    () => { console.log('Database opened.'); },
    error => { console.log(error) }
  );

  
  const CallLogTimeNameFind = (props) => {
    const {number,sethideAddcontact,count,hideCountForDetailSection} = props
    const [name,setname] = useState()

    useEffect(()=>{
        getContactTableData(number)
    },[])

    const getContactTableData = (userNumber) => {
        console.log("userNumber",userNumber)
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
              Object.keys(users).map(async (key) => {
                const str = users[key].number.replace(/[^a-z0-9,. ]/gi, '');
                if (userNumber.includes(str.replace(/ /g, ''))) {
                  console.log("key->name", users[key].name)
                  nameAdd = true
                  setname(users[key].name)
                  sethideAddcontact && sethideAddcontact(true)
                }
              })
    
              if (nameAdd == false) {
                 setname("Unknown")
                 sethideAddcontact && sethideAddcontact(false)
              }
            },
            (error) => {
              console.error('Error retrieving data:', error);
              setname("Unknown")
              sethideAddcontact && sethideAddcontact(false)

            }
          );
        });
      }
      
    return (
        count != null ? 
        <Text style={{ fontSize: 15, color: 'black', marginTop: 10, marginLeft: 15 }}>{name}{hideCountForDetailSection ? "" :  count}</Text> :
        <Text style={{ marginBottom: 15 , textAlign: 'center',}}>{name}</Text>
    )
  }
  
  
  export default CallLogTimeNameFind