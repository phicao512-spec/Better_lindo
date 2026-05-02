import { Home, User, BookOpenText, PlusSquare, Zap, Trophy } from "lucide-react";
import { useStore } from "../../store/useStore";

export function Sidebar() {
  const { currentView, setView, streak, xp } = useStore();

  const navItems = [
    { id: 'home', icon: Home, label: 'Trang chủ' },
    { id: 'practice', icon: BookOpenText, label: 'Luyện tập' },
    { id: 'create', icon: PlusSquare, label: 'Tạo bài học' },
    { id: 'profile', icon: User, label: 'Hồ sơ' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r-4 border-slate-900 h-screen sticky top-0 p-6 shadow-[4px_0px_0px_0px_rgba(15,23,42,1)]">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-12 h-12 bg-indigo-600 border-2 border-slate-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-[-3deg]">
          <span className="text-white text-2xl font-black">L</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">LingoLearn</h1>
      </div>

      <nav className="flex-1 space-y-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl border-2 transition-all font-black uppercase text-sm tracking-wider ${
              currentView === item.id
                ? 'bg-indigo-50 border-slate-900 text-indigo-600 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px] translate-x-[-2px]'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:translate-x-1'
            }`}
          >
            <item.icon size={24} strokeWidth={2.5} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t-2 border-slate-100">
        <div className="bg-amber-50 border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-amber-500" fill="currentColor" size={20} />
            <span className="font-black text-slate-900">{streak}</span>
          </div>
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">Ngày liên tiếp</span>
        </div>
        
        <div className="bg-emerald-50 border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="text-emerald-500" size={20} />
            <span className="font-black text-slate-900">{xp}</span>
          </div>
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">Tổng XP</span>
        </div>
      </div>
    </aside>
  );
}
