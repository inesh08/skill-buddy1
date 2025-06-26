import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../styles';

export default function UIDesignerScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.container}>
      <Text style={styles.title}>Mock Interview: UI/UX Designer</Text>
      <Text style={styles.question}>How do you approach user research for a new design project?</Text>

      <LinearGradient
        colors={['#FF8C42', '#FF6B35']}
        style={styles.button}
      >
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        colors={['#FF6B35', '#E55A2B']}
        style={styles.button}
      >
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>End</Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  question: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: COLORS.lightGray,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    borderRadius: 10,
    marginVertical: 10,
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
});