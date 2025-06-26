// screens/IntroQuestionScreen.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientStyle, buttonStyle, buttonTextStyle, titleStyle } from '../styles';

export default function IntroQuestionScreen({ navigation }) {
  const handleCareerSelection = (careerPath) => {
    navigation.navigate('Interview', { careerPath });
  };

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={gradientStyle}>
      <Text style={[titleStyle, { color: '#FFFFFF' }]}>Choose Your Career Path</Text>
      
      <LinearGradient
        colors={['#FF8C42', '#FF6B35']}
        style={[buttonStyle, { borderWidth: 0 }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => handleCareerSelection('SoftwareDev')}
        >
          <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Software Developer</Text>
        </TouchableOpacity>
      </LinearGradient>
      
      <LinearGradient
        colors={['#FF6B35', '#E55A2B']}
        style={[buttonStyle, { borderWidth: 0 }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => handleCareerSelection('DataAnalyst')}
        >
          <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Data Analyst</Text>
        </TouchableOpacity>
      </LinearGradient>
      
      <LinearGradient
        colors={['#FF8C42', '#FFA366']}
        style={[buttonStyle, { borderWidth: 0 }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => handleCareerSelection('UIDesigner')}
        >
          <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>UI/UX Designer</Text>
        </TouchableOpacity>
      </LinearGradient>
      
      <LinearGradient
        colors={['#E55A2B', '#FF6B35']}
        style={[buttonStyle, { borderWidth: 0 }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => handleCareerSelection('DigitalMarketer')}
        >
          <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Digital Marketer</Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
  );
}