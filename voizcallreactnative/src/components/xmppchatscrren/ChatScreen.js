import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { XMPPContext } from './XMPPProvider';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker'; // Import Document Picker
import { getDocumentIcon, identifyMessageType } from '../../HelperClass/Constant';
import RNFS from 'react-native-fs';

const ChatScreen = ({ route }) => {
  const { contact } = route.params;
  const { messages, sendMessage, sendMediaMessage, sendImage ,sendFile} = useContext(XMPPContext);
  const [messageText, setMessageText] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const scrollViewRef = useRef();
  const isSenderMessage = (msg) => msg.from === 'Me';
  const contactJid = contact.jid.split('/')[0]; // Use bare JID
  const contactMessages = messages[contactJid] || [];

  useEffect(() => {
    const contactMessages = messages[contact.jid] || [];
    console.log('contactMessages', contactMessages)
    setLocalMessages(contactMessages);
  }, [messages, contact.jid]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        from: 'Me',
        text: messageText,
        time: new Date().toLocaleTimeString(),
      };
      sendMessage(contact.jid, messageText);
      setLocalMessages(prevMessages => [...prevMessages, newMessage]);
      setMessageText('');
    }
    
  };


  const handleSendDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const file = res[0]; // Get the first file from the array

      // Alert.alert('Selected file:', `URI: ${file.uri}, Type: ${file.type}, Name: ${file.name}, Size: ${file.size}`);
      if (res) {
        setIsUploading(true);
        const base64 = await RNFS.readFile(file.uri, 'base64');
        console.log('base64',file)

        // await sendImage(contactJid, filePath);
        const dic = {'name':file.name,'type':file.type,'uri':file.uri,'size':file.size,'base64':base64,'to':contactJid}
        await sendFile(dic)
        setIsUploading(false);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Error picking document: ', error);
      }
      setIsUploading(false);
    }
  };

  const handleSendImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets[0]) {
        const { uri } = result.assets[0];
        setIsUploading(true);
        await sendImage(contactJid, uri);
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error picking or sending image:', error);
      setIsUploading(false);
      // Handle error (e.g., show an error message to the user)
    }

  };

  const renderMessage = (msg, index) => {
    const isOwnMessage = msg.from === 'Me';
    const messageType = identifyMessageType(msg.text || msg.content);
    console.log('messageType', messageType)
    return (
      <View
        key={index}
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.sentMessage : styles.receivedMessage
        ]}
      >
        {messageType === 'image' ? (
          <Image source={{ uri: msg.content }} style={styles.imageMessage} />
        ) : messageType === 'document' ? (
          <TouchableOpacity onPress={() => handleDocumentTap(msg.content)}>
            <View style={styles.documentMessage}>
              <Image source={getDocumentIcon(msg.text.split('.').pop())} style={styles.documentIcon} />
              <Text style={styles.documentText}>{msg.text.split('/').pop()}</Text>
            </View>
          </TouchableOpacity>

        ) : (
          <Text style={styles.messageText}>{msg.text}</Text>
        )}
        <Text style={styles.timeText}>{msg.time}</Text>
      </View>
    );
  };

  const handleDocumentTap = (documentUrl) => {
    // Implement the logic to open the document
    console.log('Document tapped:', documentUrl);
    // You can add code here to open the document using a suitable library or native module
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [localMessages]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
      >
        {contactMessages.map(renderMessage)}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleSendDocument} style={styles.imageButton} disabled={isUploading}>
          {isUploading ? <ActivityIndicator size="small" color="#0000ff" /> : <Text>📷</Text>}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  messagesContainer: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#888888',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mediaButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  mediaButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mediaMessage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  imageButton: {
    padding: 10,
  },
  documentMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8', // Light background for document messages
    borderRadius: 10,
    padding: 10,
    marginVertical: 5, // Space between messages
  },
  documentIcon: {
    width: 30,  // Width of the document icon
    height: 30, // Height of the document icon
    marginRight: 10, // Space between icon and text
  },
  documentText: {
    fontSize: 16, // Font size for the document name
    color: '#333', // Dark color for visibility
    flex: 1, // Allow text to fill available space
  },
});



export default ChatScreen;
