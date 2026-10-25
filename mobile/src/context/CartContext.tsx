import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  totalItemsCount: number;
  appliedReferralDiscount: number;
  applyReferralCode: (code: string) => { success: boolean; message: string };
  removeReferralCode: () => void;
}

const STORAGE_KEY_CART = 'califnco_mobile_cart_items_v1';

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isApprovedDealer } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedReferralDiscount, setAppliedReferralDiscount] = useState<number>(0);

  // Load persistent cart
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY_CART).then((stored) => {
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch (e) {
          console.warn('Failed to parse cart storage', e);
        }
      }
    });
  }, []);

  // Update item unitPrices whenever dealer status changes
  useEffect(() => {
    setItems((prev) =>
      prev.map((item) => {
        const unitPrice = isApprovedDealer ? item.product.wholesalePrice : item.product.retailPrice;
        return {
          ...item,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
        };
      })
    );
  }, [isApprovedDealer]);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    AsyncStorage.setItem(STORAGE_KEY_CART, JSON.stringify(newItems));
  };

  const addToCart = (product: Product, quantityToAdd = 1) => {
    const unitPrice = isApprovedDealer ? product.wholesalePrice : product.retailPrice;
    const minQty = isApprovedDealer ? product.minOrderQuantity || 1 : 1;
    const effectiveQtyToAdd = Math.max(quantityToAdd, minQty);

    const existingIndex = items.findIndex((i) => i.product.id === product.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...items];
      const newQty = updated[existingIndex].quantity + quantityToAdd;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        unitPrice,
        totalPrice: unitPrice * newQty,
      };
    } else {
      updated = [
        ...items,
        {
          product,
          quantity: effectiveQtyToAdd,
          unitPrice,
          totalPrice: unitPrice * effectiveQtyToAdd,
        },
      ];
    }

    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = items.filter((i) => i.product.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updated = items.map((i) => {
      if (i.product.id === productId) {
        const minQty = isApprovedDealer ? i.product.minOrderQuantity || 1 : 1;
        const validQty = Math.max(quantity, minQty);
        return {
          ...i,
          quantity: validQty,
          totalPrice: i.unitPrice * validQty,
        };
      }
      return i;
    });

    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedReferralDiscount(0);
  };

  const applyReferralCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized || normalized.length < 4) {
      return { success: false, message: 'Invalid referral code format.' };
    }
    // Grant ₹500 discount for valid referral code on cart
    const discount = 500;
    setAppliedReferralDiscount(discount);
    return {
      success: true,
      message: `Referral code "${normalized}" applied! ₹${discount} discount added.`,
    };
  };

  const removeReferralCode = () => {
    setAppliedReferralDiscount(0);
  };

  // Calculations
  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const gstAmount = Math.round(subtotal * 0.18 * 100) / 100; // 18% standard GST
  const shippingFee = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const discountAmount = Math.min(appliedReferralDiscount, subtotal);
  const totalAmount = Math.max(0, subtotal + gstAmount + shippingFee - discountAmount);
  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
