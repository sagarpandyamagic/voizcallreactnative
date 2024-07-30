import AsyncStorage from '@react-native-async-storage/async-storage';


export const AppStoreData = async (key, value) => {
    try {
        await  AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting data to AsyncStorage:', error);
    }
};

export const getStorageData = async (key) => {
    try {
        const storeData = await AsyncStorage.getItem(key);
       return  JSON.parse(storeData)
    } catch (error) {
        console.error('Error setting data to AsyncStorage:', error);
    }
};

export const RemoveStorageData = async (key) => {
    try {
         await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error setting data to AsyncStorage:', error);
    }
};