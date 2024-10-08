import { client, xml } from '@xmpp/client';
import { Platform } from 'react-native';

const XMPPClientManager = ({ username, password, onMessageReceived, onRosterUpdate }) => {
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
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const body = stanza.getChildText('body');
            if (body) {
                onMessageReceived({ from: stanza.attrs.from, text: body, time: new Date().toLocaleString() });
            }
        }
    });

    xmpp.on('error', (error) => {
        console.error('Error:', error);
    });

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

    return { connect, disconnect, sendMessage };
};

export default XMPPClientManager;
