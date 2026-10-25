import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Search,
  Check,
  Building,
  Home,
  Briefcase,
  Compass,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import {
  searchAddressOpenStreetMap,
  POPULAR_DELIVERY_HUBS,
  GeocodingResult,
} from '../services/nominatimService';
import { Address } from '../types';

export const AddressPickerScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { colors, isDark } = useTheme();
  const onSelectAddress = route.params?.onSelectAddress;

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Form Fields
  const [label, setLabel] = useState<'Home' | 'Office' | 'Shop' | 'Warehouse'>('Home');
  const [fullName, setFullName] = useState('Ananya Iyer');
  const [phone, setPhone] = useState('+91 99887 76655');
  const [addressLine1, setAddressLine1] = useState('Flat 402, Green Meadows, 5th Main');
  const [addressLine2, setAddressLine2] = useState('Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');
  const [selectedCoords, setSelectedCoords] = useState<{ lat?: number; lon?: number }>({
    lat: 12.9716,
    lon: 77.5946,
  });

  const handleSearchOSM = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchAddressOpenStreetMap(query);
      setSearchResults(results);
    } catch (e) {
      Alert.alert('Search Error', 'Could not fetch OpenStreetMap results. Please select from quick hubs.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectOsmResult = (res: GeocodingResult) => {
    setAddressLine1(res.address.road || res.displayName.split(',')[0]);
    if (res.address.city) setCity(res.address.city);
    if (res.address.state) setStateName(res.address.state);
    if (res.address.postcode) setPincode(res.address.postcode);
    setSelectedCoords({ lat: res.latitude, lon: res.longitude });
    setSearchResults([]);
    setQuery('');
  };

  const handleSelectHub = (hub: (typeof POPULAR_DELIVERY_HUBS)[0]) => {
    setAddressLine1(hub.name.split(',')[0]);
    setCity(hub.city);
    setStateName(hub.state);
    setPincode(hub.pincode);
    setSelectedCoords({ lat: hub.latitude, lon: hub.longitude });
  };

  const handleSaveAndReturn = () => {
    if (!fullName || !phone || !addressLine1 || !city || !pincode) {
      Alert.alert('Required Fields', 'Please fill in Name, Phone, Address, City and Pincode.');
      return;
    }

    const newAddress: Address = {
      id: 'addr-' + Date.now().toString(36),
      label,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state: stateName,
      pincode,
      latitude: selectedCoords.lat,
      longitude: selectedCoords.lon,
    };

    if (onSelectAddress) {
      onSelectAddress(newAddress);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Navbar */}
      <View style={[styles.nav, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Delivery Address & OSM Location</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* OpenStreetMap Search Bar */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Compass size={18} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              OpenStreetMap Location Finder (Free)
            </Text>
          </View>
          <Text style={[styles.cardSub, { color: colors.subText }]}>
            Search places and localities across India without paid Google APIs
          </Text>

          <View style={styles.searchRow}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearchOSM}
              placeholder="Search area, road, landmark (e.g. Indiranagar)"
              placeholderTextColor={colors.subText}
              style={[
                styles.searchInput,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
            />
            <TouchableOpacity
              onPress={handleSearchOSM}
              disabled={isSearching}
              style={[styles.searchBtn, { backgroundColor: colors.primary }]}
            >
              {isSearching ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Search size={16} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>

          {/* OSM Search Results list */}
          {searchResults.length > 0 && (
            <View style={[styles.resultsBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {searchResults.map((res) => (
                <TouchableOpacity
                  key={res.placeId}
                  onPress={() => handleSelectOsmResult(res)}
                  style={[styles.resultItem, { borderBottomColor: colors.border }]}
                >
                  <MapPin size={16} color={colors.primary} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.resultText, { color: colors.text }]} numberOfLines={2}>
                      {res.displayName}
                    </Text>
                    <Text style={[styles.resultCoords, { color: colors.subText }]}>
                      Lat: {res.latitude.toFixed(4)}, Lon: {res.longitude.toFixed(4)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Quick preset hubs */}
          <Text style={[styles.presetTitle, { color: colors.subText }]}>Quick Selection Delivery Hubs:</Text>
          <View style={styles.hubChipsRow}>
            {POPULAR_DELIVERY_HUBS.map((hub, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelectHub(hub)}
                style={[styles.hubChip, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <Text style={[styles.hubChipText, { color: colors.primary }]}>{hub.city}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address Form */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 12 }]}>
            Shipping Details
          </Text>

          {/* Address Type Selector */}
          <View style={styles.typeSelector}>
            {(['Home', 'Office', 'Shop', 'Warehouse'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setLabel(t)}
                style={[
                  styles.typeBtn,
                  {
                    backgroundColor: label === t ? colors.primary : colors.background,
                    borderColor: label === t ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    { color: label === t ? '#ffffff' : colors.text },
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Contact Phone *</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Address Line 1 (Flat/Building/Road) *</Text>
            <TextInput
              value={addressLine1}
              onChangeText={setAddressLine1}
              style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>Address Line 2 (Area/Landmark)</Text>
            <TextInput
              value={addressLine2}
              onChangeText={setAddressLine2}
              style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.grid2}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>City *</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>Pincode *</Text>
              <TextInput
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.text }]}>State</Text>
            <TextInput
              value={stateName}
              onChangeText={setStateName}
              style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
          </View>

          {/* Coordinates badge */}
          {selectedCoords.lat && (
            <View style={styles.coordsBadge}>
              <MapPin size={12} color="#059669" />
              <Text style={styles.coordsText}>
                OSM Coordinates: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lon?.toFixed(4)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSaveAndReturn}
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.saveBtnText}>Save Address & Select for Checkout</Text>
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
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 10,
    marginTop: 2,
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 11,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsBox: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    maxHeight: 180,
  },
  resultItem: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resultCoords: {
    fontSize: 9,
    marginTop: 2,
  },
  presetTitle: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  hubChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hubChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  hubChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  formRow: {
    marginBottom: 10,
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 11,
  },
  coordsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    padding: 6,
    borderRadius: 8,
    marginVertical: 10,
  },
  coordsText: {
    color: '#065f46',
    fontSize: 10,
    fontWeight: '700',
  },
  saveBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});
