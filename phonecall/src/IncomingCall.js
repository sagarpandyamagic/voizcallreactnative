import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import voizLogo from '../Assets/circleVoizCallLogo.png';
import callPick from '../Assets/ic_answer_call.png';
import callDecline from '../Assets/ic_decline_call.png';
import { useDispatch, useSelector } from 'react-redux';
import { updateSipState } from './redux/sipSlice';
import usecreateUA from './hook/usecreateUA';
import incomingusebyClass from './incomingusebyClass';
import skoectbyclass from './skoectbyclass';
import store from './redux/store';


function IncomingCall(props) {
    const dispatch = useDispatch()
    const { incomingcall, session, phoneNumber, Caller_Name } = useSelector((state) => state.sip)
    const { Callhangup } = usecreateUA()

    // console.log("IncomingScreen", incomingcall)
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Other UI components */}

            {/* Incoming Call Modal */}{
                <Modal
                    visible={incomingcall}
                    transparent={false}
                    animationType="none"
                >
                    <View style={style.maincontainVW}>
                        <View style={style.IconNameVW}>
                            <View style={{ alignItems: 'center', height: "40%" }}>
                                <View style={{ position: 'absolute', bottom: 15 }}>
                                    <Image style={{ width: 120, height: 120 }}
                                        source={voizLogo} />
                                </View>
                            </View>
                            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', }}>{Caller_Name}</Text>
                            <Text style={{ alignSelf: 'center', fontSize: 18, }}>{phoneNumber[0]}</Text>
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            </View>
                        </View>
                        <View style={style.CallingIcon}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <TouchableOpacity style={{ marginRight: 50 }} onPress={() => {
                                    session.accept()
                                    store.dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
                                    store.dispatch(updateSipState({ key: "incomingcall", value: false }))
                                }} >
                                    <Image style={{ width: 70, height: 70 }}
                                        source={callPick} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    //    Callhangup()
                                   skoectbyclass.declineCall()
                                   store.dispatch(updateSipState({ key: "incomingcall", value: false }))
                                   store.dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
                                   store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                                }}>
                                    <Image style={{ width: 70, height: 70 }}
                                        source={callDecline} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            }

        </View>
    )
}



const style = StyleSheet.create({
    maincontainVW: {
        flex: 1
        , backgroundColor: 'white'
    }, IconNameVW: {
        flex: 2,
    }
    , CallingIcon: {
        flex: 1,
    }
})

export default IncomingCall
