"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
   user: User | null;
   isLoading: boolean;
   login: (token: string, user: User) => void;
   logout: () => void;
   updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};

interface AuthProviderProps {
   children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         fetchUserData(token);
      } else {
         setIsLoading(false);
      }
   }, []);

   const fetchUserData = async (token: string) => {
      try {
         const response = await fetch('/api/auth/verify', {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
         } else {
            localStorage.removeItem('token');
         }
      } catch (error) {
         console.error('Error fetching user data:', error);
         localStorage.removeItem('token');
      } finally {
         setIsLoading(false);
      }
   };

   const login = (token: string, user: User) => {
      localStorage.setItem('token', token);
      setUser(user);
   };

   const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
   };

   const updateUser = (updatedUser: User) => {
      setUser(updatedUser);
   };

   const value: AuthContextType = {
      user,
      isLoading,
      login,
      logout,
      updateUser,
   };

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
};
