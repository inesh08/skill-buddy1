// StackNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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

const Stack = createStackNavigator();

export default function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Intro"
        screenOptions={{
          headerShown: false, // Hide default headers for custom design
          cardStyle: { backgroundColor: '#1A1A1A' }, // Dark background
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {/* Main Flow */}
        <Stack.Screen 
          name="Intro" 
          component={IntroScreen}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
        
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />
        
        <Stack.Screen 
          name="Questions" 
          component={IntroQuestionScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />
        
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />

        {/* Authentication Screens */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />
        
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />

        {/* Interview Flow */}
        <Stack.Screen 
          name="Interview" 
          component={InterviewScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />
        
        <Stack.Screen 
          name="InterviewResults" 
          component={InterviewResultsScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />

        {/* Profile */}
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />

        {/* Legacy Interview Screens (if still needed) */}
        <Stack.Screen 
          name="DataAnalyst" 
          component={DataAnalystScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />
        
        <Stack.Screen 
          name="DigitalMarketer" 
          component={DigitalMarketerScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />
        
        <Stack.Screen 
          name="SoftwareDev" 
          component={SoftwareDevScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />
        
        <Stack.Screen 
          name="UIDesigner" 
          component={UIDesignerScreen}
          options={{
            gestureDirection: 'horizontal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}