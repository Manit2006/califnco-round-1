import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserRole, DealerStatus } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isApprovedDealer: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (
    name: string,
    email: string,
    phone: string,
    password?: string,
    referralCode?: string
  ) => Promise<{ success: boolean; error?: string }>;
  registerDealer: (
    companyName: string,
    applicantName: string,
    email: string,
    phone: string,
    gstin: string,
    tradeLicense: string,
    yearsInBusiness: number,
    address: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchUserRoleForTesting: (role: 'customer' | 'approved_dealer' | 'pending_dealer') => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const STORAGE_KEY_AUTH = 'califnco_mobile_user_session';

// Demo seed accounts
const sampleCustomer: UserProfile = {
  uid: 'cust-demo-001',
  email: 'ananya.iyer@gmail.com',
  displayName: 'Ananya Iyer',
  phoneNumber: '+91 99887 76655',
  role: 'customer',
  referralCode: 'ANANYA77',
  walletBalance: 500,
  createdAt: Date.now() - 10 * 86400000,
  updatedAt: Date.now(),
};

const sampleApprovedDealer: UserProfile = {
  uid: 'dealer-demo-001',
  email: 'apex.purifiers@gmail.com',
  displayName: 'Apex Water Solutions (Rajesh)',
  phoneNumber: '+91 98234 56789',
  role: 'dealer',
  dealerStatus: 'approved',
  dealerDetails: {
    companyName: 'Apex Water Solutions Pvt Ltd',
    gstin: '27AADCA1234F1Z5',
    tradeLicense: 'MH/TRD/2021/8892',
    yearsInBusiness: 6,
    billingAddress: 'Plot 42, Sector 18, Vashi, Navi Mumbai, MH - 400703',
    appliedAt: Date.now() - 15 * 86400000,
    approvedAt: Date.now() - 14 * 86400000,
  },
  referralCode: 'APEXWATER',
  walletBalance: 2500,
  createdAt: Date.now() - 15 * 86400000,
  updatedAt: Date.now(),
};

const samplePendingDealer: UserProfile = {
  uid: 'dealer-pending-002',
  email: 'shree.enterprises.ro@outlook.com',
  displayName: 'Shree Aqua Enterprises (Vipul)',
  phoneNumber: '+91 97123 45678',
  role: 'dealer',
  dealerStatus: 'pending',
  dealerDetails: {
    companyName: 'Shree Aqua Enterprises',
    gstin: '24AAECS9876Q1Z2',
    tradeLicense: 'GJ/LIC/2023/1109',
    yearsInBusiness: 3,
    billingAddress: 'Shop 12, Crystal Plaza, Ring Road, Surat, GJ',
    appliedAt: Date.now() - 2 * 86400000,
  },
  referralCode: 'SHREEAQUA',
  walletBalance: 0,
  createdAt: Date.now() - 2 * 86400000,
  updatedAt: Date.now(),
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(sampleCustomer);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY_AUTH)
      .then((stored) => {
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // Default to sample customer so app opens with interactive experience immediately
          setUser(sampleCustomer);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const saveUserSession = async (userProfile: UserProfile | null) => {
    setUser(userProfile);
    if (userProfile) {
      await AsyncStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(userProfile));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY_AUTH);
    }
  };

  const isApprovedDealer = user?.role === 'dealer' && user?.dealerStatus === 'approved';

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const lower = email.toLowerCase().trim();
      if (lower.includes('dealer') || lower.includes('apex')) {
        await saveUserSession(sampleApprovedDealer);
      } else if (lower.includes('pending') || lower.includes('shree')) {
        await saveUserSession(samplePendingDealer);
      } else {
        const customCust: UserProfile = {
          ...sampleCustomer,
          email: lower,
          displayName: lower.split('@')[0],
        };
        await saveUserSession(customCust);
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const registerCustomer = async (
    name: string,
    email: string,
    phone: string,
    password?: string,
    referralCode?: string
  ) => {
    setIsLoading(true);
    try {
      // Validate referral code bonus credits
      let bonusWallet = 0;
      if (referralCode && referralCode.trim().length >= 4) {
        bonusWallet = 250; // ₹250 welcome credits for using valid referral
      }

      const newUser: UserProfile = {
        uid: 'cust-' + Date.now().toString(36),
        email: email.trim(),
        displayName: name.trim(),
        phoneNumber: phone.trim(),
        role: 'customer',
        referralCode: name.slice(0, 4).toUpperCase() + Math.floor(1000 + Math.random() * 9000),
        referredBy: referralCode ? referralCode.trim() : undefined,
        walletBalance: bonusWallet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await saveUserSession(newUser);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  const registerDealer = async (
    companyName: string,
    applicantName: string,
    email: string,
    phone: string,
    gstin: string,
    tradeLicense: string,
    yearsInBusiness: number,
    address: string
  ) => {
    setIsLoading(true);
    try {
      const newDealer: UserProfile = {
        uid: 'dealer-' + Date.now().toString(36),
        email: email.trim(),
        displayName: `${companyName} (${applicantName})`,
        phoneNumber: phone.trim(),
        role: 'dealer',
        dealerStatus: 'pending', // Requires admin approval!
        dealerDetails: {
          companyName: companyName.trim(),
          gstin: gstin.toUpperCase().trim(),
          tradeLicense: tradeLicense.trim(),
          yearsInBusiness,
          billingAddress: address.trim(),
          appliedAt: Date.now(),
        },
        referralCode: 'DLR' + Math.floor(1000 + Math.random() * 9000),
        walletBalance: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await saveUserSession(newDealer);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await saveUserSession(null);
  };

  const switchUserRoleForTesting = (mode: 'customer' | 'approved_dealer' | 'pending_dealer') => {
    if (mode === 'customer') {
      saveUserSession(sampleCustomer);
    } else if (mode === 'approved_dealer') {
      saveUserSession(sampleApprovedDealer);
    } else {
      saveUserSession(samplePendingDealer);
    }
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profile, updatedAt: Date.now() };
    saveUserSession(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isApprovedDealer,
        login,
        registerCustomer,
        registerDealer,
        logout,
        switchUserRoleForTesting,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
