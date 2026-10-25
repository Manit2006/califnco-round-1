import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ShoppingBag, Star, ShieldCheck, AlertCircle } from 'lucide-react-native';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { colors } = useTheme();
  const { isApprovedDealer } = useAuth();
  const { addToCart, items } = useCart();

  const isLowStock = product.stockQuantity < 15;
  const isOutOfStock = product.stockQuantity <= 0;

  const currentCartItem = items.find((i) => i.product.id === product.id);
  const cartQty = currentCartItem ? currentCartItem.quantity : 0;

  const activePrice = isApprovedDealer ? product.wholesalePrice : product.retailPrice;
  const discountPercent = Math.round(
    ((product.retailPrice - product.wholesalePrice) / product.retailPrice) * 100
  );

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          width: CARD_WIDTH,
        },
      ]}
    >
      {/* Product Image */}
      <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80' }}
        />

        {/* Stock / Brand Badge */}
        <View style={styles.topBadges}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandText}>{product.brand}</Text>
          </View>

          {isLowStock && (
            <View style={styles.lowStockBadge}>
              <Text style={styles.lowStockText}>Low Stock</Text>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.primary }]} numberOfLines={1}>
          {product.categoryLabel || product.category}
        </Text>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating row */}
        <View style={styles.ratingRow}>
          <Star size={12} color="#f59e0b" fill="#f59e0b" />
          <Text style={[styles.ratingText, { color: colors.subText }]}>
            {product.rating} ({product.reviewCount})
          </Text>
        </View>

        {/* Pricing Box */}
        <View style={styles.pricingContainer}>
          {isApprovedDealer ? (
            <View>
              <View style={styles.wholesalePill}>
                <ShieldCheck size={11} color="#059669" />
                <Text style={styles.wholesalePillText}>DEALER PRICE ({discountPercent}% OFF)</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={[styles.priceActive, { color: '#059669' }]}>
                  ₹{product.wholesalePrice.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.priceOld, { color: colors.subText }]}>
                  ₹{product.retailPrice.toLocaleString('en-IN')}
                </Text>
              </View>
              <Text style={[styles.moqText, { color: colors.subText }]}>
                Min Bulk Order: {product.minOrderQuantity} pcs
              </Text>
            </View>
          ) : (
            <View>
              <View style={styles.priceRow}>
                <Text style={[styles.priceActive, { color: colors.text }]}>
                  ₹{product.retailPrice.toLocaleString('en-IN')}
                </Text>
              </View>
              <Text style={[styles.dealerHint, { color: colors.primary }]}>
                Wholesale available for dealers
              </Text>
            </View>
          )}
        </View>

        {/* Add to Cart button */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isOutOfStock}
          onPress={() => addToCart(product, isApprovedDealer ? product.minOrderQuantity : 1)}
          style={[
            styles.addBtn,
            {
              backgroundColor: isOutOfStock
                ? '#94a3b8'
                : isApprovedDealer
                ? '#059669'
                : colors.primary,
            },
          ]}
        >
          <ShoppingBag size={14} color="#ffffff" />
          <Text style={styles.addBtnText}>
            {isOutOfStock
              ? 'Out of Stock'
              : cartQty > 0
              ? `In Cart (${cartQty})`
              : isApprovedDealer
              ? `Add (${product.minOrderQuantity} MOQ)`
              : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  brandText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  lowStockBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  lowStockText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  content: {
    padding: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: 2,
    minHeight: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  },
  pricingContainer: {
    marginTop: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceActive: {
    fontSize: 14,
    fontWeight: '800',
  },
  priceOld: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  wholesalePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  wholesalePillText: {
    color: '#059669',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  moqText: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 1,
  },
  dealerHint: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
