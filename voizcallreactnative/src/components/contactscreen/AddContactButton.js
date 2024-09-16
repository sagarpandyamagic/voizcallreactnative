import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { THEME_COLORS } from '../../HelperClass/Constant';
import ic_plus from '../../../Assets/ic_plus.png';

const AddContactButton = ({navigation}) => {
    return (
        // <View style={styles.container}>
        //     <TouchableOpacity style={styles.button} onPress={() => {
        //        navigation.navigate('AddNewContact')
        //     }} >
        //         <Image style={styles.imge} source={ic_plus} />
        //     </TouchableOpacity>
        // </View>
        <></>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end', // Aligns the button to the left
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center', // Center the text within the button
      width: 50, // Adjusted for better visibility
      height: 50, // Adjusted for better visibility
      backgroundColor: THEME_COLORS.black,
      borderRadius: 10,
      marginBottom: 10, // Adjust margin as needed
      right:15,
      // Shadow properties for iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      // Elevation for Android
      elevation: 5,
    },
    imge: {
       height: 30,
        width: 30,
        resizeMode: 'cover',
        tintColor:'white'
    },
});
export default AddContactButton;