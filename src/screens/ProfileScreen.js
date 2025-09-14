import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthService from '../services/AuthService';
import DatabaseService from '../services/DatabaseService';

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const activeSubscription = await DatabaseService.getActiveSubscription(currentUser.id);
        setSubscription(activeSubscription);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              // Navigate to welcome screen
              navigation.reset({
                index: 0,
                routes: [{name: 'Welcome'}],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  const handleUpgrade = () => {
    navigation.navigate('Premium');
  };

  const handleFamily = () => {
    if (user?.is_family_admin) {
      navigation.navigate('Family');
    } else {
      navigation.navigate('Premium');
    }
  };

  const menuItems = [
    {
      icon: 'person',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => Alert.alert('Edit Profile', 'Profile editing would open here'),
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage notification settings',
      onPress: () => Alert.alert('Notifications', 'Notification settings would open here'),
    },
    {
      icon: 'backup',
      title: 'Data & Backup',
      subtitle: 'Backup and restore your data',
      onPress: () => Alert.alert('Backup', 'Backup settings would open here'),
    },
    {
      icon: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Help', 'Help center would open here'),
    },
    {
      icon: 'info',
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => Alert.alert('About', 'My Pills v1.0.0\nFamily Medication Tracker'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'No email provided'}</Text>
        
        {subscription && subscription.is_active && (
          <View style={styles.premiumBadge}>
            <Icon name="star" size={16} color="#F59E0B" />
            <Text style={styles.premiumText}>Premium Active</Text>
          </View>
        )}
      </View>

      {/* Subscription Status */}
      {subscription && subscription.is_active ? (
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Icon name="check-circle" size={24} color="#10B981" />
            <Text style={styles.subscriptionTitle}>Premium Active</Text>
          </View>
          <Text style={styles.subscriptionPlan}>
            Plan: {subscription.plan_type}
          </Text>
          <Text style={styles.subscriptionExpiry}>
            Expires: {new Date(subscription.end_date).toLocaleDateString()}
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.upgradeCard} onPress={handleUpgrade}>
          <View style={styles.upgradeContent}>
            <Icon name="star" size={32} color="#8B5CF6" />
            <View style={styles.upgradeText}>
              <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
              <Text style={styles.upgradeSubtitle}>
                Unlock family features and advanced notifications
              </Text>
            </View>
            <Icon name="arrow-forward" size={24} color="#8B5CF6" />
          </View>
        </TouchableOpacity>
      )}

      {/* Family Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Family</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleFamily}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIcon}>
              <Icon name="family-restroom" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Family Members</Text>
              <Text style={styles.menuSubtitle}>
                {user?.is_family_admin ? 'Manage family members' : 'Upgrade to add family'}
              </Text>
            </View>
          </View>
          <Icon name="arrow-forward-ios" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={24} color="#6B7280" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>My Pills v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  subscriptionCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subscriptionPlan: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  subscriptionExpiry: {
    fontSize: 14,
    color: '#6B7280',
  },
  upgradeCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeText: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default ProfileScreen;