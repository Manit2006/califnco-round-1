import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Wrench,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { addNotification } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceBooking, ServiceType } from '../types';

export const ServiceBookingScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const initialType: ServiceType = route.params?.serviceType || 'installation';
  const [serviceType, setServiceType] = useState<ServiceType>(initialType);
  const [purifierBrand, setPurifierBrand] = useState('Aquaflow');
  const [purifierModel, setPurifierModel] = useState('Copper Prime RO 12L');
  const [issueDescription, setIssueDescription] = useState('Doorstep installation & plumbing setup requested.');
  const [preferredDate, setPreferredDate] = useState('2026-10-26');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  // Customer contact info
  const [fullName, setFullName] = useState(user?.displayName || 'Ananya Iyer');
  const [phone, setPhone] = useState(user?.phoneNumber || '+91 99887 76655');
  const [addressLine, setAddressLine] = useState('Flat 402, Green Meadows, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560038');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitBooking = async () => {
    if (!purifierBrand || !issueDescription || !fullName || !phone || !addressLine || !pincode) {
      Alert.alert('Required Fields', 'Please fill in all mandatory service contact and address details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketNumber = 'SRV-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
      const newBooking: ServiceBooking = {
        id: 'srv-' + Date.now().toString(36),
        ticketNumber,
        userId: user?.uid || 'cust-1',
        userName: fullName.trim(),
        userPhone: phone.trim(),
        serviceType,
        purifierBrand: purifierBrand.trim(),
        purifierModel: purifierModel.trim(),
        issueDescription: issueDescription.trim(),
        preferredDate,
        preferredTimeSlot,
        serviceAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          addressLine: addressLine.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Save to local storage service tickets
      const existingRaw = await AsyncStorage.getItem('califnco_services_history');
      const existing: ServiceBooking[] = existingRaw ? JSON.parse(existingRaw) : [];
      await AsyncStorage.setItem('califnco_services_history', JSON.stringify([newBooking, ...existing]));

      // Dispatch in-app notification
      await addNotification(
        `Service Ticket Booked #${ticketNumber}`,
        `Your ${serviceType.replace('_', ' ')} request for ${purifierBrand} is registered. A certified technician will be assigned shortly.`,
        'service',
        user?.uid
      );

      Alert.alert(
        'Service Ticket Booked! 🛠️',
        `Ticket #${ticketNumber} created successfully for ${preferredDate} (${preferredTimeSlot}). Our operations desk will assign a technician shortly.`,
        [
          {
            text: 'View Service Tickets',
            onPress: () => navigation.replace('ServiceHistory'),
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (e: any) {
      Alert.alert('Booking Error', e.message || 'Could not register service request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions: Array<{ type: ServiceType; label: string; desc: string }> = [
    {
      type: 'installation',
      label: 'New Installation',
      desc: 'Wall-mounting, inlet valve & TDS setup',
    },
    {
      type: 'maintenance',
      label: 'Preventive Service',
      desc: 'Periodic cleaning & TDS calibration',
    },
    {
      type: 'repair',
      label: 'Breakdown Repair',
      desc: 'Pump, SMPS, or solenoid failure',
    },
    {
      type: 'filter_replacement',
      label: 'Filter Replacement',
      desc: 'Membrane, sediment & carbon replacement',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Navbar */}
      <View style={[styles.nav, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Book Water Purifier Service</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Service Type Radio Cards */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Select Service Category</Text>
          <View style={styles.typeGrid}>
            {serviceOptions.map((opt) => {
              const isSelected = serviceType === opt.type;
              return (
                <TouchableOpacity
                  key={opt.type}
                  onPress={() => setServiceType(opt.type)}
                  style={[
                    styles.typeCard,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.background,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <View style={styles.typeCardTop}>
                    <Text
                      style={[
                        styles.typeCardTitle,
                        { color: isSelected ? colors.primary : colors.text },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && <CheckCircle2 size={16} color={colors.primary} />}
                  </View>
                  <Text style={[styles.typeCardDesc, { color: colors.subText }]}>{opt.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Appliance & Issue Description */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Purifier Appliance Details</Text>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Water Purifier Brand *</Text>
            <TextInput
              value={purifierBrand}
              onChangeText={setPurifierBrand}
              placeholder="e.g. Aquaflow, Kent, PureStream, AO Smith"
              placeholderTextColor={colors.subText}
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Model (Optional)</Text>
            <TextInput
              value={purifierModel}
              onChangeText={setPurifierModel}
              placeholder="e.g. Copper Prime RO 12L / Under-Sink"
              placeholderTextColor={colors.subText}
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Describe Issue / Requirement *</Text>
            <TextInput
              multiline
              numberOfLines={3}
              value={issueDescription}
              onChangeText={setIssueDescription}
              placeholder="Explain any symptoms (e.g. low water flow, unusual taste, beeping alarm, leaking connector)..."
              placeholderTextColor={colors.subText}
              style={[
                styles.textArea,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
            />
          </View>
        </View>

        {/* Preferred Date & Time Slot */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Schedule Date & Slot</Text>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Preferred Date</Text>
            <View style={styles.slotRow}>
              {['2026-10-26 (Tomorrow)', '2026-10-27 (Next Day)', '2026-10-28'].map((d) => {
                const dateVal = d.split(' ')[0];
                const isSelected = preferredDate === dateVal;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setPreferredDate(dateVal)}
                    style={[
                      styles.slotBtn,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.background,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotBtnText,
                        { color: isSelected ? '#ffffff' : colors.text },
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Time Slot Preference</Text>
            <View style={styles.slotRow}>
              {[
                { id: 'morning', label: 'Morning\n9 AM - 12 PM' },
                { id: 'afternoon', label: 'Afternoon\n12 PM - 4 PM' },
                { id: 'evening', label: 'Evening\n4 PM - 7 PM' },
              ].map((s) => {
                const isSelected = preferredTimeSlot === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => setPreferredTimeSlot(s.id as any)}
                    style={[
                      styles.slotBtn,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.background,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotBtnText,
                        { color: isSelected ? '#ffffff' : colors.text },
                      ]}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Doorstep Address Form */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Service Location & Phone</Text>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Customer Name *</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Contact Phone *</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Address Line *</Text>
            <TextInput
              value={addressLine}
              onChangeText={setAddressLine}
              style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.grid2}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>City *</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>Pincode *</Text>
              <TextInput
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmitBooking}
          disabled={isSubmitting}
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
        >
          <Wrench size={18} color="#ffffff" />
          <Text style={styles.submitBtnText}>Confirm Doorstep Service Booking</Text>
        </TouchableOpacity>
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
  scroll: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
  },
  typeGrid: {
    gap: 8,
  },
  typeCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeCardTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  typeCardDesc: {
    fontSize: 10,
    marginTop: 2,
  },
  formRow: {
    marginBottom: 10,
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 11,
  },
  textArea: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 11,
    textAlignVertical: 'top',
    minHeight: 64,
  },
  slotRow: {
    flexDirection: 'row',
    gap: 8,
  },
  slotBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotBtnText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
