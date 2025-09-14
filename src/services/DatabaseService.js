import SQLite from 'react-native-sqlite-storage';
import {v4 as uuidv4} from 'react-native-uuid';

class DatabaseService {
  static db = null;

  static async initialize() {
    try {
      this.db = await SQLite.openDatabase({
        name: 'PillReminderDB.db',
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  static async createTables() {
    const createPillsTable = `
      CREATE TABLE IF NOT EXISTS pills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        time TEXT NOT NULL,
        color TEXT DEFAULT 'blue',
        image_uri TEXT,
        taken BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT,
        family_member_id TEXT
      );
    `;

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        is_family_admin BOOLEAN DEFAULT 0,
        family_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createFamilyMembersTable = `
      CREATE TABLE IF NOT EXISTS family_members (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        family_id TEXT NOT NULL,
        name TEXT NOT NULL,
        relationship TEXT,
        can_add_pills BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `;

    const createPillHistoryTable = `
      CREATE TABLE IF NOT EXISTS pill_history (
        id TEXT PRIMARY KEY,
        pill_id TEXT NOT NULL,
        taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT,
        family_member_id TEXT,
        FOREIGN KEY (pill_id) REFERENCES pills (id)
      );
    `;

    const createSubscriptionsTable = `
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan_type TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_date DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `;

    await this.db.executeSql(createPillsTable);
    await this.db.executeSql(createUsersTable);
    await this.db.executeSql(createFamilyMembersTable);
    await this.db.executeSql(createPillHistoryTable);
    await this.db.executeSql(createSubscriptionsTable);
  }

  // Pill CRUD operations
  static async addPill(pillData) {
    const id = uuidv4();
    const {
      name,
      dosage,
      time,
      color = 'blue',
      imageUri,
      userId,
      familyMemberId,
    } = pillData;

    const query = `
      INSERT INTO pills (id, name, dosage, time, color, image_uri, user_id, family_member_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          [id, name, dosage, time, color, imageUri, userId, familyMemberId],
          (tx, results) => {
            resolve({id, ...pillData});
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  static async getPills(userId, familyMemberId = null) {
    let query = 'SELECT * FROM pills WHERE user_id = ?';
    let params = [userId];

    if (familyMemberId) {
      query += ' AND family_member_id = ?';
      params.push(familyMemberId);
    }

    query += ' ORDER BY time ASC';

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          params,
          (tx, results) => {
            const pills = [];
            for (let i = 0; i < results.rows.length; i++) {
              pills.push(results.rows.item(i));
            }
            resolve(pills);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  static async updatePill(id, updates) {
    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.values(updates);
    values.push(id);

    const query = `UPDATE pills SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          values,
          (tx, results) => {
            resolve(results);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  static async deletePill(id) {
    const query = 'DELETE FROM pills WHERE id = ?';

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          [id],
          (tx, results) => {
            resolve(results);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  static async markPillAsTaken(pillId, userId, familyMemberId = null) {
    const pillHistoryId = uuidv4();
    
    // Add to history
    const historyQuery = `
      INSERT INTO pill_history (id, pill_id, user_id, family_member_id)
      VALUES (?, ?, ?, ?)
    `;

    // Update pill status
    const updateQuery = 'UPDATE pills SET taken = 1 WHERE id = ?';

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          historyQuery,
          [pillHistoryId, pillId, userId, familyMemberId],
          (tx, results) => {
            tx.executeSql(
              updateQuery,
              [pillId],
              (tx, results) => {
                resolve(results);
              },
              (error) => {
                reject(error);
              }
            );
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  // User operations
  static async createUser(userData) {
    const id = uuidv4();
    const {name, email, isFamilyAdmin = false, familyId} = userData;

    const query = `
      INSERT INTO users (id, name, email, is_family_admin, family_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          [id, name, email, isFamilyAdmin, familyId],
          (tx, results) => {
            resolve({id, ...userData});
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  static async getUser(userId) {
    const query = 'SELECT * FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          [userId],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows.item(0));
            } else {
              resolve(null);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  // Family operations
  static async addFamilyMember(memberData) {
    const id = uuidv4();
    const {userId, familyId, name, relationship, canAddPills = false} = memberData;

    const query = `
      INSERT INTO family_members (id, user_id, family_id, name, relationship, can_add_pills)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          [id, userId, familyId, name, relationship, canAddPills],
          (tx, results) => {
            resolve({id, ...memberData});
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  static async getFamilyMembers(familyId) {
    const query = 'SELECT * FROM family_members WHERE family_id = ? ORDER BY created_at ASC';

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          [familyId],
          (tx, results) => {
            const members = [];
            for (let i = 0; i < results.rows.length; i++) {
              members.push(results.rows.item(i));
            }
            resolve(members);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  // Subscription operations
  static async createSubscription(subscriptionData) {
    const id = uuidv4();
    const {userId, planType, isActive = true, endDate} = subscriptionData;

    const query = `
      INSERT INTO subscriptions (id, user_id, plan_type, is_active, end_date)
      VALUES (?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          [id, userId, planType, isActive, endDate],
          (tx, results) => {
            resolve({id, ...subscriptionData});
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }

  static async getActiveSubscription(userId) {
    const query = `
      SELECT * FROM subscriptions 
      WHERE user_id = ? AND is_active = 1 
      ORDER BY start_date DESC 
      LIMIT 1
    `;

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          [userId],
          (tx, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows.item(0));
            } else {
              resolve(null);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }
}

export default DatabaseService;