import { Play, Check, Heart, Zap, Info, Trophy, PenTool, Flame } from "lucide-react";
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

      <div className="bg-indigo-600 border-4 border-slate-900 p-8 rounded-[2rem] mb-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-white relative overflow-hidden group">
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
        {/* Final Exam Section */}
        <section>
          <div className="flex items-center gap-4 mb-10 px-4">
            <div className="w-16 h-16 bg-amber-400 rounded-2xl border-4 border-slate-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <Trophy size={32} className="text-slate-900" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Kỳ thi cuối kì</h2>
              <p className="text-slate-500 font-bold">Đánh giá toàn diện kiến thức của bạn</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Easy Level */}
            <div className="bg-emerald-50 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-2xl font-black text-emerald-600 mb-2 uppercase text-center">Dễ</h3>
              <p className="text-slate-600 font-bold text-sm text-center mb-6">30 câu • 10 phút • Từ vựng cơ bản</p>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <button key={`easy_${num}`} onClick={() => setView('final-exam', `easy_${num}`)} className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                    <span className="font-black text-slate-900">Đề số {num}</span>
                    <Play size={20} className="text-emerald-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Medium Level */}
            <div className="bg-amber-50 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-2xl font-black text-amber-600 mb-2 uppercase text-center">Trung bình</h3>
              <p className="text-slate-600 font-bold text-sm text-center mb-6">40 câu • 15 phút • Tổng hợp & IELTS</p>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <button key={`medium_${num}`} onClick={() => setView('final-exam', `medium_${num}`)} className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                    <span className="font-black text-slate-900">Đề số {num}</span>
                    <Play size={20} className="text-amber-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Hard Level */}
            <div className="bg-rose-50 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-2xl font-black text-rose-600 mb-2 uppercase text-center">Khó</h3>
              <p className="text-slate-600 font-bold text-sm text-center mb-6">50 câu • 20 phút • IELTS & Chuyên sâu</p>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <button key={`hard_${num}`} onClick={() => setView('final-exam', `hard_${num}`)} className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                    <span className="font-black text-slate-900">Đề số {num}</span>
                    <Play size={20} className="text-rose-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Fill in the Blanks Exam Section */}
        <section>
          <div className="flex items-center gap-4 mb-10 px-4">
            <div className="w-16 h-16 bg-emerald-400 rounded-2xl border-4 border-slate-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <PenTool size={32} className="text-slate-900" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Kỳ thi Điền từ</h2>
              <p className="text-slate-500 font-bold">Thử thách khả năng ghi nhớ chính tả từ vựng</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Easy Level */}
            <div className="bg-emerald-50 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-2xl font-black text-emerald-600 mb-2 uppercase text-center">Dễ</h3>
              <p className="text-slate-600 font-bold text-sm text-center mb-6">15 câu • 10 phút • Từ vựng cơ bản</p>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <button key={`fb_easy_${num}`} onClick={() => setView('fill-blank-exam', `easy_${num}`)} className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                    <span className="font-black text-slate-900">Đề số {num}</span>
                    <Play size={20} className="text-emerald-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Medium Level */}
            <div className="bg-amber-50 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-2xl font-black text-amber-600 mb-2 uppercase text-center">Trung bình</h3>
              <p className="text-slate-600 font-bold text-sm text-center mb-6">20 câu • 15 phút • Tổng hợp & IELTS</p>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <button key={`fb_medium_${num}`} onClick={() => setView('fill-blank-exam', `medium_${num}`)} className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                    <span className="font-black text-slate-900">Đề số {num}</span>
                    <Play size={20} className="text-amber-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Hard Level */}
            <div className="bg-rose-50 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-2xl font-black text-rose-600 mb-2 uppercase text-center">Khó</h3>
              <p className="text-slate-600 font-bold text-sm text-center mb-6">30 câu • 20 phút • IELTS & Chuyên sâu</p>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <button key={`fb_hard_${num}`} onClick={() => setView('fill-blank-exam', `hard_${num}`)} className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                    <span className="font-black text-slate-900">Đề số {num}</span>
                    <Play size={20} className="text-rose-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Strict Exam Section */}
        <section>
          <div className="flex items-center gap-4 mb-10 px-4">
            <div className="w-16 h-16 bg-rose-500 rounded-2xl border-4 border-slate-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <Flame size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-rose-600 uppercase tracking-tighter italic">Kỳ thi Khắc nghiệt</h2>
              <p className="text-slate-500 font-bold">Thử thách dịch ngược (Việt → Anh) với áp lực thời gian</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Easy Level */}
            <div className="bg-slate-900 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(225,29,72,0.5)]">
              <h3 className="text-2xl font-black text-rose-400 mb-2 uppercase text-center">Dễ</h3>
              <p className="text-slate-400 font-bold text-sm text-center mb-6">15 câu • 5 phút • Từ vựng cơ bản</p>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <button key={`strict_easy_${num}`} onClick={() => setView('strict-exam', `easy_${num}`)} className="w-full flex items-center justify-between p-4 bg-slate-800 border-2 border-slate-700 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:border-rose-500 hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all">
                    <span className="font-black text-white">Thử thách {num}</span>
                    <Play size={20} className="text-rose-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Medium Level */}
            <div className="bg-slate-900 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(225,29,72,0.5)]">
              <h3 className="text-2xl font-black text-rose-500 mb-2 uppercase text-center">Trung bình</h3>
              <p className="text-slate-400 font-bold text-sm text-center mb-6">20 câu • 7 phút • Tổng hợp & IELTS</p>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <button key={`strict_medium_${num}`} onClick={() => setView('strict-exam', `medium_${num}`)} className="w-full flex items-center justify-between p-4 bg-slate-800 border-2 border-slate-700 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:border-rose-500 hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all">
                    <span className="font-black text-white">Thử thách {num}</span>
                    <Play size={20} className="text-rose-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Hard Level */}
            <div className="bg-slate-900 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(225,29,72,0.5)]">
              <h3 className="text-2xl font-black text-rose-600 mb-2 uppercase text-center">Khó</h3>
              <p className="text-slate-400 font-bold text-sm text-center mb-6">30 câu • 10 phút • IELTS & Chuyên sâu</p>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <button key={`strict_hard_${num}`} onClick={() => setView('strict-exam', `hard_${num}`)} className="w-full flex items-center justify-between p-4 bg-slate-800 border-2 border-slate-700 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:border-rose-500 hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all">
                    <span className="font-black text-white">Thử thách {num}</span>
                    <Play size={20} className="text-rose-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

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
