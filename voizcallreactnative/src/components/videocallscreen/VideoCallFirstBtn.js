import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { React, useState } from 'react';
import mute_off_ic from '../../../Assets/mute_off_ic.png'
import mute_ic from '../../../Assets/mute-ic.png'
import speaker_activate from '../../../Assets/speaker_activate.png'
import ic_Tab_DialPad from '../../../Assets/ic_Tab_DialPad.png'
import speaker_deactivate from '../../../Assets/speaker_deactivate.png'
import store from '../../store/store';
import { updateSipState } from '../../store/sipSlice';
import { useSelector } from 'react-redux';
import SipUA from '../../services/call/SipUA';
import InCallManager from 'react-native-incall-manager';
import ic_hold from '../../../Assets/ic_hold.png'


const { width } = Dimensions.get('window')
const imageSize = width * 0.17; // Example: 10% of screen width
const itemSpacing = 40;      // Space between each Image+Text pair

const VideoCallFirstBtn = () => {
    const { CallInitial } = useSelector((state) => state.sip)
    const [togglemute, settogglemute] = useState(false)
    const [isSpeker, setSpeker] = useState(false)
    const [hold, sethold] = useState(false)

    const handelToggelMute = () => {
        settogglemute(!togglemute)
        SipUA.MuteCall(togglemute)
    }

    const handelToggelSpeker = () => {
        setSpeker(!isSpeker)
        InCallManager.setSpeakerphoneOn(!isSpeker); // Turn on speaker
    }

    const handelToggelHold = () => {
        sethold(!hold)
        if (SessionCount >= 2) {
            SipUA.toggelHoldCall(!hold, "")
        } else {
            SipUA.toggelHoldCall(!hold, sessionID)
        }
    }


 

    return (
        <View style={style.container}>
            <View style={[style.item]}>
                <TouchableOpacity style={[style.imageVw, { opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={handelToggelMute}>
                    {
                        togglemute ?
                            <Image source={mute_ic} style={style.image}>
                            </Image>
                            : <Image source={mute_off_ic} style={style.image}>
                            </Image>
                    }
                </TouchableOpacity>
                <Text style={style.text}>
                    {
                        togglemute ? 'unMute' : 'Mute'
                    }
                </Text>
            </View>
            <View style={style.item}>
                <TouchableOpacity style={[style.imageVw, { opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={() => {
                    store.dispatch(updateSipState({ key: "DTMFSCreen", value: true }))
                }}>
                    <Image source={ic_Tab_DialPad} style={style.image}>
                    </Image>
                </TouchableOpacity>
                <Text style={style.text}>
                    Keypad
                </Text>
            </View>
            <View style={style.item}>
                <TouchableOpacity style={[style.imageVw, { opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={handelToggelSpeker}>
                    {
                        isSpeker ? <Image source={speaker_activate} style={style.image}>
                        </Image> : <Image source={speaker_deactivate} style={style.image}>
                        </Image>
                    }
                </TouchableOpacity>
                <Text style={style.text}>
                    Speaker
                </Text>
            </View>
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
        </View>

    )
}
const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        height:'30%'
    },
    image: {
        height: '50%',
        width: '50%',
        marginBottom: 4, // S
        paddingBottom: 10,
        tintColor: 'white'
    },
    imageVw: {
        height: imageSize,
        width: imageSize,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
        borderRadius: imageSize / 2,
        marginTop: 20,
        shadowColor: '#000',  // Set shadow color to ensure visibility
        shadowOffset: { width: 0, height: 2 },  // Set the offset for the shadow
        shadowOpacity: 0.2,  // Set shadow opacity
        shadowRadius: 4,  // Set shadow blur radius
        elevation: 2,  // Android-specific shadow property
    },
    text: {
        fontSize: 12,
        marginBottom: 0,
        marginTop: 5 // Set the font size of the text
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginHorizontal: itemSpacing / 3,
        width: imageSize,  // Set the width of the image
        height: imageSize,
    },
    disabledButton: {
        backgroundColor: '#d3d3d3', // Gray color for disabled state
        opacity: 0.6, // Reduce opacity to show it as disabled
    }
})
export default VideoCallFirstBtn