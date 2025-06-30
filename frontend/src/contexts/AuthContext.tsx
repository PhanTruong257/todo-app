// src/contexts/AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('user'));

  const login = (email: string, token: string) => {
    setUser(email);
    localStorage.setItem('user', email);
    // token đã được lưu trong hàm login() của service
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};