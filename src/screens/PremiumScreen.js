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

const PremiumScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleUpgrade = async (planType) => {
    setLoading(true);
    try {
      // In a real app, you'd integrate with a payment service like RevenueCat
      // For now, we'll simulate the upgrade
      
      const subscriptionData = {
        userId: user.id,
        planType,
        isActive: true,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };

      await DatabaseService.createSubscription(subscriptionData);
      
      // Update user to family admin
      await DatabaseService.updateUser(user.id, {is_family_admin: true});
      
      Alert.alert(
        'Upgrade Successful!',
        'Welcome to the Family Plan! You can now add family members and manage their medications.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Family');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to upgrade. Please try again.');
      console.error('Error upgrading:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = () => {
    // In a real app, you'd restore previous purchases
    Alert.alert('Restore Purchases', 'This would restore your previous purchases');
  };

  const isPremium = subscription && subscription.is_active;

  const features = [
    {
      icon: 'family-restroom',
      title: 'Family Management',
      description: 'Add up to 5 family members and manage their medications',
      color: '#8B5CF6',
    },
    {
      icon: 'cloud-sync',
      title: 'Cloud Sync',
      description: 'Sync data across all devices in real-time',
      color: '#3B82F6',
    },
    {
      icon: 'notifications-active',
      title: 'Advanced Notifications',
      description: 'Customizable reminders and missed pill alerts',
      color: '#10B981',
    },
    {
      icon: 'analytics',
      title: 'Detailed Analytics',
      description: 'Track medication adherence and generate reports',
      color: '#F59E0B',
    },
    {
      icon: 'backup',
      title: 'Data Backup',
      description: 'Automatic backup and restore functionality',
      color: '#EF4444',
    },
    {
      icon: 'support-agent',
      title: 'Priority Support',
      description: '24/7 customer support and priority assistance',
      color: '#EC4899',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="star" size={48} color="#F59E0B" />
          </View>
          <Text style={styles.title}>
            {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
          </Text>
          <Text style={styles.subtitle}>
            {isPremium
              ? 'You have access to all premium features'
              : 'Unlock powerful features for your family'}
          </Text>
        </View>

        {isPremium ? (
          /* Premium Active State */
          <View style={styles.premiumActive}>
            <View style={styles.activeCard}>
              <Icon name="check-circle" size={32} color="#10B981" />
              <Text style={styles.activeTitle}>Premium Active</Text>
              <Text style={styles.activeSubtitle}>
                Plan: {subscription.plan_type}
              </Text>
              <Text style={styles.activeSubtitle}>
                Expires: {new Date(subscription.end_date).toLocaleDateString()}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.familyButton}
              onPress={() => navigation.navigate('Family')}>
              <Icon name="family-restroom" size={24} color="#ffffff" />
              <Text style={styles.familyButtonText}>Manage Family</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Upgrade Options */
          <>
            {/* Pricing Cards */}
            <View style={styles.pricingContainer}>
              <View style={styles.pricingCard}>
                <Text style={styles.pricingTitle}>Monthly</Text>
                <Text style={styles.pricingPrice}>$4.99</Text>
                <Text style={styles.pricingPeriod}>per month</Text>
                <TouchableOpacity
                  style={styles.pricingButton}
                  onPress={() => handleUpgrade('monthly')}
                  disabled={loading}>
                  <Text style={styles.pricingButtonText}>
                    {loading ? 'Processing...' : 'Choose Monthly'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.pricingCard, styles.popularCard]}>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
                <Text style={styles.pricingTitle}>Yearly</Text>
                <Text style={styles.pricingPrice}>$39.99</Text>
                <Text style={styles.pricingPeriod}>per year</Text>
                <Text style={styles.savingsText}>Save 33%</Text>
                <TouchableOpacity
                  style={[styles.pricingButton, styles.popularButton]}
                  onPress={() => handleUpgrade('yearly')}
                  disabled={loading}>
                  <Text style={styles.pricingButtonText}>
                    {loading ? 'Processing...' : 'Choose Yearly'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Features List */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Premium Features</Text>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={[styles.featureIcon, {backgroundColor: feature.color}]}>
                    <Icon name={feature.icon} size={24} color="#ffffff" />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Restore Button */}
            <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            Subscriptions auto-renew unless cancelled at least 24 hours before the
            end of the current period.
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  premiumActive: {
    alignItems: 'center',
  },
  activeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  activeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  activeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  familyButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  familyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  popularCard: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  pricingPeriod: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pricingButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: '#8B5CF6',
  },
  pricingButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  restoreButton: {
    alignItems: 'center',
    padding: 16,
  },
  restoreText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default PremiumScreen;