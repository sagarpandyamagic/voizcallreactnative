import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import { React, useState } from 'react';
import { THEME_COLORS } from '../../HelperClass/Constant';
import ic_callT_arrow from '../../../Assets/ic_callT_arrow.png';
import ic_CallT_shuffle from '../../../Assets/ic_CallT_shuffle.png';
import store from '../../store/store';
import { updateSipState } from '../../store/sipSlice';

const CallTransfer = ({transparentCall}) => {
    return (
        <>
            <View style={style.callTrensferVw}>
                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 15, marginTop: 10 }} onPress={() => {
                    transparentCall()
                    store.dispatch(updateSipState({ key: "ISCallTransfer", value: true }))
                    store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                }}>
                    <Image resizeMode='center' style={{ height: 20, width: 20, tintColor: 'white', marginRight: 15 }} source={ic_callT_arrow}></Image>
                    <Text style={{ color: 'white' }}>Bind Transfer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 15, marginTop: 15 }} onPress={() => {
                    transparentCall()
                    store.dispatch(updateSipState({ key: "ISAttendedTransfer", value: true }))
                    store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                }}>
                    <Image resizeMode='center' style={{ height: 20, width: 20, tintColor: 'white', marginRight: 15 }} source={ic_CallT_shuffle}></Image>
                    <Text style={{ color: 'white' }}>Attended Transfer</Text>
                </TouchableOpacity>
            </View>
            <View style={style.after}></View>
        </>
    )
}
const style = StyleSheet.create({
    callTrensferVw: {
        height: '20%',
        width: '50%',
        backgroundColor: THEME_COLORS.black,
        position: 'absolute',
        left: '15%',
        top: "8%",
        borderRadius: 10,
    },
    after: {
        position: 'absolute',
        top: "27%",
        left: "20%",
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: THEME_COLORS.black,
    }

})
export default CallTransfer