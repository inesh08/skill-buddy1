// screens/LoginScreen.js
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientStyle, buttonStyle, buttonTextStyle, titleStyle, COLORS } from '../styles';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Call login with email and password
      const response = await login(email, password);
      console.log('Login successful:', response);
      
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home')
        }
      ]);
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Unable to login. Please try again.';
      
      if (error.message.includes('User not found')) {
        errorMessage = 'User not found. Please register first or check your email.';
      } else if (error.message.includes('Cannot connect to server')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact support or try registering again with the same email.',
      [{ text: 'OK' }]
    );
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={gradientStyle}>
      <Text style={[titleStyle, { color: '#FFFFFF' }]}>Welcome Back</Text>
      
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
        autoCapitalize="none"
        autoCorrect={false}
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
          borderColor: COLORS.darkGray,
        }}
      />
      
      <LinearGradient
        colors={['#FF8C42', '#FF6B35']}
        style={[buttonStyle, { width: '80%', borderWidth: 0, opacity: isLoading ? 0.7 : 1 }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color={COLORS.white} style={{ marginRight: 10 }} />
              <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Logging in...</Text>
            </View>
          ) : (
            <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Login</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
      
      <TouchableOpacity 
        onPress={handleForgotPassword}
        style={{ marginTop: 15 }}
      >
        <Text style={[buttonTextStyle, { 
          fontSize: 14, 
          textDecorationLine: 'underline',
          opacity: 0.8,
          color: COLORS.lightGray
        }]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 30 
      }}>
        <Text style={[buttonTextStyle, { fontSize: 16, color: COLORS.lightGray }]}>
          Don't have an account? 
        </Text>
        <TouchableOpacity onPress={navigateToSignup}>
          <Text style={[buttonTextStyle, { 
            fontSize: 16,
            textDecorationLine: 'underline',
            marginLeft: 5,
            color: COLORS.primary
          }]}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Debug info - remove in production */}
      {__DEV__ && (
        <View style={{
          position: 'absolute',
          bottom: 50,
          left: 20,
          right: 20,
          backgroundColor: COLORS.surface,
          padding: 10,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: COLORS.primary,
        }}>
          <Text style={{ color: COLORS.white, fontSize: 12, textAlign: 'center' }}>
            Debug: Make sure you've registered with this email first!
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}