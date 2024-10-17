import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { XMPPContext } from './XMPPProvider';
import { launchImageLibrary } from 'react-native-image-picker';

const ChatScreen = ({ route }) => {
  const { contact } = route.params;
  const { messages, sendMessage, sendMediaMessage, sendImage } = useContext(XMPPContext);
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

  const handleSendMedia = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        const base64 = response.assets[0].base64;
        sendImage(contactJid, base64, 'image/jpeg');
      }
    });
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
    return (
      <View
        key={index}
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.sentMessage : styles.receivedMessage
        ]}
      >
        {msg.type === 'image' ? (
          <Image source={{ uri: msg.content }} style={styles.imageMessage} />
        ) : (
          <Text style={styles.messageText}>{msg.text}</Text>
        )}
        <Text style={styles.timeText}>{msg.time}</Text>
      </View>
    );
  };



  useEffect(() => {
    // Scroll to bottom when messages change
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [localMessages]);

  // return (
  //     <View style={styles.container}>
  //         <Text style={styles.headerText}>{contact.name}</Text>
  //         <ScrollView
  //             ref={scrollViewRef}
  //             contentContainerStyle={styles.messagesContainer}
  //         >
  //             {localMessages.length > 0 ? (
  //                 localMessages.map((msg, index) => (
  //                     <View
  //                         key={index}
  //                         style={[
  //                             styles.messageContainer,
  //                             isSenderMessage(msg) ? styles.senderMessage : styles.receiverMessage
  //                         ]}
  //                     >
  //                         <View style={[
  //                             styles.messageContent,
  //                             isSenderMessage(msg) ? styles.senderContent : styles.receiverContent
  //                         ]}>
  //                             <Text style={styles.messageText}>{msg.text}</Text>
  //                             <Text style={styles.timeText}>{msg.time}</Text>
  //                         </View>
  //                     </View>
  //                 ))
  //             ) : (
  //                 <Text>No messages yet</Text>
  //             )}
  //         </ScrollView>

  //         <View style={styles.inputContainer}>
  //             <TextInput
  //                 style={styles.input}
  //                 placeholder="Type a message"
  //                 value={messageText}
  //                 onChangeText={setMessageText}
  //             />
  //             <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
  //                 <Text style={styles.sendButtonText}>Send</Text>
  //             </TouchableOpacity>
  //         </View>
  //     </View>
  // );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
      >
        {contactMessages.map(renderMessage)}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleSendImage} style={styles.imageButton} disabled={isUploading}>
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     padding: 10,
//     backgroundColor: '#FFFFFF',
//   },
//   messagesContainer: {
//     padding: 10,
//   },
//   messageContainer: {
//     maxWidth: '80%',
//     marginBottom: 10,
//   },
//   senderMessage: {
//     alignSelf: 'flex-end',
//   },
//   receiverMessage: {
//     alignSelf: 'flex-start',
//   },
//   messageContent: {
//     borderRadius: 10,
//     padding: 10,
//   },
//   senderContent: {
//     backgroundColor: '#DCF8C6',
//   },
//   receiverContent: {
//     backgroundColor: '#FFFFFF',
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#888888',
//     alignSelf: 'flex-end',
//     marginTop: 5,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#FFFFFF',
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#CCCCCC',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     justifyContent: 'center',
//   },
//   sendButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
// });

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
});



export default ChatScreen;
