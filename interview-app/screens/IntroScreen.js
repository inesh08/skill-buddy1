import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, Animated, Dimensions, PanGestureHandler, State } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientStyle, buttonStyle, buttonTextStyle, titleStyle, COLORS } from '../styles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 200;

const carouselItems = [
  {
    id: 1,
    title: 'Practice Interviews',
    description: 'Get ready for your dream job with realistic mock interviews',
    gradient: ['#FF8C42', '#FF6B35'],
    icon: '💼'
  },
  {
    id: 2,
    title: 'Multiple Careers',
    description: 'Choose from Software Dev, Data Analyst, UI/UX, and Marketing paths',
    gradient: ['#6C63FF', '#9F7AEA'],
    icon: '🎯'
  },
  {
    id: 3,
    title: 'Earn XP & Rewards',
    description: 'Complete interviews to earn experience points and unlock achievements',
    gradient: ['#48BB78', '#38A169'],
    icon: '🏆'
  },
  {
    id: 4,
    title: 'Track Progress',
    description: 'Monitor your improvement and build confidence over time',
    gradient: ['#ED8936', '#DD6B20'],
    icon: '📈'
  }
];

export default function IntroScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Auto-rotate carousel
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate rotation
    Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const renderCarouselItem = (item, index) => {
    const isActive = index === currentIndex;
    const translateX = (index - currentIndex) * (CARD_WIDTH * 0.8);
    const scale = isActive ? 1 : 0.8;
    const opacity = isActive ? 1 : 0.6;

    return (
      <Animated.View
        key={item.id}
        style={[
          {
            position: 'absolute',
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            transform: [
              { translateX },
              { scale },
              { 
                rotateY: rotationValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', isActive ? '5deg' : '0deg']
                })
              }
            ],
            opacity,
            zIndex: isActive ? 10 : 1,
          }
        ]}
      >
        <LinearGradient
          colors={item.gradient}
          style={{
            flex: 1,
            borderRadius: 20,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 15,
          }}
        >
          <Text style={{ fontSize: 40, marginBottom: 10 }}>{item.icon}</Text>
          <Text style={{
            fontSize: 20,
            fontFamily: 'Helvetica',
            color: '#FFFFFF',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 8
          }}>
            {item.title}
          </Text>
          <Text style={{
            fontSize: 14,
            fontFamily: 'Helvetica',
            color: '#FFFFFF',
            textAlign: 'center',
            opacity: 0.9,
            lineHeight: 20
          }}>
            {item.description}
          </Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <LinearGradient 
      colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} 
      style={gradientStyle}
    >
      <Text style={[titleStyle, { fontSize: 32, color: '#FF8C42', marginBottom: 10 }]}>Skillbuddy</Text>
      <Text style={{
        fontSize: 16,
        fontFamily: 'Helvetica',
        color: COLORS.lightGray,
        textAlign: 'center',
        marginBottom: 40,
        opacity: 0.8
      }}>
        Your AI-powered career coach
      </Text>
      
      {/* 3D Carousel */}
      <View style={{
        height: CARD_HEIGHT + 40,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        overflow: 'visible'
      }}>
        {carouselItems.map((item, index) => renderCarouselItem(item, index))}
      </View>

      {/* Carousel Indicators */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        gap: 8
      }}>
        {carouselItems.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentIndex(index)}
            style={{
              width: currentIndex === index ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentIndex === index ? COLORS.primary : COLORS.darkGray,
            }}
          />
        ))}
      </View>
      
      <LinearGradient
        colors={['#FF8C42', '#FF6B35']}
        style={[buttonStyle, { borderWidth: 0, width: '80%' }]}
      >
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center' }}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={[buttonTextStyle, { color: '#FFFFFF' }]}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
  );
}