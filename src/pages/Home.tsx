import { Play, Check, Heart, Zap, Info } from "lucide-react";
import { lessons, Lesson } from "../data/lessons";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";

export function Home() {
  const { setView, completedLessons, customLessons, streak, xp } = useStore();

  const allLessons = [...lessons, ...customLessons];

  const basicLessons = allLessons.filter(l => l.level === 'basic');
  const ieltsLessons = allLessons.filter(l => l.level === 'ielts');
  const collocations = allLessons.filter(l => l.level === 'collocations');
  
  const createGroup = allLessons.filter(l => customLessons.includes(l)); // Custom uploaded lessons
  const otherBasic = basicLessons.filter(l => !customLessons.includes(l));

  const renderLessonList = (list: Lesson[], startIndex: number, colorClass: string = "slate") => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {list.map((lesson, localIndex) => {
          const index = startIndex + localIndex;
          const isCompleted = completedLessons.includes(lesson.id);
          const isCustom = customLessons.includes(lesson);
          const isLocked = false; // !isCustom && index > 0 && !completedLessons.includes(allLessons[index - 1].id);
          
          return (
            <button
              key={lesson.id}
              disabled={isLocked && !isCompleted}
              onClick={() => setView('learn', lesson.id)}
              className={`group relative bg-white border-4 border-slate-900 p-6 rounded-[2rem] text-left transition-all hover:translate-y-[-8px] hover:translate-x-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:translate-x-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]`}
            >
              <div className={`w-16 h-16 border-4 border-slate-900 flex items-center justify-center text-4xl mb-6 rounded-2xl group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${isCompleted ? 'bg-amber-400' : isLocked ? 'bg-slate-200 opacity-50' : 'bg-emerald-400'}`}>
                {isCompleted ? <Check size={32} strokeWidth={4} /> : isLocked ? "🔒" : lesson.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight uppercase font-sans">
                {lesson.title}
              </h3>
              <p className="text-slate-500 font-bold text-sm mb-6 line-clamp-2">
                {lesson.description || "Chinh phục bộ từ vựng IELTS chất lượng cao."}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase border-2 border-slate-900">
                  {lesson.words.length} từ vựng
                </span>
                {!isLocked && (
                    <div className="w-10 h-10 bg-indigo-600 border-2 border-slate-900 rounded-full flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <Zap size={20} fill="currentColor" />
                    </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pb-32 pt-10 px-6 w-full max-w-7xl mx-auto">
      {/* Header for Desktop */}
      <div className="mb-12 hidden md:block">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Chào mừng trở lại!</h1>
        <p className="text-slate-500 font-bold text-lg italic uppercase tracking-wider">Hôm nay bạn muốn chinh phục gì?</p>
      </div>

      {/* Stats only visible on mobile (since sidebar has them on desktop) */}
      <div className="md:hidden flex justify-between items-center mb-10">
        <div className="flex items-center text-slate-900 font-black text-lg bg-amber-50 border-2 border-slate-900 px-4 py-2 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <Zap className="mr-1 text-amber-500" size={24} fill="currentColor" /> {streak}
        </div>
        <div className="flex items-center text-slate-900 font-black text-lg bg-indigo-50 border-2 border-slate-900 px-4 py-2 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
           {xp} XP
        </div>
      </div>

      <div className="bg-indigo-600 border-4 border-slate-900 p-8 rounded-[2rem] mb-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full translate-x-32 translate-y-[-32px] opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h4 className="text-3xl font-black mb-2">Phiên bản trải nghiệm LingoLearn</h4>
            <p className="text-indigo-100 font-bold">
              Ứng dụng hiện đang bao gồm một số bộ từ vựng IELTS chất lượng cao đại diện. Bạn có thể sử dụng tính năng <span className="text-amber-300 font-black underline underline-offset-4 decoration-2">Tạo bài học</span> để học ngay lập tức!
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-[150px]">
             <div className="h-4 w-full bg-indigo-800 rounded-full border-2 border-slate-900 overflow-hidden">
                <div className="h-full bg-amber-400 w-[60%] transition-all duration-1000"></div>
              </div>
              <span className="text-white font-black text-right text-sm">30/50 XP TUẦN</span>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {createGroup.length > 0 && (
          <section>
            <h2 className="text-4xl font-black text-emerald-600 mb-10 px-4 border-l-8 border-emerald-600 uppercase tracking-tighter italic">Từ vựng của bạn</h2>
            {renderLessonList(createGroup, 0, "emerald")}
          </section>
        )}

        <section>
          <h2 className="text-4xl font-black text-slate-900 mb-10 px-4 border-l-8 border-slate-900 uppercase tracking-tighter italic">Cơ bản</h2>
          {renderLessonList(otherBasic, createGroup.length, "slate")}
        </section>

        <section>
          <h2 className="text-4xl font-black text-slate-900 mb-10 px-4 border-l-8 border-slate-900 uppercase tracking-tighter italic">IELTS 7.0+</h2>
          {renderLessonList(ieltsLessons, createGroup.length + otherBasic.length, "indigo")}
        </section>

        <section>
          <h2 className="text-4xl font-black text-rose-600 mb-10 px-4 border-l-8 border-rose-600 uppercase tracking-tighter italic">Sách "2000 Collocations"</h2>
          {renderLessonList(collocations, createGroup.length + otherBasic.length + ieltsLessons.length, "rose")}
        </section>
      </div>
    </div>
  );
}
