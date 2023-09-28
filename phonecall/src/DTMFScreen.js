import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
const { width } = Dimensions.get('window')
const Length = 4
const Containersize = width;
const MaxSize = Containersize / Length
const Spacing = 0
const Size = MaxSize - Spacing * 2
import { useDispatch,useSelector } from 'react-redux';
import { updateSipState } from './redux/sipSlice';
import usecreateUA from './hook/usecreateUA';

function  DTMFScreen(){
  const [dtmfSequence, setDtmfSequence] = useState('');

  const { sendDTMF } = usecreateUA()

  const { DTMFSCreen } = useSelector((state) => state.sip)
  const dispatch = useDispatch()

  const handleButtonPress = (tone) => {
    // Update the DTMF sequence with the pressed tone
    sendDTMF(tone)
    setDtmfSequence(dtmfSequence + tone);
  };

  const handleCallPress = () => {
    // Handle the action of sending the DTMF sequence
    console.log('Sending DTMF sequence:', dtmfSequence);
    // Reset the sequence after sending
    dispatch(updateSipState({key:"DTMFSCreen",value:false}))
  };

  return (
    <Modal
    visible={DTMFSCreen}
    transparent={true}
    animationType="fade"
    >
    <View style={styles.container}>
      <Text style={styles.dtmfDisplay}>{dtmfSequence}</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <DTMFButton tone="1" onPress={handleButtonPress} />
          <DTMFButton tone="2" onPress={handleButtonPress} />
          <DTMFButton tone="3" onPress={handleButtonPress} />
        </View>
        <View style={styles.row}>
          <DTMFButton tone="4" onPress={handleButtonPress} />
          <DTMFButton tone="5" onPress={handleButtonPress} />
          <DTMFButton tone="6" onPress={handleButtonPress} />
        </View>
        <View style={styles.row}>
          <DTMFButton tone="7" onPress={handleButtonPress} />
          <DTMFButton tone="8" onPress={handleButtonPress} />
          <DTMFButton tone="9" onPress={handleButtonPress} />
        </View>
        {/* More rows of buttons */}
        <View style={styles.row}>
          <DTMFButton tone="*" onPress={handleButtonPress} special />
          <DTMFButton tone="0" onPress={handleButtonPress} />
          <DTMFButton tone="#" onPress={handleButtonPress} special />
        </View>

        <TouchableOpacity style={styles.callButton} onPress={handleCallPress}>
        <Text style={styles.callButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
      
    </View>
    </Modal>
  );
};

const DTMFButton = ({ tone, onPress, special }) => (
  <TouchableOpacity
    style={[styles.dtmfButton, special && styles.specialButton]}
    onPress={() => onPress(tone)}
  >
    <Text style={styles.dtmfButtonText}>{tone}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:40
  },
  dtmfDisplay: {
    fontSize: 24,
    marginBottom: 20,
    
  },
  buttonContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dtmfButton: {
    width: Size,
    height: Size,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  specialButton: {
    backgroundColor: '#d3d3d3',
  },
  dtmfButtonText: {
    fontSize: 18,
  },
  callButton: {
    backgroundColor: '#007AFF',
    marginTop:20,
    padding: 10,
    borderRadius: 5,
    alignItems:'center'
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default DTMFScreen;
