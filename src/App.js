import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider as PaperProvider} from 'react-native-paper';
import {StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import WelcomeScreen from './screens/WelcomeScreen';
import MainTabs from './navigation/MainTabs';
import AddPillScreen from './screens/AddPillScreen';
import EditPillScreen from './screens/EditPillScreen';
import FamilyScreen from './screens/FamilyScreen';
import SettingsScreen from './screens/SettingsScreen';
import PremiumScreen from './screens/PremiumScreen';
import CameraScreen from './screens/CameraScreen';

// Import services
import NotificationService from './services/NotificationService';
import DatabaseService from './services/DatabaseService';
import AuthService from './services/AuthService';

const Stack = createStackNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await DatabaseService.initialize();
      
      // Initialize notification service
      await NotificationService.initialize();
      
      // Check if first launch
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setIsFirstLaunch(hasLaunched === null);
      
      // Check authentication status
      const user = await AuthService.getCurrentUser();
      setIsAuthenticated(!!user);
      
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  if (isFirstLaunch === null) {
    return null; // Loading screen
  }

  return (
    <PaperProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}>
          {isFirstLaunch ? (
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          ) : !isAuthenticated ? (
            <Stack.Screen name="Auth" component={WelcomeScreen} />
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen 
                name="AddPill" 
                component={AddPillScreen}
                options={{
                  headerShown: true,
                  title: 'Add Medication',
                  headerStyle: {backgroundColor: '#3B82F6'},
                  headerTintColor: '#ffffff',
                }}
              />
              <Stack.Screen 
                name="EditPill" 
                component={EditPillScreen}
                options={{
                  headerShown: true,
                  title: 'Edit Medication',
                  headerStyle: {backgroundColor: '#3B82F6'},
                  headerTintColor: '#ffffff',
                }}
              />
              <Stack.Screen 
                name="Family" 
                component={FamilyScreen}
                options={{
                  headerShown: true,
                  title: 'Family Members',
                  headerStyle: {backgroundColor: '#3B82F6'},
                  headerTintColor: '#ffffff',
                }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{
                  headerShown: true,
                  title: 'Settings',
                  headerStyle: {backgroundColor: '#3B82F6'},
                  headerTintColor: '#ffffff',
                }}
              />
              <Stack.Screen 
                name="Premium" 
                component={PremiumScreen}
                options={{
                  headerShown: true,
                  title: 'Premium Features',
                  headerStyle: {backgroundColor: '#8B5CF6'},
                  headerTintColor: '#ffffff',
                }}
              />
              <Stack.Screen 
                name="Camera" 
                component={CameraScreen}
                options={{
                  headerShown: true,
                  title: 'Take Pill Photo',
                  headerStyle: {backgroundColor: '#3B82F6'},
                  headerTintColor: '#ffffff',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;