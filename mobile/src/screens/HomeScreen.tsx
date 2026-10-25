import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  Droplets,
  Search,
  Wrench,
  ShieldCheck,
  Bell,
  Moon,
  Sun,
  ChevronRight,
  Sparkles,
  Truck,
  RotateCcw,
  Award
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import productsData from '../../../firebase/seeds/products.json';
import categoriesData from '../../../firebase/seeds/categories.json';
import { Product } from '../types';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, isApprovedDealer, switchUserRoleForTesting } = useAuth();
  const { totalItemsCount } = useCart();

  const products = productsData as unknown as Product[];
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const spareParts = products.filter((p) => p.category === 'filter_cartridges' || p.category === 'spares_fittings').slice(0, 4);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={styles.brandIcon}>
            <Droplets size={20} color="#ffffff" />
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: colors.text }]}>Califnco Water</Text>
            <Text style={[styles.userGreeting, { color: colors.subText }]}>
              {user ? `Hello, ${user.displayName.split(' ')[0]}` : 'Pure Healthy Hydration'}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {/* Dark Mode Switcher */}
          <TouchableOpacity onPress={toggleTheme} style={[styles.iconBtn, { backgroundColor: colors.background }]}>
            {isDark ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color={colors.text} />}
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={[styles.iconBtn, { backgroundColor: colors.background }]}
          >
            <Bell size={18} color={colors.text} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Role Mode Banner & Fast Testing Switcher */}
        <View style={[styles.roleBanner, { backgroundColor: isApprovedDealer ? '#064e3b' : '#0e7490' }]}>
          <View style={styles.roleBannerText}>
            <View style={styles.rolePill}>
              <ShieldCheck size={12} color="#ffffff" />
              <Text style={styles.rolePillText}>
                {isApprovedDealer ? 'APPROVED WHOLESALE DEALER' : user?.role === 'dealer' ? 'DEALER PENDING' : 'CUSTOMER MODE'}
              </Text>
            </View>
            <Text style={styles.roleDesc}>
              {isApprovedDealer
                ? 'Wholesale Tier-1 discounted pricing active on all products!'
                : user?.role === 'dealer'
                ? 'Your wholesale application is under admin verification.'
                : 'Browse our retail collection or apply for wholesale dealership.'}
            </Text>
          </View>

          {/* Quick tester switcher button */}
          <TouchableOpacity
            onPress={() => {
              if (!isApprovedDealer) {
                switchUserRoleForTesting('approved_dealer');
              } else {
                switchUserRoleForTesting('customer');
              }
            }}
            style={styles.switchRoleBtn}
          >
            <Text style={styles.switchRoleText}>
              {isApprovedDealer ? 'Switch to Customer' : 'Test Wholesale'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar Prompt */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Catalog')}
          style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Search size={18} color={colors.subText} />
          <Text style={[styles.searchText, { color: colors.subText }]}>
            Search 52+ purifiers, membranes, pumps, filters...
          </Text>
        </TouchableOpacity>

        {/* Hero Banner Carousel */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1080&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroTag}>
              <Sparkles size={12} color="#ffffff" />
              <Text style={styles.heroTagText}>FESTIVAL OFFER</Text>
            </View>
            <Text style={styles.heroTitle}>Smart Multi-Stage Water Purifiers</Text>
            <Text style={styles.heroSubtitle}>Active Copper + Alkaline pH + 100% RO TDS Balancing</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Catalog', { categoryId: 'purifier_domestic' })}
              style={styles.heroBtn}
            >
              <Text style={styles.heroBtnText}>Explore Domestic RO</Text>
              <ChevronRight size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Action Services */}
        <View style={styles.quickServicesGrid}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ServiceBooking', { serviceType: 'installation' })}
            style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.serviceIconContainer, { backgroundColor: '#ecfeff' }]}>
              <Wrench size={20} color="#0891b2" />
            </View>
            <Text style={[styles.serviceCardTitle, { color: colors.text }]}>Book Installation</Text>
            <Text style={[styles.serviceCardSub, { color: colors.subText }]}>Certified Engineer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ServiceBooking', { serviceType: 'maintenance' })}
            style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.serviceIconContainer, { backgroundColor: '#f0fdf4' }]}>
              <RotateCcw size={20} color="#10b981" />
            </View>
            <Text style={[styles.serviceCardTitle, { color: colors.text }]}>Annual Service</Text>
            <Text style={[styles.serviceCardSub, { color: colors.subText }]}>Filter cleaning & TDS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Catalog', { categoryId: 'spares_fittings' })}
            style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.serviceIconContainer, { backgroundColor: '#faf5ff' }]}>
              <Award size={20} color="#9333ea" />
            </View>
            <Text style={[styles.serviceCardTitle, { color: colors.text }]}>Genuine Spares</Text>
            <Text style={[styles.serviceCardSub, { color: colors.subText }]}>Pumps, Valves, Tubing</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Bar */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Explore Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categoriesData.filter((c) => c.id !== 'all').map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => navigation.navigate('Catalog', { categoryId: cat.id })}
              style={[styles.categoryChip, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.categoryChipText, { color: colors.text }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Water Purifiers */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Water Purifiers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All ({products.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
            />
          ))}
        </View>

        {/* Filter Cartridges & Membranes Highlight */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Replacement Cartridges & Spares</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog', { categoryId: 'filter_cartridges' })}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Browse Spares</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {spareParts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
            />
          ))}
        </View>

        {/* Trust Badges */}
        <View style={[styles.trustSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.trustItem}>
            <Truck size={22} color={colors.primary} />
            <Text style={[styles.trustTitle, { color: colors.text }]}>Safe Delivery</Text>
            <Text style={[styles.trustSub, { color: colors.subText }]}>Fast shipping across India</Text>
          </View>

          <View style={styles.trustItem}>
            <ShieldCheck size={22} color="#10b981" />
            <Text style={[styles.trustTitle, { color: colors.text }]}>100% Genuine</Text>
            <Text style={[styles.trustSub, { color: colors.subText }]}>Original Dow & Philips parts</Text>
          </View>

          <View style={styles.trustItem}>
            <Wrench size={22} color="#f59e0b" />
            <Text style={[styles.trustTitle, { color: colors.text }]}>Certified Service</Text>
            <Text style={[styles.trustSub, { color: colors.subText }]}>Doorstep installation</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  userGreeting: {
    fontSize: 11,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  scrollContent: {
    padding: 16,
  },
  roleBanner: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleBannerText: {
    flex: 1,
    marginRight: 10,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  rolePillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roleDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
  },
  switchRoleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  switchRoleText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  heroBanner: {
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 18, 0.65)',
    padding: 16,
    justifyContent: 'space-between',
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#06b6d4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  heroTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0891b2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  quickServicesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  serviceCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  serviceIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  serviceCardSub: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trustSection: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 20,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  trustSub: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
});
