import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  addToCart,
  CartItem,
  CartItemPayload,
  clearUserCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from '../data/cart';
import { useAuth } from '../hooks/useAuth';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, '_id' | 'quantity'>, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();                    // ← get user from AuthContext
  const customerId = user?._id || '';            // ← derive id here

  const [items, setItems] = useState<CartItem[]>([]);

  // 1️⃣ Whenever customerId changes, fetch their cart
  useEffect(() => {
    if (!customerId) {
      setItems([]);   // clear local state if logged out
      return;
    }

    getCart(customerId)
      .then(cart => setItems(cart.items))
      .catch(() => setItems([]));
  }, [customerId]);

  // helper to reload from server
  const syncCart = async () => {
    if (!customerId) return;
    const cart = await getCart(customerId);
    setItems(cart.items);
  };

  const addItem = async (
    newItem: Omit<CartItem, '_id' | 'quantity'>,
    quantity = 1
  ) => {
    if (!customerId) return;
    const payload: CartItemPayload = { customerId, productId: newItem.productId, quantity };
    await addToCart(payload);
    await syncCart();
  };

  const removeItem = async (productId: string) => {
    if (!customerId) return;
    await removeFromCart({ customerId, productId });
    // optionally you could re-sync rather than filter locally:
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!customerId || quantity < 1) return;
    const payload: CartItemPayload = { customerId, productId, quantity };
    await updateCartItem(payload);
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (!customerId) return;
    await clearUserCart({ customerId });
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal   = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
