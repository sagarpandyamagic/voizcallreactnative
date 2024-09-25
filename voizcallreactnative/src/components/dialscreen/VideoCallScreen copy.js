import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import SipUA from '../../services/call/SipUA';
import { SessionState } from 'sip.js';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import VideoCallFirstBtn from '../videocallscreen/VideoCallFirstBtn';
import VideoCallCutBtn from '../videocallscreen/VideoCallCutBtn';
import { mediaDevices, RTCPeerConnection, RTCView } from 'react-native-webrtc';

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const VideoCallScreen = () => {
  const { session, CallInitial, VideoCallScreenOpen, callTimer, DialNumber, CallType, soketConnect } = useSelector((state) => state.sip);
  // const [mediaStermStart, setmediaStermStart] = useState(false);
  // const [remoteStream, setRemoteStream] = useState(null);
  // const [localStream, setLocalStream] = useState(null);
  // const [peerConnection, setPeerConnection] = useState(null);
  // const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  // const [isLoading, setIsLoading] = useState(true);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // useEffect(() => {
  //   if (remoteStream) {
  //     setIsLoading(false);
  //   }
  // }, [remoteStream]);

  useEffect(() => {
    if (session != {} && VideoCallScreenOpen && CallType == "InComingCall" && soketConnect && CallInitial) {
      console.log("CallAcceept --------------")
      session && session.accept()
      startLocalStream();
    }
  }, [CallInitial, VideoCallScreenOpen]);

  // useEffect(() => {
  //   if (session) {
  //     setupWebRTC();
  //   }
  // }, [session]);

  // useEffect(() => {
  //   requestMediaPermissions();
  // }, []);

  // useEffect(() => {
  //   if (session?.state === 'established') {
  //     const pc = session.sessionDescriptionHandler?.peerConnection;
  //     if (pc) {
  //       const newRemoteStream = new MediaStream();
  //       pc.getReceivers().forEach(receiver => {
  //         if (receiver.track) {
  //           newRemoteStream.addTrack(receiver.track);
  //         }
  //       });
  //       setRemoteStream(newRemoteStream);
  //     }
  //   }
  // }, [session, session?.state]);

  // useEffect(() => {
  //   if (session?.state == SessionState.Established) {
  //     setTimeout(() => {
  //       setmediaStermStart(true)
  //     }, 2000);
  //   }
  // }, [session, session?.state]);

  // useEffect(() => {
  //   if (session && localStream) {
  //     console.log('Adding local stream tracks to session:', localStream.getTracks());
  //     localStream.getTracks().forEach(track => {
  //       session.sessionDescriptionHandler?.peerConnection?.addTrack(track, localStream)
  //     });
  //   }
  // }, [localStream, session]);

  // const setupWebRTC = async () => {
  //   try {
  //     // Step 1: Get Local Media (Audio/Video)
  //     const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
  //     setLocalStream(stream);

  //     // Step 2: Create a new RTCPeerConnection
  //     const pc = new RTCPeerConnection(configuration);
  //     setPeerConnection(pc);

  //     // Step 3: Add local tracks (audio and video) to the connection
  //     stream.getTracks().forEach(track => pc.addTrack(track, stream));

  //     // Step 4: Handle incoming remote stream (this will fire when the remote peer sends media)
  //     pc.ontrack = (event) => {
  //       console.log('Received remote track:', event.streams);
  //       if (event.streams && event.streams[0]) {
  //         setRemoteStream(event.streams[0]);
  //       }
  //     };

  //     // Step 5: Handle ICE Candidate Exchange (Make sure this signaling part is correctly handled)
  //     pc.onicecandidate = (event) => {
  //       if (event.candidate) {
  //         // Send candidate to the remote peer
  //         console.log('New ICE Candidate:', event.candidate);
  //         // You'll need to send this candidate to the other peer through your signaling server
  //       }
  //     };

  //     // Step 6: Create an offer and set the local description
  //     if (session && CallType === 'OutgoingCall') {
  //       const offer = await pc.createOffer();
  //       await pc.setLocalDescription(offer);

  //       // Send the offer to the remote peer (through your signaling mechanism)
  //       console.log('Offer created:', offer);
  //     }

  //   } catch (error) {
  //     console.error('Error setting up WebRTC:', error);
  //   }
  // };

  // const requestMediaPermissions = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //     ]);
  //     if (granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
  //       granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('Camera and microphone permissions granted');
  //       const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
  //       stream.getTracks().forEach(track => session.sessionDescriptionHandler?.peerConnection?.addTrack(track, stream));
  //       setLocalStream(stream);
  //     } else {
  //       console.warn('Permissions denied');
  //     }
  //   } catch (error) {
  //     console.error('Error requesting permissions:', error);
  //   }
  // };

  // const toggleVideo = async () => {
  //   if (localStream) {
  //     const videoTrack = localStream.getVideoTracks()[0];
  //     if (videoTrack) {
  //       videoTrack.enabled = !isVideoEnabled;
  //       setIsVideoEnabled(!isVideoEnabled);
  //     }
  //   }
  // };

  // const hangupCall = () => {
  //   if (peerConnection) peerConnection.close();
  //   if (localStream) localStream.getTracks().forEach(track => track.stop());
  // };
  // Request permissions on Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  // Initialize the peer connection and add stream listeners
  const initializePeerConnection = async () => {
    const peerConnection = new RTCPeerConnection(configuration);

    // Add local stream tracks to peer connection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // When the remote stream is received
    peerConnection.ontrack = event => {
      const [stream] = event.streams;
      setRemoteStream(stream);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        // Send the candidate to the remote peer (via your signaling server)
        console.log('ICE Candidate', event.candidate);
      }
    };

    peerConnectionRef.current = peerConnection;
  };

  const startLocalStream = async () => {
    await requestPermissions();

    // Get the user media (camera + microphone)
    const stream = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    localStreamRef.current = stream;

    // Initialize the peer connection after getting the local stream
    initializePeerConnection();
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
            remoteStream && session &&
            <RTCView
              streamURL={localStream.toURL()}
              style={styles.localStream}
              mirror={true}
            />
          }
          <View style={{ position: 'absolute', top: 15, right: 15, height: 180, width: 120 }}>
            {
              localStream && localStream.getTracks().length > 0 &&
              <RTCView
                streamURL={localStream.toURL()}
                style={{ width: 120, height: 180 }}
                zIndex={2}
                objectFit='cover'
              />
            }
          </View>
          <View style={styles.buttonVw}>
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 20, alignSelf: 'center' }}>
              <Text style={[styles.Text, { fontSize: 15, marginTop: 15 }]}>
                {DialNumber}
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
      <View>
        {/* {session ? <SetupRemoteVideoMedia session={session} /> : <Text>No Video Found</Text>} */}
        {/* <Button title={"Call"} onPress={makeCall} /> */}
      </View>
    </View>
  );

}; const styles = StyleSheet.create({
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
