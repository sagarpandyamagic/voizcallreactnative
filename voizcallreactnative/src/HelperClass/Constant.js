import ic_chaticon_Pdf from '../../Assets/ic_chaticon_Pdf.png';
import ic_chaticon_Vector from '../../Assets/ic_chaticon_Vector.png';
import ic_chaticon_Ppt from '../../Assets/ic_chaticon_Ppt.png';
import ic_chaticon_Txt from '../../Assets/ic_chaticon_Txt.png';
import ic_chaticon_Xls from '../../Assets/ic_chaticon_Xls.png';
import ic_chaticon_Doc from '../../Assets/ic_chaticon_Doc.png';
import ic_chaticon_Csv from '../../Assets/ic_chaticon_Csv.png';

export const AppCommon_Font = {
    Font: 'Arial'//'RobotoMono-Regular'
}

export const THEME_COLORS = {
    //   black: '#3E5DA3'
      black:'#EF4F4F',
      transparent: 'transparent',
      ConfrencecllListColor:'#c74242' //'#4F6EB4'
}

export const API_BASE_URL = "https://panel-api.voizcall.com/v1.50.32/api"

export const IOSVersion = '1.0.2'
export const AndroidVersion = "1.0.2"

export const StorageKey = {
    isLogin: "isLogin",
    userData: "userData",
    access_token: "access_token",
    userprofiledata: "userprofiledata",
    instance_id: "instance_id",
    FCM: "FMCKEY",
    VOIP: "VOIPKEY",
    auth_type: "auth_type",
    UserActive: "user_active",
    UserDND: "user_DND",
    CallKeepORNot: "CallKeepORNot",
    IncomingCallNumber: ""

}

export const SCREEN_NAMES = {
    Home: "homescreen",
    Meeting: "IncomingCallingScreen",
};


export const userprofilealias = {
    "audio_audioCodecs": "audio.audioCodecs",
    "video_videoCodecs": "video.videoCodecs",
    "video_enableVideo": "video.enableVideo",
    "video_selfView": "video.selfView",
    "call_dtmfType": "call.dtmfType",
    "call_noAnswerTimeout": "call.noAnswerTimeout",
    "call_outboundCallerName": "call.outboundCallerName",
    "call_earlyMedia": "call.earlyMedia",
    "call_extraHeaders": "call.extraHeaders",
    "sip_username": "sip.username",
    "sip_password": "sip.password",
    "sip_sipServer": "sip.sipServer",
    "sip_sipProtocol": "sip.sipProtocol",
    "sip_sipPort": "sip.sipPort",
    "sip_outboundProxyServer": "sip.outboundProxyServer",
    "sip_outboundProxyPort": "sip.outboundProxyPort",
    "sip_register_interval": "sip.register.interval",
    "sip_register_respectServerExpires": "sip.register.respectServerExpires",
    "call_encryption": "call.encryption",
    "call_voicemailNumber": "call.voicemailNumber",
    "call_allowHold": "call.allowHold",
    "call_allowTransfer": "call.allowTransfer",
    "sms_status": "sms.status",
    "sms_callerId": "sms.callerId",
    "pcs_domain": "pcs.domain",
    "im_status": "im.status",
    "ldap_name": "ldap.name",
    "ldap_password": "ldap.password",
    "auth_provider": "auth.provider",
    "callForwarding": "callForwarding",
    "callforwarding_unconditionalnumber": "callforwarding.unconditionalnumber",
    "callforwarding_busystatus": "callforwarding.busystatus",
    "callforwarding_busynumber": "callforwarding.busynumber",
    "callforwarding_noansstatus": "callforwarding.noansstatus",
    "cf_no_answer_number": "cf.no.answer.number",
    "account_myaccount": "account.myaccount",
    "ma_my_account_url": "ma.my.account.url",
    "customlink_status1": "customlink.status1",
    "customlink_label1": "customlink.label1",
    "cl_custom_link_url1": "cl.custom.link.url1",
    "customlink_logo1": "customlink.logo1",
    "cl_enable_custom_link2": "cl.enable.custom.link2",
    "customlink_label2": "customlink.label2",
    "customlink_url2": "customlink.url2",
    "customlink_logo2": "customlink.logo2",
    "zi_enable_zoom_integration": "zi.enable.zoom.integration",
    "cloudcontacts_status": "cloudcontacts.status",
    "sip_callerid": "sip.callerid",
    "sip_authid": "sip.authid",
    "autoenable_blf": "autoenable.blf",
    "im_server": "im.server",
    "voicemail_status": "voicemail.status",
    "emergency_numbers": "emergency.numbers",
    "configurations": "configurations",
    "dnd_visibility": "dnd.visibility",
    "auto_answer_visibility": "auto.answer.visibility"
}

export const getDocumentIcon = (extension) => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return ic_chaticon_Pdf 
      case 'html':
        return ic_chaticon_Vector
      case 'ppt':
      case 'pptx':
        return ic_chaticon_Ppt
      case 'txt':
      case 'rft':
        return ic_chaticon_Txt
      case 'xls':
      case 'xlsx':
        return ic_chaticon_Xls
      case 'doc':
      case 'docx':
        return ic_chaticon_Doc
      case 'csv':
        return ic_chaticon_Csv
      default:
        return ic_chaticon_Csv
    }
  };

  export const identifyMessageType = (text) => {
    // List of common image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    // List of common document extensions
    const documentExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'csv', 'rft'];
  
    const extension = text.split('.').pop().toLowerCase();
  
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (documentExtensions.includes(extension)) {
      return 'document';
    } else {
      return 'text';
    }
  };