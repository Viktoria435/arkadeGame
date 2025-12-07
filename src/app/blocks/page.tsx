"use client";

import Board from "./(board)/Board";

export default function Blocks() {
    return (
       <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-8">
          <Board />
       </div>
    );
 }
 