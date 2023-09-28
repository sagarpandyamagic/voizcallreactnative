
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value) => {
  try {
    await AsyncStorage.setItem("callLog", value);
  } catch (e) {
    // saving error
  }
};

export const getDataCallLog = async () => {
  try {
    const value = await AsyncStorage.getItem("callLog");
    if (value !== null) {
      console.warn(value)
    }
    console.log("CallLoag:-",value)
  } catch (e) {
  }
};

export const removeValue = async () => {
  try {
    await AsyncStorage.removeItem("callLog")
  } catch (e) {
  }
  console.log('Done.')
}
