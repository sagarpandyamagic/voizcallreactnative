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



