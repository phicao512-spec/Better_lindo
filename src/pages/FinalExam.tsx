import { useState, useEffect } from "react";
import { lessons, Word } from "../data/lessons";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { X, Clock, Trophy, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

export function FinalExam() {
  const { setView, updateStreak, updateExamScore, customLessons, highestExamScore, activeLessonId } = useStore();
  const [testWords, setTestWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  
  // Parse difficulty from activeLessonId (e.g. 'easy_1')
  const difficultyMatch = activeLessonId?.split('_')[0] as 'easy' | 'medium' | 'hard' || 'medium';
  
  const EXAM_TIME_SECONDS = difficultyMatch === 'easy' ? 600 : difficultyMatch === 'medium' ? 900 : 1200;
  const NUM_QUESTIONS = difficultyMatch === 'easy' ? 30 : difficultyMatch === 'medium' ? 40 : 50;

  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const [isFinished, setIsFinished] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

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
    if (testWords.length > 0 && currentIndex < testWords.length) {
      generateOptions();
    }
  }, [currentIndex, testWords]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key) - 1;
        if (options[idx]) {
          handleSelectOption(options[idx]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, isFinished]);

  const generateOptions = () => {
    const word = testWords[currentIndex];
    const correct = word.vi;
    const allVi = allLessons.flatMap(l => l.words.map(w => w.vi)).filter(v => v !== correct);
    const uniqueVi = Array.from(new Set(allVi));
    
    const shuffledAll = uniqueVi.sort(() => 0.5 - Math.random());
    const wrongOptions = shuffledAll.slice(0, 3);
    
    const finalOptions = [...wrongOptions, correct].sort(() => 0.5 - Math.random());
    setOptions(finalOptions);
  };

  const finishExam = () => {
    setIsFinished(true);
    let score = 0;
    // We only have userAnswers up to the point they reached. Unanswered are wrong.
    userAnswers.forEach((ans, idx) => {
      if (ans === testWords[idx].vi) {
        score++;
      }
    });
    
    updateExamScore(difficultyMatch, score);
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

  const handleSelectOption = (opt: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = opt;
    setUserAnswers(newAnswers);

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

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleQuit = () => {
    if (confirm("Bạn có chắc chắn muốn thoát? Kết quả sẽ không được lưu.")) {
      setView('home');
    }
  };

  if (testWords.length === 0) {
    return <div className="p-6">Đang chuẩn bị đề thi...</div>;
  }

  if (isFinished) {
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === testWords[idx].vi) {
        score++;
      }
    });
    const percentage = Math.round((score / testWords.length) * 100);
    
    return (
      <div className="flex flex-col h-[100dvh] bg-slate-900 text-white p-6 overflow-y-auto custom-scrollbar">
        <div className="flex-1 flex flex-col items-center text-center max-w-2xl mx-auto w-full py-12">
          <Trophy size={80} className={`mb-6 ${percentage >= 80 ? 'text-amber-400' : 'text-slate-500'}`} />
          <h2 className="text-5xl font-black mb-2">Báo cáo Kết quả</h2>
          <p className="text-slate-400 font-bold text-xl mb-12 uppercase tracking-widest">Kỳ thi cuối kì</p>

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
              <Trophy size={20} /> Kỷ lục cá nhân ({difficultyMatch === 'easy' ? 'Dễ' : difficultyMatch === 'medium' ? 'Trung bình' : 'Khó'}): <span className="text-white">{Math.max(highestExamScore[difficultyMatch] || 0, score)}/{testWords.length}</span>
            </h3>
            <p className="text-slate-400 text-sm">Hệ thống đã ghi nhận kết quả của bạn. Hãy tiếp tục luyện tập để cải thiện điểm số nhé!</p>
          </div>

          {/* Detailed Review Section */}
          <div className="w-full text-left mb-12">
            <h3 className="text-2xl font-black text-white mb-6">Chi tiết bài làm</h3>
            <div className="space-y-4">
              {testWords.map((word, idx) => {
                const userAnswer = userAnswers[idx];
                const isCorrect = userAnswer === word.vi;
                
                return (
                  <div key={idx} className={`p-5 rounded-2xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isCorrect 
                      ? 'bg-emerald-900/20 border-emerald-800 hover:border-emerald-600' 
                      : 'bg-rose-900/20 border-rose-800 hover:border-rose-600'
                  }`}>
                    <div>
                      <div className="font-black text-2xl text-white mb-1">{word.en}</div>
                      {word.type && <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{word.type}</div>}
                      {!isCorrect && word.exampleEn && (
                        <div className="text-sm text-slate-300 italic mt-2 border-l-2 border-slate-600 pl-3">
                          "{word.exampleEn}"
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col text-sm font-bold md:text-right gap-1 shrink-0">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1.5 md:justify-end">
                          <CheckCircle size={18} /> {word.vi}
                        </span>
                      ) : (
                        <>
                          <span className="text-rose-400 line-through flex items-center gap-1.5 md:justify-end">
                            <XCircle size={18} /> {userAnswer || 'Không trả lời'}
                          </span>
                          <span className="text-emerald-400 flex items-center gap-1.5 md:justify-end">
                            <CheckCircle size={18} /> {word.vi}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button className="w-full text-xl py-6" size="lg" onClick={() => setView('home')}>Trở về Trang chủ</Button>
        </div>
      </div>
    );
  }

  const word = testWords[currentIndex];

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
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((currentIndex) / testWords.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full mt-8">
        <div className="flex justify-center mb-12">
            <button 
              onClick={() => playAudio(word.en)}
              className="px-12 py-8 bg-white border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all hover:bg-slate-50 w-full"
            >
                <span className="text-5xl font-black text-slate-900 tracking-wider">
                  {word.en}
                </span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelectOption(opt)}
              className="text-left px-6 py-6 border-4 border-slate-900 bg-white text-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] rounded-2xl font-black text-xl hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
            >
              <span className="text-slate-400 mr-4">{i + 1}.</span> {opt}
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-8 flex justify-center text-slate-400 font-bold flex items-center gap-2">
            <AlertTriangle size={16} /> Lưu ý: Không thể quay lại câu hỏi trước sau khi đã chọn đáp án.
        </div>
      </div>
    </div>
  );
}
