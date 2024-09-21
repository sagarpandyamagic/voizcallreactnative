import React, { useEffect, useState } from 'react';
import { Button, PermissionsAndroid, Text, View } from 'react-native';
import { RTCPeerConnection, mediaDevices, RTCView } from 'react-native-webrtc';
import { useSelector } from 'react-redux';
import SipUA from '../../services/call/SipUA';
import { SessionState } from 'sip.js';

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const SetupRemoteVideoMedia = ({ session }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (remoteStream) {
      setIsLoading(false);
    }
  }, [remoteStream]);



  useEffect(() => {
    const setupWebRTC = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        const pc = new RTCPeerConnection(configuration);
        setPeerConnection(pc);

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          console.log('Remote track received:', event.streams);
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
          } else {
            console.warn('No remote stream available');
          }
        };
        // // Cleanup function
        // return () => {
        //   pc.close();
        //   stream.getTracks().forEach(track => track.stop());
        // };
      } catch (error) {
        console.error('Error setting up WebRTC:', error);
      }
    };

    setupWebRTC();
  }, [session]);

  const toggleVideo = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);

        if (peerConnection) {
          const sender = peerConnection.getSenders().find(s => s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(isVideoEnabled ? null : videoTrack);
          }
        }
      }
    }
  };

  const hangupCall = () => {
    if (peerConnection) peerConnection.close();
    if (localStream) localStream.getTracks().forEach(track => track.stop());
  };

  const requestMediaPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera and microphone permissions granted');
        const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(track => session.sessionDescriptionHandler?.peerConnection?.addTrack(track, stream));
        setLocalStream(stream);
      } else {
        console.warn('Permissions denied');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };
  useEffect(() => {
    requestMediaPermissions();
  }, []);

  useEffect(() => {
    if (session && localStream) {
      console.log('Adding local stream tracks to session:', localStream.getTracks());
      localStream.getTracks().forEach(track => session.sessionDescriptionHandler?.peerConnection?.addTrack(track, localStream));
    }
  }, [localStream, session]);

  useEffect(() => {
    if (session?.state === SessionState.Established) {
      const pc = session.sessionDescriptionHandler?.peerConnection;
      if (pc) {
        const newRemoteStream = new MediaStream();
        pc.getReceivers().forEach(receiver => {
          if (receiver.track) {
            newRemoteStream.addTrack(receiver.track);
          }
        });
        setRemoteStream(newRemoteStream);
        
        // Add a listener for track additions
        pc.ontrack = (event) => {
          if (event.track) {
            newRemoteStream.addTrack(event.track);
            setRemoteStream(new MediaStream(newRemoteStream.getTracks()));
          }
        };
      }
    }
  }, [session,session?.state,refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <View>
      <Text>Remote Video</Text>
      {remoteStream ? (
        isLoading ? (
          <Text>Loading remote stream...</Text>
        ) : (
          <RTCView
            key={refreshKey}
            streamURL={remoteStream.toURL()}
            style={{ width: 200, height: 200 }}
            objectFit='cover'
            visible={!!remoteStream}
            onError={(e) => console.error('RTCView error:', e)}
          />
        )
      ) : (
        <Text>No remote stream available</Text>
      )}
      <Text>Local Video</Text>
      {localStream ? (
        <RTCView
          streamURL={localStream.toURL()}
          style={{ width: 200, height: 200 }}
          objectFit='cover'
        />
      ) : (
        <Text>No local stream available</Text>
      )}
      <Button title="Hang Up" onPress={hangupCall} />
      <Button title={isVideoEnabled ? "Disable Video" : "Enable Video"} onPress={toggleVideo} />
      <Button title="Refresh Video" onPress={handleRefresh} />

    </View>
  );
};

const VideoCallScreen = () => {
  const { session, CallInitial } = useSelector((state) => state.sip);
  const [mediaStermStart, setmediaStermStart] = useState(false);

  const makeCall = async () => {
    await SipUA.makeCall("222222", true);
  };

  useEffect(() => {
    if(session?.state == SessionState.Established) {
      console.log('Session established:', session);
        setmediaStermStart(true)
    }
  }, [session,session?.state]);

  return (
    <View>
      { session ? <SetupRemoteVideoMedia session={session} /> : <Text>No Video Found</Text>}
      <Button title={"Call"} onPress={makeCall} />
    </View>
  );
};

export default VideoCallScreen;
