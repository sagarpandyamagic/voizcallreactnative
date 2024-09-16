import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CallLogList from './CallLogList';
import { CDRLAPICALL, GETAPICALL, POSTAPICALL } from '../../services/auth';
import { APIURL } from '../../HelperClass/APIURL';
import LottieView from 'lottie-react-native';
import CallLogDeletePopup from './CallLogDeletePopup';
import LodingJson from '../../HelperClass/LodingJson';
import loadinganimaion from '../../../Assets/animation.json';

const Calllog = ({ DataType, navigation }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    const [uuidItme, setuuidItme] = useState(false);
    const [videoCall, setVideoCall] = useState(false);

    useEffect(() => {
        videoCallEnableCheck()
    }, []);

    const videoCallEnableCheck = async () => {
        const value = await getConfigParamValue(userprofilealias.video_enableVideo)
        if (value) {
            setVideoCall(value)
        }
    }

    const fetchData = async (pageNumber) => {
        setLoading(true);
        try {
            const response = await POSTAPICALL(APIURL.ALLCDR, { "page_num": pageNumber, "call_direction": DataType });
            // console.log(response)
            if (response && response.data.length > 0) {
                setList(prevList => [...prevList, ...response.data]);
            } else {
                setHasMoreData(false);
            }
        }
        catch (e) {
            console.error(e)
        }
        setLoading(false);

    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleLoadMore = () => {
        if (hasMoreData && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleDelete = async () => {
        // console.log('uuid',uuidItme)
        const response = await POSTAPICALL(APIURL.CDRDelte, { "uuid": [uuidItme] });
        if (response.success) {
            setList(prevList => prevList.filter(item => item.uuid !== uuidItme));
        }
        setDeletePopupVisible(false)
    };

    const actionBtnDelete = (id) => {
        setDeletePopupVisible(!deletePopupVisible)
        setuuidItme(id)
    };

    return (
        <View style={{ flex: 1 }}>
            {
                page == 1 && <LodingJson loading={loading} setLoading={setLoading} />
            }
           {list.length >0 ? 
              (<FlatList
                data={list}
                renderItem={({ item }) =>
                    <CallLogList data={item} navigation={navigation} onDelete={() => actionBtnDelete(item.uuid)} videoCall={videoCall}/>
                }
                keyExtractor={(item) => item.id.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                windowSize={5}
                ListFooterComponent={loading && page > 1 ? (
                    <LottieView
                        source={loadinganimaion}
                        autoPlay
                        loop
                        style={{ width: '100%', height: 50 }}
                    />
                ) : null}/>) :  (
                    <View style={styles.notFoundContainer}>
                      <Text style={styles.notFoundText}>Data not found</Text>
                    </View>
                  )
            }
            <CallLogDeletePopup
                visible={deletePopupVisible}
                ActaionCancle={() => setDeletePopupVisible(false)}
                ActaionYes={handleDelete}
            />
        </View>
    );
};

const styles = StyleSheet.create({

    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: "100%", // Adjust this value to center the text better
      },
      notFoundText: {
        fontSize: 18,
        color: 'gray',
        position: 'absolute'
      },

});
export default Calllog;
