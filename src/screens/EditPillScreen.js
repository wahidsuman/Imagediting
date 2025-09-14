import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import DatabaseService from '../services/DatabaseService';
import NotificationService from '../services/NotificationService';

const EditPillScreen = ({navigation, route}) => {
  const {pill} = route.params;
  const [name, setName] = useState(pill.name || '');
  const [dosage, setDosage] = useState(pill.dosage || '');
  const [time, setTime] = useState(pill.time || '');
  const [color, setColor] = useState(pill.color || 'blue');
  const [imageUri, setImageUri] = useState(pill.image_uri || null);
  const [loading, setLoading] = useState(false);

  const colors = [
    {name: 'blue', hex: '#3B82F6'},
    {name: 'red', hex: '#EF4444'},
    {name: 'green', hex: '#10B981'},
    {name: 'orange', hex: '#F59E0B'},
    {name: 'purple', hex: '#8B5CF6'},
    {name: 'pink', hex: '#EC4899'},
  ];

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to update the pill image',
      [
        {text: 'Camera', onPress: () => openCamera()},
        {text: 'Gallery', onPress: () => openGallery()},
        {text: 'Remove', onPress: () => setImageUri(null), style: 'destructive'},
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchCamera(options, response => {
      if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter medication name');
      return;
    }
    if (!dosage.trim()) {
      Alert.alert('Error', 'Please enter dosage');
      return;
    }
    if (!time) {
      Alert.alert('Error', 'Please select time');
      return;
    }

    setLoading(true);
    try {
      const updates = {
        name: name.trim(),
        dosage: dosage.trim(),
        time,
        color,
        image_uri: imageUri,
      };

      await DatabaseService.updatePill(pill.id, updates);
      
      // Reschedule notification if time changed
      if (time !== pill.time) {
        await NotificationService.cancelPillReminder(pill.id);
        await NotificationService.schedulePillReminder({...pill, ...updates});
      }

      Alert.alert('Success', 'Medication updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update medication');
      console.error('Error updating pill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await NotificationService.cancelPillReminder(pill.id);
              await DatabaseService.deletePill(pill.id);
              Alert.alert('Success', 'Medication deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete medication');
              console.error('Error deleting pill:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Pill Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={handleImagePicker}>
            {imageUri ? (
              <Image source={{uri: imageUri}} style={styles.pillImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="camera-alt" size={48} color="#9CA3AF" />
                <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medication Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Blood Pressure Medication"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dosage *</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="e.g., 10mg, 1 tablet"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => {
                // In a real app, you'd use a time picker
                Alert.alert('Time Picker', 'Time picker would open here');
              }}>
              <Text style={[styles.timeText, !time && styles.placeholderText]}>
                {time || 'Select time'}
              </Text>
              <Icon name="access-time" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pill Color</Text>
            <View style={styles.colorContainer}>
              {colors.map(colorOption => (
                <TouchableOpacity
                  key={colorOption.name}
                  style={[
                    styles.colorOption,
                    {backgroundColor: colorOption.hex},
                    color === colorOption.name && styles.selectedColor,
                  ]}
                  onPress={() => setColor(colorOption.name)}>
                  {color === colorOption.name && (
                    <Icon name="check" size={20} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}>
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}>
            <Icon name="delete" size={20} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Delete Medication</Text>
          </TouchableOpacity>
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
  imageSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
  },
  pillImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  timeInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  timeText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#1F2937',
  },
  actionButtons: {
    gap: 16,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditPillScreen;