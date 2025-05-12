import { createContext, useCallback, useState, ReactNode } from 'react';

// Define user types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'admin' | 'customer') => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demo
const SAMPLE_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Customer User',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer' as const,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage
  const initAuth = useCallback(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string, role: 'admin' | 'customer'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = SAMPLE_USERS.find(
          (u) => u.email === email && u.password === password && u.role === role
        );
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  }, []);

  // Register function
  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const exists = SAMPLE_USERS.some((u) => u.email === email);
        
        if (!exists) {
          // In a real app, we would create a new user in the database
          // For this demo, we'll just simulate success
          const newUser = {
            id: `${SAMPLE_USERS.length + 1}`,
            name,
            email,
            role: 'customer' as const,
          };
          
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        initAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};