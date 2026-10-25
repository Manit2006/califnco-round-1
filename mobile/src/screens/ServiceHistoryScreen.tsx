import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  Wrench,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Calendar,
  Plus,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { StatusBadge } from '../components/StatusBadge';
import { ServiceBooking } from '../types';

export const ServiceHistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [services, setServices] = useState<ServiceBooking[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const storedRaw = await AsyncStorage.getItem('califnco_services_history');
        if (storedRaw) {
          setServices(JSON.parse(storedRaw));
        } else {
          const sample: ServiceBooking[] = [
            {
              id: 'srv-demo-1',
              ticketNumber: 'SRV-2026-0082',
              userId: 'cust-1',
              userName: 'Ananya Iyer',
              userPhone: '+91 99887 76655',
              serviceType: 'installation',
              purifierBrand: 'Aquaflow',
              purifierModel: 'Copper Prime RO 12L',
              issueDescription: 'New home water purifier wall-mount installation and inlet plumbing connection.',
              preferredDate: '2026-10-26',
              preferredTimeSlot: 'morning',
              serviceAddress: {
                fullName: 'Ananya Iyer',
                phone: '+91 99887 76655',
                addressLine: 'Flat 402, Green Meadows, Indiranagar',
                city: 'Bengaluru',
                pincode: '560038',
              },
              status: 'assigned',
              assignedTechnician: {
                name: 'Ramesh Babu (Certified Technician)',
                phone: '+91 98860 12345',
                assignedAt: Date.now() - 6 * 3600000,
              },
              technicianNotes: 'Technician equipped with diamond tile drill bit and 1/4 brass diverter kit.',
              createdAt: Date.now() - 18 * 3600000,
              updatedAt: Date.now() - 6 * 3600000,
            },
          ];
          setServices(sample);
          await AsyncStorage.setItem('califnco_services_history', JSON.stringify(sample));
        }
      } catch (e) {
        console.warn('Error loading services', e);
      }
    };

    loadServices();
    const unsub = navigation.addListener('focus', loadServices);
    return unsub;
  }, [navigation]);

  const handleCancelTicket = async (ticketId: string) => {
    Alert.alert(
      'Cancel Service Ticket',
      'Are you sure you want to cancel this service request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const updated = services.map((s) =>
              s.id === ticketId ? { ...s, status: 'cancelled' as const } : s
            );
            setServices(updated);
            await AsyncStorage.setItem('califnco_services_history', JSON.stringify(updated));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Navbar */}
      <View style={[styles.nav, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Service & Installation Tickets</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ServiceBooking')}
          style={[styles.addBtn, { backgroundColor: colors.primaryLight }]}
        >
          <Plus size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {services.map((item) => (
          <View
            key={item.id}
            style={[styles.ticketCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.cardHeader}>
              <div>
                <View style={styles.ticketBadgeRow}>
                  <Text style={[styles.ticketNum, { color: colors.text }]}>{item.ticketNumber}</Text>
                  <Text style={[styles.serviceTypeBadge, { color: colors.primary }]}>
                    {item.serviceType.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.ticketDate, { color: colors.subText }]}>
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </div>
              <StatusBadge status={item.status} />
            </View>

            <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
              <Text style={[styles.modelText, { color: colors.text }]}>
                Appliance: {item.purifierBrand} {item.purifierModel || ''}
              </Text>
              <Text style={[styles.slotText, { color: colors.subText }]}>
                Scheduled: {item.preferredDate} ({item.preferredTimeSlot.toUpperCase()})
              </Text>
              <Text style={[styles.descText, { color: colors.subText }]}>
                "{item.issueDescription}"
              </Text>
            </View>

            {/* Assigned Technician if present */}
            {item.assignedTechnician && (
              <View style={[styles.techBox, { borderColor: colors.primary }]}>
                <View style={styles.techHeader}>
                  <User size={14} color={colors.primary} />
                  <Text style={[styles.techTitle, { color: colors.primary }]}>
                    Assigned Water Engineer
                  </Text>
                </View>
                <Text style={[styles.techName, { color: colors.text }]}>
                  {item.assignedTechnician.name}
                </Text>
                <Text style={[styles.techPhone, { color: colors.subText }]}>
                  Phone: {item.assignedTechnician.phone}
                </Text>
                {item.technicianNotes && (
                  <Text style={[styles.techNotes, { color: colors.subText }]}>
                    Note: {item.technicianNotes}
                  </Text>
                )}
              </View>
            )}

            {/* Cancel Action if pending */}
            {item.status === 'pending' && (
              <TouchableOpacity
                onPress={() => handleCancelTicket(item.id)}
                style={styles.cancelAction}
              >
                <Text style={styles.cancelText}>Cancel Service Ticket</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {services.length === 0 && (
          <View style={styles.emptyBox}>
            <Wrench size={48} color={colors.subText} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Service Tickets</Text>
            <Text style={[styles.emptySub, { color: colors.subText }]}>
              Need water purifier installation or repair? Book a certified engineer.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ServiceBooking')}
              style={[styles.bookBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.bookBtnText}>Book Installation / Repair</Text>
            </TouchableOpacity>
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
    fontSize: 14,
    fontWeight: '700',
  },
  addBtn: {
    padding: 6,
    borderRadius: 8,
  },
  scroll: {
    padding: 16,
    gap: 14,
  },
  ticketCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ticketBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketNum: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  serviceTypeBadge: {
    fontSize: 9,
    fontWeight: '800',
  },
  ticketDate: {
    fontSize: 10,
    marginTop: 2,
  },
  infoBox: {
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  modelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  slotText: {
    fontSize: 11,
    fontWeight: '600',
  },
  descText: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  techBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#ecfeff',
  },
  techHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  techTitle: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  techName: {
    fontSize: 12,
    fontWeight: '700',
  },
  techPhone: {
    fontSize: 11,
    marginTop: 1,
  },
  techNotes: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 4,
  },
  cancelAction: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 4,
  },
  cancelText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 240,
    marginTop: 4,
  },
  bookBtn: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
