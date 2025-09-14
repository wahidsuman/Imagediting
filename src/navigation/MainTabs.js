import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import PillsScreen from '../screens/PillsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Pills') {
            iconName = 'medication';
          } else if (route.name === 'History') {
            iconName = 'history';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{title: 'Today'}}
      />
      <Tab.Screen 
        name="Pills" 
        component={PillsScreen}
        options={{title: 'My Pills'}}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{title: 'History'}}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;