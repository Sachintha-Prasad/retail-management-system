// src/api/cart.ts
import axios from 'axios';

// Base URL for cart endpoints (make sure REACT_APP_API_URL is set in your .env)
const BASE_URL = "http://localhost:8000/api/cart";

// Payload interfaces
export interface CartItemPayload {
  customerId: string;
  productId: string;
  quantity: number;
}

export interface RemoveCartPayload {
  customerId: string;
  productId: string;
}

export interface ClearCartPayload {
  customerId: string;
}

// Cart/Item response interfaces
export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  _id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Helper to attach auth token if present
const getConfig = () => {
  const token = localStorage.getItem('token');
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;
};

// Add or increment a cart item
export const addToCart = async (
  payload: CartItemPayload
): Promise<Cart> => {
  const response = await axios.post(
    `${BASE_URL}/add`,
    payload,
    getConfig()
  );
  return response.data;
};

// Retrieve a customer's cart
export const getCart = async (
  customerId: string
): Promise<Cart> => {
  const response = await axios.get(
    `${BASE_URL}/${customerId}`,
    getConfig()
  );
  return response.data;
};

// Update the quantity of an existing item
export const updateCartItem = async (
  payload: CartItemPayload
): Promise<Cart> => {
  const response = await axios.put(
    `${BASE_URL}/update`,
    payload,
    getConfig()
  );
  return response.data;
};

// Remove a single item from the cart
export const removeFromCart = async (
  payload: RemoveCartPayload
): Promise<Cart> => {
  const response = await axios.delete(
    `${BASE_URL}/remove`,
    { data: payload, ...getConfig() }
  );
  return response.data;
};

// Clear all items in the customer's cart
export const clearUserCart = async (
  payload: ClearCartPayload
): Promise<{ message: string }> => {
  const response = await axios.delete(
    `${BASE_URL}/clear`,
    { data: payload, ...getConfig() }
  );
  return response.data;
};