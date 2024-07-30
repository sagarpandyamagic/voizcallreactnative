import {
    View,
    StyleSheet,
    Text,
    Image,
} from 'react-native';
import { React } from 'react';
import circleVoizCallLogo from '../../../Assets/circleVoizCallLogo.png'
import { useSelector } from 'react-redux';


const IncomeScreenIconVw = () => {
    const { phoneNumber, Caller_Name } = useSelector((state) => state.sip)

    return (
        <View style={style.IconNameVW}>
            <View style={{ alignItems: 'center', height: "40%" }}>
                <View style={{ position: 'absolute', bottom: 25 }}>
                    <Image style={{ width: 90, height: 90 }}
                        source={circleVoizCallLogo} />
                </View>
            </View>
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', }}>{Caller_Name}</Text>
            <Text style={{ alignSelf: 'center', fontSize: 18, }}>{phoneNumber[0]}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    IconNameVW: {
        flex: 2,
    }
})
export default IncomeScreenIconVw