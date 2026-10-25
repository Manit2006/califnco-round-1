import React from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { X, ZoomIn } from 'lucide-react-native';

interface ImageLightboxProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  visible,
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, visible]);

  if (!visible || !images || images.length === 0) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Top Controls */}
        <View style={styles.header}>
          <Text style={styles.counter}>
            {activeIndex + 1} / {images.length}
          </Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Carousel / Image display */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setActiveIndex(newIndex);
          }}
          style={styles.scroll}
        >
          {images.map((imgUrl, idx) => (
            <View key={idx} style={styles.slide}>
              <Image
                source={{ uri: imgUrl }}
                style={styles.image}
                resizeMode="contain"
                defaultSource={{ uri: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80' }}
              />
            </View>
          ))}
        </ScrollView>

        {/* Thumbnail Selector at bottom */}
        {images.length > 1 && (
          <View style={styles.footer}>
            {images.map((img, i) => (
              <View
                key={i}
                style={[
                  styles.thumbDot,
                  i === activeIndex ? styles.thumbDotActive : styles.thumbDotInactive,
                ]}
              />
            ))}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 20, 0.95)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 10,
  },
  counter: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  scroll: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.92,
    height: SCREEN_HEIGHT * 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    gap: 8,
  },
  thumbDot: {
    height: 8,
    borderRadius: 4,
  },
  thumbDotActive: {
    width: 24,
    backgroundColor: '#06b6d4',
  },
  thumbDotInactive: {
    width: 8,
    backgroundColor: '#475569',
  },
});
