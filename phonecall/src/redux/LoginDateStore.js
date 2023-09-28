import AsyncStorage from '@react-native-async-storage/async-storage';

// Store a value with a given key
export const LoginUser = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting data to AsyncStorage:', error);
  }
};

// Retrieve a value by key from AsyncStorage
export const LoginUserExist = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data
  } catch (error) {
    console.error('Error getting data from AsyncStorage:', error);
    return null;
  }
};

export const CallDataStore = async (value) => {
  try {
    await AsyncStorage.setItem("CallData", value);
  } catch (error) {
    console.error('Error getting data from AsyncStorage:', error);
  }
}



export const BlockContactSave = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error getting data from AsyncStorage:', error);
  }
};

// export const AllContact = async (value) => {
//   try {
//     const contacts = await AsyncStorage.getItem("list_contact");
//     if (contacts !== null) {
//       console.warn(contacts)
//     }
//     let AllContact = contacts
//     AllContact = JSON.parse(AllContact)

//     if (AllContact == null) {
//       Contactstore("list_contact", JSON.stringify([value]))
//       console.log("userlog", value)
//     }
//     else {
//       AllCallLogs.push(JSON.parse(value))
//       const contact = [...new Set(AllContact.map(q => q.recordID))];
//       console.log("Alluserlog", contact)
//       Contactstore("list_contact", JSON.stringify(contact))
//     }
//   } catch (e) {
//   }
// }

export const Contactstore = async (key, value) => {
  try {
    await AsyncStorage.removeItem("list_contact");
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error getting data from AsyncStorage:', error);
    }
  }
  catch (exception) {
    return false;
  }
 
};


