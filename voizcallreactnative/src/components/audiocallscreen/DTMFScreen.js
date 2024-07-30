import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
const { width } = Dimensions.get('window')
const Length = 4
const Containersize = width;
const MaxSize = Containersize / Length
const Spacing = 0
const Size = MaxSize - Spacing * 2
import { useDispatch,useSelector } from 'react-redux';
import SipUA from '../../services/call/SipUA';
import { updateSipState } from '../../store/sipSlice';
import DialPad from '../dialscreen/DialPad';
import NumberShowVw from '../dialscreen/NumberShowVw';

function  DTMFScreen(){
  const [code, setCode] = useState([]);
  const { DTMFSCreen } = useSelector((state) => state.sip)
  const dispatch = useDispatch()

  const handleCloseBtn = () => {
    setCode([])
    dispatch(updateSipState({key:"DTMFSCreen",value:false}))
  };

  useEffect(() => {
    if(code&&code.length>0){
      SipUA.sendDTMF(code[code.length - 1])
    }
  }, [code])

  return (
    <Modal
    visible={DTMFSCreen}
    transparent={true}
    animationType="fade"
    >
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <NumberShowVw number = {code} showImage = {false}/>
        <DialPad dialnumber = {code} addNumber={setCode}/>
        <TouchableOpacity style={styles.callButton} onPress={handleCloseBtn}>
        <Text style={styles.callButtonText}>Close</Text>
        </TouchableOpacity>
     </View>
    </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom:25,
  },
  buttonContainer: {
    backgroundColor: 'white',
    width:'100%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    paddingTop:20
  },
  callButton: {
    backgroundColor: '#007AFF',
    marginTop:20,
    padding: 10,
    borderRadius: 5,
    alignItems:'center',
    width:'80%'
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default DTMFScreen;
