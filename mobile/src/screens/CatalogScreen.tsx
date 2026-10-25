import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Search, Filter, ArrowUpDown, X, Check, Droplets } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import productsData from '../../../firebase/seeds/products.json';
import categoriesData from '../../../firebase/seeds/categories.json';
import { Product } from '../types';

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'rating';

export const CatalogScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const { isApprovedDealer } = useAuth();

  const initialCat = route.params?.categoryId || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showSortModal, setShowSortModal] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const products = productsData as unknown as Product[];

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

      const matchStock = inStockOnly ? p.stockQuantity > 0 : true;

      return matchCategory && matchSearch && matchStock;
    });

    // Sorting
    result.sort((a, b) => {
      const priceA = isApprovedDealer ? a.wholesalePrice : a.retailPrice;
      const priceB = isApprovedDealer ? b.wholesalePrice : b.retailPrice;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first, then name
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [products, selectedCategory, search, sortBy, inStockOnly, isApprovedDealer]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header Search & Sort bar */}
      <View style={[styles.topBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Search size={18} color={colors.subText} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search 52+ purifiers, spares, pumps..."
            placeholderTextColor={colors.subText}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={16} color={colors.subText} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setShowSortModal(true)}
          style={[styles.sortBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
          <ArrowUpDown size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Categories Horizontal Pills */}
      <View style={{ backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categoriesData.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.background,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: isSelected ? '#ffffff' : colors.text },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results Header Count & In-Stock toggle */}
      <View style={styles.resultsInfoRow}>
        <Text style={[styles.resultsCount, { color: colors.subText }]}>
          Showing <Text style={{ color: colors.text, fontWeight: '700' }}>{filteredProducts.length}</Text> products
          {isApprovedDealer && ' (Wholesale Pricing)'}
        </Text>

        <TouchableOpacity
          onPress={() => setInStockOnly(!inStockOnly)}
          style={[
            styles.inStockToggle,
            {
              backgroundColor: inStockOnly ? colors.primaryLight : colors.card,
              borderColor: inStockOnly ? colors.primary : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.inStockToggleText,
              { color: inStockOnly ? colors.primary : colors.subText },
            ]}
          >
            In Stock Only
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <ScrollView
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
            />
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Droplets size={44} color={colors.subText} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Water Purifiers Found</Text>
            <Text style={[styles.emptySub, { color: colors.subText }]}>
              Try adjusting your search query or removing category filters.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                setSelectedCategory('all');
                setInStockOnly(false);
              }}
              style={[styles.resetBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.resetBtnText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Sort Options Modal */}
      {showSortModal && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
          style={styles.modalBackdrop}
        >
          <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Sort Catalog By</Text>

            {[
              { id: 'featured', label: 'Featured / Popularity' },
              { id: 'price_asc', label: 'Price: Low to High' },
              { id: 'price_desc', label: 'Price: High to Low' },
              { id: 'rating', label: 'Customer Rating' },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  setSortBy(option.id as SortOption);
                  setShowSortModal(false);
                }}
                style={styles.modalOption}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color: sortBy === option.id ? colors.primary : colors.text,
                      fontWeight: sortBy === option.id ? '700' : '500',
                    },
                  ]}
                >
                  {option.label}
                </Text>
                {sortBy === option.id && <Check size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    padding: 0,
  },
  sortBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsCount: {
    fontSize: 11,
  },
  inStockToggle: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  inStockToggleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 240,
  },
  resetBtn: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalOptionText: {
    fontSize: 13,
  },
});
