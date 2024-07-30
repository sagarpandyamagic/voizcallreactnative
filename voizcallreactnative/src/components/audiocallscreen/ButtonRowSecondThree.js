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
import SipUA from '../../services/call/SipUA';
import InCallManager from 'react-native-incall-manager';
import { useSelector } from 'react-redux';
import store from '../../store/store';
import { updateSipState } from '../../store/sipSlice';
import { TooltipMenu } from 'react-native-tooltip-menu';


const { width } = Dimensions.get('window')
const imageSize = width * 0.15; // Example: 10% of screen width
const itemSpacing = 40;      // Space between each Image+Text pair

const ButtonRowSecondThree = () => {
    const { phoneNumber, sessionID, allSession } = useSelector((state) => state.sip)
    const [hold, sethold] = useState(false)
    const menuRef = useRef(null);

    const showMenu = () => {
        if (menuRef.current) {
            menuRef.current.show();
        }
    };

    const handelToggelHold = () => {
        sethold(!hold)
        SipUA.toggelHoldCall(!hold, sessionID)
    }

    return (
        <View style={style.container}>
            <View style={style.item}>
                <TouchableOpacity style={[style.imageVw, { backgroundColor: 'gray' }]} onPress={() => {
                    store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                }}>
                    <Image source={confeence} style={style.image}>
                    </Image>
                </TouchableOpacity>
                <Text style={[style.text]}>
                    Confrence
                </Text>
            </View>
            <View style={[style.item]}>
                <TouchableOpacity style={[style.imageVw, { backgroundColor: 'gray' }]} onPress={handelToggelHold}>
                    {
                        hold ? <Image source={ic_hold} style={[style.image, { tintColor: 'red' }]}>
                        </Image> : <Image source={ic_hold} style={[style.image, { tintColor: 'white' }]}>
                        </Image>
                    }
                </TouchableOpacity>
                <Text style={style.text}>
                    {
                        hold ? 'unhold' : 'hold'
                    }
                </Text>
            </View>

            <View style={style.item}>
                {/* <TouchableOpacity style={[style.imageVw, { backgroundColor: 'gray' }]} onPress={showMenu} >
                    <Image source={ic_transfercall} style={[style.image, { tintColor: 'white' }]}>
                    </Image>
                </TouchableOpacity>
                <Text style={style.text}>
                    Transfer
                </Text> */}

                {/* <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 25 }}>
                    <TooltipMenu
                        items={[
                            {
                                label: 'Label #1',
                                onPress: () => incrementCounter1()
                            },
                            {
                                label: 'Label #2',
                                onPress: () => incrementCounter2(),
                            },
                        ]}
                    >
                        <View style={[style.imageVw, { backgroundColor: 'gray' }]} onPress={() =>
                            store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                        } >
                            <Image source={ic_transfercall} style={[style.image, { tintColor: 'white' }]}>
                            </Image>
                        </View>
                        <Text style={style.text}>
                            Transfer
                        </Text>
                    </TooltipMenu>
                </View> */}

                <TouchableOpacity style={[style.imageVw, { backgroundColor: 'gray' }]} onPress={() =>
                    store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                } >
                    <Image source={ic_transfercall} style={[style.image, { tintColor: 'white' }]}>
                    </Image>
                </TouchableOpacity>
                <Text style={style.text}>
                    Transfer
                </Text>
            </View>
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