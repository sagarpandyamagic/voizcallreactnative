import { React, useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import loadinganimaion from '../../Assets/FIRST_TIME_LODING.json';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const LodingJsonFistScreen = ({ loading, setloading }) => {
  return (
    <>
      {
        loading ?
          <LottieView
            source={loadinganimaion}
            autoPlay
            loop
            style={{ width: "100%", left: 0,right:0, height: '20%',position: 'absolute', bottom: 20, zIndex: 1, }}
          /> : <></>
      }
      </>
  )
}
export default LodingJsonFistScreen