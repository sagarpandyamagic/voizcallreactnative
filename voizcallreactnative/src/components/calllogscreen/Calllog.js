import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CallLogList from './CallLogList';
import { GETAPICALL, POSTAPICALL } from '../../services/auth';
import { APIURL } from '../../HelperClass/APIURL';
import loadinganimaion from '../../../Assets/animation.json';
import LottieView from 'lottie-react-native';

const Calllog = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);

    const fetchData = async (pageNumber) => {
        setLoading(true);
        const response = await POSTAPICALL(APIURL.ALLCDR, { "page_num": pageNumber });
        setLoading(false);
        if (response && response.data.length > 0) {
            setList(prevList => [...prevList, ...response.data]);
        } else {
            setHasMoreData(false);
        }
    };


    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleLoadMore = () => {
        if (hasMoreData && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderRightActions = (itemId) => (
        <TouchableOpacity
            style={{
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                height: '100%',
            }}
            onPress={() => handleDelete(itemId)}
        >
            <Text style={{ color: 'white' }}>Delete</Text>
        </TouchableOpacity>
    );


    return (
        <View style={{ flex: 1 }}>
            {
                loading && page === 1 ?
                    <LottieView
                        source={loadinganimaion}
                        autoPlay
                        loop
                        style={{ width: '100%', height: '100%', position: 'absolute', top: 20, alignItems: 'center', zIndex: 1, }}
                    /> : <></>
            }
            <FlatList
                data={list}
                renderItem={({ item }) =>
                    <CallLogList data={item} />
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
                ) : null}
            />
        </View>
    );
};
const styles = StyleSheet.create({

});
export default Calllog;
