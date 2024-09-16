import {
    View,
    StyleSheet,
    Text,
    Image,
} from 'react-native';
import { React} from 'react';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { useSelector } from 'react-redux';
import { useCallTimerContext } from '../../hook/useCallTimer';
import ic_user from '../../../Assets/ic_user.png'

const CallerInfo = () => {
    const {phoneNumber,DialNumber,CallInitial} = useSelector((state) => state.sip)
    const { callTimer } = useCallTimerContext()

    return (
        <View style={style.container}>
            {/* <Text style={[style.Text,{fontWeight:'bold'}]}>
                {CallInitial == true ? "Unknown" : ""}
            </Text> */}
            <View style={{width: 80, height: 80,backgroundColor:'white',borderRadius:40,alignItems:'center',justifyContent:'center'}}>
                <Image style={{width: 50, height: 50}} source={ic_user} />
            </View>
            <Text style={[style.Text,{fontSize:15,marginTop:15}]}>
                {DialNumber}
            </Text>
            <Text style={[style.Text,{fontSize:15}]}>
                {callTimer == "00:00:00" ? (CallInitial == false ? "Connecting....." : "Calling....") : callTimer}
            </Text>
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        backgroundColor: THEME_COLORS.black
    },
    Text: {
        color: 'white',
        fontSize: 18,
        fontFamily: AppCommon_Font.Font
    }
})
export default CallerInfo