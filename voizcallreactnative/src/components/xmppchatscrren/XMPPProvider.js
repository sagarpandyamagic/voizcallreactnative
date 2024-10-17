import React, { createContext, useState, useEffect, useCallback } from 'react';
import XMPPClientManager from '../../services/XMPPClientManager';

export const XMPPContext = createContext();

export const XMPPProvider = ({ children }) => {
    const [xmppManager, setXmppManager] = useState(null);
    const [roster, setRoster] = useState([]);
    const [messages, setMessages] = useState({});
    const [presences, setPresences] = useState({});
    const [groupMessages, setGroupMessages] = useState({});


    const sendMediaMessage = useCallback((to, base64Data, mimeType) => {
        if (xmppManager) {
            const cid = `image_${Date.now()}`;
            const message = xml(
                'message',
                { to, type: 'chat' },
                xml('body', {}, 'Sent an image'),
                xml(
                    'x',
                    { xmlns: 'jabber:x:oob' },
                    xml('url', {}, `cid:${cid}`)
                ),
                xml(
                    'data',
                    { xmlns: 'urn:xmpp:bob', cid, type: mimeType },
                    base64Data
                )
            );

            xmppManager.sendStanza(message);

            setMessages(prevMessages => ({
                ...prevMessages,
                [to]: [
                    ...(prevMessages[to] || []),
                    {
                        from: 'Me',
                        type: 'test',
                        content: `data:${mimeType};base64,${base64Data}`,
                        time: new Date().toLocaleString(),
                    }
                ]
            }));
        }
    }, [xmppManager]);


    const sendImage = useCallback(async (to, imageUri) => {
        console.log('imageUri', imageUri)
        if (xmppManager) {
            try {
                const uploadedUrl = await xmppManager.sendImage(to, imageUri);
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [to]: [
                        ...(prevMessages[to] || []),
                        {
                            from: 'Me',
                            type: 'image',
                            text: uploadedUrl,
                            content: uploadedUrl,
                            time: new Date().toLocaleString()
                        }
                    ]
                }));
            } catch (error) {
                console.error('Error sending image:', error);
                // Handle error (e.g., show an error message to the user)
            }
        }
    }, [xmppManager]);


    const sendFile = useCallback(async (dic) => {
        const {to} = dic
        if (xmppManager) {
            try {
                const uploadedUrl = await xmppManager.sendFile(dic);
                console.log("fileURL:",uploadedUrl)
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [to]: [
                        ...(prevMessages[to] || []),
                        {
                            from: 'Me',
                            type: 'image',
                            text: uploadedUrl,
                            content: uploadedUrl,
                            time: new Date().toLocaleString()
                        }
                    ]
                }));
            } catch (error) {
                console.error('Error sending image:', error);
                // Handle error (e.g., show an error message to the user)
            }
        }
    }, [xmppManager]);


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
            const fromJID = message.from.split('/')[0];
            const isImage = message.text.startsWith('https://') && message.text.includes('/upload/');
            const newMessage = isImage
                ? { ...message, type: 'image', content: message.text }
                : message;
            return {
                ...prevMessages,
                [fromJID]: [
                    ...(prevMessages[fromJID] || []),
                    newMessage
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
            sendMediaMessage,
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
            sendMediaMessage,
            sendImage,
            sendFile,
            fetchRoster: xmppManager?.fetchRoster
        }}>
            {children}
        </XMPPContext.Provider>
    );
};