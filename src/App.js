import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import WelcomeScreen from './screens/WelcomeScreen';
import MainTabs from './navigation/MainTabs';
import AddPillScreen from './screens/AddPillScreen';
import EditPillScreen from './screens/EditPillScreen';
import PremiumScreen from './screens/PremiumScreen';
import CameraScreen from './screens/CameraScreen';
import FamilyScreen from './screens/FamilyScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if first launch
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setIsFirstLaunch(hasLaunched === null);
      
      // Set authenticated to true for now (simplified)
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  if (isFirstLaunch === null) {
    return null; // Loading screen
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}>
          {isFirstLaunch ? (
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen 
                name="AddPill" 
                component={AddPillScreen}
                options={{headerShown: true, title: 'Add Medication'}}
              />
              <Stack.Screen 
                name="EditPill" 
                component={EditPillScreen}
                options={{headerShown: true, title: 'Edit Medication'}}
              />
              <Stack.Screen 
                name="Premium" 
                component={PremiumScreen}
                options={{headerShown: true, title: 'Premium'}}
              />
              <Stack.Screen 
                name="Camera" 
                component={CameraScreen}
                options={{headerShown: true, title: 'Take Photo'}}
              />
              <Stack.Screen 
                name="Family" 
                component={FamilyScreen}
                options={{headerShown: true, title: 'Family'}}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{headerShown: true, title: 'Settings'}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;