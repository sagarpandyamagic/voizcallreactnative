// LogoutModal.js

import React from 'react';
import { View, Text, Button, Modal, StyleSheet, Touchable, Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { THEME_COLORS } from '../../HelperClass/Constant';

const LogoutModal = ({ visible, onClose, onLogout }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.message}>Are you sure you want to log out?</Text>
                    <View style={{ flexDirection: 'row'}}>
                        <Pressable style={styles.cancelButton} onPress={onClose}>
                            <Text>Cancel</Text>
                       </Pressable>
                       <Pressable style={styles.logoutButton} onPress={onLogout}>
                            <Text>yes</Text>
                       </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    message: {
        marginBottom: 20,
        fontSize: 16,
    },
    cancelButton: {
        borderWidth:1,
        borderColor:'black',
        marginRight: 20,
        borderRadius: 5,
        padding: 5,
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:15,
        paddingRight:15
    },
    logoutButton: {
        borderWidth:1,
        borderColor:'black',
        marginLeft: 20,
        borderRadius: 5,
        padding: 5,
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:25,
        paddingRight:25
    },
    button: {
        backgroundColor: 'blue', // Set your desired background color
        borderRadius: 10, // Adjust the border radius as needed
        padding: 10, // Adjust padding as needed
    },
    text: {
        color: 'white', // Text color
        textAlign: 'center',
    },
});

export default LogoutModal;
