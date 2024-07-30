import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AppCommon_Font, THEME_COLORS } from '../../HelperClass/Constant';
import { TouchableOpacity } from 'react-native-gesture-handler';

const OTPTimer = ({ duration, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const intervalRef = useRef(null);

    useEffect(() => {
        startTimer();
        return () => clearInterval(intervalRef.current);
    }, []);

    const startTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
                    onTimeUp();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const resetTimer = () => {
        setTimeLeft(duration);
        startTimer();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.timerText}>Remaining Time {formatTime(timeLeft)}s</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <Text style={styles.text} >Didn't receive code? </Text>
                <TouchableOpacity onPress={resetTimer} desbel disabled={timeLeft !== 0}>
                    <Text style={[styles.text,styles.resendButton, timeLeft !== 0 && styles.disabledButton,{ fontSize: 18 }]}>Resend OTP </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    timerText: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        fontFamily: AppCommon_Font.Font,
        color: 'black',
        fontSize: 17
    },
    resendButton: {
        padding: 0,
        borderRadius: 5,
        color:THEME_COLORS.black,
        fontWeight:'bold'
        
      },
      disabledButton: {
        color: 'gray',
      },
});
export default OTPTimer;