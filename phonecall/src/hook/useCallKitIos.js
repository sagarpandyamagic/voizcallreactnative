import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import uuid from 'uuid';
import RNCallKeep from 'react-native-callkeep';
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
import { callkeep } from '../CallKeep/CallKeep';


callkeep.addEventListener('didReceiveStartCallAction', ({ handle }) => {
  console.log("didReceiveStartCallAction")
  // Handle incoming call, display notification, etc.
});

callkeep.addEventListener('didDisplayIncomingCall', ({ handle }) => {
  console.log("didDisplayIncomingCall")
  // Handle call display, show notification, etc.
});

callkeep.addEventListener('endCall', ({ handle }) => {
  console.log("endCall")

  // Handle call ending, remove notification, etc.
});
