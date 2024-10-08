import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions, FlatList } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import phoneLogo from '../../../Assets/ic_call.png';
import ic_remove_number from '../../../Assets/ic_remove_number.png';
import voicemailicon from '../../../Assets/voicemailicon.png';
const { width } = Dimensions.get('window')

const pinLength = 5
const pinContainersize = width / 2;
const pinMaxSize = pinContainersize / pinLength
const pinSpacing = 7
const pinSize = pinMaxSize - pinSpacing * 1.1

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#']//, 'voizcall', 'call', 'del']
const dinlPadAlphabat = ['', 'A B C', "D E F", "G H I", "J K L", "M N O", "P Q R S", "T U V", "W X Y Z", "", "+", "", "", "", ""]
const dialPadSize = width * .145
const dialPadTextSize = dialPadSize * .38
const _spacing = 20;

function Number({ onPress, onLongPress }: { onPress: (item: typeof dialPad[number]) => void }) {
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
                        }}
                        onLongPress={() => onLongPress(item)}
                        delayLongPress={500} // Adjust this value as needed

                    >
                        <View style={[styles.DialPadNumber, { backgroundColor: item === '' ? '#fff' : item === 'call' ? '#fff' : item === 'del' ? '#fff' : '#E8EFFF', borderWidth: item === '' ? 0 : item === 'call' ? 0 : item === 'del' ? 0 : 1 }]} >
                            {
                                item === 'del' ?
                                    <Image style={{
                                        width: dialPadSize / 2,
                                        height: dialPadSize / 3, resizeMode: 'contain',
                                    }} source={ic_remove_number} />
                                    : (item === 'call'
                                        ? <Image style={{
                                            width: dialPadSize - 5,
                                            height: dialPadSize - 5
                                        }} source={phoneLogo} />
                                        : (item === "voizcall") ? <Image style={{
                                            width: dialPadSize - 5,
                                            height: dialPadSize - 5
                                        }} source={voicemailicon} /> : <Text style={{ fontSize: dialPadTextSize, fontFamily: AppCommon_Font.Font, color: THEME_COLORS.black }}>{item}</Text>
                                    )
                            }
                            {item === 0 && (
                                <Text style={{ fontSize: dialPadTextSize / 2, color: THEME_COLORS.black, bottom: 5 }}>+</Text>
                            )}
                            {item !== '' && item !== 0 && (
                                <Text style={{ fontSize: dialPadTextSize / 2, color: THEME_COLORS.black, fontStyle: "normal" }}>{dinlPadAlphabat[item - 1]}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )
            }}
        >
        </FlatList>
    )
}

const DialPad = ({ dialnumber, addNumber }) => {
    const handleLongPress = (item) => {
        if (item === 0) {
            const pressTime = new Date().toISOString();
            console.log(`Long press on "+" button at: ${pressTime}`);
            addNumber([...dialnumber, '+']);
        }
    };

    return (
        <View >
            <Number code={dialnumber.length ? {} : dialnumber} onPress={(item) => {
                if (item.toString() == 'del') {
                    const updatedWords = [...dialnumber];
                    updatedWords.pop();
                    setCode(updatedWords);
                } else if (item.toString() == "call") {
                    handleMakeCall(number)
                } else if (item.toString() == '*' || item.toString() == '#') {
                    const newNumbers = dialnumber.length === 0 ? [item.toString()] : [...dialnumber, item.toString()];
                    addNumber(newNumbers)
                } else {
                    const newNumbers = dialnumber.length === 0 ? [item.toString()] : [...dialnumber, item.toString()];
                    addNumber(newNumbers)
                }
            }}
                onLongPress={handleLongPress}

            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'grey',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10
    },
    DialPadNumber: {
        width: dialPadSize * 1.5,
        height: dialPadSize,
        borderRadius: 15,
        borderWidth: 0,
        borderColor: THEME_COLORS.transparent,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: AppCommon_Font.Font,fontWeight:'bold'
    },
});
export default DialPad;
