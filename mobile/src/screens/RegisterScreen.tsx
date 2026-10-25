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
import { ArrowLeft, User, Mail, Phone, Lock, Gift, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { registerCustomer } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Required Fields', 'Please fill in Name, Email, Phone, and Password.');
      return;
    }

    setIsLoading(true);
    const res = await registerCustomer(name, email, phone, password, referralCode);
    setIsLoading(false);

    if (res.success) {
      Alert.alert(
        'Registration Successful! 🎉',
        referralCode
          ? 'Welcome to Califnco! ₹250 welcome credits added to your wallet.'
          : 'Welcome to Califnco Water Systems!',
        [{ text: 'Start Shopping', onPress: () => navigation.replace('MainTabs') }]
      );
    } else {
      Alert.alert('Registration Error', res.error || 'Failed to create account.');
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
        <Text style={[styles.navTitle, { color: colors.text }]}>Customer Registration</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.heading, { color: colors.text }]}>Create Your Account</Text>
          <Text style={[styles.sub, { color: colors.subText }]}>
            Enjoy verified water purifiers, replacement cartridges, and certified doorstep maintenance.
          </Text>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <User size={16} color={colors.subText} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address *</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Mail size={16} color={colors.subText} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="rahul@example.com"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Mobile Phone *</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Phone size={16} color={colors.subText} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+91 98765 43210"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Password *</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Lock size={16} color={colors.subText} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••••••"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          {/* Referral Code (Optional) */}
          <View style={styles.formRow}>
            <View style={styles.referralHeader}>
              <Text style={[styles.label, { color: colors.text }]}>Have a Referral Code? (Optional)</Text>
              <Text style={styles.bonusTag}>GET ₹250 BONUS</Text>
            </View>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Gift size={16} color="#0284c7" />
              <TextInput
                value={referralCode}
                onChangeText={setReferralCode}
                autoCapitalize="characters"
                placeholder="Enter friend's code (e.g. ANANYA77)"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text, fontWeight: '700' }]}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitBtnText}>Create Customer Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerLink}>
            <Text style={[styles.alreadyText, { color: colors.subText }]}>Already registered?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.signInText, { color: colors.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
  },
  sub: {
    fontSize: 11,
    lineHeight: 16,
  },
  formRow: {
    gap: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bonusTag: {
    color: '#0284c7',
    fontSize: 9,
    fontWeight: '800',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 12,
  },
  submitBtn: {
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  alreadyText: {
    fontSize: 12,
  },
  signInText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
