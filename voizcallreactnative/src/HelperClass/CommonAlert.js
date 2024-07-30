import React from 'react';
import { View, Button, Alert } from 'react-native';

export const showAlert = (AlertTitle,message) => {
    Alert.alert(
     AlertTitle,
      message,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  };


