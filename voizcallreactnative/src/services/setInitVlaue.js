import { getStorageData } from "../components/utils/UserData"
import { getConfigParamValue } from "../data/profileDatajson"
import { StorageKey, userprofilealias } from "../HelperClass/Constant"
import { inticalluserData, updateSipState } from "../store/sipSlice"
import store from "../store/store"
import SipUA from "./call/SipUA"

export const setInitTimeValue = async () => {
    const isEnable = await getStorageData(StorageKey.UserActive);
    const isDND = await getStorageData(StorageKey.UserDND);

    const value = await getStorageData(StorageKey.isLogin);
    console.log("userprofilealias.sip_username", userprofilealias.sip_username)
    if (value) {
        const sipusername = await getConfigParamValue(userprofilealias.sip_username)
        const password = await getConfigParamValue(userprofilealias.sip_password)
        const sipserver = await getConfigParamValue(userprofilealias.sip_sipServer)
        const sipport = "7443"
        store.dispatch(inticalluserData({ sipusername, password, sipserver, sipport }))
        store.dispatch(updateSipState({ key: "UserActive", value: isEnable }))
        store.dispatch(updateSipState({ key: "UserDND", value: isDND }))
        if (isEnable) {
            SipUA.connect()
        }
    }
}

