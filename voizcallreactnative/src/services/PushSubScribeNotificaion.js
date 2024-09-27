import { Platform } from "react-native"
import { StorageKey, userprofilealias } from "../HelperClass/Constant"
import { getStorageData } from "../components/utils/UserData"
import { POSTAPICALL } from "./auth"
import { getConfigParamValue } from "../data/profileDatajson"
import { APIURL } from "../HelperClass/APIURL"

export const PushSubScribeNotificaion = async (configData) => {
    const FcmTokan = await getStorageData(StorageKey.FCM)
    let sip_username_with_instance;
    try {
        const instanceId = await getStorageData(StorageKey.instance_id)
        const sipUsername = await getConfigParamValue(userprofilealias.sip_username);
        console.log('sipUsername', sipUsername)

        let Toakn;
        if(Platform.OS == 'ios'){
            Toakn = await getStorageData(StorageKey.VOIP)
        }

        if (!instanceId || !sipUsername) {
            throw new Error('Missing instanceId or sipUsername');
        }

        sip_username_with_instance = `${instanceId}-${sipUsername}`;
        console.log('SIP Username with Instance:', sip_username_with_instance);

        const data = {
            "device_token": FcmTokan,
            "device_type": Platform.OS,
            "instance_id": instanceId,
            "auth_type": configData.auth_type,
            "device_voip_token": Toakn,
            "device_apns_token": Toakn,
            "sip_username_with_instance": sip_username_with_instance,
            "sip_domain": await getConfigParamValue(userprofilealias.sip_sipServer),
            "sip_password": await getConfigParamValue(userprofilealias.sip_password),
            "sip_ha1": await getConfigParamValue(userprofilealias.sip_password), // value pass temp
            "sip_port": await getConfigParamValue(userprofilealias.sip_sipPort),
            "sip_protocol": await getConfigParamValue(userprofilealias.sip_sipProtocol),
            "outbound_proxy": await getConfigParamValue(userprofilealias.sip_outboundProxyServer),
            "ob_proxy_port": await getConfigParamValue(userprofilealias.sip_outboundProxyPort)
        }
        console.log("pushsubscribe", data)

        const pushsubscribe = await POSTAPICALL(APIURL.PushSubScribe, data)
        console.log("pushsubscribe responce", pushsubscribe)
    } catch (error) {
        console.error('Error:', error.message);
    }
}