// screens/InterviewResultsScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  TextInput,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../styles';

const { width } = Dimensions.get('window');

export default function InterviewResultsScreen({ navigation, route }) {
  // Get parameters from route (passed from navigation)
  const params = route?.params || {};
  const { 
    careerPath = 'Unknown', 
    responses = [], 
    questions = [],
    isGuestMode = true
  } = params;
  
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [showRoulette, setShowRoulette] = useState(true);
  const [earnedXP, setEarnedXP] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  // Roulette animation
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;

  // Calculate XP based on responses (mock scoring for demo)
  const calculateXP = () => {
    // For demo, let's assume each response gets a random score
    const correctAnswers = responses.length; // Assume all are correct for demo
    let baseXP = correctAnswers * 33; // 33 XP per answer
    
    // Bonus for completing all questions
    if (correctAnswers === questions.length && questions.length >= 3) {
      baseXP += 100; // Bonus XP
    }
    
    return baseXP;
  };

  useEffect(() => {
    // Animate roulette entrance
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const spinRoulette = () => {
    if (isSpinning || hasSpun) return;
    
    setIsSpinning(true);
    const xp = calculateXP();
    setEarnedXP(xp);

    // Store XP in local storage (you can replace with actual storage later)
    const currentXP = parseInt(global.userXP || '0');
    global.userXP = (currentXP + xp).toString();

    // Spin animation
    const spinDuration = 3000;
    const finalRotation = Math.random() * 1440 + 720; // 2-6 full rotations

    Animated.timing(spinValue, {
      toValue: finalRotation,
      duration: spinDuration,
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      setHasSpun(true);
      
      // Show XP earned
      setTimeout(() => {
        Alert.alert(
          '🎉 XP Earned!',
          `You earned ${xp} XP!\n\n${responses.length} correct answers × 33 XP = ${responses.length * 33} XP${responses.length >= 3 ? '\n+ 100 XP completion bonus!' : ''}`,
          [{ text: 'Awesome!', onPress: () => setShowRoulette(false) }]
        );
      }, 500);
    });
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating before submitting.');
      return;
    }

    Alert.alert(
      'Thank You!',
      'Your feedback has been recorded. Consider creating an account to save your progress permanently!',
      [
        {
          text: 'Create Account',
          onPress: () => navigation.navigate('Signup'),
        },
        {
          text: 'Home',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  const renderStarRating = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.star}
          >
            <Text style={[
              styles.starText,
              { color: star <= rating ? '#FF8C42' : '#888888' }
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRouletteWheel = () => {
    const rotation = spinValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    const rouletteSegments = [
      { color: '#FF8C42', label: 'BONUS!' },
      { color: '#FF6B35', label: 'XP' },
      { color: '#FFA366', label: 'GREAT!' },
      { color: '#E55A2B', label: 'XP' },
      { color: '#FFD700', label: 'AMAZING!' },
      { color: '#FF8C42', label: 'XP' },
      { color: '#FF6B35', label: 'PERFECT!' },
      { color: '#FFA366', label: 'XP' },
    ];

    return (
      <View style={styles.rouletteContainer}>
        <Text style={styles.rouletteTitle}>🎉 Spin for Your XP Reward! 🎉</Text>
        
        <Animated.View 
          style={[
            styles.rouletteWheel,
            { 
              transform: [
                { scale: scaleValue },
                { rotate: rotation }
              ]
            }
          ]}
        >
          {rouletteSegments.map((segment, index) => {
            const angle = (360 / rouletteSegments.length) * index;
            return (
              <View
                key={index}
                style={[
                  styles.rouletteSegment,
                  {
                    backgroundColor: segment.color,
                    transform: [{ rotate: `${angle}deg` }],
                  }
                ]}
              >
                <Text style={styles.segmentText}>{segment.label}</Text>
              </View>
            );
          })}
          
          {/* Center circle */}
          <View style={styles.rouletteCenter}>
            <Text style={styles.centerText}>XP</Text>
          </View>
        </Animated.View>

        {/* Pointer */}
        <View style={styles.roulettePointer}>
          <Text style={styles.pointerText}>▼</Text>
        </View>

        {/* Spin Button */}
        {!hasSpun && (
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.spinButton}
          >
            <TouchableOpacity
              style={styles.spinButtonInner}
              onPress={spinRoulette}
              disabled={isSpinning}
            >
              <Text style={styles.spinButtonText}>
                {isSpinning ? 'SPINNING...' : 'SPIN FOR XP!'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {hasSpun && (
          <View style={styles.xpResult}>
            <Text style={styles.xpResultText}>🎉 You Earned {earnedXP} XP! 🎉</Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowRoulette(false)}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (showRoulette) {
    return (
      <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Interview Complete! 🎉</Text>
            <Text style={styles.subtitle}>
              Great job on the {careerPath} interview
            </Text>
          </View>

          {/* Quick Summary */}
          <View style={styles.quickSummary}>
            <Text style={styles.summaryText}>
              ✅ {responses.length} questions answered
            </Text>
            <Text style={styles.summaryText}>
              🏆 {Math.round((responses.length / questions.length) * 100)}% completion rate
            </Text>
          </View>

          {/* Roulette Wheel */}
          {renderRouletteWheel()}
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Interview Complete! 🎉</Text>
          <Text style={styles.subtitle}>
            Great job completing the {careerPath} interview
          </Text>
        </View>

        {/* Interview Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Interview Summary</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Questions Answered:</Text>
            <Text style={styles.statValue}>{responses.length}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Questions:</Text>
            <Text style={styles.statValue}>{questions.length}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Completion Rate:</Text>
            <Text style={styles.statValue}>
              {questions.length > 0 
                ? Math.round((responses.length / questions.length) * 100)
                : 0}%
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>XP Earned:</Text>
            <Text style={[styles.statValue, { color: '#FFD700' }]}>+{earnedXP} XP</Text>
          </View>
        </View>

        {/* Guest Mode Upgrade Prompt */}
        <View style={styles.upgradeContainer}>
          <Text style={styles.upgradeTitle}>🚀 Want to Save Your Progress?</Text>
          <Text style={styles.upgradeText}>
            Create an account to save your XP, interview history, and track your improvement over time!
          </Text>
          
          <View style={styles.upgradeButtons}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={[styles.button, { flex: 1, marginRight: 5 }]}
            >
              <TouchableOpacity
                style={styles.buttonInner}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.buttonText}>Sign Up Free</Text>
              </TouchableOpacity>
            </LinearGradient>
            
            <LinearGradient
              colors={['#FF8C42', '#FF6B35']}
              style={[styles.button, { flex: 1, marginLeft: 5 }]}
            >
              <TouchableOpacity
                style={styles.buttonInner}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Feedback Section */}
        <View style={styles.feedbackContainer}>
          <Text style={styles.sectionTitle}>Rate Your Experience</Text>
          
          <Text style={styles.ratingLabel}>How would you rate this interview?</Text>
          {renderStarRating()}
          
          <Text style={styles.feedbackLabel}>Additional Comments (Optional):</Text>
          <TextInput
            style={styles.feedbackInput}
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            placeholder="Share your thoughts about the interview experience..."
            placeholderTextColor="#888888"
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['#FF8C42', '#FF6B35']}
            style={styles.button}
          >
            <TouchableOpacity
              style={styles.buttonInner}
              onPress={handleSubmitFeedback}
            >
              <Text style={styles.buttonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.outlineButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('Questions')}
          >
            <Text style={styles.outlineButtonText}>Take Another Interview</Text>
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
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.9,
  },
  quickSummary: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    marginBottom: 5,
  },
  rouletteContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rouletteTitle: {
    fontSize: 22,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 30,
  },
  rouletteWheel: {
    width: 250,
    height: 250,
    borderRadius: 125,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#FFD700',
  },
  rouletteSegment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    top: '50%',
    left: '50%',
    transformOrigin: '0 0',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  segmentText: {
    fontSize: 12,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rouletteCenter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  centerText: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.dark,
    fontWeight: 'bold',
  },
  roulettePointer: {
    position: 'absolute',
    top: -10,
    zIndex: 10,
  },
  pointerText: {
    fontSize: 30,
    color: '#FFD700',
  },
  spinButton: {
    marginTop: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  spinButtonInner: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  spinButtonText: {
    fontSize: 18,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    fontWeight: 'bold',
  },
  xpResult: {
    marginTop: 30,
    alignItems: 'center',
  },
  xpResultText: {
    fontSize: 24,
    fontFamily: 'Snell Roundhand',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.lightGray,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  upgradeContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  upgradeTitle: {
    fontSize: 20,
    fontFamily: 'Snell Roundhand',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
  },
  upgradeText: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  upgradeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  feedbackContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 15,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  starText: {
    fontSize: 30,
  },
  feedbackLabel: {
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    marginBottom: 10,
  },
  feedbackInput: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Snell Roundhand',
    color: COLORS.dark,
    minHeight: 100,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
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
    fontFamily: 'Snell Roundhand',
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
    fontFamily: 'Snell Roundhand',
    fontWeight: '600',
  },
});