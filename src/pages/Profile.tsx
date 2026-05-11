import { useStore } from "../store/useStore";
import { Zap, Hexagon, UserCircle2, LogIn, LogOut } from "lucide-react";
import { lessons } from "../data/lessons";
import { auth } from "../lib/firebase";

export function Profile() {
  const { xp, streak, completedLessons, user, setView } = useStore();

  const totalWords = lessons.filter(l => completedLessons.includes(l.id)).reduce((acc, curr) => acc + curr.words.length, 0);

  if (!user) {
    return (
      <div className="pb-32 pt-16 px-4 max-w-lg mx-auto w-full flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-indigo-100 border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center mb-8">
          <UserCircle2 size={64} className="text-indigo-600" strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Chưa đăng nhập</h1>
        <p className="text-slate-600 font-bold mb-8">
          Đăng nhập để lưu trữ tiến độ học tập, điểm thi và đồng bộ trên các thiết bị.
        </p>
        <button
          onClick={() => setView('login')}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-indigo-500 text-white border-4 border-slate-900 rounded-2xl font-black text-lg shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
        >
          <LogIn size={24} />
          Đăng nhập / Đăng ký
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-8 px-4 max-w-lg mx-auto w-full">
      <div className="flex flex-col items-center mb-8 relative">
        <button
          onClick={() => auth.signOut()}
          className="absolute top-0 right-0 p-3 bg-white border-2 border-slate-900 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          title="Đăng xuất"
        >
          <LogOut size={20} />
        </button>
        <div className="w-24 h-24 bg-indigo-100 border-4 border-slate-900 rounded-full shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center mb-6 overflow-hidden">
          <span className="text-4xl font-black text-indigo-600 uppercase">{user.name.charAt(0)}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
        <p className="text-slate-600 font-bold bg-white px-4 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] mt-3">{user.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] rounded-[32px] p-6 flex flex-col items-start bg-amber-50">
          <div className="flex items-center text-amber-500 mb-4 bg-white p-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
             <Zap size={28} fill="currentColor" />
          </div>
          <span className="font-black text-4xl text-slate-900">{streak}</span>
          <span className="text-amber-800 text-sm font-bold mt-1">Chuỗi ngày học</span>
        </div>
        
        <div className="border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] rounded-[32px] p-6 flex flex-col items-start bg-indigo-50">
          <div className="flex items-center text-indigo-500 mb-4 bg-white p-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
             <Hexagon size={28} fill="currentColor" />
          </div>
          <span className="font-black text-4xl text-slate-900">{xp}</span>
          <span className="text-indigo-800 text-sm font-bold mt-1">Tổng điểm XP</span>
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-900 mb-4 px-2">Thống kê</h2>
      <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] rounded-[32px] p-6 space-y-4">
        <div className="flex justify-between items-center py-2 border-b-2 border-dashed border-slate-300">
          <span className="font-bold text-slate-600">Bài học đã thuộc</span>
          <span className="font-black text-slate-900 text-xl bg-slate-100 px-3 py-1 rounded-xl border-2 border-slate-900">{completedLessons.length}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b-2 border-dashed border-slate-300">
          <span className="font-bold text-slate-600">Từ vựng đã học</span>
          <span className="font-black text-slate-900 text-xl bg-slate-100 px-3 py-1 rounded-xl border-2 border-slate-900">{totalWords}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="font-bold text-slate-600">Xếp hạng hiện tại</span>
          <span className="font-black text-white text-lg bg-slate-900 px-3 py-1 rounded-xl border-2 border-slate-900">Đồng</span>
        </div>
      </div>
    </div>
  );
}
