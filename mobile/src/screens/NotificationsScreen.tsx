import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ArrowLeft, Bell, Check, ShoppingBag, Wrench, ShieldCheck, Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { getStoredNotifications, markNotificationAsRead } from '../services/notificationService';
import { NotificationItem } from '../types';

export const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    getStoredNotifications().then(setNotifications);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={18} color="#0891b2" />;
      case 'service':
        return <Wrench size={18} color="#10b981" />;
      case 'dealer':
        return <ShieldCheck size={18} color="#9333ea" />;
      default:
        return <Sparkles size={18} color="#f59e0b" />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Navbar */}
      <View style={[styles.nav, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Notifications</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {notifications.map((n) => (
          <TouchableOpacity
            key={n.id}
            activeOpacity={0.85}
            onPress={() => handleMarkRead(n.id)}
            style={[
              styles.notifCard,
              {
                backgroundColor: n.isRead ? colors.card : colors.primaryLight,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.iconCol}>{getIcon(n.type)}</View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={[styles.notifTitle, { color: colors.text }]}>{n.title}</Text>
                {!n.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text style={[styles.notifMsg, { color: colors.subText }]}>{n.message}</Text>
              <Text style={[styles.notifTime, { color: colors.subText }]}>
                {new Date(n.createdAt).toLocaleDateString()} at{' '}
                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {notifications.length === 0 && (
          <View style={styles.empty}>
            <Bell size={48} color={colors.subText} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Notifications</Text>
            <Text style={[styles.emptySub, { color: colors.subText }]}>
              You're all caught up with order dispatches and field services.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 6,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  scroll: {
    padding: 16,
    gap: 10,
  },
  notifCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconCol: {
    marginTop: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06b6d4',
  },
  notifMsg: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  notifTime: {
    fontSize: 9,
    marginTop: 6,
  },
  empty: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 240,
  },
});
