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
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../styles';
import { useXP } from '../context/XPContext';

const { width } = Dimensions.get('window');

export default function InterviewResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { careerPath, responses = [], questions = [] } = route.params || {};
  const { addXP, getXPRewards } = useXP();
  
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const rouletteRotation = useRef(new Animated.Value(0)).current;
  const xpAnimation = useRef(new Animated.Value(0)).current;

  const rouletteSegments = [
    { label: '50 XP', value: 50, color: '#FF6B35' },
    { label: '75 XP', value: 75, color: '#FF8C42' },
    { label: '100 XP', value: 100, color: '#FFA366' },
    { label: '25 XP', value: 25, color: '#E55A2B' },
    { label: '150 XP', value: 150, color: '#48BB78' },
    { label: '200 XP', value: 200, color: '#6C63FF' },
    { label: '75 XP', value: 75, color: '#FF8C42' },
    { label: '50 XP', value: 50, color: '#FF6B35' },
  ];

  useEffect(() => {
    // Show roulette after a short delay
    setTimeout(() => {
      setShowRoulette(true);
    }, 1000);
  }, []);

  const spinRoulette = () => {
    setRouletteSpinning(true);
    
    // Random number of rotations (5-10 full rotations plus random position)
    const spins = Math.floor(Math.random() * 5) + 5;
    const randomSegment = Math.floor(Math.random() * rouletteSegments.length);
    const segmentAngle = 360 / rouletteSegments.length;
    const finalAngle = spins * 360 + (randomSegment * segmentAngle);
    
    Animated.timing(rouletteRotation, {
      toValue: finalAngle,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      const wonSegment = rouletteSegments[randomSegment];
      const earnedXP = wonSegment.value;
      
      setXpEarned(earnedXP);
      addXP(earnedXP, 'Interview Completion');
      setRouletteSpinning(false);
      setShowXPAnimation(true);
      
      // Animate XP counter
      Animated.sequence([
        Animated.timing(xpAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(xpAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowXPAnimation(false);
      });
    });
  };

  const renderRoulette = () => {
    if (!showRoulette) return null;

    return (
      <View style={styles.rouletteContainer}>
        <Text style={styles.rouletteTitle}>🎉 Spin for Bonus XP! 🎉</Text>
        
        <View style={styles.rouletteWheel}>
          <Animated.View
            style={[
              styles.wheel,
              {
                transform: [{
                  rotate: rouletteRotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }
            ]}
          >
            {rouletteSegments.map((segment, index) => (
              <View
                key={index}
                style={[
                  styles.segment,
                  {
                    backgroundColor: segment.color,
                    transform: [
                      { rotate: `${(360 / rouletteSegments.length) * index}deg` }
                    ]
                  }
                ]}
              >
                <Text style={styles.segmentText}>{segment.label}</Text>
              </View>
            ))}
          </Animated.View>
          
          {/* Pointer */}
          <View style={styles.pointer} />
        </View>
        
        <TouchableOpacity
          style={[styles.spinButton, { opacity: rouletteSpinning ? 0.5 : 1 }]}
          onPress={spinRoulette}
          disabled={rouletteSpinning}
        >
          <LinearGradient
            colors={['#48BB78', '#38A169']}
            style={styles.spinButtonGradient}
          >
            <Text style={styles.spinButtonText}>
              {rouletteSpinning ? 'Spinning...' : 'SPIN!'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderXPAnimation = () => {
    if (!showXPAnimation) return null;

    return (
      <Animated.View
        style={[
          styles.xpAnimationContainer,
          {
            opacity: xpAnimation,
            transform: [{
              scale: xpAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1]
              })
            }]
          }
        ]}
      >
        <Text style={styles.xpAnimationText}>+{xpEarned} XP</Text>
        <Text style={styles.xpAnimationSubtext}>Experience Earned!</Text>
      </Animated.View>
    );
  };
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating before submitting.');
      return;
    }

    setIsSubmittingFeedback(true);
    
    // Add bonus XP for providing feedback
    const feedbackXP = 25;
    addXP(feedbackXP, 'Feedback Provided');
    
    // Simulate submitting feedback
    setTimeout(() => {
      Alert.alert(
        'Thank You!',
        `Your feedback has been recorded. You earned ${feedbackXP} bonus XP for providing feedback!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
      setIsSubmittingFeedback(false);
    }, 1000);
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

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Interview Complete!</Text>
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
              {Math.round((responses.length / questions.length) * 100)}%
            </Text>
          </View>
        </View>

        {/* Roulette Wheel */}
        {renderRoulette()}

        {/* XP Animation */}
        {renderXPAnimation()}

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
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.buttonInner}
              onPress={handleSubmitFeedback}
              disabled={isSubmittingFeedback}
            >
              {isSubmittingFeedback ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Submit Feedback (+25 XP)</Text>
              )}
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
    fontFamily: 'Helvetica',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.9,
  },
  summaryContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  rouletteContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#48BB78',
  },
  rouletteTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  rouletteWheel: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wheel: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'relative',
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  segment: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: 0,
    left: 50,
    transformOrigin: '0 100px',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  segmentText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  pointer: {
    position: 'absolute',
    top: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD700',
    zIndex: 10,
  },
  spinButton: {
    borderRadius: 25,
  },
  spinButtonGradient: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  spinButtonText: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    fontWeight: '700',
  },
  xpAnimationContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -50 }],
    backgroundColor: 'rgba(72, 187, 120, 0.95)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    zIndex: 1000,
    width: 150,
  },
  xpAnimationText: {
    fontSize: 24,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    fontWeight: '700',
  },
  xpAnimationSubtext: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.primary,
    fontWeight: 'bold',
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
    fontFamily: 'Helvetica',
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
    fontFamily: 'Helvetica',
  },
  feedbackLabel: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    marginBottom: 10,
  },
  feedbackInput: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: COLORS.dark,
    minHeight: 100,
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