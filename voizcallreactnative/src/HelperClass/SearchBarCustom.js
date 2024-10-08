import {
  View,
  StyleSheet,
  Image,
  TextInput
} from 'react-native';
import { React } from 'react';

import ic_Search from '../../Assets/ic_Search.png'
import { THEME_COLORS } from './Constant';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchBarCustom = ({ onSearch,placeholderText = "Search Contact"}) => {

  const search = (text) => {
    onSearch(text);
  }

  return (
    <View style={styles.containerSearch}>
      <Image size={20} color="#000" style={styles.icon} source={ic_Search}></Image>
      <TextInput
        onChangeText={search}
        placeholder={placeholderText}
        placeholderTextColor={THEME_COLORS.black}
        style={styles.input}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  containerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 5,
    backgroundColor: '#F7F2FA',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 50,
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
    height: 20,
    width: 20
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
})

export default SearchBarCustom