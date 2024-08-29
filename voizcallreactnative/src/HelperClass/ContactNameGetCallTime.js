import SQLite from 'react-native-sqlite-storage';


const db = SQLite.openDatabase(
    {
      name: 'myDatabase.db',
      location: 'default',
    },
    () => { console.log('Database opened.'); },
    error => { console.log(error) }
  );

  const getNameByPhoneNumber = (phoneNumber) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT name FROM ContactList WHERE number = ?',
        [phoneNumber],
        (tx, results) => {
          if (results.rows.length > 0) {
            const contactName = results.rows.item(0).name;
            console.log('Contact Name:', contactName);
          } else {
            console.log('No contact found with this phone number');
          }
        },
        (error) => {
          console.error('Error retrieving data:', error);
        }
      );
    });
  };;
