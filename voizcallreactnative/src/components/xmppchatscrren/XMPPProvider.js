import React, { createContext, useState, useEffect, useCallback } from 'react';
import XMPPClientManager from '../../services/XMPPClientManager';

export const XMPPContext = createContext();

export const XMPPProvider = ({ children }) => {
    const [xmppManager, setXmppManager] = useState(null);
    const [roster, setRoster] = useState([]);
    const [messages, setMessages] = useState({});
    const [presences, setPresences] = useState({});
    const [groupMessages, setGroupMessages] = useState({});


    const onGroupMessageReceived = useCallback((message) => {
        console.log('Group message received:', message);
        setGroupMessages(prevMessages => ({
            ...prevMessages,
            [message.roomJid]: [...(prevMessages[message.roomJid] || []), message]
        }));
    }, []);

    const sendGroupMessage = useCallback((roomJid, text) => {
        if (xmppManager) {
            xmppManager.sendGroupMessage(roomJid, text);
            setGroupMessages(prevMessages => ({
                ...prevMessages,
                [roomJid]: [...(prevMessages[roomJid] || []), { from: 'Me', text, time: new Date().toLocaleString() }]
            }));
        }
    }, [xmppManager]);

    const joinRoom = useCallback((roomJid, nickname) => {
        if (xmppManager) {
            xmppManager.joinRoom(roomJid, nickname);
        }
    }, [xmppManager]);


    const onMessageReceived = useCallback((message) => {
        console.log('Message received:', message);
        setMessages(prevMessages => {
            const fromJID = message.from.split('/')[0]; // Remove resource part if present
            return {
                ...prevMessages,
                [fromJID]: [
                    ...(prevMessages[fromJID] || []),
                    {
                        from: fromJID,
                        text: message.text,
                        time: new Date().toLocaleTimeString(),
                    }
                ]
            };
        });
    }, []);

    const onRosterUpdate = useCallback((rosterItems) => {
        setRoster(rosterItems);
        console.log('Roster updated:', rosterItems);
    }, []);

    const onPresenceUpdate = useCallback((presence) => {
        console.log('Presence update received:', presence);
        setPresences(prev => ({
            ...prev,
            [presence.from]: presence.status
        }));
    }, []);

    useEffect(() => {
        const manager = XMPPClientManager({
            username: 'sagar2',
            password: '123456',
            onMessageReceived,
            onRosterUpdate,
            onPresenceUpdate,
        });
        setXmppManager(manager);
        manager.connect();

        return () => {
            if (manager) {
                manager.disconnect();
            }
        };
    }, []);

    const sendMessage = useCallback((to, text) => {
        if (xmppManager) {
            xmppManager.sendMessage(to, text);
            setMessages(prevMessages => ({
                ...prevMessages,
                [to]: [
                    ...(prevMessages[to] || []),
                    {
                        from: 'Me',
                        text,
                        time: new Date().toLocaleTimeString(),
                    }
                ]
            }));
        }
    }, [xmppManager]);

    return (
        <XMPPContext.Provider value={{ 
            roster,
            presences,
            messages,
            sendMessage,
            groupMessages, 
            sendMessage, 
            sendGroupMessage, 
            joinRoom,
            fetchRoster: xmppManager?.fetchRoster 
          }}>
            {children}
        </XMPPContext.Provider>
    );
};