import {
  View,
  Text,
} from 'react-native';
import { React, useEffect, useState } from 'react';
import { xmppService } from '../xmppStore/XmppStore';

const XmppChat = ({ navigation }) => {

  // You can also add event listeners in your React component
  useEffect(() => {
    if (xmppService) {
      xmppService.xmpp.on('online', () => {
        console.log('Connected successfully!');
        // Perform actions after successful connection
      });

      xmppService.xmpp.on('error', (error) => {
        console.error('Connection error:', error);
        // Handle connection errors
      });

      // Clean up listeners when component unmounts
      return () => {
        xmppService.xmpp.removeAllListeners();
      };
    }
  }, []);

  useEffect(() => {
    xmppService.start();
  }, []);

  return (
    <View>

    </View>
  )
}
export default XmppChat