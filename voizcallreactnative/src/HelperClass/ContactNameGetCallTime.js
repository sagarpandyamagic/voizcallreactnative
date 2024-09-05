import SQLite from 'react-native-sqlite-storage';


const db = SQLite.openDatabase(
    {
      name: 'myDatabase.db',
      location: 'default',
    },
    () => { console.log('Database opened.'); },
    error => { console.log(error) }
  );

export  const getNameByPhoneNumber = (phoneNumber) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT name FROM ContactList WHERE number = ?',
        [phoneNumber],
        (tx, results) => {
          if (results.rows.length > 0) {
            const contactName = results.rows.item(0).name;
            return contactName
            console.log('Contact Name:', contactName);
          } else {
            console.log('No contact found with this phone number');
            return "Unknow"
          }
        },
        (error) => {
          console.error('Error retrieving data:', error);
          return "Unknow"
        }
      );
    });
  };;
