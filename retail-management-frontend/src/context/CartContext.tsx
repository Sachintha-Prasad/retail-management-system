import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { addToCart, Cart, CartItem, CartItemPayload, clearUserCart, getCart, removeFromCart, updateCartItem } from '../data/cart';


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
  const [items, setItems] = useState<CartItem[]>([]);
  const customerId = React.useMemo(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : '';
  }, []);

  // Load cart on mount
  useEffect(() => {
    if (!customerId) return;
    getCart(customerId)
      .then(handleCartResponse)
      .catch(() => setItems([]));
  }, [customerId]);

  const handleCartResponse = (cart: Cart) => {
    setItems(cart.items);
  };

  // Sync local state with server
  const syncCart = async () => {
    if (!customerId) return;
    const cart = await getCart(customerId);
    handleCartResponse(cart);
  };

  const addItem = async (
    newItem: Omit<CartItem, '_id' | 'quantity'>,
    quantity = 1
  ) => {
    if (!customerId) return;
    const payload: CartItemPayload = {
      customerId,
      productId: newItem.productId,
      quantity,
    };
    await addToCart(payload);
    await syncCart();
  };

  const removeItem = async (productId: string) => {
    if (!customerId) return;
    await removeFromCart({ customerId, productId });
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
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
