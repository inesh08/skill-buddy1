import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientStyle, buttonStyle, buttonTextStyle, titleStyle } from '../styles';

export default function AboutScreen({ navigation }) {
  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={gradientStyle}>
      <Image 
        source={require('../assets/Golden-Dog.png')} 
        style={{ 
          width: 120, 
          height: 120, 
          borderRadius: 60, 
          marginBottom: 20,
          borderWidth: 3,
          borderColor: '#FF8C42'
        }} 
      />
      <Text style={[titleStyle, { color: '#FFFFFF' }]}>Meet Buddy, your career coach 🐶</Text>
      
      <LinearGradient
        colors={['#FF8C42', '#FF6B35']}
        style={[buttonStyle, { borderWidth: 0 }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => navigation.navigate('Questions')}
        >
          <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Let's Go!</Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
  );
}