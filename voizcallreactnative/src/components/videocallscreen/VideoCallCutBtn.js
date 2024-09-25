import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { React, useState } from 'react';
import ic_video_disable from '../../../Assets/ic_video_disable.png'
import ic_video_enable from '../../../Assets/ic_video_enable.png'
import speaker_activate from '../../../Assets/speaker_activate.png'
import ic_Tab_DialPad from '../../../Assets/ic_Tab_DialPad.png'
import camera_switch from '../../../Assets/camera-switch.png'
import store from '../../store/store';
import { updateSipState } from '../../store/sipSlice';
import { useSelector } from 'react-redux';
import SipUA from '../../services/call/SipUA';
import InCallManager from 'react-native-incall-manager';
import ic_decline_call from '../../../Assets/ic_decline_call.png'

const { width } = Dimensions.get('window')
const imageSize = width * 0.17; // Example: 10% of screen width
const itemSpacing = 40;      // Space between each Image+Text pair

const VideoCallCutBtn = () => {
    const { CallInitial } = useSelector((state) => state.sip)
    const [isVideoStop, setVideoStop] = useState(false)
    const [isCamaraFlip, setCamaraFlip] = useState(false)

    const handelToggelVideo = () => {
        setVideoStop(!isVideoStop)
    }

    const handelToggelCamaraFlip = () => {
        setCamaraFlip(!isCamaraFlip)
    }

    

    return (
        <View style={style.container}>
            <View style={[style.item]}>
                <TouchableOpacity style={[style.imageVw, { opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={handelToggelVideo}>
                    {
                        isVideoStop ?
                            <Image source={ic_video_enable} style={style.image}>
                            </Image>
                            : <Image source={ic_video_disable} style={style.image}>
                            </Image>
                    }
                </TouchableOpacity>
                <Text style={style.text}>
                    Video
                </Text>
            </View>
            <View style={style.item}>
                <TouchableOpacity style={[style.imageVw, { backgroundColor: 'red', opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={() => {
                }}>
                    <Image source={ic_decline_call} style={{ height: "100%", width: '100%' }}>
                    </Image>
                </TouchableOpacity>
                <Text style={style.text}>

                </Text>
            </View>
            <View style={style.item}>
                <TouchableOpacity style={[style.imageVw, { opacity: !CallInitial ? 0.5 : 1 }]} disabled={!CallInitial} onPress={handelToggelCamaraFlip}>
                    <Image source={camera_switch} style={style.image}>
                    </Image>
                </TouchableOpacity>
                <Text style={style.text}>

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
        height: '30%'
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
        marginHorizontal: itemSpacing / 2,
        width: imageSize,  // Set the width of the image
        height: imageSize,
    },
    disabledButton: {
        backgroundColor: '#d3d3d3', // Gray color for disabled state
        opacity: 0.6, // Reduce opacity to show it as disabled
    }
})
export default VideoCallCutBtn