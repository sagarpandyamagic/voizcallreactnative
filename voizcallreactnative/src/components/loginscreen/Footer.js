import React from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView } from 'react-native';

import footer from '../../../Assets/footer.png';

const Footer = () => {
    return (
        <View style={styles.footerContainer}>
            <Image
                style={styles.footerImage}
                resizeMode="cover"
                source={footer} // Ensure the path is correct
            />
             <View style={styles.textContainer}>
                <Text style={styles.footerText}>Powered By NEXTUS TELECOM S.R.L.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        height: 70,
        backgroundColor: '#fff',
        marginBottom: -1,
    },
    footerImage: {
        height: '100%',
        width: '100%',
    },
    textContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: "white", // Adjust color as needed
        fontSize: 12,
    },
});
export default Footer;
