import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import { React, useState, useEffect } from 'react';
const { width, height } = Dimensions.get('window')
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import usecreateUA from '../hook/usecreateUA';
import ic_OutgoingCall from '../../Assets/outgoing.png';
import ic_IncomeingCall from '../../Assets/incoming.png';
import ic_MissedCall from '../../Assets/missedCall.png';
import ic_CallDirect from '../../Assets/ic_call1.png';
import CallLogTimeFistLetterFind from './CallLogTimeFistLetterFind';
import CallLogTimeNameFind from './CallLogTimeNameFind';

const CallLogDetails = ({ navigation }) => {
    const route = useRoute();
    const { data } = route.params;
    console.log("data", data[Object.keys(data)[0]])
    const { makeCall } = usecreateUA()

    const DateFormateChange = (item) => {
        const date = new Date(item.item);
        var formattedDate = format(date, "d MMM, yyyy h:mm a");
        return <Text style={{ fontSize: 14, color: 'black', marginTop: 10, marginLeft: 5 }}>{
            formattedDate} </Text>
    }

    const CallTypeImage = (item) => {
        const date = item.item;
        console.log("date",date)
        if (date == "OutGoing") {
            return <Image source={ic_OutgoingCall}></Image>
        } else if (date == "Incomging") {
            return <Image source={ic_IncomeingCall}></Image>
        } else {
            return <Image source={ic_MissedCall}></Image>
        }
    }

    const DurationSetForamte =(item) =>{
        const date = item.item;
        var myArray = date.split(':');
       return <Text style={{ fontSize: 12, color: 'black', marginTop: 5, marginLeft: 5, marginBottom: 10 }}>{myArray[0]+`h: `+myArray[1]+`m: `+myArray[2]+'s'}</Text>
    }

    return (
        <View style={style.mainViewContain}>
            <View style={style.viewInfo}>
                <View style={{ backgroundColor: '#4F6EB4', height: 100, width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 100 / 2 }}>
                    <CallLogTimeFistLetterFind number={Object.keys(data)[0]} isFontSizeBig={80}/>
                </View>
            </View>
            <View style={[{ backgroundColor: 'rgb(233,240,250)', marginLeft: 15,marginRight:15,flexDirection: 'row', alignContent: 'center' }, style.shadowProp]}>
                <View style={{flex:1}}>
                     <CallLogTimeNameFind  number={Object.keys(data)[0]} count={1} hideCountForDetailSection={true}/>
                    <Text style={{ fontSize: 12, color: 'black', marginTop: 5, marginLeft: 15, marginBottom: 10 }}>{Object.keys(data)[0]}</Text>
                </View>
                <View style={{ backgroundColor: '#FFFFFF',height:50,width:50,marginTop: 10,marginRight:10,borderRadius:25,marginBottom:10}}>
                    <TouchableOpacity style={{justifyContent: 'center',flex:1,alignItems:'center'}} onPress={() => {
                        const str = (data[Object.keys(data)[0]][0].number).replace(/[^a-z0-9,. ]/gi, '');
                        makeCall(str.replace(/ /g, ''))
                        navigation.navigate('Dialpad')
                    }}>
                        <Image source={ic_CallDirect}></Image>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[style.viewList, style.shadowProp]}>
                <FlatList
                    data={data[Object.keys(data)[0]]}
                    renderItem={({ item }) =>
                        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                            <View style={[{ flex: 1, marginLeft: 5 }]}>
                                <DateFormateChange item={item.current_time} />
                                <DurationSetForamte item={item.duration} />
                            </View>
                            <View style={{ justifyContent: 'center', marginRight: 15 }}>
                                <CallTypeImage item={item.direction} />
                            </View>
                        </View>
                    }
                />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    mainViewContain: {
        flex: 1,
    },
    viewInfo: {
        height: 150,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    viewList: {
        flex: 1,
        margin: 15,
        backgroundColor: '#FFFFFF',
    },
    viewDownSide: {
        height: 90,
        backgroundColor: '#FFFFFF',
        marginBottom: 5

    },
    shadowProp: {
        shadowOffset: { width: -2, height: 4 },
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
        borderRadius: 10
    }
})

export default CallLogDetails