import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native'; `1`
import ic_user from '../../../Assets/ic_user.png';
import ic_call from '../../../Assets/ic_call.png';
import ic_videoCall from '../../../Assets/ic_videoCall.png';
import incoming from '../../../Assets/incoming.png';
import outgoing from '../../../Assets/outgoing.png';
import missedCall from '../../../Assets/missedCall.png';
import ic_delete from '../../../Assets/ic_delete.png';


import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import SeparatorLine from '../../HelperClass/SeparatorLine';
import { updateSipState } from '../../store/sipSlice';
import { useDispatch, useSelector } from 'react-redux';
import SipUA from '../../services/call/SipUA';
import RNCallKeep from 'react-native-callkeep';
import Contacts from 'react-native-contacts';


const CallLogList = ({ data,onDelete,navigation,videoCall}) => {
    const [image, setImage] = useState(null);
    const dispatch = useDispatch()
    const {ISConfrenceTransfer,phoneNumber,allSession} = useSelector((state)=>state.sip)
    let [contact, setContact] = useState([]);
    console.log("CallLogList",data)

    const DataFormateChagne = ({ CallData }) => {
        const dateStr = CallData;
        const date = new Date(dateStr);

        // Extract the components
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Format the date
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return <Text style={{ marginLeft: 15, marginTop: 5, marginBottom: 10, fontFamily: AppCommon_Font.Font }}>{formattedDate}</Text>
    }
    useEffect(()=>{
        if (data.call_direction == "OUTBOUND") {
            setImage(incoming)
        }
        else if (data.call_direction == "INBOUND") {
            setImage(outgoing)
        }
        else {
            setImage(missedCall)
        }
    },[data.call_direction])

    const AudioCall = () => {
        dispatch(updateSipState({ key: "Caller_Name", value: data.callee }))
        dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
        // console.log("SessionCount",allSession)
        if(Object.keys(allSession).length > 0){
            dispatch(updateSipState({ key: "ISConfrenceTransfer", value: true }))
            SipUA.toggelHoldCall(true) 
        }else{
            dispatch(updateSipState({ key: "phoneNumber", value: [] }))
        }
        SipUA.makeCall(data.callee, false)
        navigation.navigate('AudioCallingScreen')
    }

    useEffect(() => {
        if (data.callee) {
            Contacts.checkPermission().then((permission) => {
              if (permission === 'authorized') {
                findContactByNumber(data.callee);
              } else {
                Contacts.requestPermission().then((newPermission) => {
                  if (newPermission === 'authorized') {
                    findContactByNumber(data.callee);
                  } else {
                    console.warn('Contacts permission not granted');
                  }
                });
              }
            });
          }
    }, [data.callee,findContactByNumber]);
    
    const contactName = contact ? `${contact.givenName || ''} ${contact.familyName || ''}`.trim() : data.callee;

    const findContactByNumber = useCallback(async (phoneNumber) => {
        try {
            const contacts = await Contacts.getAll();
            const foundContact = contacts.find(contact => 
                contact.phoneNumbers.some(phone => 
                    phone.number.replace(/[^0-9]/g, '').includes(phoneNumber.replace(/[^0-9]/g, ''))
                )
            );
            if (foundContact) {
                if (foundContact.hasThumbnail) {
                    foundContact.image = { uri: foundContact.thumbnailPath };
                }
                setContact(foundContact);
            } else {
                console.warn('Contact not found');
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to load contacts');
            console.error('Error loading contacts:', e.message);
        }
    }, []);

   

    return (
        <View style={{ margin: 4, borderRadius: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: THEME_COLORS.black, marginLeft: 10, height: 40, width: 40, borderRadius: 20 }}>
                     <Image style={{ height: '50%', width: '50%', tintColor: 'white' }} source={ic_user} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 15, marginTop: 5, fontFamily: AppCommon_Font.Font, fontWeight: 'bold' }}>
                            {contactName === "" ? data.callee : contactName}
                        </Text>
                        {image && <Image style={{ marginLeft: 5, height: 15, width: 15 }} source={image} />}
                    </View>
                    <DataFormateChagne CallData={data.answered_time} />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 5, height: 40, borderRadius: 20, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center' }} onPress={()=>{
                        navigation.navigate('Dialpad')
                        AudioCall()
                    }}>
                        <Image style={{ height: '50%', width: '50%', tintColor: THEME_COLORS.black }} source={ic_call} />
                    </TouchableOpacity>
                     { videoCall && <TouchableOpacity style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ height: '50%', width: '50%', tintColor: THEME_COLORS.black }} source={ic_videoCall} />
                    </TouchableOpacity>
                        }
                    <TouchableOpacity style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center' }} onPress={() => onDelete(data.uuid)}>
                        <Image style={{ height: '50%', width: '50%', tintColor: 'red' }} source={ic_delete} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
        <SeparatorLine color={'black'} thickness={0.5} marginVertical={0} />
    </View>
    );
};
export default CallLogList;
