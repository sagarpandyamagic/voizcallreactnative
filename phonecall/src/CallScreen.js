import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid
} from 'react-native';
import { React, useEffect, useRef, useState } from 'react';
const { width } = Dimensions.get('window')
import InCallManager from 'react-native-incall-manager';
import { useDispatch, useSelector } from 'react-redux';
import { Callcount, updateSipState } from './redux/sipSlice';
import DTMFScreen from './DTMFScreen';
import usecreateUA from './hook/usecreateUA';

import DeclineButton from '../Assets/ic_decline_call.png'
import SpekerButton from '../Assets/speaker_deactivate.png'
import SpekerButtonOn from '../Assets/speaker_activate.png'
import muteLogo from '../Assets/mute_off_ic.png';
import muteLogoOn from '../Assets/mute-ic.png';
import confrence from '../Assets/ic_confeence.png'
import recoding from '../Assets/ic_recording.png'
import callTranfer from '../Assets/ic_transfer-call.png'
import callHold from '../Assets/ic_hold.png'
import callUnhold from '../Assets/ic_pause-record.png'
import callmerge from '../Assets/ic_merge_call.png'
import DialPedLogo from '../Assets/dial_pad_icon.png';
import phoneLogo from '../Assets/circleVoizCallLogoround.png';
import iccallSwip from '../Assets/ic_call_swipe.png';
import ContactsList from './ContactScreen/ContactsList';
import { useCallTimerContext } from './hook/useCallTimer';


function CallScreen(props) {
  InCallManager.start({ media: 'audio' }); // Start audio mode
  const { CallScreenOpen, session, newCallAdd, phoneNumber,Caller_Name } = useSelector((state) => state.sip)
  const dispatch = useDispatch()
  const { toggelHoldCall, blindTx, CallRecoding, CallRecodingStop, Callhangup, holdUsedSwipTime, MuteCall } = usecreateUA()
  const [isSpeker, setSpeker] = useState(false)
  const [isMute, setMute] = useState(false)
  const [hold, sethold] = useState(false)
  const [swip, setswip] = useState(false)
  const [ContactShow, setContactShow] = useState(false)
  const [isRecording, setIsRecording] = useState(false);
  const { callTimer } = useCallTimerContext()
  useEffect(() => {
    setSpeker(false)
    setMute(false)
    sethold(false)
    setswip(false)
    if(session != {} && CallScreenOpen){
      session&&session.accept()
    }
  }, [CallScreenOpen]);

  return (
    <View style={styles.container}>
      <Modal visible={CallScreenOpen}
        transparent={false}
        animationType="none"
      >
        {
          (Callcount >= 2 && newCallAdd == 0) ? null :
            Callcount == 2 ? <>
              <View style={{
                height: 50
                , width: "80%"
                , backgroundColor: '#4F6EB4'
                , alignSelf: 'center'
                , marginTop: 30
                , justifyContent: 'center', borderRadius: 5, opacity: (swip == false) ? 0.8 : 1
              }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={{ height: 25, width: 25, marginLeft: 15 }} source={phoneLogo} />
                  <Text style={{ color: '#fff', marginLeft: 15 }}>{phoneNumber[0]}</Text>
                </View>
              </View>
              <View style={{
                height: 50
                , width: "80%"
                , backgroundColor: '#4F6EB4'
                , alignSelf: 'center'
                , marginTop: 1, justifyContent: 'center', borderRadius: 5, opacity: (swip == true) ? 0.8 : 1
              }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={{ height: 25, width: 25, marginLeft: 15 }} source={phoneLogo} />
                  <Text style={{ color: '#fff', marginLeft: 15 }}>{phoneNumber[1]}</Text>
                </View>
              </View>
            </> : null
        }

        <View style={styles.containerName}>
          <View>
            <Text style={styles.CallerText}>
              {                  
                (Callcount >= 2 && newCallAdd == 0) ? "Confrence" : (Callcount >= 3) ? "Confrence" : (Caller_Name == "Unknown"? phoneNumber[0]:Caller_Name)
              }
            </Text>
            <Text style={{ fontSize: 15, alignSelf: 'center' }}>
              {callTimer}
            </Text>
          </View>
        </View>
        <View style={styles.containerCallFeature}>
          <View style={{ flexDirection: 'row', width: '70%', marginTop: 30 }}>
            <TouchableOpacity style={{ paddingLeft: "20%" }} onPress={() => {
              if (newCallAdd == 1) {
                toggelHoldCall(false, true)
                dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
              } else {
                setContactShow(true)
              }
            }}>
              <Image style={{ height: 60, width: 60 }} source={(newCallAdd == 0) ? confrence : callmerge}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingLeft: "20%" }} onPress={() => {
              if (isRecording == true) {

              } else {

              }
            }}>
              <Image style={{ height: 60, width: 60 }} source={recoding}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingLeft: "20%" }} onPress={() => {
              blindTx("4228976292")
            }}>
              <Image style={{ height: 60, width: 60 }} source={callTranfer}></Image>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', width: '70%', marginTop: 30 }}>
            <TouchableOpacity style={{ paddingLeft: "20%" }} onPress={() => {
              setSpeker(!isSpeker)
              InCallManager.setSpeakerphoneOn(!isSpeker); // Turn on speaker
            }}>
              <Image style={{ height: 60, width: 60 }} source={isSpeker ? SpekerButtonOn : SpekerButton}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingLeft: "20%" }} onPress={() => {
              dispatch(updateSipState({ key: "DTMFSCreen", value: true }))
            }}>
              <Image style={{ height: 60, width: 60 }} source={DialPedLogo}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingLeft: "20%" }} onPress={() => {
              setMute(!isMute)
              MuteCall(isMute)
            }}>
              <Image style={{ height: 60, width: 60 }} source={isMute ? muteLogoOn : muteLogo}></Image>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', width: '70%', marginTop: 30 }}>
            <TouchableOpacity style={{ paddingLeft: "20%" }} onPress={() => {
            }}>
              <View style={{ height: 60, width: 60 }} ></View>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingLeft: "20%" }} onPress={() => {
              if (Callcount == 2) {
                setswip(!swip)
                if (swip == true) {
                  holdUsedSwipTime(phoneNumber[0])
                } else {
                  holdUsedSwipTime(phoneNumber[1])
                }
              } else {
                sethold(!hold)
                toggelHoldCall(!hold, true)
              }
            }}>
              {
                (Callcount >= 2 && newCallAdd == 0) ? null :
                  Callcount == 2 ?
                    <Image style={{ height: 60, width: 60 }} source={iccallSwip}></Image> :
                    <Image style={{ height: 60, width: 60 }} source={hold ? callUnhold : callHold}></Image>
              }
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.containerButton}>
          <TouchableOpacity style={{ paddingLeft: "2%" }} onPress={() => {
            Callhangup()
            InCallManager.setSpeakerphoneOn(false);
            InCallManager.stop();
          }}>
            <Image style={{ height: 80, width: 80 }} source={DeclineButton}></Image>
          </TouchableOpacity>
        </View>
        <View>
          <DTMFScreen />
        </View>
      </Modal>
      <Modal 
         visible={ContactShow}
      >
        <View style={{flex:1}}>
        <View style={{height:40,alignItems:'center',flexDirection:'row'}}>
          <TouchableOpacity style={{paddingLeft:15,paddingRight:25}}  onPress={()=>{
            setContactShow(false)
          }}>
            <Text>Back</Text>
          </TouchableOpacity>
          <Text style={{fontSize:22}}>ContactList</Text>
        </View>
        <ContactsList />
        </View>
      </Modal>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerName: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  }, containerCallFeature: {
    flex: 2,
  }, containerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CallerText: {
    fontSize: 25,
  }
})

export default CallScreen
