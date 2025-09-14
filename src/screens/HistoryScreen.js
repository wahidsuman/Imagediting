import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatabaseService from '../services/DatabaseService';
import AuthService from '../services/AuthService';

const HistoryScreen = ({navigation}) => {
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadHistory();
  }, [selectedDate]);

  const loadHistory = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        // In a real app, you'd have a getPillHistory method
        // const historyData = await DatabaseService.getPillHistory(currentUser.id, selectedDate);
        // For now, we'll use mock data
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
  };

  const renderHistoryItem = ({item}) => (
    <View style={styles.historyCard}>
      <View style={styles.historyImageContainer}>
        <Image
          source={
            item.image_uri
              ? {uri: item.image_uri}
              : require('../../assets/default-pill.png')
          }
          style={styles.historyImage}
        />
        <View style={styles.statusBadge}>
          <Icon name="check" size={16} color="#ffffff" />
        </View>
      </View>
      
      <View style={styles.historyInfo}>
        <Text style={styles.historyName}>{item.name}</Text>
        <Text style={styles.historyDosage}>{item.dosage}</Text>
        <Text style={styles.historyTime}>
          Taken at {formatTime(item.time)}
        </Text>
      </View>
      
      <View style={styles.historyStatus}>
        <Icon name="check-circle" size={24} color="#10B981" />
      </View>
    </View>
  );

  const getStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const thisWeek = history.filter(item => {
      const itemDate = new Date(item.taken_at);
      return itemDate >= startOfWeek;
    });

    const thisMonth = history.filter(item => {
      const itemDate = new Date(item.taken_at);
      return itemDate.getMonth() === today.getMonth() && 
             itemDate.getFullYear() === today.getFullYear();
    });

    return {
      today: history.length,
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
    };
  };

  const stats = getStats();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medication History</Text>
        <Text style={styles.headerSubtitle}>
          {formatDate(selectedDate)}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.today}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.thisWeek}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.thisMonth}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
      </View>

      {/* History List */}
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="history" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptySubtitle}>
              Your medication history will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  historyCard: {
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
  historyImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  statusBadge: {
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
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  historyDosage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  historyStatus: {
    marginLeft: 16,
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
});

export default HistoryScreen;