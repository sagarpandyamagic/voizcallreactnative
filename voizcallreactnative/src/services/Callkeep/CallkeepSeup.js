import RNCallKeep from "react-native-callkeep";


export function setupCallKeep() {
    const options = {
       ios: {
         appName: "voizcallreactnative",
       },
       android: {
         alertTitle: "Permissions required",
         alertDescription:
           "This application needs to access your phone accounts",
         cancelButton: "Cancel",
         okButton: "ok",
         imageName: "phone_account_icon",
       },
     };
     RNCallKeep.setup(options);
     RNCallKeep.setAvailable(true);
}