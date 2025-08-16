import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers } from '../data/mockData';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('akwareg_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check test accounts
    const testAccounts = {
      'john.doe@email.com': { password: 'password123', user: mockUsers[0] },
      'sarah.wilson@email.com': { password: 'password123', user: mockUsers[1] },
      'official@aksgov.ng': { password: 'password123', user: mockUsers[2] },
      'admin@akwareg.ng': { password: 'password123', user: mockUsers[3] },
    };
    
    const account = testAccounts[email as keyof typeof testAccounts];
    
    if (account && account.password === password) {
      setUser(account.user);
      localStorage.setItem('akwareg_user', JSON.stringify(account.user));
      setLoading(false);
    } else {
      setLoading(false);
      throw new Error('Invalid email or password');
    }
  };

  const signUp = async (email: string, password: string, userData: any): Promise<void> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would create the user in the backend
    // For now, just simulate success
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('akwareg_user');
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};