// src/data/orders.ts
const BASE_URL = "http://localhost:8000/api/orders"; // Adjust if needed

export interface Address {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface Order {
  _id?: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status?: "pending" | "shipped" | "delivered";
  address: Address;
  createdAt?: string;
}

// Create a new order
export const createOrder = async (order: Order): Promise<Order> => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    throw new Error("Failed to create order");
  }

  return res.json();
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
};

// Get single order
export const getOrderById = async (id: string): Promise<Order> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }
  return res.json();
};

// Update order status
export const updateOrderStatus = async (
  id: string,
  status: "pending" | "shipped" | "delivered"
): Promise<Order> => {
  const res = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update order status");
  }

  return res.json();
};

// Delete order
export const deleteOrder = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete order");
  }

  return res.json();
};
