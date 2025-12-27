"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         alert("Пароли не совпадают!");
         return;
      }
      setIsLoading(true);
      const response = await fetch("/api/auth/register", {
         method: "POST",
         body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
         router.push("/login");
         setIsLoading(false);
      }
      else {
         alert(data.error);
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden flex items-center justify-center py-12">
         {/* Background Grid Pattern */}
         <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
               backgroundImage: `
                  linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
               `,
               backgroundSize: "50px 50px",
            }}
         />

         {/* Floating Icons */}
         <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">
            🎮
         </div>
         <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float-delayed">
            🏆
         </div>
         <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-float">
            ⭐
         </div>
         <div className="absolute bottom-40 right-10 text-6xl opacity-20 animate-float-delayed">
            🎯
         </div>

         <div className="relative z-10 w-full max-w-md px-6">

            <div className="relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

               <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 shadow-2xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>

                  <div className="p-8">
                     <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <User className="w-4 h-4 text-purple-500" />
                              Имя пользователя
                           </label>
                           <div className="relative">
                              <input
                                 type="text"
                                 name="username"
                                 value={formData.username}
                                 onChange={handleChange}
                                 className="w-full px-4 py-3 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300 text-gray-800"
                                 placeholder="Игрок123"
                                 required
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-purple-500" />
                              Email
                           </label>
                           <div className="relative">
                              <input
                                 type="email"
                                 name="email"
                                 value={formData.email}
                                 onChange={handleChange}
                                 className="w-full px-4 py-3 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300 text-gray-800"
                                 placeholder="your@email.com"
                                 required
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Lock className="w-4 h-4 text-purple-500" />
                              Пароль
                           </label>
                           <div className="relative">
                              <input
                                 type={showPassword ? "text" : "password"}
                                 name="password"
                                 value={formData.password}
                                 onChange={handleChange}
                                 className="w-full px-4 py-3 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300 text-gray-800 pr-12"
                                 placeholder="Минимум 8 символов"
                                 required
                                 minLength={8}
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                              >
                                 {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                 ) : (
                                    <Eye className="w-5 h-5" />
                                 )}
                              </button>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Lock className="w-4 h-4 text-purple-500" />
                              Подтвердите пароль
                           </label>
                           <div className="relative">
                              <input
                                 type={showConfirmPassword ? "text" : "password"}
                                 name="confirmPassword"
                                 value={formData.confirmPassword}
                                 onChange={handleChange}
                                 className="w-full px-4 py-3 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300 text-gray-800 pr-12"
                                 placeholder="Повторите пароль"
                                 required
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                 }
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                              >
                                 {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                 ) : (
                                    <Eye className="w-5 h-5" />
                                 )}
                              </button>
                           </div>
                        </div>
                        <button
                           type="submit"
                           disabled={isLoading}
                           className="w-full py-4 rounded-xl font-bold text-white text-lg
                              bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500
                              transform transition-all duration-300
                              hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105
                              active:scale-95
                              disabled:opacity-50 disabled:cursor-not-allowed
                              flex items-center justify-center gap-2"
                        >
                           {isLoading ? (
                              <>
                                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                 Регистрация...
                              </>
                           ) : (
                              <>
                                 <Zap className="w-5 h-5" />
                                 ЗАРЕГИСТРИРОВАТЬСЯ
                              </>
                           )}
                        </button>
                     </form>

                  
                     <div className="text-center mt-6">
                        <p className="text-gray-600">
                           Уже есть аккаунт?{" "}
                           <button
                              type="button"
                              onClick={() => router.push("/login")}
                              className="text-purple-600 hover:text-pink-500 font-bold transition-colors"
                           >
                              Войти
                           </button>
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <style>{`
            @keyframes float {
               0%, 100% {
                  transform: translateY(0) translateX(0);
               }
               25% {
                  transform: translateY(-20px) translateX(10px);
               }
               50% {
                  transform: translateY(-40px) translateX(-10px);
               }
               75% {
                  transform: translateY(-20px) translateX(10px);
               }
            }
            
            @keyframes float-delayed {
               0%, 100% {
                  transform: translateY(0) translateX(0);
               }
               25% {
                  transform: translateY(-30px) translateX(-10px);
               }
               50% {
                  transform: translateY(-50px) translateX(10px);
               }
               75% {
                  transform: translateY(-30px) translateX(-10px);
               }
            }

            .animate-float {
               animation: float 6s ease-in-out infinite;
            }

            .animate-float-delayed {
               animation: float-delayed 8s ease-in-out infinite;
            }
         `}</style>
      </div>
   );
};

export default RegisterPage;
