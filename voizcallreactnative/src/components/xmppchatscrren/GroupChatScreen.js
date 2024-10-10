import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { XMPPContext } from './XMPPProvider';

const GroupChatScreen = ({ route }) => {
    const { roomJid, roomName } = route.params;
    const { groupMessages, sendGroupMessage, joinRoom } = useContext(XMPPContext);
    const [messageText, setMessageText] = useState('');
    const scrollViewRef = useRef();

    const roomMessages = groupMessages[roomJid] || [];

    useEffect(() => {
        joinRoom(roomJid, 'YourNickname'); // Replace 'YourNickname' with the user's chosen nickname
    }, [roomJid, joinRoom]);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [roomMessages]);

    const handleSendMessage = () => {
        if (messageText.trim()) {
            sendGroupMessage(roomJid, messageText);
            setMessageText('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{roomName}</Text>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.messagesContainer}
            >
                {roomMessages.map((msg, index) => (
                    <View
                        key={index}
                        style={[
                            styles.messageContainer,
                            msg.from === 'Me' ? styles.sentMessage : styles.receivedMessage
                        ]}
                    >
                        <Text style={styles.senderText}>{msg.from}</Text>
                        <Text style={styles.messageText}>{msg.text}</Text>
                        <Text style={styles.timeText}>{msg.time}</Text>
                    </View>
                ))}
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
        fontSize: 20,
        fontWeight: 'bold',
        padding: 15,
        backgroundColor: '#4A90E2',
        color: 'white',
        textAlign: 'center',
    },
    messagesContainer: {
        padding: 10,
    },
    messageContainer: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },
    senderText: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 14,
    },
    messageText: {
        fontSize: 16,
    },
    timeText: {
        fontSize: 12,
        color: '#888',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
export default GroupChatScreen;