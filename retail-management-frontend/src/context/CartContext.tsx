// src/context/CartContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { addToCart, getCart, removeFromCart, updateCartItem, clearUserCart, Cart, CartItem } from '../data/cart';


interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const customerId = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)._id
    : '';

  // Load cart from API on mount
  useEffect(() => {
    if (!customerId) return;
    getCart(customerId)
      .then((cart: Cart) => {
        const mapped = cart.items.map((i: CartItem) => ({
          _id: i._id,
          productId: i.productId,
          id: i.productId,
          name: i.name,
          price: i.price,
          image: i.image,
          quantity: i.quantity,
        }));
        setItems(mapped);
      })
      .catch(() => setItems([]));
  }, [customerId]);

  // Persist local changes back to API
  const syncCart = async () => {
    if (!customerId) return;
    // Re-fetch to get server state
    const cart = await getCart(customerId);
    const mapped = cart.items.map((i) => ({
      _id: i._id,
      productId: i.productId,
      id: i.productId,
      name: i.name,
      price: i.price,
      image: i.image,
      quantity: i.quantity,
    }));
    setItems(mapped);
  };

  const addItem = async (
    newItem: Omit<CartItem, 'quantity'>,
    quantity = 1
  ) => {
    if (!customerId) return;
    await addToCart({ customerId, productId: newItem._id, quantity });
    await syncCart();
  };

  const removeItem = async (id: string) => {
    if (!customerId) return;
    await removeFromCart({ customerId, productId: id });
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!customerId || quantity < 1) return;
    await updateCartItem({ customerId, productId: id, quantity });
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = async () => {
    if (!customerId) return;
    await clearUserCart({ customerId });
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
