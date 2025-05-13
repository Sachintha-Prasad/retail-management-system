// src/api/cart.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/cart'; // Update this to match your backend

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  customerId: string;
  items: CartItem[];
  total: number;
}

// Add to cart
export const addToCart = async (
  customerId: string,
  productId: string,
  quantity: number
): Promise<Cart> => {
  const response = await axios.post(`${BASE_URL}/add`, {
    customerId,
    productId,
    quantity,
  });
  return response.data;
};

// Get cart by customer ID
export const getCart = async (customerId: string): Promise<Cart> => {
  const response = await axios.get(`${BASE_URL}/${customerId}`);
  return response.data;
};

// Update item quantity in cart
export const updateCartItem = async (
  customerId: string,
  productId: string,
  quantity: number
): Promise<Cart> => {
  const response = await axios.put(`${BASE_URL}/update`, {
    customerId,
    productId,
    quantity,
  });
  return response.data;
};

// Remove an item from the cart
export const removeFromCart = async (
  customerId: string,
  productId: string
): Promise<Cart> => {
  const response = await axios.delete(`${BASE_URL}/remove`, {
    data: {
      customerId,
      productId,
    },
  });
  return response.data;
};

// Clear the cart
export const clearCart = async (customerId: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${BASE_URL}/clear`, {
    data: { customerId },
  });
  return response.data;
};
