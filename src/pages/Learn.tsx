import { useState, useEffect } from "react";
import { lessons } from "../data/lessons";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { Volume2, X, ArrowLeft, ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";

export function Learn() {
  const { activeLessonId, setView, customLessons } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const allLessons = [...lessons, ...customLessons];
  const lesson = allLessons.find(l => l.id === activeLessonId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lesson || currentIndex >= lesson.words.length) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, lesson]);

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const word = lesson.words[currentIndex];
  const isFinished = currentIndex >= lesson.words.length;

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < lesson.words.length) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(c => c + 1);
        if (currentIndex < lesson.words.length - 1) {
          playAudio(lesson.words[currentIndex + 1].en);
        }
      }, 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(c => c - 1);
        playAudio(lesson.words[currentIndex - 1].en);
      }, 150);
    }
  };

  const handleStartQuiz = () => {
    setView('quiz', activeLessonId || undefined);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#F1F5F9] p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-8xl mb-6 animate-bounce">🎓</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Đã học xong lý thuyết!</h2>
          <p className="text-slate-600 font-bold mb-8">Bạn có muốn kiểm tra lại những gì vừa học không?</p>
        </div>
        <div className="space-y-4">
          <Button className="w-full" size="lg" onClick={handleStartQuiz}>Làm bài kiểm tra</Button>
          <Button variant="outline" className="w-full" size="lg" onClick={() => setView('home')}>Trở về trang chủ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F1F5F9]">
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => setView('home')} className="bg-white border-2 border-slate-900 rounded-xl text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none hover:bg-slate-50 transition-all p-2">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="w-full mx-4 h-4 bg-white border-2 border-slate-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-400 border-r-2 border-slate-900 transition-all duration-300"
            style={{ width: `${((currentIndex) / lesson.words.length) * 100}%` }}
          />
        </div>
        <span className="text-slate-900 font-black">{currentIndex + 1}/{lesson.words.length}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-12 w-full max-w-2xl mx-auto">
        <div className="w-full flex justify-end text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest hidden md:flex items-center gap-4">
             <div className="flex items-center gap-1"><span className="bg-white border border-slate-300 px-1.5 py-0.5 rounded shadow-sm text-slate-900">Space</span> lật thẻ</div>
             <div className="flex items-center gap-1"><span className="bg-white border border-slate-300 px-1.5 py-0.5 rounded shadow-sm text-slate-900">⬅</span> <span className="bg-white border border-slate-300 px-1.5 py-0.5 rounded shadow-sm text-slate-900">➡</span> chuyển từ</div>
        </div>
        
        <motion.div 
          className="w-full aspect-square [perspective:1000px] cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-500"
            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div className="absolute w-full h-full bg-white rounded-[32px] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center justify-center p-8 [backface-visibility:hidden]" style={{ backfaceVisibility: 'hidden' }}>
                <span className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 text-center">{word.en}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); playAudio(word.en); }}
                  className="bg-indigo-100 border-2 border-slate-900 text-indigo-700 p-4 rounded-xl hover:bg-indigo-200 transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none hover:-translate-y-1"
                >
                  <Volume2 size={32} strokeWidth={3} />
                </button>
                <p className="mt-12 text-slate-500 text-xs font-black uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full border-2 border-dashed border-slate-300">Chạm để xem nghĩa</p>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full bg-indigo-500 rounded-[32px] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center justify-center p-8 [backface-visibility:hidden]" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <span className="text-4xl sm:text-5xl font-black text-white mb-6 text-center">{word.vi}</span>
                {word.exampleEn && (
                  <div className="mt-6 text-center bg-indigo-600 border-2 border-slate-900 p-4 rounded-2xl text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] w-full">
                    <p className="italic mb-2 text-lg font-bold">"{word.exampleEn}"</p>
                    <p className="text-indigo-200 text-sm font-semibold">{word.exampleVi}</p>
                  </div>
                )}
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-12 w-full flex items-center gap-4">
           <Button variant="outline" className="flex-1" size="lg" disabled={currentIndex === 0} onClick={handlePrev}>
             <ArrowLeft className="mr-2" /> Trước
           </Button>
           <Button className="flex-[2] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]" size="lg" onClick={handleNext}>
             Tiếp tục <ArrowRight className="ml-2" />
           </Button>
        </div>

      </div>
    </div>
  );
}
