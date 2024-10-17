import { client, xml } from '@xmpp/client';
import axios from 'axios';
import { Alert, Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';
import { format } from 'date-fns';
import { decode } from 'base-64'; // Import the decode function from base-64


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
            await checkDiscoInfo(); // Check disco info upon connection

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
        // if (stanza.is('message')) {
        //     const body = stanza.getChildText('body');
        //     if (body) {
        //         const from = stanza.attrs.from;
        //         const type = stanza.attrs.type;
        //         const time = new Date().toLocaleString();

        //         if (type === 'groupchat') {
        //             onGroupMessageReceived({ from, text: body, time, roomJid: from.split('/')[0] });
        //         } else if (type === 'chat') {
        //             onMessageReceived({ from, text: body, time });
        //         }
        //     }
        // }
        if (stanza.is('message')) {
            const body = stanza.getChildText('body');
            const from = stanza.attrs.from;
            const time = new Date().toLocaleString();

            // Check for image content
            const bobData = stanza.getChild('data', 'urn:xmpp:bob');
            if (bobData) {
                const cid = bobData.attrs.cid;
                const mimeType = bobData.attrs.type;
                const base64Data = bobData.text();
                onMessageReceived({
                    from,
                    type: 'image',
                    content: `data:${mimeType};base64,${base64Data}`,
                    time
                });
            } else if (body) {
                onMessageReceived({ from, text: body, time });
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

        console.log('Received stanza:', stanza.toString()); // Log the entire stanza

        if (stanza.is('iq') && stanza.attrs.type === 'result' && stanza.attrs.id === 'upload_slot_request') {
            const query = stanza.getChild('query', 'http://jabber.org/protocol/disco#info');
            if (query) {
                console.log('Upload slot query received:', query.toString());

                // Look for the upload URL node
                const uploadUrlNode = query.getChild('upload-url'); // Replace with actual node name
                if (uploadUrlNode) {
                    const uploadUrl = uploadUrlNode.text();
                    console.log('Upload URL:', uploadUrl);
                    // Store or use the upload URL as needed
                } else {
                    console.warn('Upload URL node not found in response.');
                }
            } else {
                console.warn('No <query> element found in the upload slot response.');
            }
        }

        if (stanza.is('iq') && stanza.attrs.id === 'upload') {
            const slot = stanza.getChild('slot', 'urn:xmpp:http:upload:0');
            if (slot) {
                const putUrl = slot.getChildText('put');
                const getUrl = slot.getChildText('get');
                if (putUrl && getUrl) {
                    console.log('Upload URL:', putUrl);
                    console.log('Download URL:', getUrl);
                } else {
                    console.error('Upload URLs missing in response');
                }
            }
        }

    });

    const checkDiscoInfo = async () => {
        const iq = xml('iq', { type: 'get', to: 'upload.xmpp.voizcall.com', id: 'disco_info_request' },
            xml('query', { xmlns: 'http://jabber.org/protocol/disco#info' })
        );

        try {
            // Send the disco info request
            const response = await xmpp.iqCaller.request(iq);
            console.log('Disco info response received:', response.toString());

            // Parse the response to check supported features
            if (response.is('iq') && response.attrs.type === 'result') {
                const query = response.getChild('query');
                if (query) {
                    const features = query.getChildren('feature');
                    features.forEach(feature => {
                        console.log('Supported feature:', feature.attrs.var);
                    });
                } else {
                    console.warn('No <query> element found in the disco info response.');
                }
            } else {
                console.warn('Unexpected response:', response.toString());
            }
        } catch (error) {
            console.error('Error checking disco info:', error);
        }
    };

    xmpp.on('error', (error) => {
        console.error('Error:', error);
    });

    xmpp.on('online', async (address) => {
        console.log('Connected as', address.toString());
        // await requestUploadSlot('upload.xmpp.voizcall.com'); // Replace with actual upload service JID if different

    });


    const requestUploadSlot = async (uploadServiceJID, filename, filesize) => {
        const iq = xml('iq', { type: 'get', to: uploadServiceJID, id: 'upload_slot_request' },
            xml('request', { xmlns: 'urn:xmpp:http:upload:0', filename: filename, size: filesize })
        );
        try {
            console.log('Sending upload slot request:', iq.toString());
            const response = await xmpp.iqCaller.request(iq);
            
            // Log the full response for troubleshooting
            console.log('Upload slot response received:', response.toString());

            const slot = response.getChild('slot', 'urn:xmpp:http:upload:0');
            if (slot) {
                // Retrieve the <put> and <get> elements
                const putElement = slot.getChild('put');
                const getElement = slot.getChild('get');

                // Debugging: log if elements are found
                console.log('PUT Element:', putElement);
                console.log('GET Element:', getElement);

                // Extract the URLs directly from the attributes
                const putUrl = putElement ? putElement.attrs.url : null;
                const getUrl = getElement ? getElement.attrs.url : null;

                // Debugging: log the URLs
                console.log('PUT URL:', putUrl);
                console.log('GET URL:', getUrl);

                // Return the URLs if both are found
                if (putUrl && getUrl) {
                    return { putUrl, getUrl };
                } else {
                    console.error('PUT or GET URL missing in the upload slot response.');
                    return null;
                }
            } else {
                console.error('No <slot> element found in the response.');
            }
        } catch (error) {
            console.error('Error requesting upload slot:', error);
            throw error;
        }
    }

    const sendImage = async (to, imageUri) => {
        const fileInfo = await RNFS.stat(imageUri); // Get file info
        const filename = imageUri.split('/').pop(); // Extract filename
        const filesize = fileInfo.size; // Get file size

        const uploadResponse = await requestUploadSlot('upload.xmpp.voizcall.com', filename, filesize);
        console.log('uploadResponse', uploadResponse)

        if (uploadResponse) {
            console.log('putUrl', uploadResponse.putUrl)
            if (uploadResponse.putUrl) {
                await uploadImage(uploadResponse.putUrl, imageUri, to);
                return uploadResponse.putUrl
            }
        }
    };

    const uploadImage = async (uploadUrl, imagePath, recipient) => {
        try {
            // Read the image file as binary data (base64 is not needed here)
            const fileData = await RNFS.readFile(imagePath, 'base64'); // Read the image as base64

            // Convert the Base64 data to a Blob to handle the PUT request properly
            const binaryData = Uint8Array.from(decode(fileData), c => c.charCodeAt(0));

            // Make the PUT request to upload the image
            const response = await fetch(uploadUrl, {
                method: 'PUT',
                body: binaryData, // Send binary data
                headers: {
                    'Content-Type': 'image/jpeg', // Set appropriate content type
                    'Content-Length': binaryData.length, // Set content length of binary data
                },
            });

            // Check if the upload was successful
            if (response.ok) {
                const imageUrl = uploadUrl; // Use the same URL to access the image
                console.log('Image uploaded successfully:', imageUrl);

                // Send the image URL in the message
                sendMessageImage(imageUrl, recipient);
            } else {
                // Log the error if the upload fails
                console.error('Error uploading image:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };


    const sendMessageImage = async (imageUrl, recipient) => {
        const message = xml('message', { to: recipient, type: 'chat' },
            xml('body', {}, imageUrl) // The image URL is the body of the message
        );
        try {
            await xmpp.send(message);
            console.log('Message sent with image URL:', imageUrl);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }



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

    return { connect, disconnect, sendMessage, sendGroupMessage, joinRoom, sendImage };
};

export default XMPPClientManager;
