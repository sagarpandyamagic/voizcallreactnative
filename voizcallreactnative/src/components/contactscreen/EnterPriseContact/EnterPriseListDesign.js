import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';`1`
import ic_user from '../../../../Assets/ic_user.png';
import ic_call from '../../../../Assets/ic_call.png';
import ic_videoCall from '../../../../Assets/ic_videoCall.png';
import { AppCommon_Font, THEME_COLORS } from '../../../HelperClass/Constant';
import SeparatorLine from '../../../HelperClass/SeparatorLine';

``
const EnterPriseListDesign = ({ onRemove }) => {
    return (
        <View style={{ margin: 4, borderRadius: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                }
                }>
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: THEME_COLORS.black, marginLeft: 10, height: 40, width: 40, borderRadius: 20 }}>
                        <Image style={{ height: '50%', width: '50%', tintColor: 'white' }}
                            source={ic_user}
                        >
                        </Image>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginLeft: 15, marginTop: 5, fontFamily: AppCommon_Font.Font, fontWeight: 'bold' }} >Call Agent 2</Text>
                        <Text style={{ marginLeft: 15, marginTop: 5, marginBottom: 10, fontFamily: AppCommon_Font.Font }}>26/05/2014 11:45:03</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <SeparatorLine color={'black'} thickness={0.5} marginVertical={0} />
        </View>
    );
};
export default EnterPriseListDesign;
