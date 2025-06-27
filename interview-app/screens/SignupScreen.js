// screens/SignupScreen.js
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientStyle, buttonStyle, buttonTextStyle, titleStyle, COLORS } from '../styles';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
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
      // Call signup with user data
      const response = await signup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password: password
      });
      
      console.log('Signup successful:', response);
      
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
      console.error('Signup error:', error);
      
      let errorMessage = 'Unable to create account. Please try again.';
      
      if (error.message.includes('User already exists')) {
        errorMessage = 'An account with this email already exists. Please login instead.';
      } else if (error.message.includes('Cannot connect to server')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={gradientStyle}>
      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 20 
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[titleStyle, { color: '#FFFFFF', marginBottom: 30 }]}>Create Account</Text>
        
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#888888"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          autoCorrect={false}
          style={{
            backgroundColor: COLORS.surface,
            color: COLORS.white,
            width: '100%',
            maxWidth: 320,
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
            fontSize: 16,
            fontFamily: 'Helvetica',
            borderWidth: 2,
            borderColor: COLORS.darkGray,
          }}
        />

        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#888888"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
          autoCorrect={false}
          style={{
            backgroundColor: COLORS.surface,
            color: COLORS.white,
            width: '100%',
            maxWidth: 320,
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
            fontSize: 16,
            fontFamily: 'Helvetica',
            borderWidth: 2,
            borderColor: COLORS.darkGray,
          }}
        />
        
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            backgroundColor: COLORS.surface,
            color: COLORS.white,
            width: '100%',
            maxWidth: 320,
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
            fontSize: 16,
            fontFamily: 'Helvetica',
            borderWidth: 2,
            borderColor: email && !isValidEmail(email) ? '#E55A2B' : COLORS.darkGray,
          }}
        />
        
        <TextInput
          placeholder="Password (min 6 characters)"
          placeholderTextColor="#888888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            backgroundColor: COLORS.surface,
            color: COLORS.white,
            width: '100%',
            maxWidth: 320,
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
            fontSize: 16,
            fontFamily: 'Helvetica',
            borderWidth: 2,
            borderColor: password && password.length < 6 ? '#E55A2B' : COLORS.darkGray,
          }}
        />

        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#888888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            backgroundColor: COLORS.surface,
            color: COLORS.white,
            width: '100%',
            maxWidth: 320,
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 16,
            fontFamily: 'Helvetica',
            borderWidth: 2,
            borderColor: confirmPassword && password !== confirmPassword ? '#E55A2B' : COLORS.darkGray,
          }}
        />
        
        <LinearGradient
          colors={['#FF8C42', '#FF6B35']}
          style={[buttonStyle, { 
            width: '100%', 
            maxWidth: 320, 
            borderWidth: 0, 
            opacity: isLoading ? 0.7 : 1 
          }]}
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
              <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Create Account</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
        
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginTop: 30 
        }}>
          <Text style={[buttonTextStyle, { fontSize: 16, color: COLORS.lightGray }]}>
            Already have an account? 
          </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={[buttonTextStyle, { 
              fontSize: 16,
              textDecorationLine: 'underline',
              marginLeft: 5,
              color: COLORS.primary
            }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <Text style={{
          fontSize: 12,
          fontFamily: 'Helvetica',
          color: COLORS.lightGray,
          textAlign: 'center',
          marginTop: 20,
          opacity: 0.8,
          paddingHorizontal: 20,
        }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </Text>
        
        {/* Debug info - remove in production */}
        {__DEV__ && (
          <View style={{
            marginTop: 30,
            backgroundColor: COLORS.surface,
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: COLORS.primary,
            width: '100%',
            maxWidth: 320,
          }}>
            <Text style={{ 
              color: COLORS.white, 
              fontSize: 12, 
              textAlign: 'center',
              fontFamily: 'Helvetica'
            }}>
              Debug: Fill all fields to create your account
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}