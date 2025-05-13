import axios from "axios";

const API_URL = 'http://localhost:8000/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
  createdAt: string;
}


/**
 * Fetch all products
 */
export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_URL}/products`);
  return response.data;
};

/**
 * Fetch a single product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/products/${id}`);
  return response.data;
};

/**
 * Add a new product
 */
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { image: string }): Promise<Product> => {
  const response = await axios.post<Product>(
    `${API_URL}/products`,
    product,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

/**
 * Update an existing product (full update) - expects JSON with base64 image string
 */
export const updateProduct = async (
  id: string,
  product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> & { image?: string }
): Promise<Product> => {
  const response = await axios.put<Product>(
    `${API_URL}/products/${id}`,
    product,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/products/${id}`);
};

/**
 * Update only the stock of a product
 */
export const updateStock = async (id: string, stock: number): Promise<Product> => {
  const response = await axios.patch<Product>(
    `${API_URL}/products/${id}/stock`,
    { stock },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};
