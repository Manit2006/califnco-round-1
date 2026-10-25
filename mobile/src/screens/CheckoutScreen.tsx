import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Truck,
  Wrench,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  createRazorpayOrder,
  initiateRazorpayPayment,
  RAZORPAY_TEST_KEY_ID,
} from '../services/paymentService';
import { addNotification } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address, Order, OrderItem } from '../types';

export const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { user, isApprovedDealer } = useAuth();
  const {
    items,
    subtotal,
    gstAmount,
    shippingFee,
    discountAmount,
    totalAmount,
    totalItemsCount,
    clearCart,
  } = useCart();

  const [selectedAddress, setSelectedAddress] = useState<Address>({
    id: 'addr-default-1',
    label: 'Home',
    fullName: user?.displayName || 'Ananya Iyer',
    phone: user?.phoneNumber || '+91 99887 76655',
    addressLine1: 'Flat 402, Green Meadows, 5th Main Road',
    addressLine2: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    latitude: 12.9716,
    longitude: 77.5946,
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'dealer_credit'>('razorpay');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Missing Address', 'Please select or add a delivery address.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = 'ORD-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
      let rzpResult: any = null;

      if (paymentMethod === 'razorpay') {
        // Step 1: Create Razorpay Order
        const rzpOrder = await createRazorpayOrder(totalAmount);

        // Step 2: Execute Payment (with Test Credentials & HMAC verification)
        rzpResult = await initiateRazorpayPayment(
          rzpOrder.id,
          totalAmount,
          selectedAddress.fullName,
          user?.email || 'customer@califnco.com',
          selectedAddress.phone,
          simulateFailure
        );

        if (!rzpResult.success) {
          Alert.alert(
            'Payment Failed (Razorpay Test Mode) ❌',
            rzpResult.error || 'The test payment transaction was declined. Please try again or switch to COD.',
            [{ text: 'Dismiss' }]
          );
          setIsProcessing(false);
          return;
        }
      }

      // Prepare finalized order items snapshot
      const orderItemsSnapshot: OrderItem[] = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productThumbnail: i.product.thumbnail,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        totalPrice: i.totalPrice,
      }));

      const newOrder: Order = {
        id: 'ord-' + Date.now().toString(36),
        orderNumber,
        userId: user?.uid || 'guest-cust',
        userRole: user?.role || 'customer',
        userEmail: user?.email || 'customer@califnco.com',
        userName: selectedAddress.fullName,
        userPhone: selectedAddress.phone,
        items: orderItemsSnapshot,
        subtotal,
        gstAmount,
        shippingFee,
        discountAmount,
        totalAmount,
        shippingAddress: selectedAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
        razorpayOrderId: rzpResult?.orderId,
        razorpayPaymentId: rzpResult?.paymentId,
        razorpaySignature: rzpResult?.signature,
        status: 'confirmed',
        statusHistory: [
          {
            status: 'pending',
            timestamp: Date.now() - 1000,
            note: 'Order submitted by customer',
          },
          {
            status: 'confirmed',
            timestamp: Date.now(),
            note:
              paymentMethod === 'razorpay'
                ? `Payment verified via Razorpay Test Key (${rzpResult?.paymentId})`
                : 'Order confirmed with Cash on Delivery',
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Save order to persistent storage
      const existingOrdersRaw = await AsyncStorage.getItem('califnco_orders_history');
      const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
      await AsyncStorage.setItem('califnco_orders_history', JSON.stringify([newOrder, ...existingOrders]));

      // Dispatch in-app notification
      await addNotification(
        `Order Confirmed #${orderNumber}`,
        `Your water purifier order of ₹${totalAmount.toLocaleString('en-IN')} has been placed successfully.`,
        'order',
        user?.uid
      );

      // Clear shopping cart
      clearCart();

      // Navigate to success receipt screen
      navigation.replace('OrderSuccess', { order: newOrder });
    } catch (err: any) {
      Alert.alert('Order Placement Error', err.message || 'Something went wrong processing your order.');
    } finally {
      setIsProcessing(false);
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
        <Text style={[styles.navTitle, { color: colors.text }]}>Checkout & Payment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Shipping Address Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <MapPin size={18} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Delivery Address</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddressPicker', {
                  onSelectAddress: (addr: Address) => setSelectedAddress(addr),
                })
              }
              style={[styles.changeBtn, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.changeBtnText, { color: colors.primary }]}>Change (OSM)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressBox}>
            <View style={styles.addressTypeRow}>
              <Text style={[styles.addressName, { color: colors.text }]}>{selectedAddress.fullName}</Text>
              <View style={[styles.addressTypePill, { backgroundColor: colors.background }]}>
                <Text style={[styles.addressTypeText, { color: colors.primary }]}>
                  {selectedAddress.label}
                </Text>
              </View>
            </View>
            <Text style={[styles.addressDetails, { color: colors.subText }]}>
              {selectedAddress.addressLine1}
              {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}
            </Text>
            <Text style={[styles.addressDetails, { color: colors.subText }]}>
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
            </Text>
            <Text style={[styles.addressPhone, { color: colors.text }]}>
              Phone: {selectedAddress.phone}
            </Text>
          </View>
        </View>

        {/* Order Items Snapshot Preview */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 10 }]}>
            Order Snapshot ({totalItemsCount} units)
          </Text>
          {items.map((item) => (
            <View key={item.product.id} style={styles.itemRow}>
              <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                {item.quantity}× {item.product.name}
              </Text>
              <Text style={[styles.itemPrice, { color: colors.text }]}>
                ₹{item.totalPrice.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}

          {/* Doorstep installation add-on */}
          <TouchableOpacity
            onPress={() => setIncludeInstallation(!includeInstallation)}
            style={[styles.installOption, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            <CheckCircle2
              size={18}
              color={includeInstallation ? colors.primary : colors.subText}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.installTitle, { color: colors.text }]}>
                Complimentary Doorstep Installation Request
              </Text>
              <Text style={[styles.installSub, { color: colors.subText }]}>
                Dispatch technician for wall mounting & water TDS calibration upon delivery.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Method Selection */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 4 }]}>
            Payment Selection
          </Text>
          <Text style={[styles.paymentSub, { color: colors.subText }]}>
            Select your preferred transaction channel
          </Text>

          {/* Option 1: Razorpay Test Mode */}
          <TouchableOpacity
            onPress={() => setPaymentMethod('razorpay')}
            style={[
              styles.paymentOption,
              {
                backgroundColor: paymentMethod === 'razorpay' ? colors.primaryLight : colors.background,
                borderColor: paymentMethod === 'razorpay' ? colors.primary : colors.border,
              },
            ]}
          >
            <CreditCard size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <View style={styles.methodTitleRow}>
                <Text style={[styles.methodTitle, { color: colors.text }]}>
                  Razorpay (Test Mode)
                </Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>HMAC-SHA256 VERIFIED</Text>
                </View>
              </View>
              <Text style={[styles.methodDesc, { color: colors.subText }]}>
                UPI, NetBanking, Debit/Credit Cards via Test Mode Key: {RAZORPAY_TEST_KEY_ID.slice(0, 14)}...
              </Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: Cash on Delivery */}
          <TouchableOpacity
            onPress={() => setPaymentMethod('cod')}
            style={[
              styles.paymentOption,
              {
                backgroundColor: paymentMethod === 'cod' ? colors.primaryLight : colors.background,
                borderColor: paymentMethod === 'cod' ? colors.primary : colors.border,
              },
            ]}
          >
            <Banknote size={20} color="#10b981" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.methodTitle, { color: colors.text }]}>Cash on Delivery (COD)</Text>
              <Text style={[styles.methodDesc, { color: colors.subText }]}>
                Pay upon physical delivery and inspection of product package.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Option 3: Dealer Credit (for approved dealers) */}
          {isApprovedDealer && (
            <TouchableOpacity
              onPress={() => setPaymentMethod('dealer_credit')}
              style={[
                styles.paymentOption,
                {
                  backgroundColor:
                    paymentMethod === 'dealer_credit' ? '#ecfdf5' : colors.background,
                  borderColor: paymentMethod === 'dealer_credit' ? '#059669' : colors.border,
                },
              ]}
            >
              <ShieldCheck size={20} color="#059669" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.methodTitle, { color: '#059669' }]}>
                  Dealer 15-Day Wholesale Credit
                </Text>
                <Text style={[styles.methodDesc, { color: colors.subText }]}>
                  Authorized B2B credit line for {user?.displayName}.
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Test Scenario Simulator: Toggle Failure state */}
          <View style={[styles.simulatorBox, { borderColor: colors.border }]}>
            <View style={styles.simulatorHeader}>
              <AlertTriangle size={14} color="#f59e0b" />
              <Text style={[styles.simulatorTitle, { color: colors.text }]}>
                Test Result Simulator:
              </Text>
            </View>
            <View style={styles.simulatorBtnsRow}>
              <TouchableOpacity
                onPress={() => setSimulateFailure(false)}
                style={[
                  styles.simBtn,
                  {
                    backgroundColor: !simulateFailure ? '#10b981' : colors.background,
                    borderColor: !simulateFailure ? '#10b981' : colors.border,
                  },
                ]}
              >
                <Text style={{ color: !simulateFailure ? '#ffffff' : colors.text, fontSize: 10, fontWeight: '700' }}>
                  Simulate Success
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSimulateFailure(true)}
                style={[
                  styles.simBtn,
                  {
                    backgroundColor: simulateFailure ? '#ef4444' : colors.background,
                    borderColor: simulateFailure ? '#ef4444' : colors.border,
                  },
                ]}
              >
                <Text style={{ color: simulateFailure ? '#ffffff' : colors.text, fontSize: 10, fontWeight: '700' }}>
                  Simulate Bank Decline (Failure)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Total Price Summary */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>Subtotal</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>GST (18%)</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>₹{gstAmount.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>Shipping</Text>
            <Text style={[styles.summaryVal, { color: shippingFee === 0 ? '#10b981' : colors.text }]}>
              {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
            </Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#059669' }]}>Discount</Text>
              <Text style={[styles.summaryVal, { color: '#059669', fontWeight: '700' }]}>
                -₹{discountAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View style={[styles.finalTotalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.finalTotalLabel, { color: colors.text }]}>Total Payable</Text>
            <Text style={[styles.finalTotalVal, { color: colors.primary }]}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order CTA Button */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.bottomLabel, { color: colors.subText }]}>Total to Pay</Text>
          <Text style={[styles.bottomAmount, { color: colors.text }]}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={isProcessing}
          activeOpacity={0.85}
          style={[styles.payBtn, { backgroundColor: colors.primary }]}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Text style={styles.payBtnText}>
                {paymentMethod === 'razorpay' ? 'Pay via Razorpay' : 'Place Order'}
              </Text>
              <ChevronRight size={16} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>
      </View>
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
    fontSize: 15,
    fontWeight: '700',
  },
  scroll: {
    padding: 16,
    paddingBottom: 110,
    gap: 14,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  changeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
  addressBox: {
    gap: 2,
  },
  addressTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  addressName: {
    fontSize: 12,
    fontWeight: '700',
  },
  addressTypePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  addressTypeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  addressDetails: {
    fontSize: 11,
    lineHeight: 16,
  },
  addressPhone: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 11,
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 11,
    fontWeight: '700',
  },
  installOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  installTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  installSub: {
    fontSize: 9,
    marginTop: 1,
  },
  paymentSub: {
    fontSize: 10,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '800',
  },
  methodDesc: {
    fontSize: 9,
    marginTop: 2,
  },
  simulatorBox: {
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  simulatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  simulatorTitle: {
    fontSize: 10,
    fontWeight: '700',
  },
  simulatorBtnsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  simBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 11,
  },
  summaryVal: {
    fontSize: 11,
    fontWeight: '600',
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 4,
  },
  finalTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  finalTotalVal: {
    fontSize: 16,
    fontWeight: '900',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  bottomLabel: {
    fontSize: 10,
  },
  bottomAmount: {
    fontSize: 18,
    fontWeight: '900',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  payBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
