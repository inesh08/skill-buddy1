// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../styles';

export default function HomeScreen({ navigation }) {
  // Simple version without authentication context - all users are guests
  const isAuthenticated = false; // Set to false for guest mode
  const user = null;

  // XP state and animation
  const [currentXP, setCurrentXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xpToNextLevel, setXpToNextLevel] = useState(100);
  const xpBarWidth = React.useRef(new Animated.Value(0)).current;

  // Load XP from storage
  useEffect(() => {
    const loadXP = () => {
      const storedXP = parseInt(global.userXP || '0');
      setCurrentXP(storedXP);
      
      // Calculate level and progress
      const level = Math.floor(storedXP / 100) + 1;
      const xpInCurrentLevel = storedXP % 100;
      const xpNeeded = 100 - xpInCurrentLevel;
      
      setCurrentLevel(level);
      setXpToNextLevel(xpNeeded);

      // Animate XP bar
      Animated.timing(xpBarWidth, {
        toValue: (xpInCurrentLevel / 100) * 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    };

    loadXP();
    
    // Set up interval to check for XP updates
    const interval = setInterval(loadXP, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    console.log('Logout pressed');
    // For now, just log since we don't have auth
  };

  const handleStartInterview = () => {
    // Always allow navigation to Questions screen - no authentication required
    navigation.navigate('Questions');
  };

  const renderXPMonitor = () => {
    return (
      <View style={styles.xpContainer}>
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C42']}
          style={styles.xpGradient}
        >
          <View style={styles.xpHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>LVL {currentLevel}</Text>
            </View>
            <View style={styles.xpInfo}>
              <Text style={styles.xpAmount}>{currentXP} XP</Text>
              <Text style={styles.xpNextLevel}>{xpToNextLevel} XP to next level</Text>
            </View>
            <View style={styles.xpIcon}>
              <Text style={styles.xpIconText}>⭐</Text>
            </View>
          </View>
          
          {/* XP Progress Bar */}
          <View style={styles.xpProgressContainer}>
            <View style={styles.xpProgressBackground}>
              <Animated.View 
                style={[
                  styles.xpProgressFill,
                  {
                    width: xpBarWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    })
                  }
                ]}
              />
            </View>
            <Text style={styles.xpProgressText}>
              {currentXP % 100}/100 XP
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.container}>
      {/* XP Monitor at the top */}
      {renderXPMonitor()}

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to Skillbuddy</Text>
        
        <Text style={styles.subtitle}>
          Practice your interview skills and earn XP!
        </Text>

        {isAuthenticated && (
          <Text style={styles.welcomeText}>
            Hello, {user?.email || 'User'}!
          </Text>
        )}

        {/* Main action button - always visible */}
        <LinearGradient
          colors={['#FF8C42', '#FF6B35']}
          style={styles.gradientButton}
        >
          <TouchableOpacity
            style={styles.buttonInner}
            onPress={handleStartInterview}
          >
            <Text style={styles.buttonText}>Start Interview</Text>
            <Text style={styles.buttonSubtext}>Earn XP for each answer!</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* XP Benefits Info */}
        <View style={styles.xpBenefitsContainer}>
          <Text style={styles.xpBenefitsTitle}>🏆 XP Rewards</Text>
          <View style={styles.xpBenefitItem}>
            <Text style={styles.xpBenefitText}>✅ +33 XP per correct answer</Text>
          </View>
          <View style={styles.xpBenefitItem}>
            <Text style={styles.xpBenefitText}>🎯 +100 XP bonus for completing all questions</Text>
          </View>
          <View style={styles.xpBenefitItem}>
            <Text style={styles.xpBenefitText}>🎡 Spin the roulette wheel for bonus rewards!</Text>
          </View>
        </View>

        <Text style={styles.infoText}>
          Choose from multiple career paths and level up your skills
        </Text>

        {/* Auth section with prominent buttons */}
        <View style={styles.authSection}>
          {isAuthenticated ? (
            <>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.linkText}>View Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleLogout}
              >
                <Text style={styles.linkText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.authPrompt}>
                🚀 Save your XP and track progress across devices!
              </Text>
              
              <View style={styles.authButtonsContainer}>
                {/* Prominent Login Button */}
                <LinearGradient
                  colors={['#FF6B35', '#E55A2B']}
                  style={styles.authGradientButton}
                >
                  <TouchableOpacity
                    style={styles.authButtonInner}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={styles.authButtonText}>Login</Text>
                  </TouchableOpacity>
                </LinearGradient>

                {/* Prominent Signup Button */}
                <LinearGradient
                  colors={['#FFA366', '#FF8C42']}
                  style={styles.authGradientButton}
                >
                  <TouchableOpacity
                    style={styles.authButtonInner}
                    onPress={() => navigation.navigate('Signup')}
                  >
                    <Text style={styles.authButtonText}>Sign Up</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <Text style={styles.guestModeText}>
                Playing as guest • XP resets when app closes
              </Text>
            </>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  xpContainer: {
    margin: 20,
    marginTop: 60,
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  xpGradient: {
    padding: 20,
    borderRadius: 15,
  },
  xpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 15,
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    fontWeight: 'bold',
  },
  xpInfo: {
    flex: 1,
  },
  xpAmount: {
    fontSize: 24,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    fontWeight: 'bold',
  },
  xpNextLevel: {
    fontSize: 12,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    opacity: 0.9,
  },
  xpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xpIconText: {
    fontSize: 20,
  },
  xpProgressContainer: {
    alignItems: 'center',
  },
  xpProgressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  xpProgressText: {
    fontSize: 12,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 15,
    fontFamily: 'Snell Roundhand',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightGray,
    marginBottom: 20,
    fontFamily: 'Snell Roundhand',
    textAlign: 'center',
    opacity: 0.9,
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 20,
    fontFamily: 'Snell Roundhand',
    textAlign: 'center',
  },
  gradientButton: {
    borderRadius: 12,
    marginVertical: 25,
    width: '80%',
    elevation: 5,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonInner: {
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'Snell Roundhand',
    fontWeight: 'bold',
  },
  buttonSubtext: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Snell Roundhand',
    opacity: 0.9,
    marginTop: 4,
  },
  xpBenefitsContainer: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  xpBenefitsTitle: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  xpBenefitItem: {
    marginBottom: 5,
  },
  xpBenefitText: {
    fontSize: 14,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginBottom: 30,
    fontFamily: 'Snell Roundhand',
    textAlign: 'center',
    opacity: 0.8,
  },
  authSection: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  authPrompt: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 20,
    fontFamily: 'Snell Roundhand',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    gap: 15,
    marginBottom: 15,
  },
  authGradientButton: {
    flex: 1,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  authButtonInner: {
    padding: 15,
    alignItems: 'center',
  },
  authButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 5,
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
  },
  guestModeText: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: 'Snell Roundhand',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
  },
});