import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { SessionState } from 'sip.js';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import VideoCallFirstBtn from '../videocallscreen/VideoCallFirstBtn';
import VideoCallCutBtn from '../videocallscreen/VideoCallCutBtn';
import { mediaDevices, MediaStream, RTCPeerConnection, RTCView } from 'react-native-webrtc';
import { useCallTimerContext } from '../../hook/useCallTimer';
import InCallManager from 'react-native-incall-manager';

const { height } = Dimensions.get('window');

const VideoCallScreen = () => {
  const { session, CallInitial, VideoCallScreenOpen, DialNumber, CallType, soketConnect, sesstionState } = useSelector((state) => state.sip);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { callTimer } = useCallTimerContext()
  const [isFrontCamera, setIsFrontCamera] = useState(true); // State to track camera direction
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isButtonVwVisible, setIsButtonVwVisible] = useState(true);


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
      if (sesstionState == SessionState.Established) {
        if (session.sessionDescriptionHandler && session.sessionDescriptionHandler.peerConnection) {
          const pc = session.sessionDescriptionHandler?.peerConnection;
          const remoteStream = new MediaStream();
          let hasVideoTrack = false;

          pc.getReceivers().forEach((receiver) => {
            if (receiver.track) {
              remoteStream.addTrack(receiver.track);
              if (receiver.track.kind === 'video') {
                hasVideoTrack = true;
              }
            }
          });

          if (remoteStream.getTracks().length > 0) {
            console.log("Remote stream created with tracks:", remoteStream.getTracks().length);
            setRemoteStream(remoteStream);
          } else {
            console.warn("No tracks found in remote stream");
          }
          console.log("remoteStream ff", remoteStream?.toURL())
        }
      }

      console.log("session?.sessionDescriptionHandler?.peerConnection?.getReceivers()", session?.sessionDescriptionHandler?.peerConnection?.getReceivers())
    }
  }, [session, sesstionState]);

  useEffect(() => {
    if (remoteStream) {
      remoteStream.getVideoTracks().forEach(track => {
        if (!track.enabled) {
          console.log("Enabling disabled video track");
          track.enabled = true;
        }
      });
    }
  }, [remoteStream]);

  // useEffect(() => {
  //   InCallManager.start({ media: 'video' });  // Change 'audio' to 'video'
  //   InCallManager.setForceSpeakerphoneOn(true);
  //   return () => InCallManager.stop();
  // }, []);

  useEffect(() => {
    if (session) {
      startLocalStream();
    }
  }, [session])

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

  useEffect(() => {
    if (remoteStream) {
      const videoTracks = remoteStream.getVideoTracks();
      console.log("Remote video tracks:", videoTracks.length);
      videoTracks.forEach((track, index) => {
        console.log(`Video track ${index}:`, {
          id: track.id,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState
        });
        track.enabled = true;
      });
    }
  }, [remoteStream]);

  const toggleButtonVwVisibility = () => {
    setIsButtonVwVisible(prevState => !prevState);
  };

  const startLocalStream = async (facingMode = 'user') => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
          Alert.alert('Permission denied', 'Camera and microphone permissions are required for video calls.');
          return;
        }
      }
      const constraints = {
        audio: true,
        video: {
          facingMode: facingMode, // 'user' for front camera, 'environment' for back camera
        },
      };
      const stream = await mediaDevices.getUserMedia(constraints);
      if (session && session.sessionDescriptionHandler && session.sessionDescriptionHandler.peerConnection) {
        stream.getTracks().forEach(track => {
          session.sessionDescriptionHandler.peerConnection.addTrack(track, stream);
        });
      }
      setLocalStream(stream);
    } catch (error) {
      logError('Error getting user media', error);
    }
  };

  const updateTracks = (newStream) => {
    if (session && session.sessionDescriptionHandler && session.sessionDescriptionHandler.peerConnection) {
      const pc = session.sessionDescriptionHandler.peerConnection;

      newStream.getTracks().forEach(track => {
        const sender = pc.getSenders().find(s => s.track && s.track.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track);
        } else {
          pc.addTrack(track, newStream);
        }
      });
    }
  };


  // Function to toggle the camera direction
  const toggleCamera = async () => {
    setIsFrontCamera((prev) => !prev); // Toggle the state
    const newFacingMode = isFrontCamera ? 'environment' : 'user';
    const newStream = await mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: newFacingMode },
    });
    setLocalStream(newStream);
    updateTracks(newStream);// Restart the stream with the new camera
  };



  const toggleVideo = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const hangupCall = () => {
    if (localStream) localStream.getTracks().forEach(track => track.stop());

    SipUA.hangupCall();
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={VideoCallScreenOpen}
        transparent={false}
        animationType="none"
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.overlay, { bottom: isButtonVwVisible ? '50%' : 0 }]}
            activeOpacity={1}
            onPress={toggleButtonVwVisibility}
          />
          {
            remoteStream &&
            <RTCView
              streamURL={remoteStream.toURL()}
              style={{
                width: "100%",
                height: '100%',
                backgroundColor: 'blue',

              }}
              objectFit="cover"
              zOrder={0}
              mirror={false}
              onError={(e) => console.error('RTCView error:', e)}
              onLoadStart={() => console.log("RTCView load started")}
              onLoad={() => console.log("RTCView loaded")}
            />
          }
          <View style={{ position: 'absolute', top: "5%", right: "3%", height: "22%", width: "40%" }}>
            {
              localStream &&
              <RTCView
                streamURL={localStream.toURL()}
                style={{ width: "100%", height: "100%" }}
                objectFit="cover"
                mirror={true}
              />
            }
          </View>
          {isButtonVwVisible && (
            <View style={[styles.buttonVw, { display: isButtonVwVisible ? 'flex' : 'none' }]}>
              <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 20, alignSelf: 'center' }}>
                <Text style={[styles.Text, { fontSize: 15, marginTop: 15 }]}>
                  {DialNumber}
                </Text>
                <Text style={[styles.Text, { fontSize: 15 }]}>
                  {callTimer == "00:00:00" ? (CallInitial == false ? "Connecting....." : "Calling....") : callTimer}
                </Text>
              </View>
              <VideoCallFirstBtn />
              <VideoCallCutBtn camaraDireationChange={toggleCamera} toggleVideo={toggleVideo} hangupCall={hangupCall} />
            </View>
          )}
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
    zIndex: 2,
    borderTopLeftRadius: 40,  // Add this line
    borderTopRightRadius: 40, // 

  },
  remoteStream: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

    zIndex: 1,
  },
});

export default VideoCallScreen;
