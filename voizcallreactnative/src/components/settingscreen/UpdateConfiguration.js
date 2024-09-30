import { Platform } from "react-native";
import { getConfigParamValue } from "../../data/profileDatajson";
import { AndroidVersion, IOSVersion, StorageKey, userprofilealias } from "../../HelperClass/Constant";
import { DLETEAPICAll, getProfile, POSTAPICALL } from "../../services/auth";
import { AppStoreData, getStorageData, RemoveStorageData } from "../utils/UserData";
import { APIURL } from "../../HelperClass/APIURL";
import store from "../../store/store";
import { PushSubScribeNotificaion } from "../../services/PushSubScribeNotificaion";
import SipUA from "../../services/call/SipUA";
import { inticalluserData } from "../../store/sipSlice";
import { showAlert } from "../../HelperClass/CommonAlert";


export const UpdateConfiguration = async () => {

    const instanceId = await getStorageData(StorageKey.instance_id)
    const sipUsername = await getConfigParamValue(userprofilealias.sip_username);
    const sipServer = await getConfigParamValue(userprofilealias.sip_sipServer);

    let sip_username_with_instance = `${instanceId}-${sipUsername}@${sipServer}`;
    const pram = {
        "aor": sip_username_with_instance,
        "action": "disable",
    }
    console.log(pram)
    const dataRegister = await POSTAPICALL(APIURL.REGISTER, pram)
    console.log("dataRegister", dataRegister)
    if (dataRegister.success) {
        const prampushsubscribe = {
            "instance_id": instanceId,
            "device_type": Platform.OS,
            "auth_type": "auto",
            "X-localization": "en"
        }
        const pushsubscribeDelete = await DLETEAPICAll(APIURL.PushSubScribe, prampushsubscribe)
        console.log("prampushsubscribe", pushsubscribeDelete)

        if (pushsubscribeDelete.success) {
            const profileInfo = await getProfile()
            console.log("profileInfo", profileInfo.data.account_properties)
            if (profileInfo.success) {
                try {
                    await RemoveStorageData(StorageKey.userprofiledata)
                    await AppStoreData(StorageKey.userprofiledata, profileInfo.data.account_properties)
                    const sipusername = await getConfigParamValue(userprofilealias.sip_username)
                    const password = await getConfigParamValue(userprofilealias.sip_password)
                    const sipserver = await getConfigParamValue(userprofilealias.sip_sipServer)
                    const sipport = "7443"
                    store.dispatch(inticalluserData({ sipusername, password, sipserver, sipport }))

                    const pushsubscribe = await PushSubScribeNotificaionSetting(pushsubscribeDelete.data)
                    const pram = {
                        "aor": sip_username_with_instance,
                        "action": "disable",
                    }
                    const dataRegister = await POSTAPICALL(APIURL.REGISTER, pram)
                    if (dataRegister.success) {
                        const pramprofileUpdate = {
                            "audio.audioCodecs": await getConfigParamValue(userprofilealias.audio_audioCodecs),
                            "video.videoCodecs": await getConfigParamValue(userprofilealias.video_videoCodecs),
                            "call.encryption": await getConfigParamValue(userprofilealias.call_encryption),
                            "call.dtmfType": await getConfigParamValue(userprofilealias.call_dtmfType),
                            "sip.register.interval": await getConfigParamValue(userprofilealias.sip_register_interval),
                            "sip.register.respectServerExpires": await getConfigParamValue(userprofilealias.sip_register_respectServerExpires),
                        }

                        const profileUpdate = await POSTAPICALL(APIURL.PROFILE_UPDATE, prampushsubscribe)

                        if (profileUpdate.success) {
                            SipUA.connect()
                        }
                        else {
                            console.log("profileUpdate", profileUpdate)
                        }
                    } else {
                        console.log("dataRegister", dataRegister)
                    }
                }
                catch (e) {
                    console.log("error", e)
                }
            } else {
                showAlert(profileInfo.message)
                console.log("profileInfo", profileInfo.message)
            }
        }
        else {
            console.log("pushsubscribe", pushsubscribe)
        }
    }
    else {
        console.log("dataRegister", dataRegister)
    }

}

const PushSubScribeNotificaionSetting = async (configData) => {
    const FcmTokan = await getStorageData(StorageKey.FCM)
    let sip_username_with_instance;
    try {
        const instanceId = await getStorageData(StorageKey.instance_id)
        const sipUsername = await getConfigParamValue(userprofilealias.sip_username);
        console.log('sipUsername', sipUsername)

        let Toakn;
        if (Platform.OS == 'ios') {
            Toakn = await getStorageData(StorageKey.VOIP)
        }

        if (!instanceId || !sipUsername) {
            throw new Error('Missing instanceId or sipUsername');
        }

        sip_username_with_instance = `${instanceId}-${sipUsername}`;
        console.log('SIP Username with Instance:', sip_username_with_instance);

        const data = {
            "dnd": "N",
            "device_token": FcmTokan,
            "device_type": Platform.OS,
            "instance_id": instanceId,
            "auth_type": configData?.auth_type || "auto",
            "device_voip_token": Toakn,
            "device_apns_token": Toakn,
            "sip_username_with_instance": sip_username_with_instance,
            "sip_domain": await getConfigParamValue(userprofilealias.sip_sipServer),
            "sip_password": await getConfigParamValue(userprofilealias.sip_password),
            "sip_ha1": await getConfigParamValue(userprofilealias.sip_password), // value pass temp
            "sip_port": await getConfigParamValue(userprofilealias.sip_sipPort),
            "sip_protocol": await getConfigParamValue(userprofilealias.sip_sipProtocol),
            "outbound_proxy": await getConfigParamValue(userprofilealias.sip_outboundProxyServer),
            "ob_proxy_port": await getConfigParamValue(userprofilealias.sip_outboundProxyPort),
            "api_version": Platform.OS === 'ios' ? IOSVersion : AndroidVersion
        }
        console.log("pushsubscribe", data)

        const pushsubscribe = await POSTAPICALL(APIURL.PushSubScribe, data)
        console.log("pushsubscribe responce", pushsubscribe)
    } catch (error) {
        console.error('Error:', error.message);
    }
}