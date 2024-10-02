import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { React } from 'react';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { useSelector } from 'react-redux';
import { useCallTimerContext } from '../../hook/useCallTimer';
import ic_user from '../../../Assets/ic_user.png'
import phoneLogo from '../../../Assets/phone-call.png';
import ArrowGoCall from '../../../Assets/ic_next_arrow.png';
import ic_decline_call from '../../../Assets/ic_decline_call.png'
import SipUA from '../../services/call/SipUA';

const CallerInfo = () => {
    const { phoneNumber, DialNumber, CallInitial, allSession } = useSelector((state) => state.sip)
    const { callTimer } = useCallTimerContext()

    const renderSessionItem = ({ item }) => (
        <View style={{
            height: 50
            , width: 250
            , backgroundColor: THEME_COLORS.ConfrencecllListColor
            , alignSelf: 'center'
            , marginTop: 10
            , justifyContent: 'center'
            , borderRadius: 5
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ height: 25, width: 25, marginLeft: 15 }} source={phoneLogo} />
                <Text style={{ color: '#fff', marginLeft: 15, flex: 1, fontFamily: AppCommon_Font.Font,fontWeight:'bold' }}>
                    {allSession[item].remoteIdentity?.uri?.normal?.user}
                </Text>
                <TouchableOpacity onPress={() => {
                    SipUA.hangupSession(allSession[item].id)
                }
                }>
                    <Image style={{ height: 25, width: 25, marginRight: 15 }} source={ic_decline_call} />
                </TouchableOpacity>
            </View>
        </View>

    );

    // console.log("allSession", allSession)

    return (
        <View style={style.container}>
            {
                allSession && Object.keys(allSession).length > 1 ? <></> :
                    <View style={style.userImageContainer}>
                        <Image style={{ width: 50, height: 50 }} source={ic_user} />
                    </View>
            }
            <Text style={[style.Text, { fontSize: 15, marginTop: 15 }]}>
                {DialNumber}
            </Text>
            <Text style={[style.Text, { fontSize: 15 }]}>
                {callTimer == "00:00:00" ? (CallInitial == false ? "Connecting....." : "Calling....") : callTimer}
            </Text>
            {
                allSession && Object.keys(allSession).length > 1 &&
                <FlatList
                    data={Object.keys(allSession)}
                    renderItem={renderSessionItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={style.sessionList}
                />
            }

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
    },
    userImageContainer: {
        width: 80,
        height: 80,
        backgroundColor: 'white',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
export default CallerInfo