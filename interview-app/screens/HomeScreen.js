// screens/HomeScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../styles';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();

  const handleStartInterview = () => {
    navigation.navigate('Questions');
  };

  const handleViewProfile = () => {
    if (isAuthenticated) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Skillbuddy!</Text>
          {isAuthenticated && user ? (
            <Text style={styles.subtitle}>Hello, {user.email}!</Text>
          ) : (
            <Text style={styles.subtitle}>Your career coach is ready</Text>
          )}
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <LinearGradient
            colors={['#FF8C42', '#FF6B35']}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.buttonInner}
              onPress={handleStartInterview}
            >
              <Text style={styles.buttonText}>Start Mock Interview</Text>
            </TouchableOpacity>
          </LinearGradient>

          {isAuthenticated && (
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={handleViewProfile}
            >
              <Text style={styles.outlineButtonText}>View Profile</Text>
            </TouchableOpacity>
          )}

          {!isAuthenticated && (
            <>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.outlineButtonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.outlineButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Practice Makes Perfect</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Multiple Career Paths</Text>
            <Text style={styles.featureDescription}>
              Software Developer, Data Analyst, UI/UX Designer, Digital Marketer
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Realistic Questions</Text>
            <Text style={styles.featureDescription}>
              Practice with industry-standard interview questions
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Track Progress</Text>
            <Text style={styles.featureDescription}>
              Monitor your improvement over time
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.9,
  },
  xpContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  levelIcon: {
    fontSize: 20,
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    fontWeight: '600',
  },
  levelName: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    fontWeight: '400',
  },
  xpStats: {
    flex: 1,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  xpLabel: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
  },
  xpValue: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: '#FFD700',
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.darkGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  recentXPContainer: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#48BB78',
  },
  recentXPTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  xpGainItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  xpGainSource: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
  },
  xpGainAmount: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#48BB78',
    fontWeight: '600',
  },
  actionsContainer: {
    marginBottom: 40,
    gap: 15,
  },
  gradientButton: {
    borderRadius: 10,
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
    fontFamily: 'Helvetica',
    fontWeight: '600',
  },
  buttonSubtext: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Helvetica',
    opacity: 0.8,
    marginTop: 2,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: '600',
  },
  featuresContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  featuresTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  featureCard: {
    backgroundColor: COLORS.darkGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.primary,
    marginBottom: 5,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
    lineHeight: 20,
  },
});