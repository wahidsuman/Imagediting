import AsyncStorage from '@react-native-async-storage/async-storage';
import DatabaseService from './DatabaseService';
import {v4 as uuidv4} from 'react-native-uuid';

class AuthService {
  static currentUser = null;

  static async getCurrentUser() {
    try {
      if (this.currentUser) {
        return this.currentUser;
      }

      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async setCurrentUser(user) {
    try {
      this.currentUser = user;
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  static async createUser(userData) {
    try {
      const {name, email, isFamilyAdmin = false} = userData;
      
      // Create family ID if user is admin
      const familyId = isFamilyAdmin ? uuidv4() : null;
      
      const user = await DatabaseService.createUser({
        name,
        email,
        isFamilyAdmin,
        familyId,
      });

      await this.setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async loginUser(userId) {
    try {
      const user = await DatabaseService.getUser(userId);
      if (user) {
        await this.setCurrentUser(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error logging in user:', error);
      return null;
    }
  }

  static async logout() {
    try {
      this.currentUser = null;
      await AsyncStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  static async updateUserProfile(updates) {
    try {
      if (!this.currentUser) return null;

      const updatedUser = {...this.currentUser, ...updates};
      await this.setCurrentUser(updatedUser);
      
      // Update in database
      // Note: You would need to add an updateUser method to DatabaseService
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async isFamilyAdmin() {
    try {
      const user = await this.getCurrentUser();
      return user ? user.is_family_admin : false;
    } catch (error) {
      console.error('Error checking family admin status:', error);
      return false;
    }
  }

  static async getFamilyId() {
    try {
      const user = await this.getCurrentUser();
      return user ? user.family_id : null;
    } catch (error) {
      console.error('Error getting family ID:', error);
      return null;
    }
  }
}

export default AuthService;