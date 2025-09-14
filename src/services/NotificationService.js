import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import WorkManager from 'react-native-workmanager';
import DatabaseService from './DatabaseService';

class NotificationService {
  static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      // Configure push notifications
      PushNotification.configure({
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
          
          if (notification.userInteraction) {
            // Handle notification tap
            this.handleNotificationTap(notification);
          }
          
          if (Platform.OS === 'ios') {
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          }
        },
        onAction: function (notification) {
          console.log('ACTION:', notification.action);
          console.log('NOTIFICATION:', notification);
        },
        onRegistrationError: function(err) {
          console.error(err.message, err);
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
      });

      // Create notification channel for Android
      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: 'pill-reminders',
            channelName: 'Pill Reminders',
            channelDescription: 'Notifications for pill reminders',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          (created) => console.log(`createChannel returned '${created}'`)
        );
      }

      this.isInitialized = true;
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Notification initialization error:', error);
    }
  }

  static async schedulePillReminder(pill) {
    try {
      const {id, name, dosage, time, imageUri, color} = pill;
      
      // Parse time
      const [hours, minutes] = time.split(':');
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // If time has passed today, schedule for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const notificationId = parseInt(id.replace(/\D/g, '').substring(0, 8)) || Math.floor(Math.random() * 1000000);

      const notificationData = {
        id: notificationId,
        title: 'Time for your medication! 💊',
        message: `${name} - ${dosage}`,
        date: reminderTime,
        repeatType: 'day',
        userInfo: {
          pillId: id,
          pillName: name,
          dosage: dosage,
          imageUri: imageUri,
          color: color,
        },
        actions: [
          {
            id: 'take',
            title: 'Mark as Taken',
            icon: 'ic_check',
          },
          {
            id: 'snooze',
            title: 'Snooze 10 min',
            icon: 'ic_snooze',
          },
        ],
        largeIcon: imageUri || 'ic_launcher',
        bigText: `${name} - ${dosage}\n\nTap to mark as taken or snooze for 10 minutes.`,
        subText: 'Pill Reminder',
        color: this.getColorHex(color),
        vibrate: true,
        vibration: 300,
        priority: 'high',
        importance: 'high',
        channelId: 'pill-reminders',
      };

      // Schedule the notification
      PushNotification.localNotificationSchedule(notificationData);

      console.log(`Scheduled reminder for ${name} at ${time}`);
    } catch (error) {
      console.error('Error scheduling reminder:', error);
    }
  }

  static async cancelPillReminder(pillId) {
    try {
      const notificationId = parseInt(pillId.replace(/\D/g, '').substring(0, 8)) || Math.floor(Math.random() * 1000000);
      PushNotification.cancelLocalNotifications({id: notificationId.toString()});
      console.log(`Cancelled reminder for pill ${pillId}`);
    } catch (error) {
      console.error('Error cancelling reminder:', error);
    }
  }

  static async rescheduleAllReminders(userId) {
    try {
      // Cancel all existing notifications
      PushNotification.cancelAllLocalNotifications();

      // Get all active pills for the user
      const pills = await DatabaseService.getPills(userId);
      
      // Schedule reminders for each pill
      for (const pill of pills) {
        if (!pill.taken) {
          await this.schedulePillReminder(pill);
        }
      }

      console.log('Rescheduled all reminders');
    } catch (error) {
      console.error('Error rescheduling reminders:', error);
    }
  }

  static handleNotificationTap(notification) {
    const {pillId, action} = notification;
    
    if (action === 'take') {
      this.markPillAsTaken(pillId);
    } else if (action === 'snooze') {
      this.snoozePill(pillId, 10); // 10 minutes
    }
  }

  static async markPillAsTaken(pillId) {
    try {
      // Update database
      await DatabaseService.markPillAsTaken(pillId, 'current_user_id');
      
      // Cancel the notification
      await this.cancelPillReminder(pillId);
      
      // Show confirmation
      PushNotification.localNotification({
        title: 'Medication Taken! ✅',
        message: 'Great job! Your medication has been recorded.',
        channelId: 'pill-reminders',
      });
    } catch (error) {
      console.error('Error marking pill as taken:', error);
    }
  }

  static async snoozePill(pillId, minutes) {
    try {
      // Cancel current notification
      await this.cancelPillReminder(pillId);
      
      // Get pill data
      const pills = await DatabaseService.getPills('current_user_id');
      const pill = pills.find(p => p.id === pillId);
      
      if (pill) {
        // Schedule new notification in X minutes
        const snoozeTime = new Date();
        snoozeTime.setMinutes(snoozeTime.getMinutes() + minutes);
        
        const notificationData = {
          id: parseInt(pillId.replace(/\D/g, '').substring(0, 8)) || Math.floor(Math.random() * 1000000),
          title: 'Time for your medication! 💊',
          message: `${pill.name} - ${pill.dosage}`,
          date: snoozeTime,
          userInfo: {
            pillId: pillId,
            pillName: pill.name,
            dosage: pill.dosage,
            imageUri: pill.image_uri,
            color: pill.color,
          },
          actions: [
            {
              id: 'take',
              title: 'Mark as Taken',
              icon: 'ic_check',
            },
            {
              id: 'snooze',
              title: 'Snooze 10 min',
              icon: 'ic_snooze',
            },
          ],
          largeIcon: pill.image_uri || 'ic_launcher',
          bigText: `${pill.name} - ${pill.dosage}\n\nTap to mark as taken or snooze for 10 minutes.`,
          subText: 'Pill Reminder (Snoozed)',
          color: this.getColorHex(pill.color),
          vibrate: true,
          vibration: 300,
          priority: 'high',
          importance: 'high',
          channelId: 'pill-reminders',
        };

        PushNotification.localNotificationSchedule(notificationData);
        
        PushNotification.localNotification({
          title: 'Reminder Snoozed',
          message: `You'll be reminded again in ${minutes} minutes.`,
          channelId: 'pill-reminders',
        });
      }
    } catch (error) {
      console.error('Error snoozing pill:', error);
    }
  }

  static getColorHex(color) {
    const colors = {
      blue: '#3B82F6',
      red: '#EF4444',
      green: '#10B981',
      orange: '#F59E0B',
      purple: '#8B5CF6',
      pink: '#EC4899',
    };
    return colors[color] || '#3B82F6';
  }

  static async sendMissedPillNotification(pill) {
    try {
      PushNotification.localNotification({
        title: 'Missed Medication Alert! ⚠️',
        message: `You missed ${pill.name} at ${pill.time}`,
        channelId: 'pill-reminders',
        priority: 'high',
        importance: 'high',
        vibrate: true,
        vibration: 500,
        actions: [
          {
            id: 'take_now',
            title: 'Take Now',
            icon: 'ic_check',
          },
          {
            id: 'skip',
            title: 'Skip',
            icon: 'ic_close',
          },
        ],
        userInfo: {
          pillId: pill.id,
          action: 'missed',
        },
      });
    } catch (error) {
      console.error('Error sending missed pill notification:', error);
    }
  }

  static async checkMissedPills(userId) {
    try {
      const pills = await DatabaseService.getPills(userId);
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      for (const pill of pills) {
        if (!pill.taken) {
          const [hours, minutes] = pill.time.split(':');
          const pillTime = parseInt(hours) * 60 + parseInt(minutes);
          
          // If pill time has passed by more than 30 minutes
          if (currentTime > pillTime + 30) {
            await this.sendMissedPillNotification(pill);
          }
        }
      }
    } catch (error) {
      console.error('Error checking missed pills:', error);
    }
  }
}

export default NotificationService;