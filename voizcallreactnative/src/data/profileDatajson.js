import { getStorageData } from "../components/utils/UserData";
import { StorageKey } from "../HelperClass/Constant";

export const getConfigParamValue = async (alias) => {
    let val = "";
    let divided = alias.split(".");
    div1 = typeof divided[0] !== "undefined" ? divided[0] : "";
    div2 = typeof divided[1] !== "undefined" ? divided[1] : "";

    let decrytedData =  await getStorageData(StorageKey.userprofiledata)
    var data = decrytedData;
    // console.log("decrypt data==>",data)
    // console.log("alias data==>",alias)
    if (
        typeof data[div1] !== "undefined" &&
        typeof data[div1][div2] !== "undefined" &&
        typeof data[div1][div2]["value"] !== "undefined"
    ) {
        const value = data[div1][div2]["value"];
        // Check if value is an array
        if (Array.isArray(value)) {
            return data[div1][div2]["value"].toString();
        } else {
            // for object check like country.default alias in future this condition added
            return value;
        }
    }
    return val;
};


