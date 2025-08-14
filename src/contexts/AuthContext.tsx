import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { mockUsers, testAccounts } from '../data/mockData';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const signIn = async (email: string, password: string) => {
    // Mock authentication - check against test accounts
    const account = Object.values(testAccounts).find(
      acc => acc.email === email && acc.password === password
    );
    
    if (!account) {
      throw new Error('Invalid email or password');
    }
    
    setUser(account.user);
    localStorage.setItem('akwareg_user', JSON.stringify(account.user));
  };

  const signUp = async (email: string, password: string, userData: any) => {
    // Mock user creation
    const newUser: User = {
      id: Date.now().toString(),
      email,
      ...userData,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // In a real app, this would be saved to the backend
    mockUsers.push(newUser);
    
    // Auto sign in the new user
    setUser(newUser);
    localStorage.setItem('akwareg_user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('akwareg_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}