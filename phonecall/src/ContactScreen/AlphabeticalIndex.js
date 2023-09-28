import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const AlphabeticalIndex = ({ sections, scrollToSection }) => {
  return (
    <View style={{ position: 'absolute', top: 0, right: 0 }}>
      {sections.map((section) => (
        <TouchableOpacity
          key={section.title}
          onPress={() => scrollToSection(section.title)}>
          <Text>{section.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AlphabeticalIndex;