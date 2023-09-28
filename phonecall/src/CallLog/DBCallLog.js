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
        'CREATE TABLE IF NOT EXISTS CallLogList (id INTEGER PRIMARY KEY AUTOINCREMENT, number TEXT, direction TEXT,duration TEXT, current_time TEXT, name TEXT,unicid TEXT)',
        [],
        () => { 
          console.log('Table created successfully CallLog.'); 
      },
        (error) => { console.error('Error creating table:', error); }
      );
    });
  }

  export const setCallLogTable = async (callLog) => {
    const number = callLog.number
    const direction = callLog.direction
    const duration = callLog.duration
    const current_time = callLog.current_time
    const name = callLog.name
    const id =  callLog.id

    console.log("setCallLogTable....",callLog)
    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          "INSERT INTO CallLogList (number,direction,duration, current_time, name,unicid) VALUES (?,?,?,?,?,?)",
          [number, direction, duration, current_time, name,id],
          () => { 
           console.log('Data inserted successfully.');
         },
          (error) => { console.error('Error inserting data:', error); }
        );
      })
    } catch (error) {
      console.log(error);
    }
  }


  export const getCallLogTableDate = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM CallLogList',
        [],
        (tx, results) => {
          const rows = results.rows;
          const users = [];
          for (let i = 0; i < rows.length; i++) {
            const user = rows.item(i);
            users.push(user);
          }
          console.log('users', users); 
          return users
        },
        (error) => { 
          console.error('Error retrieving data:', error); 
        }
      );
    });
  }

