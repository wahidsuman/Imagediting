import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatabaseService from '../services/DatabaseService';
import NotificationService from '../services/NotificationService';
import AuthService from '../services/AuthService';

const HomeScreen = ({navigation}) => {
  const [pills, setPills] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const userPills = await DatabaseService.getPills(currentUser.id);
        setPills(userPills);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const markAsTaken = async (pillId) => {
    try {
      await DatabaseService.markPillAsTaken(pillId, user.id);
      await loadData();
      
      // Cancel notification
      await NotificationService.cancelPillReminder(pillId);
      
      Alert.alert('Success', 'Medication marked as taken!');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark medication as taken');
      console.error('Error marking pill as taken:', error);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTodaysPills = () => {
    return pills.filter(pill => !pill.taken);
  };

  const getTakenPills = () => {
    return pills.filter(pill => pill.taken);
  };

  const getUpcomingPills = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    return pills
      .filter(pill => !pill.taken)
      .filter(pill => {
        const [hours, minutes] = pill.time.split(':');
        const pillMinutes = parseInt(hours) * 60 + parseInt(minutes);
        return pillMinutes >= currentMinutes;
      })
      .sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':');
        const [bHours, bMinutes] = b.time.split(':');
        return (parseInt(aHours) * 60 + parseInt(aMinutes)) - (parseInt(bHours) * 60 + parseInt(bMinutes));
      });
  };

  const getOverduePills = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    return pills
      .filter(pill => !pill.taken)
      .filter(pill => {
        const [hours, minutes] = pill.time.split(':');
        const pillMinutes = parseInt(hours) * 60 + parseInt(minutes);
        return pillMinutes < currentMinutes;
      });
  };

  const renderPillCard = (pill, isOverdue = false) => (
    <TouchableOpacity
      key={pill.id}
      style={[
        styles.pillCard,
        isOverdue && styles.overdueCard,
        pill.taken && styles.takenCard,
      ]}
      onPress={() => !pill.taken && markAsTaken(pill.id)}>
      <View style={styles.pillImageContainer}>
        <Image
          source={
            pill.image_uri
              ? {uri: pill.image_uri}
              : require('../../assets/default-pill.png')
          }
          style={styles.pillImage}
        />
        {pill.taken && (
          <View style={styles.takenBadge}>
            <Icon name="check" size={16} color="#ffffff" />
          </View>
        )}
      </View>
      
      <View style={styles.pillInfo}>
        <Text style={[styles.pillName, pill.taken && styles.takenText]}>
          {pill.name}
        </Text>
        <Text style={[styles.pillDosage, pill.taken && styles.takenText]}>
          {pill.dosage}
        </Text>
        <Text style={[styles.pillTime, isOverdue && styles.overdueText]}>
          {formatTime(pill.time)}
        </Text>
      </View>
      
      {!pill.taken && (
        <TouchableOpacity
          style={[styles.takeButton, isOverdue && styles.overdueButton]}
          onPress={() => markAsTaken(pill.id)}>
          <Text style={styles.takeButtonText}>
            {isOverdue ? 'Take Now' : 'Take'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const upcomingPills = getUpcomingPills();
  const overduePills = getOverduePills();
  const takenPills = getTakenPills();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}, {user?.name || 'User'}!</Text>
          <Text style={styles.date}>
            {currentTime.toLocaleDateString([], {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.time}>
            {currentTime.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPill')}>
          <Icon name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{takenPills.length}</Text>
          <Text style={styles.statLabel}>Taken</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{upcomingPills.length}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, overduePills.length > 0 && styles.overdueNumber]}>
            {overduePills.length}
          </Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
      </View>

      {/* Overdue Pills */}
      {overduePills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Overdue Medications</Text>
          {overduePills.map(pill => renderPillCard(pill, true))}
        </View>
      )}

      {/* Upcoming Pills */}
      {upcomingPills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Upcoming Medications</Text>
          {upcomingPills.map(pill => renderPillCard(pill))}
        </View>
      )}

      {/* Taken Pills */}
      {takenPills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Taken Today</Text>
          {takenPills.map(pill => renderPillCard(pill))}
        </View>
      )}

      {/* Empty State */}
      {pills.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="medication" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No medications added yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the + button to add your first medication
          </Text>
        </View>
      )}

      {/* Family Plan CTA */}
      {user && !user.is_family_admin && (
        <TouchableOpacity
          style={styles.familyCta}
          onPress={() => navigation.navigate('Premium')}>
          <View style={styles.familyCtaContent}>
            <Icon name="family-restroom" size={32} color="#8B5CF6" />
            <View style={styles.familyCtaText}>
              <Text style={styles.familyCtaTitle}>Upgrade to Family Plan</Text>
              <Text style={styles.familyCtaSubtitle}>
                Add up to 5 family members and manage medications remotely
              </Text>
            </View>
            <Icon name="arrow-forward" size={24} color="#8B5CF6" />
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  time: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 2,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  overdueNumber: {
    color: '#EF4444',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  takenCard: {
    backgroundColor: '#F0FDF4',
  },
  pillImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  pillImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  takenBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillInfo: {
    flex: 1,
  },
  pillName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  pillDosage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  pillTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  takenText: {
    color: '#6B7280',
  },
  overdueText: {
    color: '#EF4444',
  },
  takeButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  overdueButton: {
    backgroundColor: '#EF4444',
  },
  takeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  familyCta: {
    margin: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
  },
  familyCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyCtaText: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  familyCtaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  familyCtaSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default HomeScreen;