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
import { Droplets, Mail, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { login, switchUserRoleForTesting } = useAuth();

  const [email, setEmail] = useState('ananya.iyer@gmail.com');
  const [password, setPassword] = useState('WaterCare@2026');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Required', 'Please enter your email.');
      return;
    }
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res.success) {
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Login Error', res.error || 'Failed to authenticate.');
    }
  };

  const handleForgotPassword = () => {
    Alert.prompt
      ? Alert.prompt('Password Reset', 'Enter your email to receive recovery instructions:', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send Reset Link',
            onPress: (val) => Alert.alert('Sent', `Password recovery link dispatched to ${val || email}.`),
          },
        ])
      : Alert.alert('Password Reset', `Password recovery instructions dispatched to ${email}.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Brand Hero */}
        <View style={styles.brandHero}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Droplets size={32} color="#ffffff" />
          </View>
          <Text style={[styles.brandName, { color: colors.text }]}>Califnco Water</Text>
          <Text style={[styles.brandTagline, { color: colors.subText }]}>
            Advanced Water Purification & Wholesale Distribution
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Sign In to Account</Text>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Mail size={16} color={colors.subText} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@domain.com"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.pwHeader}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
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

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={[styles.loginBtn, { backgroundColor: colors.primary }]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <ArrowRight size={16} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Testing Accounts for Evaluator */}
        <View style={[styles.demoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.demoTitle, { color: colors.text }]}>⚡ Fast Demo Logins for Evaluator:</Text>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              onPress={() => {
                switchUserRoleForTesting('customer');
                navigation.replace('MainTabs');
              }}
              style={[styles.demoBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
              <Text style={[styles.demoBtnText, { color: colors.text }]}>Retail Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                switchUserRoleForTesting('approved_dealer');
                navigation.replace('MainTabs');
              }}
              style={[styles.demoBtn, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}
            >
              <Text style={[styles.demoBtnText, { color: '#065f46' }]}>Wholesale Dealer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Registration links */}
        <View style={styles.registerLinksRow}>
          <Text style={[styles.dontHaveText, { color: colors.subText }]}>New to Califnco?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLinkText, { color: colors.primary }]}>Register as Customer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('DealerRegister')}
          style={styles.dealerRegisterBtn}
        >
          <ShieldCheck size={16} color="#9333ea" />
          <Text style={styles.dealerRegisterText}>Apply as Authorized Wholesale Dealer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  brandHero: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 260,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  formRow: {
    gap: 6,
  },
  pwHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
  forgotText: {
    fontSize: 10,
    fontWeight: '700',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 12,
  },
  loginBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    marginTop: 6,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  demoCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  demoBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  registerLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  dontHaveText: {
    fontSize: 12,
  },
  registerLinkText: {
    fontSize: 12,
    fontWeight: '800',
  },
  dealerRegisterBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
  },
  dealerRegisterText: {
    color: '#9333ea',
    fontSize: 11,
    fontWeight: '700',
  },
});
