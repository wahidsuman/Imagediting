// Simple UUID generator (no external dependency)
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Simple in-memory storage (no external dependency)
const memoryStorage = new Map();

class DatabaseService {
  static async initialize() {
    try {
      console.log('Database initialized successfully (in-memory storage)');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  // User management
  static async createUser(userData) {
    try {
      const user = {
        id: generateUUID(),
        ...userData,
        created_at: new Date().toISOString(),
      };
      
      memoryStorage.set(`user_${user.id}`, user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUser(userId) {
    try {
      return memoryStorage.get(`user_${userId}`) || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Pill management
  static async createPill(pillData) {
    try {
      const pill = {
        id: generateUUID(),
        ...pillData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      memoryStorage.set(`pill_${pill.id}`, pill);
      return pill;
    } catch (error) {
      console.error('Error creating pill:', error);
      throw error;
    }
  }

  static async getPills(userId) {
    try {
      const pills = [];
      for (const [key, value] of memoryStorage.entries()) {
        if (key.startsWith('pill_') && value.user_id === userId) {
          pills.push(value);
        }
      }
      return pills;
    } catch (error) {
      console.error('Error getting pills:', error);
      return [];
    }
  }

  static async updatePill(pillId, updates) {
    try {
      const pill = memoryStorage.get(`pill_${pillId}`);
      if (pill) {
        const updatedPill = {
          ...pill,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        memoryStorage.set(`pill_${pillId}`, updatedPill);
        return updatedPill;
      }
      return null;
    } catch (error) {
      console.error('Error updating pill:', error);
      throw error;
    }
  }

  static async deletePill(pillId) {
    try {
      return memoryStorage.delete(`pill_${pillId}`);
    } catch (error) {
      console.error('Error deleting pill:', error);
      throw error;
    }
  }

  // Pill history
  static async recordPillTaken(pillId, userId, notes = '') {
    try {
      const historyEntry = {
        id: generateUUID(),
        pill_id: pillId,
        user_id: userId,
        taken_at: new Date().toISOString(),
        notes,
      };
      
      memoryStorage.set(`history_${historyEntry.id}`, historyEntry);
      return historyEntry;
    } catch (error) {
      console.error('Error recording pill taken:', error);
      throw error;
    }
  }

  static async getPillHistory(userId) {
    try {
      const history = [];
      for (const [key, value] of memoryStorage.entries()) {
        if (key.startsWith('history_') && value.user_id === userId) {
          history.push(value);
        }
      }
      return history.sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at));
    } catch (error) {
      console.error('Error getting pill history:', error);
      return [];
    }
  }
}

export default DatabaseService;