import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = (status || '').toLowerCase();

  const getTheme = () => {
    switch (norm) {
      case 'delivered':
      case 'approved':
      case 'completed':
      case 'paid':
        return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'processing':
      case 'shipped':
      case 'assigned':
      case 'in_progress':
        return { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' };
      case 'confirmed':
        return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'pending':
        return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
      case 'cancelled':
      case 'rejected':
      case 'failed':
        return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    }
  };

  const theme = getTheme();
  const label = norm.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <View style={[styles.badge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      <View style={[styles.dot, { backgroundColor: theme.text }]} />
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
