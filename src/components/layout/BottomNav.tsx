import { Home, User, BookOpenText, PlusSquare } from "lucide-react";
import { useStore } from "../../store/useStore";

export function BottomNav() {
  const { currentView, setView } = useStore();

  return (
    <nav className="fixed bottom-0 mt-auto left-0 right-0 max-w-md mx-auto border-t-2 border-slate-900 bg-white px-6 py-4 flex justify-around items-center z-50 rounded-t-[32px] shadow-[0px_-4px_0px_0px_rgba(15,23,42,1)]">
      <button 
        onClick={() => setView('home')}
        className={`flex flex-col items-center p-3 rounded-2xl transition-all border-2 ${currentView === 'home' ? 'text-indigo-600 bg-indigo-50 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]' : 'text-slate-400 border-transparent hover:text-slate-900'}`}
      >
        <Home size={28} />
      </button>
      <button 
        onClick={() => setView('practice')}
        className={`flex flex-col items-center p-3 rounded-2xl transition-all border-2 ${currentView === 'practice' ? 'text-indigo-600 bg-indigo-50 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]' : 'text-slate-400 border-transparent hover:text-slate-900'}`}
      >
        <BookOpenText size={28} />
      </button>
      <button 
        onClick={() => setView('create')}
        className={`flex flex-col items-center p-3 rounded-2xl transition-all border-2 ${currentView === 'create' ? 'text-indigo-600 bg-indigo-50 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]' : 'text-slate-400 border-transparent hover:text-slate-900'}`}
      >
        <PlusSquare size={28} />
      </button>
      <button 
        onClick={() => setView('profile')}
        className={`flex flex-col items-center p-3 rounded-2xl transition-all border-2 ${currentView === 'profile' ? 'text-indigo-600 bg-indigo-50 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]' : 'text-slate-400 border-transparent hover:text-slate-900'}`}
      >
        <User size={28} />
      </button>
    </nav>
  );
}
