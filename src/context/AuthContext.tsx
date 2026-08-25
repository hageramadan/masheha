/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<any>;
  loginWithPhone: (phone: string, countryCode: string) => Promise<any>;
  getUserProfile: () => Promise<any>;
  updateProfile: (data: { name: string; phone: string; country_code: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: any, token: string) => {
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  // ✅ تسجيل الخروج من الـ API
  const logout = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      
      if (currentToken) {
        await fetch('https://admin.masheha.com/api/user/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
            
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
     
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.success('تم تسجيل الخروج بنجاح');
    }
  };


  const getUserProfile = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        throw new Error('No token found');
      }

      const response = await fetch('https://admin.masheha.com/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.result) {
        
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        return data;
      } else {
        throw new Error(data.message || 'فشل جلب بيانات المستخدم');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  };

  
  const updateProfile = async (data: { name: string; phone: string; country_code: string }) => {
    try {
      const currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('country_code', data.country_code);
      formData.append('_method', 'PUT');

      const response = await fetch('https://admin.masheha.com/api/user/update/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (result.result) {
        // تحديث بيانات المستخدم المحلية
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('تم تحديث البيانات بنجاح');
        return result;
      } else {
        throw new Error(result.message || 'فشل تحديث البيانات');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // ✅ تسجيل الدخول
  const loginWithPhone = async (phone: string, countryCode: string) => {
    try {
      const response = await fetch('https://admin.masheha.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country_code: countryCode,
          phone: phone,
        }),
      });

      const data = await response.json();
      
      if (data.result) {
        const token = data.data?.user?.token;
        const userData = data.data?.user || { phone, country_code: countryCode };
        
        if (token) {
          login(userData, token);
          // جلب البيانات الكاملة للمستخدم
          await getUserProfile();
        } else {
          throw new Error('لم يتم استلام التوكن');
        }
        return data;
      } else {
        throw new Error(data.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // ✅ التسجيل
  const register = async (userData: any) => {
    try {
      const response = await fetch('https://admin.masheha.com/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country_code: userData.country_code || '+966',
          phone: userData.phone,
          name: userData.name,
        }),
      });

      const data = await response.json();
      
      if (data.result) {
        const token = data.data?.user?.token;
        const userDataResponse = data.data?.user || userData;
        
        if (token) {
          login(userDataResponse, token);
          // جلب البيانات الكاملة للمستخدم
          await getUserProfile();
        } else {
          throw new Error('لم يتم استلام التوكن');
        }
        return data;
      } else {
        throw new Error(data.message || 'فشل التسجيل');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      token,
      login, 
      logout, 
      register,
      loginWithPhone,
      getUserProfile,
      updateProfile,
    }}>
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