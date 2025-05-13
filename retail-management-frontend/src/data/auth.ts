
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/users'; // Adjust based on your backend server

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}


export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Register a new user
export const registerUser = async (payload: RegisterPayload): Promise<{ message: string; user: User }> => {
  const response = await axios.post(`${BASE_URL}/register`, payload);
  return response.data;
};

// Login user
export const loginUser = async (payload: LoginPayload): Promise<{ message: string; user: User }> => {
  const response = await axios.post(`${BASE_URL}/login`, payload);
  return response.data;
};

// Get user by ID (admin only)
export const getUser = async (id: string): Promise<User> => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// Update user by ID (admin only)
export const updateUser = async (
  id: string,
  payload: Partial<RegisterPayload>
): Promise<User> => {
  const response = await axios.put(`${BASE_URL}/${id}`, payload);
  return response.data;
};

// Delete user by ID (admin only)
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
