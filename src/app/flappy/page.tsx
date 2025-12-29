"use client";

import FlappyGame from "@/components/FlappyGame";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function Page() {
   const router = useRouter();
   return (
      <ProtectedRoute>
         <div className="flex items-center justify-center h-screen bg-blue-300">
            <FlappyGame />
         </div>
         <button onClick={() => router.push(`/`)} className="absolute bottom-10 right-10 px-6 py-3 bg-blue-500 rounded-xl font-semibold transition-all duration-300 hover:scale-105">🏠</button>
      </ProtectedRoute>
   );
}
