import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateSipState } from "./redux/sipSlice";
import store from "./redux/store";
import skoectbyclass from "./skoectbyclass";
import SQLite from 'react-native-sqlite-storage';
const db = SQLite.openDatabase(
    {
      name: 'myDatabase.db',
      location: 'default',
    },
    () => { console.log('Database opened.'); },
    error => { console.log(error) }
  );
class Vlaue {

    
    
    usedValue = async () => {
        try {
            const value = await AsyncStorage.getItem("is_live");
            if (value !== null) {
                console.warn(value)
            }
            if (value == "true") {
                try {
                    const value = await AsyncStorage.getItem("CallData");
                    if (value !== null) {
                        console.warn(value)
                    }
                    let CallData = value
                    CallData = JSON.parse(CallData)
                    store.dispatch(updateSipState({ key: "UserName", value: CallData.UserName }))
                    store.dispatch(updateSipState({ key: "Password", value: CallData.Password }))
                    store.dispatch(updateSipState({ key: "Server", value: CallData.Server }))
                    store.dispatch(updateSipState({ key: "Port", value: CallData.Port }))
                    skoectbyclass.connect()
                } catch (e) {
                }
            } else {
            }
            console.log("value", value)
        } catch (e) {
        }
    }
}
export default initVlaue = new Vlaue();
