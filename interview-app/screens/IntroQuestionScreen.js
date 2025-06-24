// screens/IntroQuestionScreen.js
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientStyle, buttonStyle, buttonTextStyle, titleStyle, COLORS } from '../styles';

export default function IntroQuestionScreen({ navigation }) {
  const handleCareerSelection = (careerPath) => {
    console.log('Selected career path:', careerPath);
    console.log('Navigating to Interview with params:', { careerPath });
    
    // Directly navigate to interview - NO authentication check
    try {
      navigation.navigate('Interview', { careerPath });
      console.log('Navigation called successfully');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={gradientStyle}>
      <Text style={[titleStyle, { color: COLORS.white }]}>Choose Your Career Path</Text>
      
      <Text style={{
        fontSize: 16,
        color: COLORS.lightGray,
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
        opacity: 0.9,
        fontFamily: 'Snell Roundhand', // Cursive font
      }}>
        Select a career path to start practicing interview questions
      </Text>
      
      <LinearGradient
        colors={['#FF8C42', '#FF6B35']}
        style={[buttonStyle, { borderWidth: 0, width: '80%' }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => handleCareerSelection('SoftwareDev')}
        >
          <Text style={[buttonTextStyle, { color: COLORS.white }]}>Software Developer</Text>
        </TouchableOpacity>
      </LinearGradient>
      
      <LinearGradient
        colors={['#FF6B35', '#E55A2B']}
        style={[buttonStyle, { borderWidth: 0, width: '80%' }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => handleCareerSelection('DataAnalyst')}
        >
          <Text style={[buttonTextStyle, { color: COLORS.white }]}>Data Analyst</Text>
        </TouchableOpacity>
      </LinearGradient>
      
      <LinearGradient
        colors={['#FF8C42', '#FFA366']}
        style={[buttonStyle, { borderWidth: 0, width: '80%' }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => handleCareerSelection('UIDesigner')}
        >
          <Text style={[buttonTextStyle, { color: COLORS.white }]}>UI/UX Designer</Text>
        </TouchableOpacity>
      </LinearGradient>
      
      <LinearGradient
        colors={['#E55A2B', '#FF6B35']}
        style={[buttonStyle, { borderWidth: 0, width: '80%' }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => handleCareerSelection('DigitalMarketer')}
        >
          <Text style={[buttonTextStyle, { color: COLORS.white }]}>Digital Marketer</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Optional: Add a note about creating account for saving progress */}
      <Text style={{
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        marginTop: 30,
        paddingHorizontal: 20,
        fontFamily: 'Snell Roundhand', // Cursive font
      }}>
        💡 Create an account from the home page to save your progress
      </Text>
    </LinearGradient>
  );
}