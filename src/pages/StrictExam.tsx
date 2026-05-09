import { useState, useEffect, useRef } from "react";
import { lessons, Word } from "../data/lessons";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { X, Clock, Trophy, AlertTriangle, ArrowRight, Flame } from "lucide-react";
import confetti from "canvas-confetti";

export function StrictExam() {
  const { setView, updateStreak, updateStrictScore, customLessons, highestStrictScore, activeLessonId } = useStore();
  const [testWords, setTestWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Parse difficulty from activeLessonId (e.g. 'easy_1')
  const difficultyMatch = activeLessonId?.split('_')[0] as 'easy' | 'medium' | 'hard' || 'medium';
  
  const EXAM_TIME_SECONDS = difficultyMatch === 'easy' ? 300 : difficultyMatch === 'medium' ? 420 : 600;
  const NUM_QUESTIONS = difficultyMatch === 'easy' ? 15 : difficultyMatch === 'medium' ? 20 : 30;

  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const [isFinished, setIsFinished] = useState(false);

  const allLessons = [...lessons, ...customLessons];

  useEffect(() => {
    // Filter words based on difficulty
    let filteredLessons = allLessons;
    if (difficultyMatch === 'easy') {
      filteredLessons = allLessons.filter(l => l.level === 'basic' || customLessons.includes(l));
    } else if (difficultyMatch === 'medium') {
      filteredLessons = allLessons.filter(l => l.level === 'basic' || l.level === 'ielts' || customLessons.includes(l));
    } else {
      filteredLessons = allLessons.filter(l => l.level === 'ielts' || l.level === 'collocations' || customLessons.includes(l));
    }

    const allWords = filteredLessons.flatMap(l => l.words);
    const uniqueWords = Array.from(new Map(allWords.map(w => [w.en, w])).values());
    const shuffled = uniqueWords.sort(() => 0.5 - Math.random());
    setTestWords(shuffled.slice(0, Math.min(NUM_QUESTIONS, shuffled.length)));
  }, [activeLessonId]);

  useEffect(() => {
    if (testWords.length > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testWords, isFinished]);

  useEffect(() => {
    // Focus input on mount and question change
    if (!isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isFinished]);

  const finishExam = () => {
    setIsFinished(true);
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans.toLowerCase().trim() === testWords[idx].en.toLowerCase().trim()) {
        score++;
      }
    });
    
    updateStrictScore(difficultyMatch, score);
    updateStreak();

    if (score > (testWords.length / 2)) {
      confetti({
        particleCount: 400,
        spread: 160,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f97316', '#fcd34d']
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentInput.trim()) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = currentInput;
    setUserAnswers(newAnswers);
    setCurrentInput("");

    if (currentIndex < testWords.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      finishExam();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleQuit = () => {
    setView('home');
  };

  if (testWords.length === 0) {
    return <div className="p-6">Đang chuẩn bị đề thi...</div>;
  }

  if (isFinished) {
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans.toLowerCase().trim() === testWords[idx].en.toLowerCase().trim()) {
        score++;
      }
    });
    const percentage = Math.round((score / testWords.length) * 100);
    
    return (
      <div className="flex flex-col h-[100dvh] bg-slate-950 text-white p-6 overflow-y-auto custom-scrollbar">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full py-12">
          <Flame size={80} className={`mb-6 ${percentage >= 80 ? 'text-rose-500' : 'text-slate-600'}`} />
          <h2 className="text-5xl font-black mb-2">Báo cáo Sinh tồn</h2>
          <p className="text-rose-400 font-bold text-xl mb-12 uppercase tracking-widest">Kỳ thi Khắc nghiệt</p>

          <div className="grid grid-cols-2 gap-6 w-full mb-12">
            <div className="bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl">
              <div className="text-6xl font-black text-rose-500 mb-2">{score}/{testWords.length}</div>
              <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">Câu đúng</div>
            </div>
            <div className="bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl">
              <div className="text-6xl font-black text-orange-400 mb-2">{percentage}%</div>
              <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">Độ chính xác</div>
            </div>
          </div>
          
          <div className="bg-slate-900 w-full p-6 rounded-2xl mb-12 border-2 border-slate-800 text-left">
            <h3 className="font-bold text-rose-500 mb-2 flex items-center gap-2">
              <Trophy size={20} /> Kỷ lục cá nhân ({difficultyMatch === 'easy' ? 'Dễ' : difficultyMatch === 'medium' ? 'Trung bình' : 'Khó'}): <span className="text-white">{Math.max(highestStrictScore[difficultyMatch] || 0, score)}/{testWords.length}</span>
            </h3>
            <p className="text-slate-400 text-sm">Hệ thống đã ghi nhận kết quả của bạn. Dưới đây là chi tiết đáp án.</p>
          </div>

          {/* Review Answers */}
          <div className="w-full space-y-4 mb-12 text-left">
            <h3 className="text-2xl font-black text-white mb-6">Chi tiết bài làm</h3>
            {testWords.map((w, idx) => {
              const uAns = userAnswers[idx] || "";
              const isCorrect = uAns.toLowerCase().trim() === w.en.toLowerCase().trim();
              return (
                <div key={idx} className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-emerald-950 border-emerald-900' : 'bg-rose-950 border-rose-900'}`}>
                  <p className="font-bold text-xl mb-4 text-white">{w.vi}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <span className="text-xs text-slate-500 uppercase font-black block mb-1">Bạn dịch</span>
                      <span className={`font-black text-lg ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {uAns || "(Bỏ trống)"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex-1">
                        <span className="text-xs text-slate-500 uppercase font-black block mb-1">Đáp án đúng</span>
                        <span className="font-black text-lg text-rose-400">{w.en}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Button className="w-full text-lg bg-rose-600 hover:bg-rose-700 text-white" size="lg" onClick={() => setView('home')}>Thoát khỏi thử thách</Button>
        </div>
      </div>
    );
  }

  const word = testWords[currentIndex];

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-md relative z-10 border-b border-slate-800">
        <button onClick={handleQuit} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-black text-xl tracking-widest text-slate-300">
            <span className="text-slate-500 text-sm">CÂU</span> {currentIndex + 1}/{testWords.length}
          </div>
          <div className={`flex items-center gap-2 font-black text-xl ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-orange-400'}`}>
            <Clock size={20} /> {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-900">
        <div 
          className="h-full bg-rose-500 transition-all duration-300"
          style={{ width: `${((currentIndex) / testWords.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full mt-12">
        
        <div className="flex flex-col items-center justify-center mb-16 flex-1">
          <div className="flex items-center justify-center w-20 h-20 bg-rose-950 rounded-full mb-8">
             <Flame size={40} className="text-rose-500 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-center text-white leading-tight tracking-tight">
            {word.vi}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-auto flex flex-col gap-6">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Gõ từ tiếng Anh vào đây..."
            className="w-full px-8 py-6 text-2xl font-black text-center bg-slate-900 border-4 border-slate-800 text-white rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] focus:outline-none focus:border-rose-500 focus:translate-y-[-4px] focus:shadow-[12px_12px_0px_0px_rgba(225,29,72,0.3)] transition-all placeholder:text-slate-600"
            autoComplete="off"
            spellCheck="false"
          />
          <Button type="submit" size="lg" className="w-full py-6 text-xl tracking-widest gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-[0px_4px_0px_0px_rgba(159,18,57,1)] active:shadow-none active:translate-y-[4px]" disabled={!currentInput.trim()}>
            CHỐT ĐÁP ÁN <ArrowRight size={24} />
          </Button>
        </form>
        
        <div className="pt-8 pb-4 flex justify-center text-slate-500 font-bold flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-500" /> Hãy gõ thật nhanh! Không thể quay lại câu trước.
        </div>
      </div>
    </div>
  );
}
