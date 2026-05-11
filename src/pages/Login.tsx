import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Mail, Lock, User, LogIn, ArrowRight, Chrome } from 'lucide-react';
import * as motion from 'motion/react-client';
import { auth, googleProvider } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile 
} from 'firebase/auth';

export function Login() {
  const { setView } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) return;
    
    setIsLoading(true);
    setError('');

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setView('profile');
    } catch (err: any) {
      console.error(err);
      let msg = 'Có lỗi xảy ra. Vui lòng thử lại.';
      if (err.code === 'auth/user-not-found') msg = 'Email không tồn tại.';
      if (err.code === 'auth/wrong-password') msg = 'Mật khẩu không chính xác.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email đã được sử dụng.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      setView('profile');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi đăng nhập Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#F1F5F9] text-slate-900 antialiased overflow-hidden flex flex-col justify-center px-4 py-12">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -120, 0],
            x: [0, -60, 0],
            y: [0, 40, 0] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] bg-fuchsia-200/40 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-cyan-100/30 rounded-full blur-[100px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 bg-white/80 backdrop-blur-xl border-4 border-slate-900 shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] rounded-[40px] p-8 md:p-10 max-w-md mx-auto w-full"
      >
        <div className="flex justify-center mb-10">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 border-4 border-slate-900 rounded-[32px] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center -mt-20 transform rotate-6"
          >
            <LogIn size={48} className="text-white" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-black text-center text-slate-900 mb-3 tracking-tight">
            {isRegister ? 'Tạo tài khoản' : 'Chào mừng bạn!'}
          </h1>
          <p className="text-center text-slate-500 font-bold mb-10 text-lg leading-tight">
            {isRegister ? 'Khám phá thế giới ngôn ngữ cùng LingoLearn.' : 'Tiếp tục hành trình chinh phục tiếng Anh.'}
          </p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-rose-50 border-4 border-rose-500 rounded-2xl text-rose-600 text-sm font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(244,63,94,0.2)]"
          >
            <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black">!</span>
            </div>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-black text-slate-900 mb-2 ml-1 uppercase tracking-wider">Họ và tên</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
                  <User size={22} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-4 border-slate-900 rounded-[24px] text-slate-900 font-bold focus:outline-none focus:ring-0 focus:bg-white focus:border-indigo-500 transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)]"
                  placeholder="Nhập tên của bạn..."
                  required
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-black text-slate-900 mb-2 ml-1 uppercase tracking-wider">Email học tập</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
                <Mail size={22} className="text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-4 border-slate-900 rounded-[24px] text-slate-900 font-bold focus:outline-none focus:ring-0 focus:bg-white focus:border-indigo-500 transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)]"
                placeholder="example@gmail.com"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-black text-slate-900 mb-2 ml-1 uppercase tracking-wider">Mật khẩu bảo mật</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
                <Lock size={22} className="text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-4 border-slate-900 rounded-[24px] text-slate-900 font-bold focus:outline-none focus:ring-0 focus:bg-white focus:border-indigo-500 transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)]"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 mt-8 py-5 px-6 bg-indigo-500 text-white border-4 border-slate-900 rounded-[24px] font-black text-xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xác thực...' : (isRegister ? 'Bắt đầu ngay' : 'Đăng nhập')}
            {!isLoading && <ArrowRight size={24} />}
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-slate-400 font-black tracking-widest uppercase">Hoặc nhanh hơn với</span>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            whileHover={{ y: -4, shadow: "8px 8px 0px 0px rgba(15,23,42,1)" }}
            className="w-full flex items-center justify-center gap-4 mt-8 py-5 px-6 bg-white border-4 border-slate-900 rounded-[24px] font-black text-slate-900 text-xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all disabled:opacity-50"
          >
            <div className="bg-rose-50 p-2 rounded-xl border-2 border-rose-500 shadow-[2px_2px_0px_0px_rgba(244,63,94,0.3)]">
              <Chrome size={28} className="text-rose-500" />
            </div>
            Google Account
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <p className="text-slate-500 font-bold text-lg">
            {isRegister ? 'Đã là thành viên?' : 'Chưa có tài khoản?'}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="ml-3 text-indigo-600 font-black hover:text-indigo-700 hover:underline decoration-4 underline-offset-4 transition-all"
            >
              {isRegister ? 'Đăng nhập' : 'Tham gia ngay'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
