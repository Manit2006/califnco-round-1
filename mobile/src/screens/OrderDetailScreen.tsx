import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Package,
  CreditCard,
  ShieldCheck
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { StatusBadge } from '../components/StatusBadge';
import { Order } from '../types';

export const OrderDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { colors, isDark } = useTheme();
  const order: Order = route.params?.order;

  if (!order) return null;

  const steps = [
    { key: 'pending', label: 'Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Packed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === order.status);
  const activeIdx = currentStepIdx === -1 ? 1 : currentStepIdx;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Navbar */}
      <View style={[styles.nav, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Order #{order.orderNumber}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status Stepper Header */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusTopRow}>
            <div>
              <Text style={[styles.headerOrderNo, { color: colors.text }]}>{order.orderNumber}</Text>
              <Text style={[styles.headerDate, { color: colors.subText }]}>
                Placed on {new Date(order.createdAt).toLocaleString()}
              </Text>
            </div>
            <StatusBadge status={order.status} />
          </View>

          {/* Stepper */}
          <View style={styles.stepperContainer}>
            {steps.map((step, idx) => {
              const isPassed = idx <= activeIdx;
              const isCurrent = idx === activeIdx;

              return (
                <View key={step.key} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor: isPassed ? colors.primary : colors.background,
                        borderColor: isPassed ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {isPassed ? (
                      <CheckCircle size={12} color="#ffffff" />
                    ) : (
                      <Text style={[styles.stepNum, { color: colors.subText }]}>{idx + 1}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isCurrent ? colors.primary : colors.subText,
                        fontWeight: isCurrent ? '800' : '500',
                      },
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Ordered Items */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Ordered Items ({order.items.length})
          </Text>

          <View style={styles.itemsList}>
            {order.items.map((item, i) => (
              <View key={i} style={[styles.itemCard, { borderBottomColor: colors.border }]}>
                <Image
                  source={{ uri: item.productThumbnail }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.productName}</Text>
                  <Text style={[styles.itemPricing, { color: colors.subText }]}>
                    ₹{item.unitPrice.toLocaleString('en-IN')} × {item.quantity} units
                  </Text>
                  <Text style={[styles.itemTotal, { color: colors.text }]}>
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Payment & Invoice Breakdown */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment & Tax Summary</Text>

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.subText }]}>Subtotal</Text>
            <Text style={[styles.billVal, { color: colors.text }]}>₹{order.subtotal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.subText }]}>GST (18% Equipment Tax)</Text>
            <Text style={[styles.billVal, { color: colors.text }]}>₹{order.gstAmount.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.subText }]}>Shipping Fee</Text>
            <Text style={[styles.billVal, { color: order.shippingFee === 0 ? '#10b981' : colors.text }]}>
              {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
            </Text>
          </View>

          {order.discountAmount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: '#059669' }]}>Referral Discount</Text>
              <Text style={[styles.billVal, { color: '#059669' }]}>
                -₹{order.discountAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalVal, { color: colors.primary }]}>
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={[styles.paymentDetailsBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.payHeading, { color: colors.text }]}>Transaction Channel:</Text>
            <Text style={[styles.payVal, { color: colors.subText }]}>
              Method: {order.paymentMethod === 'razorpay' ? 'Razorpay (Test Mode)' : order.paymentMethod.toUpperCase()}
            </Text>
            <Text style={[styles.payVal, { color: colors.subText }]}>
              Payment Status: {order.paymentStatus.toUpperCase()}
            </Text>
            {order.razorpayPaymentId && (
              <Text style={[styles.payVal, { color: colors.subText, fontFamily: 'monospace' }]}>
                Payment ID: {order.razorpayPaymentId}
              </Text>
            )}
          </View>
        </View>

        {/* Shipping Address */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.addressHeader}>
            <MapPin size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipping Address</Text>
          </View>
          <Text style={[styles.addressName, { color: colors.text }]}>{order.shippingAddress.fullName}</Text>
          <Text style={[styles.addressLine, { color: colors.subText }]}>
            {order.shippingAddress.addressLine1}
            {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
          </Text>
          <Text style={[styles.addressLine, { color: colors.subText }]}>
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </Text>
          <Text style={[styles.addressPhone, { color: colors.text }]}>
            Phone: {order.shippingAddress.phone}
          </Text>
        </View>

        {/* Audit Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
              Fulfillment Timeline
            </Text>
            <View style={styles.historyList}>
              {order.statusHistory.map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <View style={[styles.historyDot, { backgroundColor: colors.primary }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.historyRow}>
                      <Text style={[styles.historyStatus, { color: colors.text }]}>
                        {h.status.toUpperCase()}
                      </Text>
                      <Text style={[styles.historyTime, { color: colors.subText }]}>
                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    {h.note && <Text style={[styles.historyNote, { color: colors.subText }]}>{h.note}</Text>}
                  </View>
                </View>
              ))}
            </View>
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
  scroll: {
    padding: 16,
    gap: 14,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerOrderNo: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  headerDate: {
    fontSize: 10,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepNum: {
    fontSize: 10,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 9,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  itemsList: {
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemPricing: {
    fontSize: 10,
    marginTop: 1,
  },
  itemTotal: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  billLabel: {
    fontSize: 11,
  },
  billVal: {
    fontSize: 11,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  totalVal: {
    fontSize: 15,
    fontWeight: '900',
  },
  paymentDetailsBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  payHeading: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  payVal: {
    fontSize: 10,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  addressName: {
    fontSize: 12,
    fontWeight: '700',
  },
  addressLine: {
    fontSize: 11,
    marginTop: 1,
  },
  addressPhone: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  historyList: {
    gap: 10,
    paddingLeft: 4,
  },
  historyItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyStatus: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyTime: {
    fontSize: 9,
  },
  historyNote: {
    fontSize: 10,
    marginTop: 1,
  },
});
