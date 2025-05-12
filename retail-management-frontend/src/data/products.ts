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

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Leather Wallet',
    description: 'Handcrafted premium leather wallet with multiple card slots and a coin pocket. Made from genuine leather that ages beautifully with use.',
    price: 59.99,
    image: 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg',
    category: 'accessories',
    stock: 25,
    featured: true,
    createdAt: '2023-03-12T10:00:00Z',
  },
  {
    id: '2',
    name: 'Wireless Over-Ear Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality for the ultimate listening experience.',
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    category: 'electronics',
    stock: 12,
    featured: true,
    createdAt: '2023-04-05T14:30:00Z',
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    description: 'Track your health metrics, workouts, and receive notifications with this water-resistant smart fitness watch featuring a bright OLED display.',
    price: 149.99,
    image: 'https://images.pexels.com/photos/4046707/pexels-photo-4046707.jpeg',
    category: 'electronics',
    stock: 18,
    featured: false,
    createdAt: '2023-05-20T09:15:00Z',
  },
  {
    id: '4',
    name: 'Minimalist Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness, color temperature, and an elegant minimalist design perfect for any workspace.',
    price: 79.99,
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg',
    category: 'home',
    stock: 30,
    featured: false,
    createdAt: '2023-02-18T11:45:00Z',
  },
  {
    id: '5',
    name: 'Organic Cotton T-shirt',
    description: 'Eco-friendly, soft organic cotton t-shirt with a classic fit. Sustainably made with non-toxic dyes and fair labor practices.',
    price: 32.99,
    image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg',
    category: 'clothing',
    stock: 45,
    featured: true,
    createdAt: '2023-01-10T13:20:00Z',
  },
  {
    id: '6',
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'Handcrafted ceramic pour-over coffee set including dripper, server, and two cups. Perfect for brewing the perfect cup every morning.',
    price: 65.99,
    image: 'https://images.pexels.com/photos/4200791/pexels-photo-4200791.jpeg',
    category: 'home',
    stock: 15,
    featured: false,
    createdAt: '2023-06-02T15:10:00Z',
  },
  {
    id: '7',
    name: 'Vintage Polaroid Camera',
    description: 'Refurbished vintage Polaroid camera that captures memories with a classic, nostalgic feel. Includes a starter pack of film.',
    price: 129.99,
    image: 'https://images.pexels.com/photos/3615739/pexels-photo-3615739.jpeg',
    category: 'electronics',
    stock: 8,
    featured: true,
    createdAt: '2023-04-28T10:30:00Z',
  },
  {
    id: '8',
    name: 'Leather Messenger Bag',
    description: 'Stylish yet functional leather messenger bag with multiple compartments, perfect for work, school, or everyday use.',
    price: 119.99,
    image: 'https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg',
    category: 'accessories',
    stock: 20,
    featured: false,
    createdAt: '2023-03-15T12:00:00Z',
  },
];

// API simulation functions
export const getProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 800);
  });
};

export const getProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = products.find((p) => p.id === id);
      resolve(product);
    }, 500);
  });
};

export const getFeaturedProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const featured = products.filter((p) => p.featured);
      resolve(featured);
    }, 800);
  });
};

export const searchProducts = (query: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = products.filter((p) => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 800);
  });
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = {
        ...product,
        id: String(products.length + 1),
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, this would be added to the database
      // For this demo, we'll just return the new product
      resolve(newProduct);
    }, 1000);
  });
};

export const updateProduct = (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const productIndex = products.findIndex((p) => p.id === id);
      
      if (productIndex === -1) {
        resolve(undefined);
        return;
      }
      
      // In a real app, this would update the database
      // For this demo, we'll just return the updated product
      const updatedProduct = {
        ...products[productIndex],
        ...updates,
      };
      
      resolve(updatedProduct);
    }, 1000);
  });
};

export const deleteProduct = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const productIndex = products.findIndex((p) => p.id === id);
      
      if (productIndex === -1) {
        resolve(false);
        return;
      }
      
      // In a real app, this would delete from the database
      // For this demo, we'll just return success
      resolve(true);
    }, 1000);
  });
};