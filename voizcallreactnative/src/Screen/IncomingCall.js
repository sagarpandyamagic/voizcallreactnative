import React from 'react'
import { Modal, View, StyleSheet, Image, NativeModules, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import IncomeScreenIconVw from '../components/incomescreen/IncomeScreenIconVw'
import IncomeScreenBtnVw from '../components/incomescreen/IncomeScreenBtnVw'

function IncomingCall() {
    const dispatch = useDispatch()
    const { IncomingScrrenOpen, session, phoneNumber, Caller_Name } = useSelector((state) => state.sip)
    console.log('incomingcall', IncomingScrrenOpen)


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {
                <Modal
                    visible={IncomingScrrenOpen}
                    transparent={false}
                    animationType="none"
                >
                    <View style={style.maincontainVW}>
                        <IncomeScreenIconVw />
                        <IncomeScreenBtnVw />
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
