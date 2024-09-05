  import { React, useEffect, useState } from 'react';
  import LottieView from 'lottie-react-native';
  import loadinganimaion from '../../Assets/APICallingTime.json';
    
  const LodingJson = ({ loading, setloading }) => {
    return (
        <>
        {
          loading ?
            <LottieView
              source={loadinganimaion}
              autoPlay
              loop
              style={{ width: '100%', height: '100%', position: 'absolute', top: 20, alignItems: 'center', zIndex: 1, }}
            /> : <></>
        }
        </>
    )
  }
  export default LodingJson