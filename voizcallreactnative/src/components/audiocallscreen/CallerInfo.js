import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { React} from 'react';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { useSelector } from 'react-redux';
import { useCallTimerContext } from '../../hook/useCallTimer';

const CallerInfo = () => {
    const {phoneNumber} = useSelector((state) => state.sip)
    const { callTimer } = useCallTimerContext()

    return (
        <View style={style.container}>
            <Text style={[style.Text,{fontWeight:'bold'}]}>
                Unknown
            </Text>
            <Text style={[style.Text,{fontSize:15,marginTop:15}]}>
                {phoneNumber[0]}
            </Text>
            <Text style={[style.Text,{fontSize:15}]}>
                {callTimer}
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