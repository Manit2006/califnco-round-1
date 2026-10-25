import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { CheckCircle2, PackageCheck, ArrowRight, Home, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { Order } from '../types';

export const OrderSuccessScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { colors, isDark } = useTheme();
  const order: Order = route.params?.order;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Success Icon Header */}
        <View style={styles.successHeader}>
          <View style={styles.iconCircle}>
            <CheckCircle2 size={54} color="#10b981" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Order Placed Successfully!</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>
            Thank you for choosing Califnco Water Systems. Your order has been registered in the database.
          </Text>
        </View>

        {/* Receipt Card */}
        {order && (
          <View style={[styles.receiptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.subText }]}>Order Reference</Text>
              <Text style={[styles.orderNumber, { color: colors.primary }]}>{order.orderNumber}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.subText }]}>Payment Method</Text>
              <Text style={[styles.receiptVal, { color: colors.text }]}>
                {order.paymentMethod === 'razorpay' ? 'Razorpay (Test Mode)' : order.paymentMethod.toUpperCase()}
              </Text>
            </View>

            {order.razorpayPaymentId && (
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: colors.subText }]}>Razorpay Payment ID</Text>
                <Text style={[styles.paymentIdVal, { color: colors.text }]}>
                  {order.razorpayPaymentId}
                </Text>
              </View>
            )}

            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.subText }]}>Total Amount</Text>
              <Text style={[styles.totalAmount, { color: colors.text }]}>
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </Text>
            </View>

            {/* Delivery Destination */}
            <View style={[styles.addressBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.addressHeading, { color: colors.text }]}>Delivering to:</Text>
              <Text style={[styles.addressDetails, { color: colors.subText }]}>
                {order.shippingAddress.fullName} • {order.shippingAddress.phone}
              </Text>
              <Text style={[styles.addressDetails, { color: colors.subText }]}>
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
              </Text>
            </View>

            {/* Items summary */}
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.addressHeading, { color: colors.text, marginBottom: 6 }]}>Items:</Text>
              {order.items.map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <Text style={[styles.itemName, { color: colors.subText }]}>
                    {item.quantity}× {item.productName}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.text }]}>
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.btnStack}>
          <TouchableOpacity
            onPress={() => navigation.navigate('OrdersTab')}
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          >
            <PackageCheck size={18} color="#ffffff" />
            <Text style={styles.primaryBtnText}>Track in Order History</Text>
            <ArrowRight size={16} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('HomeTab')}
            style={[styles.secondaryBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <Home size={18} color={colors.text} />
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Return to Home</Text>
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
  scroll: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  successHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
    lineHeight: 18,
  },
  receiptCard: {
    width: '100%',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  receiptLabel: {
    fontSize: 11,
  },
  receiptVal: {
    fontSize: 11,
    fontWeight: '600',
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  paymentIdVal: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '900',
  },
  addressBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  addressHeading: {
    fontSize: 11,
    fontWeight: '700',
  },
  addressDetails: {
    fontSize: 11,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  itemName: {
    fontSize: 11,
    flex: 1,
    marginRight: 6,
  },
  itemPrice: {
    fontSize: 11,
    fontWeight: '600',
  },
  btnStack: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
