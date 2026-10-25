import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle,
  Truck,
  Droplets
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { isApprovedDealer } = useAuth();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    gstAmount,
    shippingFee,
    discountAmount,
    totalAmount,
    totalItemsCount,
    appliedReferralDiscount,
    applyReferralCode,
    removeReferralCode,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const res = applyReferralCode(couponCode);
    if (res.success) {
      setCouponMsg({ text: res.message });
      setCouponCode('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconBg, { backgroundColor: colors.card }]}>
            <ShoppingBag size={54} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your Cart is Empty</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subText }]}>
            Explore our advanced RO purifiers, genuine cartridges, and spare parts.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CatalogTab')}
            style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.emptyBtnText}>Explore Water Purifiers</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <div>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Shopping Cart</Text>
          <Text style={[styles.headerSubtitle, { color: colors.subText }]}>
            {totalItemsCount} item(s) selected
          </Text>
        </div>

        <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Dealer Wholesale Notice */}
        {isApprovedDealer && (
          <View style={styles.wholesaleNotice}>
            <ShieldCheck size={16} color="#059669" />
            <Text style={styles.wholesaleNoticeText}>
              Wholesale Tier-1 bulk pricing applied automatically.
            </Text>
          </View>
        )}

        {/* Cart Item Cards */}
        <View style={styles.itemsList}>
          {items.map((item) => {
            const minQty = isApprovedDealer ? item.product.minOrderQuantity || 1 : 1;
            return (
              <View
                key={item.product.id}
                style={[
                  styles.itemCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Image
                  source={{ uri: item.product.thumbnail }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />

                <View style={styles.itemInfo}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={[styles.itemBrand, { color: colors.primary }]}>
                      {item.product.brand}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.product.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                    {item.product.name}
                  </Text>

                  {/* Quantity and Pricing Row */}
                  <View style={styles.itemBottomRow}>
                    <View>
                      <Text style={[styles.unitPrice, { color: colors.text }]}>
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                        <Text style={{ fontSize: 10, color: colors.subText }}> / unit</Text>
                      </Text>
                      <Text style={[styles.itemTotal, { color: isApprovedDealer ? '#059669' : colors.primary }]}>
                        Total: ₹{item.totalPrice.toLocaleString('en-IN')}
                      </Text>
                    </View>

                    {/* Quantity Selector */}
                    <View style={[styles.qtyBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= minQty}
                        style={[styles.qtyBtn, { opacity: item.quantity <= minQty ? 0.3 : 1 }]}
                      >
                        <Minus size={13} color={colors.text} />
                      </TouchableOpacity>
                      <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                        style={styles.qtyBtn}
                      >
                        <Plus size={13} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Referral / Promo Code Box */}
        <View style={[styles.couponCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.couponHeader}>
            <Tag size={16} color={colors.primary} />
            <Text style={[styles.couponTitle, { color: colors.text }]}>Referral / Discount Code</Text>
          </View>

          {appliedReferralDiscount > 0 ? (
            <View style={styles.appliedRow}>
              <View style={styles.appliedTag}>
                <CheckCircle size={14} color="#059669" />
                <Text style={styles.appliedText}>₹{appliedReferralDiscount} Discount Applied</Text>
              </View>
              <TouchableOpacity onPress={removeReferralCode}>
                <Text style={styles.removeCodeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputRow}>
              <TextInput
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter referral code (e.g. CALIF500)"
                placeholderTextColor={colors.subText}
                autoCapitalize="characters"
                style={[
                  styles.couponInput,
                  { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
                ]}
              />
              <TouchableOpacity
                onPress={handleApplyCoupon}
                style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}

          {couponMsg && (
            <Text
              style={[
                styles.couponMsgText,
                { color: couponMsg.isError ? '#ef4444' : '#059669' },
              ]}
            >
              {couponMsg.text}
            </Text>
          )}
        </View>

        {/* Cost Breakdown */}
        <View style={[styles.billCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.billHeading, { color: colors.text }]}>Price Breakdown</Text>

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.subText }]}>Subtotal ({totalItemsCount} items)</Text>
            <Text style={[styles.billVal, { color: colors.text }]}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.subText }]}>GST (18% Equipment Tax)</Text>
            <Text style={[styles.billVal, { color: colors.text }]}>₹{gstAmount.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.subText }]}>Delivery Charges</Text>
            <Text style={[styles.billVal, { color: shippingFee === 0 ? '#10b981' : colors.text }]}>
              {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
            </Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: '#059669' }]}>Referral Discount</Text>
              <Text style={[styles.billVal, { color: '#059669', fontWeight: '700' }]}>
                -₹{discountAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalVal, { color: colors.primary }]}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Checkout Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.bottomTotalLabel, { color: colors.subText }]}>Payable</Text>
          <Text style={[styles.bottomTotalVal, { color: colors.text }]}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Checkout')}
          style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <ArrowRight size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearBtnText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  wholesaleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  wholesaleNoticeText: {
    color: '#065f46',
    fontSize: 11,
    fontWeight: '700',
  },
  itemsList: {
    gap: 12,
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBrand: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    lineHeight: 16,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  unitPrice: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
  },
  couponCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  couponTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 11,
    fontWeight: '600',
  },
  applyBtn: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  appliedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appliedText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  removeCodeText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '600',
  },
  couponMsgText: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  billCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  billHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  totalVal: {
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
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  bottomTotalLabel: {
    fontSize: 10,
  },
  bottomTotalVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 260,
  },
  emptyBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
