import React, { useState, useEffect } from "react";
import { StickyNote, X, Maximize2, Minimize2, Save } from "lucide-react";
import { useStore } from "../../store/useStore";

export function Notepad() {
  const { notes, setNotes } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);

  // Sync local notes with store notes when notes change (e.g. on load)
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localNotes !== notes) {
        setNotes(localNotes);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localNotes, notes, setNotes]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 border-2 border-slate-900 rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all group"
      >
        <StickyNote size={28} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-in-out ${
        isMinimized 
          ? 'bottom-6 right-6 w-72 h-14 overflow-hidden' 
          : 'bottom-6 right-6 w-80 md:w-96 h-[500px]'
      } bg-white/80 backdrop-blur-xl border-4 border-slate-900 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b-2 border-slate-900 flex items-center justify-between bg-indigo-50 rounded-t-[2.2rem] shrink-0">
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          <StickyNote size={20} className="text-indigo-600 shrink-0" />
          <span className="font-black text-slate-900 uppercase tracking-tight whitespace-nowrap truncate text-sm">Sổ tay ghi chú</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <>
          <div className="flex-1 p-4 relative">
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Ghi chú những điều bạn vừa học được vào đây nhé..."
              className="w-full h-full bg-transparent resize-none outline-none font-medium text-slate-700 leading-relaxed custom-scrollbar placeholder:text-slate-400"
            />
            
            {/* Lines effect like a real notebook */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] p-4 flex flex-col gap-[1.6rem]">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-full border-b border-slate-900" />
                ))}
            </div>
          </div>
          
          <div className="p-3 bg-slate-50 border-t-2 border-slate-900 rounded-b-[2.2rem] flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">
            <span>Tự động lưu sau 1 giây</span>
            <div className="flex items-center gap-1 text-emerald-500">
              <Save size={10} />
              <span>Đã đồng bộ</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
