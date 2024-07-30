import React, { useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import EnterPriseListDesign from './EnterPriseListDesign';
import { GETAPICALL } from '../../../services/auth';
import { APIURL } from '../../../HelperClass/APIURL';


const list = [
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Syah', status: 'Active', time: '9:14 PM', date: '1 Dec 2018' },
    { name: 'Izzat', status: 'Active', time: '8:15 PM', date: '1 Jan 2018' },
    { name: 'Ali', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Abu', status: 'Active', time: '8:11 PM', date: '1 Jan 2018' },
    { name: 'Fitri', status: 'Active', time: '8:20 PM', date: '1 Jan 2018' },
    { name: 'Armi', status: 'Active', time: '8:33 PM', date: '1 Jan 2018' },
    { name: 'Eidit', status: 'Active', time: '9:10 PM', date: '1 Jan 2018' },
    { name: 'Hamdan', status: 'Active', time: '10:10 PM', date: '1 Jan 2018' },
    {
        name: 'Muhyiddeen',
        status: 'Blocked',
        time: '10:10 PM',
        date: '9 Feb 2018',
    },
];



const EnterPriseList = () => {

    const EnterpriceListAPI = async () => {
        const data = await  GETAPICALL(APIURL.EnterPriseContact)
        if (data.success){

        }else{
            Alert.alert(
                'Alert!',
                `${data.message}`,
                [
                    {
                        text: 'cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Ok',
                        onPress: async () => {
                        },
                    },
                ],
            );
        }
        console.log(EnterpriceContact)
    }

    useEffect(() => {
        // EnterpriceListAPI()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={list}
                renderItem={({ item }) =>
                    <EnterPriseListDesign />
                }
            />
        </View>
    );
};
const styles = StyleSheet.create({

});
export default EnterPriseList;
