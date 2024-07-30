import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Linking, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { THEME_COLORS } from '../../HelperClass/Constant';

const AppURL = () => {
    const storeUrl =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/us/app/your-app/id1234567890'
        : 'https://play.google.com/store/apps/details?id=com.yourapp';
    Linking.openURL(storeUrl);
  };

const UpdateApp = () => {
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchUpdateStatus = async () => {
            const updateAvailable = true
            setIsUpdateAvailable(updateAvailable);
            if (updateAvailable) {
                setIsModalVisible(true);
            }
        };
        fetchUpdateStatus();
    }, []);

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Welcome to the App!</Text>
        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>A new version of the app is available!</Text>
            <TouchableOpacity style={styles.updateButton} onPress={UpdateApp}>
              <Text style={styles.buttonText}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        fontSize: 18,
        marginBottom: 20,
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      modalText: {
        fontSize: 16,
        marginBottom: 20,
      },
      updateButton: {
        backgroundColor: THEME_COLORS.black, // Change to your desired color
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
      },
});

export default UpdateApp;
