// screens/AboutScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  Animated, 
  Dimensions, 
  ScrollView,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientStyle, buttonStyle, buttonTextStyle, titleStyle, COLORS } from '../styles';

const { width } = Dimensions.get('window');

export default function AboutScreen({ navigation }) {
  console.log('AboutScreen rendered with navigation:', navigation);

  const handleLetsGo = () => {
    console.log('Lets Go pressed - navigating to Home');
    try {
      navigation.navigate('Home');
    } catch (error) {
      console.error('Navigation error from AboutScreen:', error);
    }
  };

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-scroll the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % 3;
        
        // Animate fade transition
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        // Scroll to next item
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 5000); // Change card every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const cardsData = [
    {
      id: 1,
      title: "🌟 What is SkillBuddy?",
      items: [
        {
          icon: "🎤",
          title: "Mock Interviews with AI Voice Agent",
          description: "Practice real interview questions using voice — just like talking to a real interviewer."
        },
        {
          icon: "🧠",
          title: "Instant Feedback & Smart Suggestions", 
          description: "Get AI-powered feedback on your answers, tone, confidence, and structure after every session."
        },
        {
          icon: "🛠️",
          title: "All-in-One Career Toolkit",
          description: "Build your resume, LinkedIn profile, GitHub, and portfolio — all from one app."
        },
        {
          icon: "🎯",
          title: "Tailored for Students & Freshers",
          description: "Designed to help you ace placements, internships, and first job interviews."
        },
        {
          icon: "📈",
          title: "Track Your Progress",
          description: "Monitor improvements in speaking skills, answer quality, and confidence over time."
        }
      ],
      color: ['#FF8C42', '#FFA366']
    },
    {
      id: 2,
      title: "💡 Key Features",
      items: [
        {
          icon: "🎤",
          title: "Mock Interviews with AI Voice Agent",
          description: "Practice interviews with a realistic AI that asks questions just like a real interviewer."
        },
        {
          icon: "🧠",
          title: "Personalized Feedback After Every Interview",
          description: "Get insights on how you speak, areas to improve, and structure clarity."
        },
        {
          icon: "💬",
          title: "Communication Analysis",
          description: "AI evaluates your speaking style, confidence, and delivery in real-time."
        },
        {
          icon: "📄",
          title: "Build Your Career Tools in One Place",
          description: "Resume builder, LinkedIn optimizer, GitHub showcase, and portfolio creator all integrated."
        }
      ],
      color: ['#FF6B35', '#E55A2B']
    },
    {
      id: 3,
      title: "🏆 Points & Rewards System",
      items: [
        {
          icon: "✅",
          title: "Practice Completion",
          description: "Completing an interview: +50 points"
        },
        {
          icon: "🔥",
          title: "Consistency Streaks",
          description: "Daily streaks: +10 pts/day • Weekly streaks: +100 pts"
        },
        {
          icon: "📊",
          title: "Improvement Bonus",
          description: "Score increase from last attempt: +30 points"
        },
        {
          icon: "⚡",
          title: "Difficulty Multipliers",
          description: "Easy: x1.0 • Medium: x1.5 • Hard: x2.0"
        },
        {
          icon: "⏱️",
          title: "Time Management",
          description: "Completing in optimal time: +15 points"
        },
        {
          icon: "🎯",
          title: "Behavior Metrics",
          description: "Eye contact, voice clarity, confidence: +10-30 points"
        }
      ],
      color: ['#FFA366', '#FFD700']
    }
  ];

  const renderFeatureItem = ({ item }) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Text style={styles.featureIcon}>{item.icon}</Text>
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const renderCard = ({ item: card }) => (
    <View style={[styles.card, { width: width - 40 }]}>
      <LinearGradient
        colors={card.color}
        style={styles.cardGradient}
      >
        <Text style={styles.cardTitle}>{card.title}</Text>
        <ScrollView 
          style={styles.cardScrollView}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {card.items.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const onScroll = (event) => {
    const slideSize = width - 40 + 20; // card width + margin
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={gradientStyle}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', padding: 20 }}>
          {/* Buddy Avatar */}
          <View style={styles.avatarContainer}>
            <Text style={{ fontSize: 40 }}>🐶</Text>
          </View>
          
          <Text style={[titleStyle, styles.mainTitle]}>
            Meet Buddy, your career coach 🐶
          </Text>
          
          <Text style={[titleStyle, styles.subtitle]}>
            I'll help you practice interview questions and improve your skills
          </Text>
          
          {/* Let's Go Button */}
          <LinearGradient
            colors={['#FF8C42', '#FF6B35']}
            style={[buttonStyle, { width: '80%', borderWidth: 0, marginBottom: 40 }]}
          >
            <TouchableOpacity 
              style={{ padding: 15, alignItems: 'center' }}
              onPress={handleLetsGo}
            >
              <Text style={[buttonTextStyle, { color: COLORS.white }]}>Let's Go!</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Readable Carousel Section */}
          <View style={styles.carouselContainer}>
            <Text style={styles.carouselTitle}>Discover SkillBuddy Features</Text>
            
            <Animated.View style={[styles.carouselWrapper, { opacity: fadeAnim }]}>
              <FlatList
                ref={flatListRef}
                data={cardsData}
                renderItem={renderCard}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                snapToInterval={width - 40 + 20}
                decelerationRate="fast"
                contentContainerStyle={styles.flatListContainer}
              />
            </Animated.View>

            {/* Carousel Indicators */}
            <View style={styles.indicatorContainer}>
              {cardsData.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    { 
                      backgroundColor: index === currentIndex ? COLORS.primary : COLORS.gray,
                      width: index === currentIndex ? 24 : 8,
                    }
                  ]}
                  onPress={() => {
                    setCurrentIndex(index);
                    flatListRef.current?.scrollToIndex({ index, animated: true });
                  }}
                />
              ))}
            </View>

            {/* Navigation Hint */}
            <Text style={styles.hintText}>
              Swipe to explore • Auto-scrolls every 5 seconds
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = {
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFA366',
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainTitle: {
    textAlign: 'center', 
    marginBottom: 20,
    color: COLORS.white,
    fontSize: 24
  },
  subtitle: {
    fontSize: 16, 
    opacity: 0.8, 
    textAlign: 'center', 
    marginBottom: 30,
    lineHeight: 22,
    color: COLORS.lightGray
  },
  carouselContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  carouselTitle: {
    fontSize: 22,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    marginBottom: 30,
    textAlign: 'center',
  },
  carouselWrapper: {
    height: 450,
    width: '100%',
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  card: {
    height: 420,
    marginHorizontal: 10,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 25,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardScrollView: {
    flex: 1,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 20,
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: 'Snell Roundhand',
    color: COLORS.white,
    lineHeight: 18,
    opacity: 0.9,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: COLORS.gray,
  },
  hintText: {
    fontSize: 12,
    fontFamily: 'Snell Roundhand',
    color: COLORS.gray,
    marginTop: 15,
    textAlign: 'center',
    opacity: 0.8,
  },
};