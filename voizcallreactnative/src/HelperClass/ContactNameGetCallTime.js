import SQLite from 'react-native-sqlite-storage';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid, Platform } from 'react-native';
import { AsyncStorage } from 'react-native';
const cache = {};


const db = SQLite.openDatabase(
  {
    name: 'myDatabase.db',
    location: 'default',
  },
  () => { console.log('Database opened.'); },
  error => { console.log(error) }
);

// export  const getNameByPhoneNumber = (phoneNumber) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT name FROM ContactList WHERE number = ?',
//         [phoneNumber],
//         (tx, results) => {
//           if (results.rows.length > 0) {
//             const contactName = results.rows.item(0).name;
//             return contactName
//             console.log('Contact Name:', contactName);
//           } else {
//             console.log('No contact found with this phone number');
//             return "Unknow"
//           }
//         },
//         (error) => {
//           console.error('Error retrieving data:', error);
//           return "Unknow"
//         }
//       );
//     });
//   };;


const hasContactsPermission = async () => {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
    const granted = await PermissionsAndroid.check(permission);
    if (granted) {
      // Permission is granted
      return true;
    } else {
      // Permission is not granted
      return false;
    }
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

export const getNameByPhoneNumber = async (phoneNumber) => {
  try {
    const permissionGranted = await hasContactsPermission();
    if (Platform.OS === 'android' && permissionGranted === true) {
      const contacts = await Contacts.getAll();
      const normalizedPhoneNumber = phoneNumber.replace(/\D/g, '');

      const matchingContact = contacts.find(contact =>
        contact.phoneNumbers.some(num =>
          num.number.replace(/\D/g, '') === normalizedPhoneNumber
        )
      );

      if (matchingContact) {
        return `${matchingContact.givenName} ${matchingContact.familyName}`.trim();
      }
    }

    return 'Unknown';
  } catch (error) {
    console.error('Error fetching contact name:', error);
    return 'Unknown';
  }
};
