import { createContext, useCallback, useState, ReactNode } from 'react';
import { loginUser, registerUser } from '../data/auth';

// Define user types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'admin' | 'customer') => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'admin' | 'customer') => Promise<boolean>;
  logout: () => void;
  initAuth: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Login function using backend API
  const login = useCallback(async (email: string, password: string, role: 'admin' | 'customer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await loginUser({ email, password });
      if (loggedInUser.role !== role) {
        setIsLoading(false);
        return false;
      }

      const { password: _, ...cleanUser } = loggedInUser;
      setUser(cleanUser);
      localStorage.setItem('user', JSON.stringify(cleanUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function using backend API
const register = useCallback(
  async (name: string, email: string, password: string, role: 'admin' | 'customer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: registeredUser } = await registerUser({ name, email, password, role });
      const { password: _, ...cleanUser } = registeredUser;
      setUser(cleanUser);
      localStorage.setItem('user', JSON.stringify(cleanUser));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  },
  []
);


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
