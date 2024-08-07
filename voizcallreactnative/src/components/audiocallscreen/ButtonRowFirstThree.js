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


const { width } = Dimensions.get('window')
const imageSize = width * 0.15; // Example: 10% of screen width
const itemSpacing = 40;      // Space between each Image+Text pair

const ButtonRowFirstThree = () => {
    const { phoneNumber, sessionID, allSession } = useSelector((state) => state.sip)
    const [togglemute, settogglemute] = useState(false)
    const [isSpeker, setSpeker] = useState(false)

    const handelToggelMute = () => {
        settogglemute(!togglemute)
        SipUA.MuteCall(togglemute)
    }

    const handelToggelSpeker = () => {
        setSpeker(!isSpeker)
        InCallManager.setSpeakerphoneOn(!isSpeker); // Turn on speaker
    }

    return (
        <View style={style.container}>
            <View style={style.item}>
                <TouchableOpacity style={style.imageVw} onPress={handelToggelMute}>
                    {
                        togglemute ? 
                         <Image source={mute_ic} style={style.image}>
                         </Image> 
                        :<Image source={mute_off_ic} style={style.image}>
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
                <TouchableOpacity style={style.imageVw} onPress={() => {
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
                <TouchableOpacity style={style.imageVw} onPress={handelToggelSpeker}>
                {
                    isSpeker ?<Image source={speaker_activate} style={style.image}>
                    </Image> : <Image source={speaker_deactivate} style={style.image}>
                    </Image>
                }  
                </TouchableOpacity>
                <Text style={style.text}>
                    Speker
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
        alignItems: 'center',
        flex: 1,
        // backgroundColor:'red',
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
        fontSize: 14,
        marginBottom: 0,
        marginTop: 5 // Set the font size of the text
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
export default ButtonRowFirstThree