// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../styles';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      
      // Load user profile and statistics
      const profileResponse = await apiService.getUserProfile(user.user_id);
      setProfileData(profileResponse);
      
      // Load user sessions
      const sessionsResponse = await apiService.getUserSessions(user.user_id);
      setSessions(sessionsResponse.sessions || []);
      
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            navigation.navigate('Intro');
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return COLORS.primary;
      case 'in_progress':
        return '#FFA366';
      default:
        return '#E55A2B';
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Statistics */}
        {profileData?.statistics && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Interview Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {profileData.statistics.total_sessions}
                </Text>
                <Text style={styles.statLabel}>Total Interviews</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {profileData.statistics.completed_sessions}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {Math.round(profileData.statistics.completion_rate)}%
                </Text>
                <Text style={styles.statLabel}>Completion Rate</Text>
              </View>
            </View>

            {/* Career Paths */}
            {Object.keys(profileData.statistics.career_paths).length > 0 && (
              <View style={styles.careerPathsContainer}>
                <Text style={styles.subSectionTitle}>Career Paths Practiced</Text>
                {Object.entries(profileData.statistics.career_paths).map(([career, count]) => (
                  <View key={career} style={styles.careerPathRow}>
                    <Text style={styles.careerPathName}>{career}</Text>
                    <Text style={styles.careerPathCount}>{count} interviews</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Recent Sessions */}
        <View style={styles.sessionsContainer}>
          <Text style={styles.sectionTitle}>Recent Interviews</Text>
          
          {sessions.length === 0 ? (
            <Text style={styles.noSessionsText}>
              No interviews completed yet. Start your first interview!
            </Text>
          ) : (
            sessions.slice(0, 5).map((session, index) => (
              <View key={session.id || index} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionCareer}>{session.career_path}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                    <Text style={styles.statusText}>{session.status}</Text>
                  </View>
                </View>
                
                <Text style={styles.sessionDate}>
                  Started: {formatDate(session.started_at)}
                </Text>
                
                {session.completed_at && (
                  <Text style={styles.sessionDate}>
                    Completed: {formatDate(session.completed_at)}
                  </Text>
                )}
                
                <Text style={styles.sessionResponses}>
                  Responses: {session.responses?.length || 0}
                </Text>
              </View>
            ))
          )}
          
          {sessions.length > 5 && (
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Interviews</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['#FF8C42', '#FF6B35']}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.buttonInner}
              onPress={() => navigation.navigate('Questions')}
            >
              <Text style={styles.buttonText}>Start New Interview</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.outlineButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlineButton, { borderColor: '#E55A2B' }]}
            onPress={handleLogout}
          >
            <Text style={[styles.outlineButtonText, { color: '#E55A2B' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'Helvetica',
    marginTop: 10,
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
    fontSize: 28,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    marginBottom: 5,
    fontWeight: '600',
  },
  email: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
    opacity: 0.9,
  },
  statsContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Helvetica',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
    textAlign: 'center',
    marginTop: 5,
  },
  careerPathsContainer: {
    marginTop: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    marginBottom: 10,
    fontWeight: '500',
  },
  careerPathRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  careerPathName: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
  },
  careerPathCount: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: COLORS.primary,
    fontWeight: '500',
  },
  sessionsContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  noSessionsText: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.8,
  },
  sessionCard: {
    backgroundColor: COLORS.darkGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sessionCareer: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  sessionDate: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
    opacity: 0.8,
    marginBottom: 2,
  },
  sessionResponses: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.primary,
    fontWeight: '500',
  },
  viewAllButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  buttonContainer: {
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
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: '600',
  },
});