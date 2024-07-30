// SeparatorLine.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const SeparatorLine = ({ color = '#f3f7ff', thickness = 1, marginVertical = 10 }) => {
  return (
    <View
      style={[
        styles.separator,
        { borderBottomColor: color, borderBottomWidth: thickness, marginVertical }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    width: '100%',
  },
});

export default SeparatorLine;
