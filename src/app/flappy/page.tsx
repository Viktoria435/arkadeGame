"use client";

import FlappyGame from "@/components/FlappyGame";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Page() {
   return (
      <ProtectedRoute>
         <div className="flex items-center justify-center h-screen bg-blue-300">
            <FlappyGame />
         </div>
      </ProtectedRoute>
   );
}
