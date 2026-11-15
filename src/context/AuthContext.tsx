/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { AuthService, AuthUser, PhoneCredentials, RegistrationData, normalizePhone } from '@/src/services/authService';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => Promise<void>;
  register: (userData: RegistrationData) => Promise<any>;
  verifyOtp: (credentials: PhoneCredentials, otp: string) => Promise<void>;
  resendOtp: (credentials: PhoneCredentials) => Promise<void>;
  clearPendingAuth: () => void;
  getUserProfile: () => Promise<any>;
  updateProfile: (data: { name: string; phone: string; country_code: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Keep registration tokens private until the backend accepts the OTP.
  const pendingAuth = useRef<{ credentials: PhoneCredentials; user: AuthUser; token?: string } | null>(null);
  const authGeneration = useRef(0);
  const clearPendingAuth = () => { pendingAuth.current = null; authGeneration.current += 1; };

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

  // تسجيل الخروج من الـ API
  const logout = async () => {
    clearPendingAuth();
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

  const stageAuthentication = async (credentials: PhoneCredentials, request: () => ReturnType<typeof AuthService.register>) => {
    clearPendingAuth();
    const generation = authGeneration.current;
    const response = await request();
    if (generation !== authGeneration.current) throw new Error('تم تغيير بيانات التسجيل، حاول مرة أخرى');
    const user = response.data?.user || {};
    pendingAuth.current = { credentials: normalizePhone(credentials), user, token: user.token || response.data?.token };
    return response;
  };

  const register = (data: RegistrationData) => stageAuthentication(data, () => AuthService.register(data));

  const requirePendingAuth = (credentials: PhoneCredentials) => {
    const pending = pendingAuth.current;
    const normalized = normalizePhone(credentials);
    if (!pending || pending.credentials.phone !== normalized.phone || pending.credentials.country_code !== normalized.country_code) {
      throw new Error('يرجى طلب رمز تحقق لهذا الرقم أولاً');
    }
    return pending;
  };

  const verifyOtp = async (credentials: PhoneCredentials, otp: string) => {
    const pending = requirePendingAuth(credentials);
    const response = await AuthService.verifyOtp(pending.credentials, otp);
    if (pendingAuth.current !== pending) throw new Error('تم تغيير رقم الجوال، اطلب رمز تحقق جديد');
    const verifiedUser = response.data?.user || {};
    const verifiedToken = verifiedUser.token || response.data?.token || pending.token;
    if (!verifiedToken) throw new Error('لم يتم استلام توكن تسجيل الدخول');
    login({ ...pending.credentials, ...pending.user, ...verifiedUser }, verifiedToken);
    clearPendingAuth();
  };

  const resendOtp = async (credentials: PhoneCredentials) => {
    const pending = requirePendingAuth(credentials);
    await AuthService.resendOtp(pending.credentials);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      token,
      login, 
      logout, 
      register,
      verifyOtp,
      resendOtp,
      clearPendingAuth,
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