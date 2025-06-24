// App.js - Navigation with XP System
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

// Initialize global XP storage (replace with AsyncStorage or backend later)
if (!global.userXP) {
  global.userXP = '0';
}

// Import your screens
import IntroScreen from './screens/IntroScreen';
import AboutScreen from './screens/AboutScreen';
import IntroQuestionScreen from './screens/IntroQuestionScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen';
import InterviewScreen from './screens/InterviewScreen';
import InterviewResultsScreen from './screens/InterviewResultsScreen';
import DataAnalystScreen from './screens/DataAnalystScreen';
import DigitalMarketerScreen from './screens/DigitalMarketerScreen';
import SoftwareDevScreen from './screens/SoftwareDevScreen';
import UIDesignerScreen from './screens/UIDesignerScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Intro');
  const [routeParams, setRouteParams] = useState({});

  // Simple navigation function
  const navigate = (screenName, params = {}) => {
    console.log('Navigating to:', screenName, 'with params:', params);
    setCurrentScreen(screenName);
    setRouteParams(params);
  };

  // Create a mock navigation object that matches React Navigation API
  const navigation = { 
    navigate,
    goBack: () => {
      // Simple back navigation - you can enhance this with a stack
      navigate('Home');
    }
  };

  // Create route object for screens that need params
  const route = {
    params: routeParams
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Intro':
        return <IntroScreen navigation={navigation} />;
      case 'About':
        return <AboutScreen navigation={navigation} />;
      case 'Questions':
        return <IntroQuestionScreen navigation={navigation} />;
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'Login':
        return <LoginScreen navigation={navigation} />;
      case 'Signup':
        return <SignupScreen navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      case 'Interview':
        return <InterviewScreen navigation={navigation} route={route} />;
      case 'InterviewResults':
        return <InterviewResultsScreen navigation={navigation} route={route} />;
      case 'DataAnalyst':
        return <DataAnalystScreen navigation={navigation} />;
      case 'DigitalMarketer':
        return <DigitalMarketerScreen navigation={navigation} />;
      case 'SoftwareDev':
        return <SoftwareDevScreen navigation={navigation} />;
      case 'UIDesigner':
        return <UIDesignerScreen navigation={navigation} />;
      default:
        return <IntroScreen navigation={navigation} />;
    }
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#1A1A1A" />
      {renderScreen()}
    </>
  );
}