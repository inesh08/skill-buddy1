// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import { XPProvider } from './context/XPContext';

// Import your screens
import IntroScreen from './screens/IntroScreen';
import AboutScreen from './screens/AboutScreen';
import IntroQuestionScreen from './screens/IntroQuestionScreen';
import InterviewScreen from './screens/InterviewScreen';
import InterviewResultsScreen from './screens/InterviewResultsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import UIDesignerScreen from './screens/UIDesignerScreen';
import SoftwareDevScreen from './screens/SoftwareDevScreen';
import DataAnalystScreen from './screens/DataAnalystScreen';
import DigitalMarketerScreen from './screens/DigitalMarketerScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <XPProvider>
        <InterviewProvider>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Intro"
              screenOptions={{
                headerShown: false, // Hide headers for custom styling
              }}
            >
              <Stack.Screen name="Intro" component={IntroScreen} />
              <Stack.Screen name="About" component={AboutScreen} />
              <Stack.Screen name="Questions" component={IntroQuestionScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Interview" component={InterviewScreen} />
              <Stack.Screen name="InterviewResults" component={InterviewResultsScreen} />
              <Stack.Screen name="UIDesigner" component={UIDesignerScreen} />
              <Stack.Screen name="SoftwareDev" component={SoftwareDevScreen} />
              <Stack.Screen name="DataAnalyst" component={DataAnalystScreen} />
              <Stack.Screen name="DigitalMarketer" component={DigitalMarketerScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </InterviewProvider>
      </XPProvider>
    </AuthProvider>
  );
}