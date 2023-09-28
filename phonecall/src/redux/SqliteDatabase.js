import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
      name: 'myDatabase.db',
      location: 'default',
    },
    () => { console.log('Database opened.'); },
    error => { console.log(error) }
  );
 
 export const createCallLogTable = () => {      
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS CallLog (id INTEGER PRIMARY KEY AUTOINCREMENT, number TEXT, direction TEXT,duration TEXT, current_time TEXT, name TEXT)',
        [],
        () => { console.log('Table created successfully.'); },
        (error) => { console.error('Error creating table:', error); }
      );
    });
  }

//   export const setCallLogTableData = async (contactDetail) => {
//     const name = `${contactDetail.data[0].givenName} ${contactDetail.data[0].familyName}`
//     const phonenumber = contactDetail.data[0].phoneNumbers[0].number
//     const RecordID = contactDetail.data[0].recordID
//     const HasThumbnail = contactDetail.data[0].hasThumbnail
//     const ThumbnailPath = contactDetail.data[0].thumbnailPath
//     try {
//       await db.transaction(async (tx) => {
//         tx.executeSql(
//           "INSERT INTO CallLog (name, number,recordid,thumbnail,thumbnailpath) VALUES (?,?,?,?,?)",
//           [name, phonenumber, RecordID, HasThumbnail, ThumbnailPath],
//           () => { console.log('Data inserted successfully.'); },
//           (error) => { console.error('Error inserting data:', error); }
//         );
//       })
//     } catch (error) {
//       console.log(error);
//     }
//   }

  export const getCallLogTableData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM CallLog',
        [],
        (tx, results) => {
          const rows = results.rows;
          const users = [];
          for (let i = 0; i < rows.length; i++) {
            const user = rows.item(i);
            users.push(user);
          }
          console.log('Data retrieved successfully:', users);
        },
        (error) => { 
          createContactTable()
          console.error('Error retrieving data:', error); 
        }
      );
    });
  }