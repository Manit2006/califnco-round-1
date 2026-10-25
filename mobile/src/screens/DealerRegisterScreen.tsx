import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Building,
  User,
  Mail,
  Phone,
  FileText,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const DealerRegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { registerDealer } = useAuth();

  const [companyName, setCompanyName] = useState('Apex Water Solutions Pvt Ltd');
  const [applicantName, setApplicantName] = useState('Rajesh Sharma');
  const [email, setEmail] = useState('apex.purifiers@gmail.com');
  const [phone, setPhone] = useState('+91 98234 56789');
  const [gstin, setGstin] = useState('27AADCA1234F1Z5');
  const [tradeLicense, setTradeLicense] = useState('MH/TRD/2021/8892');
  const [yearsInBusiness, setYearsInBusiness] = useState('6');
  const [address, setAddress] = useState('Plot 42, Sector 18, Vashi, Navi Mumbai, MH - 400703');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitApplication = async () => {
    if (!companyName || !applicantName || !email || !phone || !gstin || !address) {
      Alert.alert('Required Fields', 'Please fill in Company Name, Applicant Name, Email, Phone, GSTIN and Billing Address.');
      return;
    }

    if (gstin.trim().length < 10) {
      Alert.alert('Invalid GSTIN', 'Please enter a valid GST identification number.');
      return;
    }

    setIsLoading(true);
    const res = await registerDealer(
      companyName,
      applicantName,
      email,
      phone,
      gstin,
      tradeLicense,
      Number(yearsInBusiness) || 1,
      address
    );
    setIsLoading(false);

    if (res.success) {
      Alert.alert(
        'Dealer Application Submitted! 📋',
        `Your application for "${companyName}" (GSTIN: ${gstin.toUpperCase()}) has been submitted for Admin verification.\n\nNote: Wholesale discounted prices and bulk MOQ access will be activated once approved by the Califnco operations desk.`,
        [{ text: 'Go to App', onPress: () => navigation.replace('MainTabs') }]
      );
    } else {
      Alert.alert('Application Error', res.error || 'Failed to submit dealer application.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Navbar */}
      <View style={[styles.nav, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Wholesale Dealer Application</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Verification Gate Notice */}
        <View style={styles.gateNotice}>
          <AlertTriangle size={18} color="#d97706" style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.gateNoticeTitle}>Admin Verification Mandatory</Text>
            <Text style={styles.gateNoticeText}>
              In accordance with Califnco wholesale policy, all B2B dealer registrations require manual GSTIN & trade license verification before wholesale pricing is unlocked.
            </Text>
          </View>
        </View>

        {/* Application Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardHeading, { color: colors.text }]}>Business Information</Text>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Registered Business / Shop Name *</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Building size={16} color={colors.subText} />
              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="e.g. HydroTech Aqua Systems"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Authorized Signatory / Applicant Name *</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <User size={16} color={colors.subText} />
              <TextInput
                value={applicantName}
                onChangeText={setApplicantName}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Business Email *</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Mail size={16} color={colors.subText} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="dealer@hydrotech.com"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Business Phone *</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Phone size={16} color={colors.subText} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+91 98220 12345"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <View style={styles.grid2}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>GSTIN (15 Digits) *</Text>
              <TextInput
                value={gstin}
                onChangeText={setGstin}
                autoCapitalize="characters"
                placeholder="27AADCA1234F1Z5"
                placeholderTextColor={colors.subText}
                style={[
                  styles.inputSolo,
                  { color: colors.text, backgroundColor: colors.background, borderColor: colors.border, fontFamily: 'monospace' },
                ]}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>Trade License #</Text>
              <TextInput
                value={tradeLicense}
                onChangeText={setTradeLicense}
                placeholder="MH/TRD/2021"
                placeholderTextColor={colors.subText}
                style={[
                  styles.inputSolo,
                  { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
                ]}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Years in Water Treatment Business</Text>
            <TextInput
              value={yearsInBusiness}
              onChangeText={setYearsInBusiness}
              keyboardType="numeric"
              placeholder="e.g. 5"
              placeholderTextColor={colors.subText}
              style={[
                styles.inputSolo,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Billing & Warehouse Address *</Text>
            <TextInput
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
              placeholder="Shop/Warehouse number, commercial complex, city, state and pincode"
              placeholderTextColor={colors.subText}
              style={[
                styles.textArea,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmitApplication}
            disabled={isLoading}
            style={[styles.submitBtn, { backgroundColor: '#7e22ce' }]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <ShieldCheck size={18} color="#ffffff" />
                <Text style={styles.submitBtnText}>Submit Dealer Application for Approval</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  gateNotice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  gateNoticeTitle: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '800',
  },
  gateNoticeText: {
    color: '#b45309',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  formRow: {
    gap: 4,
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 11,
  },
  inputSolo: {
    height: 42,
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
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 46,
    borderRadius: 12,
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});
