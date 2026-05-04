import { useState, useEffect, useRef } from "react";
import { lessons, Word } from "../data/lessons";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { X, Clock, Trophy, AlertTriangle, ArrowRight, Lightbulb } from "lucide-react";
import confetti from "canvas-confetti";

export function FillBlankExam() {
  const { setView, updateStreak, updateFillBlankScore, customLessons, highestFillBlankScore, activeLessonId } = useStore();
  const [testWords, setTestWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Parse difficulty from activeLessonId (e.g. 'easy_1')
  const difficultyMatch = activeLessonId?.split('_')[0] as 'easy' | 'medium' | 'hard' || 'medium';
  
  const EXAM_TIME_SECONDS = difficultyMatch === 'easy' ? 600 : difficultyMatch === 'medium' ? 900 : 1200;
  const NUM_QUESTIONS = difficultyMatch === 'easy' ? 15 : difficultyMatch === 'medium' ? 20 : 30;

  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const [isFinished, setIsFinished] = useState(false);

  const allLessons = [...lessons, ...customLessons];

  useEffect(() => {
    // Filter words based on difficulty AND MUST HAVE exampleEn
    let filteredLessons = allLessons;
    if (difficultyMatch === 'easy') {
      filteredLessons = allLessons.filter(l => l.level === 'basic' || customLessons.includes(l));
    } else if (difficultyMatch === 'medium') {
      filteredLessons = allLessons.filter(l => l.level === 'basic' || l.level === 'ielts' || customLessons.includes(l));
    } else {
      filteredLessons = allLessons.filter(l => l.level === 'ielts' || l.level === 'collocations' || customLessons.includes(l));
    }

    const allWords = filteredLessons.flatMap(l => l.words).filter(w => w.exampleEn && w.exampleVi);
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
    
    updateFillBlankScore(difficultyMatch, score);
    updateStreak();

    if (score > (testWords.length / 2)) {
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1']
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
    if (confirm("Bạn có chắc chắn muốn thoát? Kết quả sẽ không được lưu.")) {
      setView('home');
    }
  };

  if (testWords.length === 0) {
    return <div className="p-6">Đang chuẩn bị đề thi điền từ...</div>;
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
      <div className="flex flex-col h-[100dvh] bg-slate-900 text-white p-6 overflow-y-auto custom-scrollbar">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full py-12">
          <Trophy size={80} className={`mb-6 ${percentage >= 80 ? 'text-emerald-400' : 'text-slate-500'}`} />
          <h2 className="text-5xl font-black mb-2">Báo cáo Kết quả</h2>
          <p className="text-slate-400 font-bold text-xl mb-12 uppercase tracking-widest">Kỳ thi Điền từ</p>

          <div className="grid grid-cols-2 gap-6 w-full mb-12">
            <div className="bg-slate-800 border-2 border-slate-700 p-6 rounded-3xl">
              <div className="text-6xl font-black text-emerald-400 mb-2">{score}/{testWords.length}</div>
              <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">Câu đúng</div>
            </div>
            <div className="bg-slate-800 border-2 border-slate-700 p-6 rounded-3xl">
              <div className="text-6xl font-black text-indigo-400 mb-2">{percentage}%</div>
              <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">Độ chính xác</div>
            </div>
          </div>
          
          <div className="bg-slate-800 w-full p-6 rounded-2xl mb-12 border-2 border-slate-700 text-left">
            <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
              <Trophy size={20} /> Kỷ lục cá nhân ({difficultyMatch === 'easy' ? 'Dễ' : difficultyMatch === 'medium' ? 'Trung bình' : 'Khó'}): <span className="text-white">{Math.max(highestFillBlankScore[difficultyMatch] || 0, score)}/{testWords.length}</span>
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
                <div key={idx} className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-emerald-900/30 border-emerald-800' : 'bg-rose-900/30 border-rose-800'}`}>
                  <p className="font-bold mb-2">Câu {idx + 1}: {w.exampleVi}</p>
                  <p className="text-slate-300 mb-4">{w.exampleEn?.replace(new RegExp(w.en, 'gi'), '_____')}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <span className="text-xs text-slate-500 uppercase font-black block mb-1">Bạn điền</span>
                      <span className={`font-black text-lg ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {uAns || "(Bỏ trống)"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex-1">
                        <span className="text-xs text-slate-500 uppercase font-black block mb-1">Đáp án đúng</span>
                        <span className="font-black text-lg text-amber-400">{w.en}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Button className="w-full text-lg" size="lg" onClick={() => setView('home')}>Trở về Trang chủ</Button>
        </div>
      </div>
    );
  }

  const word = testWords[currentIndex];
  // Blank out the word in the example sentence
  const maskedSentence = word.exampleEn?.replace(new RegExp(word.en, 'gi'), '___________') || '';

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-md relative z-10">
        <button onClick={handleQuit} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-black text-xl tracking-widest">
            <span className="text-slate-400 text-sm">CÂU</span> {currentIndex + 1}/{testWords.length}
          </div>
          <div className={`flex items-center gap-2 font-black text-xl ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
            <Clock size={20} /> {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((currentIndex) / testWords.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full mt-8">
        
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-12 shadow-[4px_4px_0px_0px_rgba(251,191,36,0.3)]">
          <div className="flex items-center gap-2 text-amber-600 font-extrabold mb-3">
            <Lightbulb size={24} /> Gợi ý nghĩa tiếng Việt:
          </div>
          <p className="text-2xl font-black text-slate-800">{word.exampleVi}</p>
        </div>

        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-700 leading-relaxed">
              {maskedSentence.split('___________').map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="inline-block border-b-4 border-indigo-600 w-32 mx-2"></span>
                  )}
                </span>
              ))}
            </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-auto flex flex-col gap-6">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Nhập từ còn thiếu vào đây..."
            className="w-full px-8 py-6 text-2xl font-black text-center bg-white border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:translate-y-[-4px] focus:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] transition-all placeholder:text-slate-300"
            autoComplete="off"
            spellCheck="false"
          />
          <Button type="submit" size="lg" className="w-full py-6 text-xl tracking-widest gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={!currentInput.trim()}>
            TIẾP TỤC <ArrowRight size={24} />
          </Button>
        </form>
        
        <div className="pt-6 flex justify-center text-slate-400 font-bold flex items-center gap-2">
            <AlertTriangle size={16} /> Lưu ý: Không thể quay lại câu hỏi trước sau khi chuyển câu.
        </div>
      </div>
    </div>
  );
}
