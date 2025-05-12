import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (wallet) => {
    try {

      const adminWallet = import.meta.env.VITE_ADMIN_WALLET_ADDRESS;

      if (!adminWallet) {
        throw new Error('Admin wallet address tidak ditemukan di environment variables');
      }
      
      // Simulasi pengecekan role (dalam implementasi nyata, ini bisa dari smart contract)
      const isAdmin = wallet.toLowerCase() === adminWallet.toLowerCase();
      
      const userData = {
        wallet,
        role: isAdmin ? 'admin' : 'user',
        timestamp: Date.now()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('balance');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};