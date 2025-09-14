import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = ({navigation}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderSound, setReminderSound] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [missedPillAlerts, setMissedPillAlerts] = useState(true);

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your medication data will be exported to a file that you can save or share.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Export',
          onPress: () => {
            // In a real app, you'd implement data export
            Alert.alert('Success', 'Data exported successfully!');
          },
        },
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Select a file to import your medication data.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Import',
          onPress: () => {
            // In a real app, you'd implement data import
            Alert.alert('Success', 'Data imported successfully!');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your medication data. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            // In a real app, you'd implement data clearing
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive medication reminders',
          type: 'switch',
          value: notificationsEnabled,
          onPress: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
          icon: 'volume-up',
          title: 'Reminder Sound',
          subtitle: 'Play sound with notifications',
          type: 'switch',
          value: reminderSound,
          onPress: () => setReminderSound(!reminderSound),
        },
        {
          icon: 'vibration',
          title: 'Vibration',
          subtitle: 'Vibrate with notifications',
          type: 'switch',
          value: vibrationEnabled,
          onPress: () => setVibrationEnabled(!vibrationEnabled),
        },
        {
          icon: 'warning',
          title: 'Missed Pill Alerts',
          subtitle: 'Alert when pills are missed',
          type: 'switch',
          value: missedPillAlerts,
          onPress: () => setMissedPillAlerts(!missedPillAlerts),
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          icon: 'cloud-upload',
          title: 'Export Data',
          subtitle: 'Export your medication data',
          type: 'action',
          onPress: handleExportData,
        },
        {
          icon: 'cloud-download',
          title: 'Import Data',
          subtitle: 'Import medication data from file',
          type: 'action',
          onPress: handleImportData,
        },
        {
          icon: 'delete-forever',
          title: 'Clear All Data',
          subtitle: 'Permanently delete all data',
          type: 'action',
          onPress: handleClearData,
          destructive: true,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: 'palette',
          title: 'Theme',
          subtitle: 'Light theme',
          type: 'action',
          onPress: () => Alert.alert('Theme', 'Theme selection would open here'),
        },
        {
          icon: 'text-size',
          title: 'Font Size',
          subtitle: 'Medium',
          type: 'action',
          onPress: () => Alert.alert('Font Size', 'Font size selection would open here'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'info',
          title: 'App Version',
          subtitle: '1.0.0',
          type: 'info',
        },
        {
          icon: 'privacy-tip',
          title: 'Privacy Policy',
          subtitle: 'View our privacy policy',
          type: 'action',
          onPress: () => Alert.alert('Privacy Policy', 'Privacy policy would open here'),
        },
        {
          icon: 'description',
          title: 'Terms of Service',
          subtitle: 'View terms and conditions',
          type: 'action',
          onPress: () => Alert.alert('Terms of Service', 'Terms would open here'),
        },
      ],
    },
  ];

  const renderSettingItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.settingItem, item.destructive && styles.destructiveItem]}
      onPress={item.onPress}
      disabled={item.type === 'info'}>
      <View style={styles.settingItemLeft}>
        <View style={[styles.settingIcon, item.destructive && styles.destructiveIcon]}>
          <Icon name={item.icon} size={24} color={item.destructive ? '#EF4444' : '#6B7280'} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, item.destructive && styles.destructiveText]}>
            {item.title}
          </Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      
      {item.type === 'switch' && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{false: '#D1D5DB', true: '#3B82F6'}}
          thumbColor={item.value ? '#ffffff' : '#ffffff'}
        />
      )}
      
      {item.type === 'action' && (
        <Icon name="arrow-forward-ios" size={16} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}
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
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  destructiveItem: {
    borderBottomColor: '#FEE2E2',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destructiveIcon: {
    backgroundColor: '#FEE2E2',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#EF4444',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default SettingsScreen;