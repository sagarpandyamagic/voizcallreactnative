import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import XMPPClientManager from '../services/XMPPClientManager';
import ic_plus from '../../Assets/ic_plus.png';
import { XMPPContext } from '../components/xmppchatscrren/XMPPProvider';

const XmppUSerList = ({ navigation }) => {
  const { roster, messages, presences } = useContext(XMPPContext);

  const getStatus = (jid) => {
    console.log('getStatus', presences);
    if (!presences || !presences[jid]) return 'Offline';

    const status = presences[jid];
    if (status === 'online') return 'Online';
    if (status === 'away') return 'Away';
    if (status === 'dnd') return 'Do Not Disturb';
    return 'Offline';
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Button
          title="Join Group Chat"
          onPress={() => navigation.navigate('GroupChatScreen', { roomJid: 'room@conference.xmpp.voizcall.com', roomName: 'Test Room' })}
        />
      </View>
      <ScrollView style={{ marginTop: 20 }}>
        {roster.length > 0 ? (
          roster.map((contact, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('ChatScreen', { contact })}
              style={styles.userList}
            >
              <Image
                source={{ uri: contact.profileImage || 'https://via.placeholder.com/50' }}
                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 15 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#333', fontSize: 18, fontWeight: 'bold' }}>
                  {contact.name}
                </Text>
                <Text style={{ color: '#888', fontSize: 14 }}>
                  {getStatus(contact.jid)}
                </Text>
              </View>
              {(messages[contact.jid] || []).length > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{(messages[contact.jid] || []).length}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text>No contacts available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  fabContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#26A69A',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  userList: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  unreadBadge: {
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
  },
});

export default XmppUSerList;
