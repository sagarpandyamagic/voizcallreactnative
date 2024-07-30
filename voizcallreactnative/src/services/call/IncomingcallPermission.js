import { React } from 'react';
import { PermissionsAndroid } from 'react-native';
import InCallManager from 'react-native-incall-manager';

export const IncomingcallPermission = () => {
    InCallManager.setSpeakerphoneOn(false);
    InCallManager.stop();
}

export const requestMediaPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Camera and microphone permissions granted');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // stream.getTracks().forEach(track => session.sessionDescriptionHandler.peerConnection.addTrack(track, stream));
        setLocalStrea(stream);
      } else {
        console.warn('Permissions denied');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };