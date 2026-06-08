import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';
import { getApiErrorMessage } from '../utils/apiErrors';
import { initializeSocket, disconnectSocket } from '../services/socketService';

const AuthContext = createContext(null);

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      initializeSocket(token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password })
      if (response.success) {
        setUser(response.data)
        setIsAuthenticated(true)
        const token = localStorage.getItem('token')
        if (token) {
          initializeSocket(token)
        }
        return { success: true, data: response.data }
      }
      return { success: false, message: 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: getApiErrorMessage(error, 'Login failed. Please try again.')
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Registration failed. Please try again.')
      };
    }
  };

  const logout = () => {
    disconnectSocket();
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
