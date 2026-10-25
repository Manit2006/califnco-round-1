import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Package, ChevronRight, Clock, ShieldCheck, ShoppingBag } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Order } from '../types';

export const OrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { user, isApprovedDealer } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const storedRaw = await AsyncStorage.getItem('califnco_orders_history');
        if (storedRaw) {
          const parsed: Order[] = JSON.parse(storedRaw);
          setOrders(parsed);
        } else {
          // Initial sample order
          const sample: Order[] = [
            {
              id: 'ord-initial-1',
              orderNumber: 'ORD-2026-98214',
              userId: user?.uid || 'cust-1',
              userRole: user?.role || 'customer',
              userEmail: user?.email || 'customer@califnco.com',
              userName: user?.displayName || 'Ananya Iyer',
              userPhone: user?.phoneNumber || '+91 99887 76655',
              items: [
                {
                  productId: 'prod-001',
                  productName: 'Aquaflow Copper Prime RO+UV+UF+TDS Controller 12L',
                  productThumbnail: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
                  unitPrice: 14999,
                  quantity: 1,
                  totalPrice: 14999,
                },
              ],
              subtotal: 14999,
              gstAmount: 2699.82,
              shippingFee: 0,
              discountAmount: 500,
              totalAmount: 17198.82,
              shippingAddress: {
                id: 'addr-1',
                label: 'Home',
                fullName: 'Ananya Iyer',
                phone: '+91 99887 76655',
                addressLine1: 'Flat 402, Green Meadows',
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560038',
              },
              paymentMethod: 'razorpay',
              paymentStatus: 'paid',
              razorpayPaymentId: 'pay_test_whs_98214',
              status: 'processing',
              statusHistory: [
                { status: 'pending', timestamp: Date.now() - 36 * 3600000 },
                { status: 'confirmed', timestamp: Date.now() - 24 * 3600000 },
                { status: 'processing', timestamp: Date.now() - 8 * 3600000, note: 'Water purifier tested & packaged' },
              ],
              createdAt: Date.now() - 36 * 3600000,
              updatedAt: Date.now() - 8 * 3600000,
            },
          ];
          setOrders(sample);
          await AsyncStorage.setItem('califnco_orders_history', JSON.stringify(sample));
        }
      } catch (e) {
        console.warn('Failed to load orders history', e);
      }
    };

    loadOrders();
    const unsub = navigation.addListener('focus', loadOrders);
    return unsub;
  }, [navigation, user]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order History</Text>
        <Text style={[styles.headerSub, { color: colors.subText }]}>
          {isApprovedDealer ? 'Wholesale B2B & Retail Dispatches' : 'Track your water purifiers & filters'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('OrderDetail', { order })}
            style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            {/* Top row */}
            <View style={styles.cardTop}>
              <div>
                <Text style={[styles.orderNumber, { color: colors.text }]}>{order.orderNumber}</Text>
                <Text style={[styles.orderDate, { color: colors.subText }]}>
                  {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </div>
              <StatusBadge status={order.status} />
            </View>

            {/* Thumbnails preview */}
            <View style={styles.thumbsRow}>
              {order.items.slice(0, 3).map((item, idx) => (
                <Image
                  key={idx}
                  source={{ uri: item.productThumbnail }}
                  style={styles.thumb}
                  resizeMode="cover"
                />
              ))}
              <View style={styles.itemsSummary}>
                <Text style={[styles.summaryText, { color: colors.text }]} numberOfLines={2}>
                  {order.items.map((i) => `${i.quantity}× ${i.productName}`).join(', ')}
                </Text>
              </View>
            </View>

            {/* Bottom Row */}
            <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
              <div>
                <Text style={[styles.amountLabel, { color: colors.subText }]}>Total Amount</Text>
                <Text style={[styles.amountVal, { color: colors.text }]}>
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </Text>
              </div>

              <View style={styles.viewDetailRow}>
                <Text style={[styles.viewDetailText, { color: colors.primary }]}>View Details</Text>
                <ChevronRight size={14} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {orders.length === 0 && (
          <View style={styles.emptyBox}>
            <Package size={48} color={colors.subText} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders Placed Yet</Text>
            <Text style={[styles.emptySub, { color: colors.subText }]}>
              When you place an order, its real-time shipping status will appear here.
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 11,
    marginTop: 2,
  },
  scroll: {
    padding: 16,
    gap: 14,
  },
  orderCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  orderDate: {
    fontSize: 10,
    marginTop: 2,
  },
  thumbsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  itemsSummary: {
    flex: 1,
    marginLeft: 4,
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 9,
  },
  amountVal: {
    fontSize: 14,
    fontWeight: '900',
  },
  viewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
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
});
