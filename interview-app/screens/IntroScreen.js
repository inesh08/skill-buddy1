import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientStyle, buttonStyle, buttonTextStyle, titleStyle } from '../styles';

export default function IntroScreen({ navigation }) {
  return (
    <LinearGradient 
      colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} 
      style={gradientStyle}
    >
      <Text style={[titleStyle, { fontSize: 30, color: '#FF8C42' }]}>Skillbuddy</Text>
      
      <LinearGradient
        colors={['#FF8C42', '#FF6B35']}
        style={[buttonStyle, { borderWidth: 0 }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
  );
}