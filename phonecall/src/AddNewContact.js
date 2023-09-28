import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Modal, Pressable, FlatList, Alert
} from 'react-native';
import { React, useEffect, useState } from 'react';

import ic_contact_camera from '../Assets/ic_add_contact_camera.png';
import { CountryPicker } from "react-native-country-codes-picker";
import { Dropdown } from 'react-native-element-dropdown';


const { width } = Dimensions.get('window')
const AddNewContact = ({ navigation }) => {
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('');
    const [value, setValue] = useState(null);

    const data = [
        { label: 'Mobile', value: '1' },
        { label: 'Home', value: '2' },
        { label: 'Work', value: '3' },
        { label: 'Other', value: '4' },
    ];


    return (
        <View style={style.maincontains}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={style.ImageView}>
                    <Image source={ic_contact_camera}></Image>
                </View>
            </View>
            <View style={style.InputTextView}>
                <TextInput style={style.InpuText} placeholder='First Name' placeholderTextColor={"#D3D3D3"} onChangeText={(text) => console.log(text)}>
                </TextInput>
            </View>
            <View style={style.InputTextView}>
                <TextInput style={style.InpuText} placeholder='Last Name' placeholderTextColor={"#D3D3D3"} onChangeText={(text) => console.log(text)}>
                </TextInput>
            </View>
            <View style={[style.InputTextView, { borderWidth: 0, flexDirection: 'row' }]}>
                <View style={{
                    flex: 2, height: 50, borderBlockColor: '#4F6EB4',
                    borderWidth: 0.5, borderRadius: 5, justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        onPress={() => setShow(true)}
                        style={{
                        }}
                    >
                        <Text style={{
                            color: 'black',
                            fontSize: 15,
                            paddingLeft: 10
                        }}>
                            { countryCode == "" ? "County Code" : countryCode
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    height: 50, borderBlockColor: '#4F6EB4',
                    borderWidth: 0.5, borderRadius: 5, marginLeft: 15,justifyContent:'center',flex:1
                }}>
                    <Dropdown
                        style={style.dropdown}
                        placeholderStyle={style.placeholderStyle}
                        selectedTextStyle={style.selectedTextStyle}
                        inputSearchStyle={style.inputSearchStyle}
                        iconStyle={style.iconStyle}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Mobile"
                        searchPlaceholder="Search..."
                        value={value}
                        onChange={item => {
                            setValue(item.value);
                        }}
                    />
                </View>
            </View>
            <View style={style.InputTextView}>
                <TextInput style={style.InpuText} placeholder='Phone Number' placeholderTextColor={"#D3D3D3"} onChangeText={(text) => console.log(text)}>
                </TextInput>
            </View>
            <View style={style.InputTextView}>
                <TextInput style={style.InpuText} placeholder='Email Address' placeholderTextColor={"#D3D3D3"} onChangeText={(text) => console.log(text)}>
                </TextInput>
            </View>
            <View style={style.InputTextView}>
                <TextInput style={style.InpuText} placeholder='Company' placeholderTextColor={"#D3D3D3"} onChangeText={(text) => console.log(text)}>
                </TextInput>
            </View>
            <View style={style.InputTextView}>
                <TextInput style={style.InpuText} placeholder='Occupation' placeholderTextColor={"#D3D3D3"} onChangeText={(text) => console.log(text)}>
                </TextInput>
            </View>
            <View style={[style.InputTextView, { borderWidth: 0, paddingTop: 10 }]}>
                <TouchableOpacity style={style.Button}>
                    <Text style={{color:"#FFFF"}}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
            <View>
                <CountryPicker
                    show={show}
                    pickerButtonOnPress={(item) => {
                        setCountryCode(item.dial_code + " " + item.name.pt);
                        setShow(false);
                    }}
                />
            </View>



        </View>
    )
}

const style = StyleSheet.create({
    dropdown: {
        margin: 10,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    maincontains: {
        flex: 1,
    },
    InputTextView: {
        borderBlockColor: 'black',
        borderWidth: 0.5,
        marginTop: 20,
        marginHorizontal: 20,
        height: 50,
        borderRadius: 5
    },
    InpuText: {
        marginLeft: 15, height: "100%", color: "black"
    },
    InputTextSideImgView: {
        backgroundColor: '#E8F1FF',
        width: "12%",
        height: "99%",
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    Button: {
        flex: 1,
        backgroundColor: '#4F6EB4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    ImageView: {
        height: 80,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        borderWidth: 0.5,
        borderColor: 'black',
    }
})


export default AddNewContact