import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Mail, Lock, User, LogIn, ArrowRight, Chrome } from 'lucide-react';
import * as motion from 'motion/react-client';

export function Login() {
  const { setView, setUser } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) return;
    
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: isRegister ? name : email.split('@')[0],
      });
      setIsLoading(false);
      setView('profile');
    }, 1000);
  };

  return (
    <div className="pb-32 pt-8 px-4 max-w-md mx-auto w-full min-h-screen flex flex-col justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] rounded-[32px] p-8"
      >
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-indigo-100 border-4 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center -mt-16 transform rotate-3">
            <LogIn size={40} className="text-indigo-600" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-center text-slate-900 mb-2">
          {isRegister ? 'Tạo tài khoản' : 'Chào mừng trở lại!'}
        </h1>
        <p className="text-center text-slate-500 font-bold mb-8">
          {isRegister ? 'Bắt đầu hành trình học tập ngay hôm nay.' : 'Tiếp tục rèn luyện và nâng cao trình độ.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-black text-slate-900 mb-2">Họ và tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-4 border-slate-900 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-0 focus:bg-white transition-colors"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-black text-slate-900 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-4 border-slate-900 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-0 focus:bg-white transition-colors"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-900 mb-2">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-4 border-slate-900 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-0 focus:bg-white transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-6 py-4 px-6 bg-indigo-500 text-white border-4 border-slate-900 rounded-2xl font-black text-lg shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : (isRegister ? 'Đăng ký ngay' : 'Đăng nhập')}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500 font-bold">HOẶC</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 mt-6 py-4 px-6 bg-white border-4 border-slate-900 rounded-2xl font-black text-slate-900 text-lg shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-50 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
          >
            <Chrome size={24} className="text-rose-500" />
            Tiếp tục với Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 font-bold">
            {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 text-indigo-600 font-black hover:underline"
            >
              {isRegister ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
