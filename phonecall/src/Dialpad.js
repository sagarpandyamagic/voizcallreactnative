import {
    View,
    StyleSheet,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { React, useEffect, useRef, useState } from 'react';
const { width } = Dimensions.get('window')
import phoneLogo from '../Assets/phone-call.png';
import removeLogo from '../Assets/ic_remove_number.png';
import IncomingCall from './IncomingCall';
import usecreateUA from './hook/usecreateUA';
import CallScreen from './CallScreen';
import { useSelector, useDispatch } from 'react-redux';
import { updateSipState } from './redux/sipSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DialpadTimeSearchContact from './ContactScreen/DialpadTimeSearchContact';

const pinLength = 3
const pinContainersize = width / 2;
const pinMaxSize = pinContainersize / pinLength
const pinSpacing = 7
const pinSize = pinMaxSize - pinSpacing * 1.8

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#', '', 'call', 'del']
const dinlPadAlphabat = ['', 'A B C', "D E F", "G H I", "J K L", "M N O", "P Q R S", "T U V", "W X Y Z", "", "+", "", "", "", ""]
const dialPadSize = width * .2
const dialPadTextSize = dialPadSize * .38
const _spacing = 20;

function Number({ onPress }: { onPress: (item: typeof dialPad[number]) => void }) {
    return (
        <FlatList
            numColumns={3}
            data={dialPad}
            style={{ flexGrow: 0 }}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: _spacing }}
            contentContainerStyle={{ gap: _spacing }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        disabled={item === ''}
                        onPress={() => {
                            onPress(item)
                        }} >
                        <View style={[style.DialPadNumber, { borderWidth: item === '' ? 0 : item === 'call' ? 0 : item === 'del' ? 0 : 1 }]} >
                            {
                                item === 'del' ?
                                    <Image style={{
                                        width: dialPadSize / 2,
                                        height: dialPadSize / 3, resizeMode: 'contain',
                                    }} source={removeLogo} />
                                    : (item === 'call'
                                        ? <Image style={{
                                            width: dialPadSize - 5,
                                            height: dialPadSize - 5
                                        }} source={phoneLogo} />
                                        : <Text style={{ fontSize: dialPadTextSize }}>{item}</Text>
                                    )
                            }
                            {
                                item === '' ? null : <Text style={{ fontSize: dialPadTextSize / 3, color: 'black', fontStyle: "normal" }}>{dinlPadAlphabat[item - 1]}</Text>
                            }
                        </View>
                    </TouchableOpacity>
                )
            }}
        >
        </FlatList>

    )
}

const Dialpad = ({ navigation }) => {
    const incomeingCall = false
    const { connect, makeCall } = usecreateUA()
    const [code, setCode] = useState([]);
    const { CallScreenOpen, soketConnect } = useSelector((state) => state.sip)
    const dispatch = useDispatch()


    useEffect(() => {
        connect();
    }, []);

    const handleMakeCall = (code) => {
        const number = code.join('')
        number.toString()
        console.log(number)
        makeCall(number)
        dispatch(updateSipState({ key: "Caller_Name", value: number }))
        dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
    };

    const callPick = () => {
        navigation.navigate('CallScreen', { number, navigation })
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: 'row'
                        , gap: pinSpacing * 2
                        , height: pinSize * 1
                        , justifyContent: 'center'
                        , alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 20, }}>{code}</Text>
                </View>
                <View style={{flex:1}}>
                <DialpadTimeSearchContact searchtext={code} setCode={setCode}/>
                </View>
            </View>

            <View style={style.container}>
                <View style={{ height: 20 }}>

                </View>
                <View >
                <Number code={code.length ? {} : code} onPress={(item) => {
                    if (item.toString() == 'del') {
                        const updatedWords = [...code];
                        updatedWords.pop();
                        setCode(updatedWords);
                    } else if (item.toString() == "call") {
                        handleMakeCall(code)
                    } else if (item.toString() == '*' || item.toString() == '#') {
                    } else {
                        const newNumbers = code.length === 0 ? [item.toString()] : [...code, item.toString()];
                        setCode(newNumbers)
                    }
                }} />
                </View>
            </View>
            {/* <View>
                <IncomingCall nav={navigation} />
            </View>

            <View>
                <CallScreen nav={navigation} />
            </View> */}

        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
        borderColor: 'grey',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10
    },
    DialPadNumber: {
        width: dialPadSize,
        height: dialPadSize,
        borderRadius: dialPadSize,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',

    }
})

export default Dialpad