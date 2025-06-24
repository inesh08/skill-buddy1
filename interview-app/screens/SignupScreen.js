// screens/SignupScreen.js
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientStyle, buttonStyle, buttonTextStyle, titleStyle, COLORS } from '../styles';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password);
      Alert.alert(
        'Success', 
        'Account created successfully! Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={gradientStyle}>
      <Text style={[titleStyle, { color: '#FFFFFF' }]}>Sign Up</Text>
      
      <TextInput
        placeholder="Email"
        placeholderTextColor="#888888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          backgroundColor: COLORS.surface,
          color: COLORS.white,
          width: '80%',
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
          fontSize: 16,
          fontFamily: 'PlayfairDisplay_400Regular',
          borderWidth: 2,
          borderColor: email && !isValidEmail(email) ? '#E55A2B' : COLORS.darkGray,
        }}
      />
      
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: COLORS.surface,
          color: COLORS.white,
          width: '80%',
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
          fontSize: 16,
          fontFamily: 'PlayfairDisplay_400Regular',
          borderWidth: 2,
          borderColor: COLORS.darkGray,
        }}
      />
      
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#888888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{
          backgroundColor: COLORS.surface,
          color: COLORS.white,
          width: '80%',
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 16,
          fontFamily: 'PlayfairDisplay_400Regular',
          borderWidth: 2,
          borderColor: confirmPassword && password !== confirmPassword ? '#E55A2B' : COLORS.darkGray,
        }}
      />
      
      <LinearGradient
        colors={['#FF8C42', '#FF6B35']}
        style={[buttonStyle, { width: '80%', borderWidth: 0, opacity: isLoading ? 0.7 : 1 }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color={COLORS.white} style={{ marginRight: 10 }} />
              <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Creating Account...</Text>
            </View>
          ) : (
            <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[buttonTextStyle, { 
          textDecorationLine: 'underline', 
          marginTop: 10,
          color: COLORS.primary
        }]}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}