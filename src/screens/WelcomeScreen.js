import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({navigation}) => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isFamilyAdmin, setIsFamilyAdmin] = useState(false);

  const handleGetStarted = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      const user = await AuthService.createUser({
        name: name.trim(),
        email: email.trim() || null,
        isFamilyAdmin,
      });

      // Mark as not first launch
      await AsyncStorage.setItem('hasLaunched', 'true');

      // Navigate to main app
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
      console.error('Error creating user:', error);
    }
  };

  const handleLogin = async () => {
    // For demo purposes, we'll create a user with the entered name
    // In a real app, you'd implement proper authentication
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      const user = await AuthService.createUser({
        name: name.trim(),
        email: email.trim() || null,
        isFamilyAdmin,
      });

      await AsyncStorage.setItem('hasLaunched', 'true');
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
      console.error('Error logging in:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="medication" size={80} color="#3B82F6" />
          </View>
          <Text style={styles.title}>My Pills</Text>
          <Text style={styles.subtitle}>Family Medication Tracker</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Icon name="notifications" size={24} color="#10B981" />
            <Text style={styles.featureText}>Smart Reminders</Text>
          </View>
          <View style={styles.feature}>
            <Icon name="camera-alt" size={24} color="#F59E0B" />
            <Text style={styles.featureText}>Pill Photos</Text>
          </View>
          <View style={styles.feature}>
            <Icon name="family-restroom" size={24} color="#8B5CF6" />
            <Text style={styles.featureText}>Family Sharing</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Welcome Back!' : 'Get Started'}
          </Text>

          <View style={styles.inputContainer}>
            <Icon name="person" size={24} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email" size={24} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email (Optional)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsFamilyAdmin(!isFamilyAdmin)}>
            <View style={[styles.checkbox, isFamilyAdmin && styles.checkboxChecked]}>
              {isFamilyAdmin && <Icon name="check" size={16} color="#ffffff" />}
            </View>
            <Text style={styles.checkboxText}>
              I want to create a family group (Premium)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={isLogin ? handleLogin : handleGetStarted}>
            <Text style={styles.primaryButtonText}>
              {isLogin ? 'Login' : 'Get Started'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.secondaryButtonText}>
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxText: {
    flex: 1,
    fontSize: 16,
    color: '#6B7280',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default WelcomeScreen;