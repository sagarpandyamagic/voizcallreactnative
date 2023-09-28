import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    Linking,
    Modal, Pressable
} from 'react-native';
import { React, useState } from 'react';
import { SectionList } from 'react-native';

import Logo from '../Assets/voizcall_icon_rectangle.png';
import LogoAccount from '../Assets/user_setting.png';
import LogoBlock from '../Assets/blocknumbers.png';
import LogOut from '../Assets/logout1.png';
import { useSelector } from 'react-redux';
import { C } from 'sip.js/lib/core';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width } = Dimensions.get('window')

const Logowidth = width * 0.18
const SettingLogowidth = width * 0.1


const DATA = [
    {
        title: 'ACCOUNT',
        data: [
            //     {
            //     id: 1,
            //     name: 'My Account',
            //     source: LogoAccount
            // },
            {
                id: 2,
                name: 'Bloack Contact',
                source: LogoBlock
            },
            {
                id: 3,
                name: 'Logout',
                source: LogOut
            }
        ],
    },
    {
        title: 'REVIEW',
        data: [{
            id: 1,
            name: 'FeedBack',
            source: LogoAccount
        },
        {
            id: 2,
            name: 'Rate VoizCall',
            source: LogoAccount
        },
        ],
    },
    {
        title: 'LEGAL',
        data: [{
            id: 1,
            name: 'Terms of Service',
            source: LogoAccount
        },
        {
            name: 'Privacy Policy',
            source: LogoAccount
        },
        ],
    }
];

const Setting = ({ navigation }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const { UserName } = useSelector((state) => state.sip)

    const LogoutPopup = () => {
        <SafeAreaView>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    }

    const Item = ({ title, source, navi }) => (
        <TouchableOpacity style={style.item}
            onPress={() => ButtonAction(title, navi)}
        >
            <Image style={{ width: SettingLogowidth, height: SettingLogowidth, marginLeft: 10 }} source={source} />
            <Text style={style.title}>{title}</Text>
        </TouchableOpacity>
    );

    const ButtonAction = (title, navi) => {
        if (title == "Terms of Service") {
            navigation.navigate('WebViewScreen', { url: 'https://reactnative.dev/' })
        } else if (title == "Privacy Policy") {
            navigation.navigate('WebViewScreen', { url: 'https://reactnative.dev/' })
        } else if (title === "FeedBack") {
            navigation.navigate('Feedback')
        } else if (title === "Rate VoizCall") {
            Linking.openURL('https://apps.apple.com/us/app/voizcall/id6447302483')
        } else if (title === "Logout") {
            setModalVisible(true)
        } else if (title == "Bloack Contact") {
            navigation.navigate('BlockContact')
        }
        else {
            console.log(title)
        }
    }

    const userDataRemvoe = async () => {
        try {
            const value = await AsyncStorage.removeItem("is_live");
            console.log("is_live", value)
            try {
                const valuelog = await AsyncStorage.removeItem("callLog");
                console.log("callLog", valuelog)
                navigation.navigate("Home")
                setModalVisible(!modalVisible)
            } catch (e) {
            }
        } catch (e) {
        }
    }

    const BackToHomeScreen = () => {
        userDataRemvoe()
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(16,94,174,1)', flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: Logowidth, height: Logowidth, resizeMode: 'cover', borderRadius: Logowidth / 2 }} source={Logo} />
                </View>
                <View style={{ flex: 3, flexDirection: 'column', justifyContent: 'center', marginVertical: 0 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>
                        VoizCall User
                    </Text >
                    <Text style={{ fontSize: 20, marginTop: 10, color: '#ffffff' }}>
                        {UserName}
                    </Text>
                </View>
            </View>
            <View style={{ flex: 3, backgroundColor: '#ffffff' }}>
                <SectionList
                    sections={DATA}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => <Item title={item.name} source={item.source} navi={navigation} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={style.header}>{title}</Text>
                    )}
                />
            </View>
            {
                modalVisible ?
                    <View>
                        <View style={styles.centeredView}>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setModalVisible(!modalVisible);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalText}>Log Out!</Text>
                                        <Text style={styles.modalText}>Are you sure want to logout?</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                                            <Pressable
                                                style={[styles.button, styles.buttonClose]}
                                                onPress={() => setModalVisible(!modalVisible)}>
                                                <Text style={styles.textStyle}>Cancel</Text>
                                            </Pressable>
                                            <Pressable
                                                style={[styles.button, styles.buttonOpen]}
                                                onPress={BackToHomeScreen}
                                            // onPress={
                                            //     () => {
                                            //         navigation.navigate("Home")
                                            //         setModalVisible(!modalVisible)
                                            //     }

                                            // }
                                            >
                                                <Text style={styles.textStyle}>Yes</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </View>
                    : null
            }

        </View>
    )
}

const style = StyleSheet.create({
    container: {
        // flex: 1,
        marginHorizontal: 16
    },
    item: {
        padding: 5,
        marginVertical: 0,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header: {
        fontSize: 12,
        backgroundColor: "#d3d3d3",
        padding: 5,
        fontWeight: 'normal',
        paddingLeft: 15
    },
    title: {
        fontSize: 13,
        marginLeft: 15
    }
})

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "60%",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginHorizontal: 15,
        fontSize: 15,
    },
    buttonOpen: {
        backgroundColor: '#ffff',
        borderRadius: 10,
        borderColor: 'rgba(16,94,174,1)',
        borderWidth: 1,
        width: "50%",
    },
    buttonClose: {
        backgroundColor: '#fff',
        elevation: 0,
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});


export default Setting