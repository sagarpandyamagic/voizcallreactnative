import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, Platform, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import XMPPClientManager from '../services/XMPPClientManager';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'chat.db', location: 'default' });

db.transaction(tx => {
    // Create Users Table
    tx.executeSql(`
        CREATE TABLE IF NOT EXISTS Users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create Media Table
    tx.executeSql(`
        CREATE TABLE IF NOT EXISTS Media (
            media_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            media_type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES Users(user_id)
        )
    `);

    // Create Messages Table
    tx.executeSql(`
        CREATE TABLE IF NOT EXISTS Messages (
            message_id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER,
            receiver_id INTEGER,
            message_text TEXT,
            media_id INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_read INTEGER DEFAULT 0,
            FOREIGN KEY(sender_id) REFERENCES Users(user_id),
            FOREIGN KEY(receiver_id) REFERENCES Users(user_id),
            FOREIGN KEY(media_id) REFERENCES Media(media_id)
        )
    `);
});
const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [roster, setRoster] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [xmppManager, setXmppManager] = useState(null);

    // Handle incoming messages
    const onMessageReceived = useCallback((message) => {
        setMessages(prevMessages => [
            ...prevMessages,
            {
                ...message,
                time: new Date().toLocaleTimeString(), // Add timestamp when message is received
            },
        ]);
    }, []);

    // Update roster
    const onRosterUpdate = useCallback((rosterItems) => {
        setRoster(rosterItems);
        console.log('Roster updated:', rosterItems);
    }, []);

    // Initialize XMPP client manager
    useEffect(() => {
        connectXMPP()
        // Cleanup on unmount
        return () => {
            if (manager) {
                manager.disconnect();
            }
        };
    }, [onMessageReceived, onRosterUpdate]);

    // Connect to XMPP server
    useEffect(() => {
        if (xmppManager) {
            xmppManager.connect();
        }
    }, [xmppManager]);

    const connectXMPP = () => {
        if (!xmppManager) {
            const manager = XMPPClientManager({
                username: 'sagar2',
                password: '123456',
                onMessageReceived,
                onRosterUpdate,
            });
            setXmppManager(manager);
            manager.connect();
        } else if (!xmppManager.connected) {
            xmppManager.connect();
        }
    };

    // Send message
    const handleSendMessage = () => {
        if (xmppManager && selectedRecipient && messageText) {
            xmppManager.sendMessage(selectedRecipient, messageText);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    from: 'Me', // Change 'Me' to the sender's name or ID
                    text: messageText,
                    time: new Date().toLocaleTimeString(), // Add timestamp when message is sent
                },
            ]);
            setMessageText(''); // Clear input after sending
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text>Connected: {xmppManager && xmppManager.connected ? 'Yes' : 'No'}</Text>
            {/* Roster list */}
            <ScrollView style={{ marginTop: 20 }}>
                {roster.length > 0 ? (
                    roster.map((contact, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => setSelectedRecipient(contact.jid)} 
                            style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
                        >
                            <Text style={{ color: 'blue', fontSize: 16 }}>{contact.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text>No contacts available</Text>
                )}
            </ScrollView>

            {/* Input for the message */}
            <TextInput
                placeholder="Type your message"
                value={messageText}
                onChangeText={setMessageText}
                style={{ borderColor: 'gray', borderWidth: 1, marginTop: 10, padding: 10 }}
            />

            {/* Send message button */}
            <TouchableOpacity
                onPress={handleSendMessage}
                style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 10 }}
            >
                <Text style={{ color: 'white' }}>Send Message</Text>
            </TouchableOpacity>

            {/* Message history */}
            <ScrollView style={{ marginTop: 20 }}>
                {messages.map((msg, index) => (
                    <Text key={index}>
                        {msg.from}: {msg.text} (at {msg.time})
                    </Text>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
                <View style={styles.fabContainer}>
                    <Ionicons name="chatbox-ellipses" size={24} color={'white'} />
                </View>
            </TouchableOpacity>
        </View>
    );
};



export default ChatScreen;
