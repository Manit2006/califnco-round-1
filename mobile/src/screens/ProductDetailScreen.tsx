import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Share2,
  Star,
  ShieldCheck,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  ZoomIn,
  Truck,
  RotateCcw,
  Wrench
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ImageLightbox } from '../components/ImageLightbox';
import productsData from '../../../firebase/seeds/products.json';
import { Product } from '../types';

const { width } = Dimensions.get('window');

export const ProductDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { colors, isDark } = useTheme();
  const { isApprovedDealer } = useAuth();
  const { addToCart, items } = useCart();

  const { productId } = route.params;
  const products = productsData as unknown as Product[];
  const product = products.find((p) => p.id === productId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  const minOrderQty = isApprovedDealer ? product.minOrderQuantity || 1 : 1;
  const [selectedQuantity, setSelectedQuantity] = useState(minOrderQty);

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const activePrice = isApprovedDealer ? product.wholesalePrice : product.retailPrice;
  const discountPercent = Math.round(
    ((product.retailPrice - product.wholesalePrice) / product.retailPrice) * 100
  );

  const isLowStock = product.stockQuantity < 15;
  const isOutOfStock = product.stockQuantity <= 0;

  const currentCartItem = items.find((i) => i.product.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
    Alert.alert(
      'Added to Cart! 🛒',
      `${selectedQuantity} unit(s) of ${product.name} added.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'Go to Cart', onPress: () => navigation.navigate('CartTab') },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Navigation */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.navIconBtn, { backgroundColor: colors.card }]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.navTitle, { color: colors.text }]} numberOfLines={1}>
          {product.brand}
        </Text>

        <TouchableOpacity
          onPress={() => {
            Alert.alert('Share Product', `Check out ${product.name} on Califnco Water App!`);
          }}
          style={[styles.navIconBtn, { backgroundColor: colors.card }]}
        >
          <Share2 size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Main Product Image Carousel */}
        <View style={[styles.imageWrapper, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setLightboxVisible(true)}
            style={styles.imageTouch}
          >
            <Image
              source={{ uri: images[activeImageIndex] }}
              style={styles.mainImage}
              resizeMode="contain"
            />
            {/* Zoom hint badge */}
            <View style={styles.zoomPill}>
              <ZoomIn size={12} color="#ffffff" />
              <Text style={styles.zoomPillText}>Tap to Zoom</Text>
            </View>
          </TouchableOpacity>

          {/* Multiple image thumbnails */}
          {images.length > 1 && (
            <View style={styles.thumbRow}>
              {images.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setActiveImageIndex(i)}
                  style={[
                    styles.thumbBtn,
                    {
                      borderColor: i === activeImageIndex ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Image source={{ uri: img }} style={styles.thumbImg} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View style={[styles.detailsSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
                {product.categoryLabel}
              </Text>
            </View>

            <View style={styles.ratingBadge}>
              <Star size={12} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingBadgeText}>{product.rating} ({product.reviewCount} reviews)</Text>
            </View>
          </View>

          <Text style={[styles.productTitle, { color: colors.text }]}>{product.name}</Text>

          {/* Price Block */}
          <View style={[styles.priceBlock, { backgroundColor: colors.background }]}>
            {isApprovedDealer ? (
              <View>
                <View style={styles.wholesaleAlert}>
                  <ShieldCheck size={14} color="#059669" />
                  <Text style={styles.wholesaleAlertText}>
                    APPROVED DEALER WHOLESALE PRICING ({discountPercent}% OFF)
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={[styles.mainPrice, { color: '#059669' }]}>
                    ₹{product.wholesalePrice.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.oldPrice, { color: colors.subText }]}>
                    MRP ₹{product.retailPrice.toLocaleString('en-IN')}
                  </Text>
                </View>
                <Text style={[styles.moqNote, { color: colors.subText }]}>
                  Minimum Order Quantity: <strong style={{ color: colors.text }}>{product.minOrderQuantity} units</strong>
                </Text>
              </View>
            ) : (
              <View>
                <View style={styles.priceRow}>
                  <Text style={[styles.mainPrice, { color: colors.text }]}>
                    ₹{product.retailPrice.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.taxInclusive, { color: colors.subText }]}>(Inclusive of all taxes)</Text>
                </View>
                <Text style={[styles.dealerInvite, { color: colors.primary }]}>
                  💼 Certified water dealers get wholesale pricing up to 45% off.
                </Text>
              </View>
            )}
          </View>

          {/* Stock Level Warning */}
          <View style={styles.stockRow}>
            <View
              style={[
                styles.stockDot,
                { backgroundColor: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#10b981' },
              ]}
            />
            <Text style={[styles.stockText, { color: colors.text }]}>
              {isOutOfStock
                ? 'Out of Stock'
                : isLowStock
                ? `Only ${product.stockQuantity} units left in warehouse - Order soon`
                : `${product.stockQuantity} units in stock and ready to dispatch`}
            </Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={[styles.quantityLabel, { color: colors.text }]}>Order Quantity:</Text>
            <View style={[styles.qtySelector, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TouchableOpacity
                onPress={() => setSelectedQuantity(Math.max(minOrderQty, selectedQuantity - 1))}
                disabled={selectedQuantity <= minOrderQty}
                style={[styles.qtyBtn, { opacity: selectedQuantity <= minOrderQty ? 0.3 : 1 }]}
              >
                <Minus size={16} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.qtyValue, { color: colors.text }]}>{selectedQuantity}</Text>
              <TouchableOpacity
                onPress={() => setSelectedQuantity(Math.min(product.stockQuantity, selectedQuantity + 1))}
                style={styles.qtyBtn}
              >
                <Plus size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.infoBlock}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Product Overview</Text>
            <Text style={[styles.descriptionText, { color: colors.subText }]}>
              {product.description}
            </Text>
          </View>

          {/* Verified Specifications */}
          {product.specifications && (
            <View style={styles.infoBlock}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>
                Verified Technical Specifications
              </Text>
              <View style={[styles.specsTable, { borderColor: colors.border }]}>
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.specRow,
                      {
                        backgroundColor: idx % 2 === 0 ? colors.background : colors.card,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.specKey, { color: colors.subText }]}>{key}</Text>
                    <Text style={[styles.specVal, { color: colors.text }]}>{val}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Service & Installation Banner */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ServiceBooking', { serviceType: 'installation' })}
            style={[styles.serviceBanner, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
          >
            <Wrench size={22} color={colors.primary} />
            <View style={styles.serviceBannerText}>
              <Text style={[styles.serviceBannerTitle, { color: colors.primary }]}>
                Need Doorstep Installation?
              </Text>
              <Text style={[styles.serviceBannerSub, { color: colors.subText }]}>
                Book a certified water engineer to connect plumbing and test TDS.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.bottomPriceLabel, { color: colors.subText }]}>Total Price</Text>
          <Text style={[styles.bottomPriceVal, { color: colors.text }]}>
            ₹{(activePrice * selectedQuantity).toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isOutOfStock}
          onPress={handleAddToCart}
          style={[
            styles.bottomAddBtn,
            { backgroundColor: isOutOfStock ? '#94a3b8' : colors.primary },
          ]}
        >
          <ShoppingBag size={18} color="#ffffff" />
          <Text style={styles.bottomAddBtnText}>
            {isOutOfStock
              ? 'Out of Stock'
              : currentCartItem
              ? `Update Cart (${currentCartItem.quantity + selectedQuantity})`
              : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Lightbox Modal */}
      <ImageLightbox
        visible={lightboxVisible}
        images={images}
        initialIndex={activeImageIndex}
        onClose={() => setLightboxVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  navIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingBottom: 100,
  },
  imageWrapper: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  imageTouch: {
    width: width * 0.85,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  zoomPill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  zoomPillText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  thumbBtn: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  detailsSection: {
    padding: 20,
    marginTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f59e0b',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginTop: 8,
  },
  priceBlock: {
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  wholesaleAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  wholesaleAlertText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  mainPrice: {
    fontSize: 22,
    fontWeight: '900',
  },
  oldPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  taxInclusive: {
    fontSize: 10,
  },
  moqNote: {
    fontSize: 11,
    marginTop: 3,
  },
  dealerInvite: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  quantityLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 12,
  },
  infoBlock: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 18,
  },
  specsTable: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  specKey: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  specVal: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  serviceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
  },
  serviceBannerText: {
    flex: 1,
  },
  serviceBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  serviceBannerSub: {
    fontSize: 10,
    marginTop: 2,
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
  bottomPriceLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  bottomPriceVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  bottomAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  bottomAddBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
