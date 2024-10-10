import { client, xml } from '@xmpp/client';
import { Platform } from 'react-native';

const XMPPClientManager = ({ username, password, onMessageReceived, onRosterUpdate, onPresenceUpdate }) => {
    const xmpp = client({
        service: 'wss://xmpp.voizcall.com:5443/ws',
        domain: 'xmpp.voizcall.com',
        username,
        password,
        resource: Platform.OS,
    });

    let isConnected = false;

    const connect = async () => {
        if (isConnected) {
            console.warn('Already connected to XMPP');
            return;
        }
        try {
            await xmpp.start();
            isConnected = true;
            xmpp.send(xml('presence', {}, xml('show', {}, 'chat')));
            fetchRoster();
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    const fetchRoster = async () => {
        try {
            const rosterIQ = xml('iq', { type: 'get' }, xml('query', { xmlns: 'jabber:iq:roster' }));
            const result = await xmpp.iqCaller.request(rosterIQ);
            const rosterItems = result.getChild('query').getChildren('item');
            onRosterUpdate(rosterItems.map(item => ({ jid: item.attrs.jid, name: item.attrs.name || item.attrs.jid })));
        } catch (error) {
            console.error('Failed to fetch roster:', error);
        }
    };

    xmpp.on('stanza', (stanza) => {
        if (stanza.is('message')) {
            const body = stanza.getChildText('body');
            if (body) {
                const from = stanza.attrs.from;
                const type = stanza.attrs.type;
                const time = new Date().toLocaleString();

                if (type === 'groupchat') {
                    onGroupMessageReceived({ from, text: body, time, roomJid: from.split('/')[0] });
                } else if (type === 'chat') {
                    onMessageReceived({ from, text: body, time });
                }
            }
        }
        if (stanza.is('presence')) {
            console.log('Received presence:', stanza.toString());
            const from = stanza.attrs.from;
            const bareJid = from.split('/')[0]; // Get the bare JID
            const type = stanza.attrs.type || 'available';
            const show = stanza.getChildText('show') || 'online';
            const status = stanza.getChildText('status') || '';

            let presenceStatus;
            if (type === 'unavailable') {
                presenceStatus = 'offline';
            } else if (show === 'away' || show === 'xa') {
                presenceStatus = 'away';
            } else if (show === 'dnd') {
                presenceStatus = 'dnd';
            } else {
                presenceStatus = 'online';
            }

            onPresenceUpdate({ from: bareJid, fullJid: from, status: presenceStatus, statusMessage: status });
        }

    });


    xmpp.on('error', (error) => {
        console.error('Error:', error);
    });


    const sendGroupMessage = (roomJid, messageText) => {
        if (!roomJid || !messageText.trim()) {
            console.log('Invalid room JID or empty message');
            return;
        }

        const message = xml(
            'message',
            { to: roomJid, type: 'groupchat' },
            xml('body', {}, messageText)
        );

        xmpp.send(message);
    };

    const joinRoom = (roomJid, nickname) => {
        const presence = xml(
            'presence',
            { to: `${roomJid}/${nickname}` },
            xml('x', { xmlns: 'http://jabber.org/protocol/muc' })
        );

        xmpp.send(presence);
    };

    const disconnect = async () => {
        if (!isConnected) {
            console.warn('Already disconnected from XMPP');
            return;
        }
        try {
            await xmpp.stop();
            isConnected = false;
            console.log('Disconnected from XMPP');
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    };

    const sendMessage = (selectedRecipient, messageText) => {
        if (!selectedRecipient) {
            console.log('Please select a recipient');
            return;
        }
        if (!messageText.trim()) {
            console.log('Please enter a message');
            return;
        }

        const timestamp = new Date().toISOString();
        const message = xml(
            'message',
            { to: selectedRecipient, id: timestamp, type: 'chat' },
            xml('body', {}, messageText),
            xml('TIME', { xmlns: 'urn:xmpp:time' },
                xml('ts', {}, timestamp)
            ),
            xml('request', { xmlns: 'urn:xmpp:receipts' })
        );

        xmpp.send(message);
    };

    return { connect, disconnect, sendMessage , sendGroupMessage, joinRoom,};
};

export default XMPPClientManager;
