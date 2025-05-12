import { CartItem } from '../context/CartContext';

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

// Sample orders for demo
export const orders: Order[] = [
  {
    id: 'ORD-1001',
    customerId: '2',
    items: [
      {
        id: '1',
        name: 'Premium Leather Wallet',
        price: 59.99,
        image: 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg',
        quantity: 1,
      },
      {
        id: '5',
        name: 'Organic Cotton T-shirt',
        price: 32.99,
        image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg',
        quantity: 2,
      },
    ],
    total: 125.97,
    status: 'delivered',
    address: {
      line1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
    },
    createdAt: '2023-06-15T14:30:00Z',
  },
  {
    id: 'ORD-1002',
    customerId: '2',
    items: [
      {
        id: '2',
        name: 'Wireless Over-Ear Headphones',
        price: 199.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
        quantity: 1,
      },
    ],
    total: 199.99,
    status: 'shipped',
    address: {
      line1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
    },
    createdAt: '2023-07-05T09:15:00Z',
  },
];

// API simulation functions
export const getOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders);
    }, 800);
  });
};

export const getOrderById = (id: string): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = orders.find((o) => o.id === id);
      resolve(order);
    }, 500);
  });
};

export const getOrdersByCustomerId = (customerId: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const customerOrders = orders.filter((o) => o.customerId === customerId);
      resolve(customerOrders);
    }, 800);
  });
};

export const createOrder = (
  customerId: string,
  items: CartItem[],
  address: Order['address']
): Promise<Order> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      
      const newOrder: Order = {
        id: `ORD-${1000 + orders.length + 1}`,
        customerId,
        items,
        total,
        status: 'pending',
        address,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, this would be saved to the database
      // For this demo, we'll just return the new order
      resolve(newOrder);
    }, 1000);
  });
};

export const updateOrderStatus = (
  id: string,
  status: Order['status']
): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderIndex = orders.findIndex((o) => o.id === id);
      
      if (orderIndex === -1) {
        resolve(undefined);
        return;
      }
      
      // In a real app, this would update the database
      // For this demo, we'll just return the updated order
      const updatedOrder = {
        ...orders[orderIndex],
        status,
      };
      
      resolve(updatedOrder);
    }, 1000);
  });
};