import {
  Text, Image, StyleSheet
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


const CallLogTimeFistLetterFind = (number) => {
  const [Letter, setLetter] = useState('')
  const [ThumbImage, seThumbImage] = useState(false)

  const FistLetterFind = (Name) => {
    console.log("name:-", Name)
    const myObject = Name;
    const nameParts = Name.split(" ");
    if (nameParts.length > 1) {
      const surname = nameParts[1];
      const surnameFirstLetter = nameParts[0].charAt(0) + surname.charAt(0)
      setLetter(surnameFirstLetter)
    } else {
      const surnameFirstLetter = nameParts[0].charAt(0);
      console.log("No surname found.");
      setLetter(surnameFirstLetter)
    }
  }

  useEffect(() => {
    getContactTableData(number.number)
  }, [])

  const getContactTableData = (userNumber) => {
    console.log("userNumber", userNumber.replace(/[^a-z0-9,. ]/gi, '').replace(/ /g, ''))
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
            if (userNumber.replace(/[^a-z0-9,. ]/gi, '').replace(/ /g, '').includes(str.replace(/ /g, ''))) {
              console.log("key->", users[key].name)
              nameAdd = true
              console.log("users[key]", users[key].thumbnailpath)
              if (users[key].thumbnailpath == "") {
                FistLetterFind(users[key].name)
                seThumbImage(false)

              } else {
                console.log("users[key].thumbnailpath", users[key].thumbnailpath)
                setLetter(`${users[key].thumbnailpath}`)
                seThumbImage(true)
              }
            }
          })


          if (nameAdd == false) {
            FistLetterFind("Unknown")
            seThumbImage(false)
          }
        },
        (error) => {
          console.error('Error retrieving data:', error);
          FistLetterFind("Unknown")
          seThumbImage(false)
        }
      );
    });
    console.error('Letter', Letter)
  }

  return (
    ThumbImage == true ? <Image style={{ overflow: 'hidden', justifyContent: 'center', height: number.isFontSizeBig, width: number.isFontSizeBig, borderRadius: Math.round(number.isFontSizeBig + number.isFontSizeBig) / 2 }} source={{ uri: Letter }} /> : <Text style={{ fontSize: number.isFontSizeBig, color: '#FFFF' }}>{Letter}</Text>
  )
}


export default CallLogTimeFistLetterFind