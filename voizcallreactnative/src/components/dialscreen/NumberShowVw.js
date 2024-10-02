import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text,TextInput } from 'react-native';
import ic_more from '../../../Assets/ic_more.png';
import ic_remove_number from '../../../Assets/ic_remove_number.png';
import { THEME_COLORS } from '../../HelperClass/Constant';


const NumberShowVw = ({ number, onRemove, setNumber }) => {
  const [showCursor, setShowCursor] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(number.length);


  const renderNumberWithCursor = () => {
    if (number.length === 0) {
      return <Text style={styles.numberText}></Text>;
    }
    return (
      // <Text style={styles.numberText}>
      //   {afterCursor}
      //   <Text style={styles.cursor}>{showCursor ? '|' : ' '}</Text>
      //   {beforeCursor}
      // </Text>
      <TextInput style={styles.numberText}
        selection={{ start: cursorPosition, end: cursorPosition }}
        onSelectionChange={(event) => setCursorPosition(event.nativeEvent.selection.start)}
        // value={number}
        keyboardType="numeric"
        onKeyPress={handleKeyPress}
        onChangeText={handleChangeText}
      >
        {number}
      </TextInput>
    );
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace' && number.length > 0) {
      setNumber(number.slice(0, -1));
    }
  };


  const handleChangeText = (text) => {
    const formattedNumber = text.split(',');
    console.log("formattedNumber",formattedNumber)
    setNumber(formattedNumber);
  };


  return (
    <View style={styles.container}>
      <View style={styles.numberContainer}>
        {
          renderNumberWithCursor()
        }
        {
          number.length > 0 && <TouchableOpacity style={[styles.callBtn]}
            onPress={onRemove}
          >
            <Image
              source={ic_remove_number}
              resizeMode="cover"
              style={[styles.callBtnImage]}></Image>
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '80%',
    paddingBottom: 5,
    justifyContent: 'center',
  },
  numberContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 20,
  },
  cursor: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  controlButton: {
    fontSize: 16,
    marginHorizontal: 10,
    color: 'blue',
  },
  callBtn: {
    height: 35,
    width: 60,
    marginLeft: 2,
    backgroundColor: THEME_COLORS.transparent,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    borderRadius: 20
  },
  callBtnImage: {
    tintColor: THEME_COLORS.black, height: 25, width: 30,
  }
});
export default NumberShowVw;
