import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Button, PermissionsAndroid, KeyboardAvoidingView,ScrollView, TextInput } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import ic_user from '../../../Assets/ic_user.png';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

const AddNewContact = () => {
    const [imageUri, setImageUri] = useState(null);
    const [FName, setFName] = useState(null);
    const [LName, setLName] = useState(null);
    const [PhoneNumber, setPhoneNumber] = useState(null);
    const [Email, setEmail] = useState(null);
    const [PostAdd, setPostAdd] = useState(null);

    const options = [
        'Cancel',
        'Camera',
        'Photo Gallery',
    ]

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const readGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "Storage Permission",
                    message: "App needs access to your storage to select photos",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            const cameraGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "App needs access to your camera to take photos",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            return readGranted === PermissionsAndroid.RESULTS.GRANTED &&
                cameraGranted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            return true;
        }
    };

    const selectImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            Alert.alert('Permission required', 'Storage and camera permissions are required to select or take an image.');
            return;
        }

        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorCode);
                } else if (response.assets && response.assets.length > 0) {
                    const uri = response.assets[0].uri;
                    setImageUri(uri);
                }
            }
        );
    };

    const takePhoto = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            Alert.alert('Permission required', 'Storage and camera permissions are required to select or take an image.');
            return;
        }

        launchCamera(
            {
                mediaType: 'photo',
                includeBase64: false,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled camera');
                } else if (response.errorCode) {
                    console.log('Camera Error: ', response.errorCode);
                } else if (response.assets && response.assets.length > 0) {
                    const uri = response.assets[0].uri;
                    setImageUri(uri);
                }
            }
        );
    };

    const showActionSheet = () => {
        this.ActionSheet.show()
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainViewContain}>
                    <TouchableOpacity onPress={showActionSheet} style={styles.viewInfo}>
                        {
                            imageUri ? (
                                <Image source={{ uri: imageUri }} resizeMode="cover" style={[styles.image]} />
                            ) : <Image source={ic_user} style={[styles.image, { tintColor: 'white', width: '80%', height: '80%' }]} />
                        }
                    </TouchableOpacity>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={<Text style={{ color: '#000', fontSize: 18 }}>Which one do you like?</Text>}
                        options={options}
                        cancelButtonIndex={0}
                        destructiveButtonIndex={4}
                        onPress={(index) => {
                            if (index == 0) {
                                selectImage()
                            } else if (index == 1) {
                                takePhoto()
                            }
                        }}
                    />
                    <View style={styles.viewList}>
                        <View style={styles.InputTextView}>
                            <TextInput style={styles.InpuText} placeholder='Enter First Name' placeholderTextColor={THEME_COLORS.black} onChangeText={(text) => setFName(text)}>
                            </TextInput>
                        </View>
                        <View style={styles.InputTextView}>
                            <TextInput style={styles.InpuText} placeholder='Enter Last Name' placeholderTextColor={THEME_COLORS.black} onChangeText={(text) => setLName(text)}>
                            </TextInput>
                        </View>
                        <View style={styles.InputTextView}>
                            <TextInput style={styles.InpuText} placeholder='Enter Phone Number' placeholderTextColor={THEME_COLORS.black} keyboardType='phone-pad' onChangeText={(text) => setPhoneNumber(text)}>
                            </TextInput>
                        </View>
                        <View style={styles.InputTextView}>
                            <TextInput style={styles.InpuText} placeholder='Enter Email' placeholderTextColor={THEME_COLORS.black} keyboardType='email-address' onChangeText={(text) => setEmail(text)}>
                            </TextInput>
                        </View>
                        <View style={styles.InputTextView}>
                            <TextInput style={styles.InpuText} placeholder='Enter Postal Addres' placeholderTextColor={THEME_COLORS.black} onChangeText={(text) => setPostAdd(text)}>
                            </TextInput>
                        </View>
                        <View style={[styles.ButtonVw]}>
                            <Text style={[styles.buttonText, { alignSelf: 'center', color: 'white', fontSize: 20 }]}>
                                Submit
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>


    );
};
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    mainViewContain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewInfo: {
        height: 80,
        width: 80,
        backgroundColor: THEME_COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        margin: 15,
        // paddingTop: 15,
    },
    viewList: {
        flex: 1,
        width: '90%'
        // margin: 15,
    },
    InputTextView: {
        borderBlockColor: THEME_COLORS.black,
        borderWidth: 0.5,
        marginTop: 20,
        marginHorizontal: 20,
        flexDirection: 'row',
        height: 50,
        borderRadius: 5,
        fontFamily: AppCommon_Font.Font,
        width:'100%'
    },
    ButtonVw: {
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginHorizontal: 20,
        // Android shadow
        elevation: 5,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        backgroundColor: THEME_COLORS.black, justifyContent: 'center'
    },
    InpuText: {
        marginLeft: 15,
        height: "100%",
        color: THEME_COLORS.black,
        flex: 1,
        fontFamily: AppCommon_Font.Font,
        fontSize: 18 // Specify the custom font here
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 40
    },
    actionSheetContainer: {
        padding: 20,
    },
    titleBox: {
        background: 'pink'
    },
    titleText: {
        fontSize: 16,
        color: '#000'
    },

});
export default AddNewContact;