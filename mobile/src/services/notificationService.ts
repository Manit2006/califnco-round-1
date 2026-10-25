/**
 * In-App and Push Notification Service
 * Manages in-app notification state, unread badges, and FCM token registration.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationItem } from '../types';

const STORAGE_KEY_NOTIFS = 'califnco_mobile_notifications_v1';

const defaultNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    recipientUserId: 'all',
    title: 'Welcome to Califnco Water Systems!',
    message: 'Explore 50+ domestic & commercial RO purifiers, genuine membranes, and spare parts.',
    type: 'promo',
    isRead: false,
    createdAt: Date.now() - 24 * 3600000,
  },
  {
    id: 'n-2',
    recipientUserId: 'all',
    title: 'Doorstep Installation & Repair Available',
    message: 'Book certified RO technicians for installation or maintenance in under 60 seconds.',
    type: 'service',
    isRead: false,
    createdAt: Date.now() - 12 * 3600000,
  },
];

export async function getStoredNotifications(): Promise<NotificationItem[]> {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEY_NOTIFS);
    if (val) return JSON.parse(val);
  } catch (e) {
    console.warn('Error reading notifications', e);
  }
  return defaultNotifications;
}

export async function addNotification(
  title: string,
  message: string,
  type: NotificationItem['type'] = 'order',
  recipientUserId = 'current'
): Promise<NotificationItem> {
  const current = await getStoredNotifications();
  const newItem: NotificationItem = {
    id: 'notif-' + Date.now().toString(36),
    recipientUserId,
    title,
    message,
    type,
    isRead: false,
    createdAt: Date.now(),
  };

  const updated = [newItem, ...current];
  await AsyncStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
  return newItem;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const current = await getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  await AsyncStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
}

export async function registerPushNotificationToken(): Promise<string | null> {
  // FCM integration hook
  try {
    const token = 'fcm_token_califnco_' + Math.random().toString(36).slice(2);
    console.log('[FCM Notification Engine] Device Push Token registered:', token);
    return token;
  } catch (err) {
    console.warn('Push notification token registration error:', err);
    return null;
  }
}
