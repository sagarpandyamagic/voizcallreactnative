import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { XMPPContext } from './XMPPProvider';
import { launchImageLibrary } from 'react-native-image-picker';

const ChatScreen = ({ route }) => {
    const { contact } = route.params;
    const { messages, sendMessage } = useContext(XMPPContext);
    const [messageText, setMessageText] = useState('');
    const [localMessages, setLocalMessages] = useState([]);
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


    useEffect(() => {
        // Scroll to bottom when messages change
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [localMessages]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{contact.name}</Text>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.messagesContainer}
            >
                {localMessages.length > 0 ? (
                    localMessages.map((msg, index) => (
                        <View
                            key={index}
                            style={[
                                styles.messageContainer,
                                isSenderMessage(msg) ? styles.senderMessage : styles.receiverMessage
                            ]}
                        >
                            <View style={[
                                styles.messageContent,
                                isSenderMessage(msg) ? styles.senderContent : styles.receiverContent
                            ]}>
                                <Text style={styles.messageText}>{msg.text}</Text>
                                <Text style={styles.timeText}>{msg.time}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>No messages yet</Text>
                )}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    value={messageText}
                    onChangeText={setMessageText}
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
    },
    senderMessage: {
      alignSelf: 'flex-end',
    },
    receiverMessage: {
      alignSelf: 'flex-start',
    },
    messageContent: {
      borderRadius: 10,
      padding: 10,
    },
    senderContent: {
      backgroundColor: '#DCF8C6',
    },
    receiverContent: {
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
  });
  

export default ChatScreen;
