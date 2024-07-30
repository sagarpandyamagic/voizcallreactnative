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
});
export default Footer;
