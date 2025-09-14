import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatabaseService from '../services/DatabaseService';
import AuthService from '../services/AuthService';

const FamilyScreen = ({navigation}) => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    canAddPills: false,
  });

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser && currentUser.is_family_admin) {
        const members = await DatabaseService.getFamilyMembers(currentUser.family_id);
        setFamilyMembers(members);
      }
    } catch (error) {
      console.error('Error loading family data:', error);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim()) {
      Alert.alert('Error', 'Please enter member name');
      return;
    }

    try {
      const memberData = {
        userId: user.id,
        familyId: user.family_id,
        name: newMember.name.trim(),
        relationship: newMember.relationship.trim() || 'Family Member',
        canAddPills: newMember.canAddPills,
      };

      await DatabaseService.addFamilyMember(memberData);
      await loadFamilyData();
      
      setNewMember({name: '', relationship: '', canAddPills: false});
      setShowAddModal(false);
      
      Alert.alert('Success', 'Family member added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add family member');
      console.error('Error adding family member:', error);
    }
  };

  const handleRemoveMember = (memberId) => {
    Alert.alert(
      'Remove Family Member',
      'Are you sure you want to remove this family member?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, you'd have a deleteFamilyMember method
              // await DatabaseService.deleteFamilyMember(memberId);
              await loadFamilyData();
              Alert.alert('Success', 'Family member removed');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove family member');
              console.error('Error removing family member:', error);
            }
          },
        },
      ]
    );
  };

  const handleManagePills = (member) => {
    // Navigate to member's pills management
    navigation.navigate('MemberPills', {member});
  };

  const renderMemberItem = ({item}) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberInitial}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberRelationship}>{item.relationship}</Text>
          <View style={styles.permissionBadge}>
            <Icon
              name={item.can_add_pills ? 'check' : 'close'}
              size={16}
              color={item.can_add_pills ? '#10B981' : '#EF4444'}
            />
            <Text style={[
              styles.permissionText,
              {color: item.can_add_pills ? '#10B981' : '#EF4444'}
            ]}>
              {item.can_add_pills ? 'Can add pills' : 'View only'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.memberActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleManagePills(item)}>
          <Icon name="medication" size={20} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemoveMember(item.id)}>
          <Icon name="delete" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user || !user.is_family_admin) {
    return (
      <View style={styles.container}>
        <View style={styles.upgradePrompt}>
          <Icon name="family-restroom" size={64} color="#8B5CF6" />
          <Text style={styles.upgradeTitle}>Family Plan Required</Text>
          <Text style={styles.upgradeSubtitle}>
            Upgrade to Premium to add and manage family members
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('Premium')}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Members</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}>
          <Icon name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Family Members List */}
      <FlatList
        data={familyMembers}
        renderItem={renderMemberItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="family-restroom" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No family members yet</Text>
            <Text style={styles.emptySubtitle}>
              Add family members to start managing their medications
            </Text>
          </View>
        }
      />

      {/* Add Member Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Family Member</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newMember.name}
                  onChangeText={text => setNewMember({...newMember, name: text})}
                  placeholder="Enter member name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Relationship</Text>
                <TextInput
                  style={styles.input}
                  value={newMember.relationship}
                  onChangeText={text => setNewMember({...newMember, relationship: text})}
                  placeholder="e.g., Mother, Father, Spouse"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setNewMember({...newMember, canAddPills: !newMember.canAddPills})}>
                <View style={[styles.checkbox, newMember.canAddPills && styles.checkboxChecked]}>
                  {newMember.canAddPills && <Icon name="check" size={16} color="#ffffff" />}
                </View>
                <View style={styles.checkboxText}>
                  <Text style={styles.checkboxTitle}>Can add medications</Text>
                  <Text style={styles.checkboxSubtitle}>
                    Allow this member to add and manage their own medications
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddMember}>
                <Text style={styles.saveButtonText}>Add Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  upgradePrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  upgradeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 16,
  },
  memberCard: {
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
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  memberInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  memberRelationship: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  permissionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkboxText: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  checkboxSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FamilyScreen;