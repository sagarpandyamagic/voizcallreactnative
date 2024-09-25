import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { SessionState } from 'sip.js';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import VideoCallFirstBtn from '../videocallscreen/VideoCallFirstBtn';
import VideoCallCutBtn from '../videocallscreen/VideoCallCutBtn';
import { mediaDevices, MediaStream, RTCView } from 'react-native-webrtc';

const VideoCallScreen = () => {
  const { session, CallInitial, VideoCallScreenOpen, callTimer, DialNumber, CallType, soketConnect, sesstionState } = useSelector((state) => state.sip);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const logError = useCallback((message, error) => {
    console.error(message, error);
    Alert.alert('Error', `${message}: ${error.message}`);
  }, []);

  useEffect(() => {
    if (session != {} && VideoCallScreenOpen && CallType == "InComingCall" && soketConnect && CallInitial) {
      console.log("CallAcceept --------------")
      session.accept();
    }
  }, [CallInitial, VideoCallScreenOpen]);

  useEffect(() => {
    if (session) {
      if(sesstionState == SessionState.Established){
        if (session.sessionDescriptionHandler && session.sessionDescriptionHandler.peerConnection) {
          const pc = session.sessionDescriptionHandler.peerConnection;
          const remoteStream = new MediaStream();
          pc.getReceivers().forEach((receiver) => {
            remoteStream.addTrack(receiver.track);
          });
          setRemoteStream(remoteStream);
          console.log("remoteStream ff", remoteStream?.toURL())
        }
      }
      console.log("session?.sessionDescriptionHandler?.peerConnection?.getReceivers()", session?.sessionDescriptionHandler?.peerConnection?.getReceivers())
    }
  }, [session, sesstionState]);

  useEffect(()=>{
    if(session){
      startLocalStream();
    }
  },[session])

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      return (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);


  const startLocalStream = async () => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
          Alert.alert('Permission denied', 'Camera and microphone permissions are required for video calls.');
          return;
        }
      }
      const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => session.sessionDescriptionHandler?.peerConnection?.addTrack(track, stream));
      setLocalStream(stream);
    } catch (error) {
      logError('Error getting user media', error);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={VideoCallScreenOpen}
        transparent={false}
        animationType="none"
      >
        <View style={styles.container}>
          
          {
            remoteStream &&
            <RTCView
              streamURL={remoteStream.toURL()}
              style={{ width: 500, height: 500,backgroundColor:"green" }}
              objectFit='cover'
              onError={(e) => console.error('RTCView error:', e)}
            />
          }
          <View style={{ position: 'absolute', top: 15, right: 15, height: 180, width: 120 }}>
            {
              localStream &&
              <RTCView
                streamURL={localStream.toURL()}
                style={{ width: 120, height: 180 }}
                mirror={true}
              />
            }
          </View>
          <View style={styles.buttonVw}>
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 20, alignSelf: 'center' }}>
              <Text style={[styles.Text, { fontSize: 15, marginTop: 15 }]}>
                {DialNumber} {remoteStream &&<Text>Loading...</Text>}
              </Text>
              <Text style={[styles.Text, { fontSize: 15 }]}>
                {callTimer == "00:00:00" ? (CallInitial == false ? "Connecting....." : "Calling....") : callTimer}
              </Text>
            </View>
            <VideoCallFirstBtn />
            <VideoCallCutBtn />
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.black,
  },
  Text: {
    color: '#000000',
    fontSize: 18,
    fontFamily: AppCommon_Font.Font
  },
  buttonVw: {
    width: '100%',
    height: "50%",
    backgroundColor: 'white',
    opacity: 0.7,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 20, // Add some padding at the bottom
  },
  remoteStream: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },

});

export default VideoCallScreen;
