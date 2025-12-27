"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
   children: React.ReactNode;
   redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
   children,
   redirectTo = '/login'
}) => {
   const { user, isLoading } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!isLoading && !user) {
         router.push(redirectTo);
      }
   }, [user, isLoading, router, redirectTo]);

   if (isLoading) {
      return (
         <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
               <p className="text-purple-600 font-medium">Загрузка...</p>
            </div>
         </div>
      );
   }

   if (!user) {
      return null; // Component will redirect
   }

   return <>{children}</>;
};
