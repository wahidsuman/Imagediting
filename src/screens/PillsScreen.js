import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatabaseService from '../services/DatabaseService';
import AuthService from '../services/AuthService';

const PillsScreen = ({navigation}) => {
  const [pills, setPills] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadPills();
  }, []);

  const loadPills = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const userPills = await DatabaseService.getPills(currentUser.id);
        setPills(userPills);
      }
    } catch (error) {
      console.error('Error loading pills:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPills();
    setRefreshing(false);
  };

  const markAsTaken = async (pillId) => {
    try {
      await DatabaseService.markPillAsTaken(pillId, user.id);
      await loadPills();
      Alert.alert('Success', 'Medication marked as taken!');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark medication as taken');
      console.error('Error marking pill as taken:', error);
    }
  };

  const deletePill = (pillId) => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.deletePill(pillId);
              await loadPills();
              Alert.alert('Success', 'Medication deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete medication');
              console.error('Error deleting pill:', error);
            }
          },
        },
      ]
    );
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
  };

  const renderPillItem = ({item}) => (
    <View style={[styles.pillCard, item.taken && styles.takenCard]}>
      <View style={styles.pillImageContainer}>
        <Image
          source={
            item.image_uri
              ? {uri: item.image_uri}
              : require('../../assets/default-pill.png')
          }
          style={styles.pillImage}
        />
        {item.taken && (
          <View style={styles.takenBadge}>
            <Icon name="check" size={16} color="#ffffff" />
          </View>
        )}
      </View>
      
      <View style={styles.pillInfo}>
        <Text style={[styles.pillName, item.taken && styles.takenText]}>
          {item.name}
        </Text>
        <Text style={[styles.pillDosage, item.taken && styles.takenText]}>
          {item.dosage}
        </Text>
        <Text style={[styles.pillTime, item.taken && styles.takenText]}>
          {formatTime(item.time)}
        </Text>
      </View>
      
      <View style={styles.pillActions}>
        {!item.taken && (
          <TouchableOpacity
            style={styles.takeButton}
            onPress={() => markAsTaken(item.id)}>
            <Text style={styles.takeButtonText}>Take</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditPill', {pill: item})}>
          <Icon name="edit" size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deletePill(item.id)}>
          <Icon name="delete" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const getStats = () => {
    const total = pills.length;
    const taken = pills.filter(pill => pill.taken).length;
    const remaining = total - taken;
    return {total, taken, remaining};
  };

  const stats = getStats();

  return (
    <View style={styles.container}>
      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.takenNumber]}>{stats.taken}</Text>
          <Text style={styles.statLabel}>Taken</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.remainingNumber]}>{stats.remaining}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>

      {/* Pills List */}
      <FlatList
        data={pills}
        renderItem={renderPillItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="medication" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No medications yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first medication to get started
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => navigation.navigate('AddPill')}>
              <Text style={styles.addFirstButtonText}>Add Medication</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPill')}>
        <Icon name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  takenNumber: {
    color: '#10B981',
  },
  remainingNumber: {
    color: '#F59E0B',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
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
  takenCard: {
    backgroundColor: '#F0FDF4',
    opacity: 0.8,
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
  pillActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  takeButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  takeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
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
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
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
});

export default PillsScreen;