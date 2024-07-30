import {
    View,
    StyleSheet,
    Modal,
} from 'react-native';
import { React } from 'react';
import { THEME_COLORS } from '../HelperClass/Constant';
import CallerInfo from '../components/audiocallscreen/CallerInfo';
import ButtonRowFirstThree from '../components/audiocallscreen/ButtonRowFirstThree';
import ButtonCallCut from '../components/audiocallscreen/ButtonCallCut';
import InCallManager from 'react-native-incall-manager';
import { useSelector } from 'react-redux';
import DTMFScreen from '../components/audiocallscreen/DTMFScreen';
import ButtonRowSecondThree from '../components/audiocallscreen/ButtonRowSecondThree';

function AudioCallingScreen() {
    InCallManager.start({ media: 'audio' }); // Start audio mode
    const { CallScreenOpen } = useSelector((state) => state.sip)

    return (
        <View style={{ flex: 1, backgroundColor: THEME_COLORS.black }}>
             <Modal
                visible={CallScreenOpen}
                transparent={false}
                animationType="none"
            >
                <View style={style.overlay}>
                    <View style={style.whitePattie}></View>
                    <CallerInfo />
                </View>
                <View style={{ backgroundColor: THEME_COLORS.black }}>
                    <View style={style.container}>
                        <ButtonRowFirstThree />
                        <ButtonRowSecondThree />
                        <ButtonCallCut />
                    </View>
                </View>
                <View>
                    <DTMFScreen/>
                </View>
            </Modal>
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'grey',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10,
        height: 320,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    whitePattie: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 50, // Adjust height as needed
        backgroundColor: THEME_COLORS.black, // Semi-transparent white
    },

})
export default AudioCallingScreen