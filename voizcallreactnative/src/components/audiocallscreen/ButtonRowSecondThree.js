import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
    Button,
} from 'react-native';
import { React, useRef, useState } from 'react';
import confeence from '../../../Assets/confeence.png'
import ic_hold from '../../../Assets/ic_hold.png'
import ic_transfercall from '../../../Assets/ic_transfer-call.png'
import ic_call_swipe from '../../../Assets/ic_call_swipe.png'
import ic_merge_call from '../../../Assets/ic_merge_call.png'

import SipUA, { holdUsedSwipTime } from '../../services/call/SipUA';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store/store';
import { updateSipState } from '../../store/sipSlice';


const { width } = Dimensions.get('window')
const imageSize = width * 0.17; // Example: 10% of screen width
const itemSpacing = 40;      // Space between each Image+Text pair

const ButtonRowSecondThree = ({ transparentCall }) => {
    const { phoneNumber, sessionID, allSession, ISConfrenceTransfer, SessionCount, CallInitial, ISAttendedTransfer } = useSelector((state) => state.sip)
    const [hold, sethold] = useState(false)
    const [swip, setswip] = useState(false)

    const dispatch = useDispatch()
    const menuRef = useRef(null);

    const showMenu = () => {
        if (menuRef.current) {
            menuRef.current.show();
        }
    };

    const handelToggelHold = () => {
        sethold(!hold)
        if (SessionCount >= 2) {
            SipUA.toggelHoldCall(!hold, "")
        } else {
            SipUA.toggelHoldCall(!hold, sessionID)
        }
    }

    const handelToggelSwip = () => {
        setswip(!swip)
        console.log("phoneNumber", phoneNumber)
        if (swip == true) {
            store.dispatch(updateSipState({ key: "DialNumber", value: phoneNumber[0] }))
            holdUsedSwipTime(phoneNumber[1])
        } else {
            store.dispatch(updateSipState({ key: "DialNumber", value: phoneNumber[1] }))
            holdUsedSwipTime(phoneNumber[0])
        }
    }


    return (
        <View style={style.container}>
            {
                !ISConfrenceTransfer && <>
                    {
                            <View style={style.item}>
                                <TouchableOpacity style={[style.imageVw, { backgroundColor: 'gray', opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={() =>
                                    transparentCall()
                                } >
                                    <Image source={ic_transfercall} style={[style.image, { tintColor: 'white' }]}>
                                    </Image>
                                </TouchableOpacity>
                                <Text style={style.text}>
                                    Transfer
                                </Text>
                            </View>
                    }

                </>
            }
            {
                ISConfrenceTransfer ?
                    <>
                        {
                            allSession && Object.keys(allSession).length == 2 &&
                            <>
                                <View style={[style.item]}>
                                    <TouchableOpacity style={[style.imageVw, { backgroundColor: 'gray', opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={handelToggelSwip}>
                                        <Image source={ic_call_swipe} style={[style.image, { tintColor: 'white' }]}>
                                        </Image>
                                    </TouchableOpacity>
                                    <Text style={style.text}>
                                        Swipe
                                    </Text>
                                </View>
                            </>
                        }

                    </> : <>
                        <View style={[style.item]}>
                            <TouchableOpacity style={[style.imageVw, { backgroundColor: 'gray', opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={handelToggelHold}>
                                {
                                    hold ? <Image source={ic_hold} style={[style.image, { tintColor: 'red' }]}>
                                    </Image> : <Image source={ic_hold} style={[style.image, { tintColor: 'white' }]}>
                                    </Image>
                                }
                            </TouchableOpacity>
                            <Text style={style.text}>
                                {
                                    hold ? 'Unhold' : 'Hold'
                                }
                            </Text>
                        </View>
                    </>
            }

            {
                ISConfrenceTransfer ? <>
                    <View style={style.item}>
                        <TouchableOpacity style={[style.imageVw, { backgroundColor: 'gray', opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={() => {
                            SipUA.toggelHoldCall(false)
                            dispatch(updateSipState({ key: "ISConfrenceTransfer", value: false }))
                            store.dispatch(updateSipState({ key: "DialNumber", value: "Confrence" }))
                        }}>
                            <Image source={ic_merge_call} style={style.image}>
                            </Image>
                        </TouchableOpacity>
                        <Text style={[style.text]}>
                            Marge
                        </Text>
                    </View>

                </> :  ISAttendedTransfer&&allSession&&Object.keys(allSession).length > 1 ? <></> : <>
                    <View style={style.item}>
                        <TouchableOpacity style={[style.imageVw, { backgroundColor: 'gray', opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={() => {
                            store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                        }}>
                            <Image source={confeence} style={style.image}>
                            </Image>
                        </TouchableOpacity>
                        <Text style={[style.text]}>
                            Confrence
                        </Text>
                    </View>
                </>
            }

        </View>


    )
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 20
    },
    image: {
        height: '100%',
        width: '100%',
        tintColor: 'white'
    },
    imageVw: {
        height: imageSize,
        width: imageSize,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: imageSize / 2,
        shadowColor: '#000',  // Set shadow color to ensure visibility
        shadowOffset: { width: 0, height: 2 },  // Set the offset for the shadow
        shadowOpacity: 0.2,  // Set shadow opacity
        shadowRadius: 4,  // Set shadow blur radius
        elevation: 2,  // Android-specific shadow property

    },
    text: {
        fontSize: 12,
        marginTop: 5, // Set the font size of the text
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginHorizontal: itemSpacing / 2,
        width: imageSize,  // Set the width of the image
        height: imageSize,
    },
})
export default ButtonRowSecondThree