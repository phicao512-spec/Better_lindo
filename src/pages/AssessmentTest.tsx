import { useState, useEffect } from "react";
import { lessons, Word } from "../data/lessons";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { X, Check, Info } from "lucide-react";
import confetti from "canvas-confetti";

export function AssessmentTest() {
  const { setView, updateStreak, customLessons } = useStore();
  const [testWords, setTestWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const allLessons = [...lessons, ...customLessons];

  useEffect(() => {
    // Select 20 random words from all available words
    const allWords = allLessons.flatMap(l => l.words);
    // Remove duplicates if any
    const uniqueWords = Array.from(new Map(allWords.map(w => [w.en, w])).values());
    const shuffled = uniqueWords.sort(() => 0.5 - Math.random());
    setTestWords(shuffled.slice(0, 20));
  }, []);

  useEffect(() => {
    if (testWords.length > 0 && currentIndex < testWords.length) {
      generateOptions();
    }
  }, [currentIndex, testWords]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChecking) {
        if (e.code === 'Enter' || e.code === 'Space') {
          handleNext();
        }
        return;
      }

      if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key) - 1;
        if (options[idx]) {
          setSelectedOption(options[idx]);
        }
      } else if (e.code === 'Enter' && selectedOption) {
        handleCheck();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, selectedOption, isChecking]);

  if (testWords.length === 0) {
    return <div className="p-6">Đang chuẩn bị câu hỏi...</div>;
  }

  const isFinished = currentIndex >= testWords.length;
  const word = testWords[currentIndex];

  const generateOptions = () => {
    const correct = word.vi;
    const allVi = allLessons.flatMap(l => l.words.map(w => w.vi)).filter(v => v !== correct);
    const uniqueVi = Array.from(new Set(allVi));
    
    const shuffledAll = uniqueVi.sort(() => 0.5 - Math.random());
    const wrongOptions = shuffledAll.slice(0, 3);
    
    const finalOptions = [...wrongOptions, correct].sort(() => 0.5 - Math.random());
    setOptions(finalOptions);
    setSelectedOption(null);
    setIsChecking(false);
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    setIsChecking(true);
    
    if (selectedOption === word.vi) {
      setScore(s => s + 1);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } else {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  };

  const handleNext = () => {
    if (currentIndex < testWords.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
      updateStreak();
      // To show finish screen
      setCurrentIndex(c => c + 1);
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / testWords.length) * 100);
    return (
      <div className="flex flex-col h-[100dvh] bg-indigo-50 p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 bg-indigo-400 rounded-full flex items-center justify-center mb-8 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-bounce">
             <span className="text-5xl font-black text-slate-900">{percentage}%</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Kết quả kiểm tra</h2>
          <p className="text-slate-900 font-bold mb-8 text-lg bg-indigo-100 border-2 border-slate-900 px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            Bạn trả lời đúng {score} / {testWords.length} câu.
          </p>
        </div>
        <div className="space-y-4">
          <Button className="w-full" size="lg" onClick={() => setView('practice')}>Trở về Thực hành</Button>
        </div>
      </div>
    );
  }

  const isCorrect = selectedOption === word.vi;

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F1F5F9]">
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => setView('practice')} className="bg-white border-2 border-slate-900 rounded-xl text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none hover:bg-slate-50 transition-all p-2">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="w-full mx-4 h-4 bg-white border-2 border-slate-900 rounded-full overflow-hidden shadow-[2px_2px_0px_0px_rgba(15,23,42,1)_inset]">
          <div 
            className="h-full bg-indigo-500 border-r-2 border-slate-900 transition-all duration-300"
            style={{ width: `${((currentIndex) / testWords.length) * 100}%` }}
          />
        </div>
        <span className="font-black text-slate-500">{currentIndex + 1}/{testWords.length}</span>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-2xl mx-auto w-full">
        <div className="hidden md:flex justify-end mb-4">
             <div className="bg-amber-100 border-2 border-slate-900 px-4 py-2 rounded-xl text-amber-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Info size={16} /> Nhấn các phím số 1, 2, 3, 4 để chọn
             </div>
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-8 text-center md:text-left">Nghĩa của từ này là gì?</h2>
        
        <div className="flex justify-center mb-8">
            <button 
              onClick={() => playAudio(word.en)}
              className="px-8 py-6 bg-white border-4 border-slate-900 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all hover:bg-slate-50"
            >
                <span className="text-4xl font-black text-indigo-600 tracking-wider inline-flex items-center gap-3">
                  {word.en}
                </span>
            </button>
        </div>

        <div className="grid gap-4">
          {options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCurrentlyCorrect = opt === word.vi;
            
            let btnClass = "border-2 border-slate-900 bg-white text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-50 hover:-translate-y-[2px] transition-all";
            if (isSelected && !isChecking) {
              btnClass = "border-2 border-slate-900 bg-indigo-50 text-indigo-700 shadow-none translate-x-[4px] translate-y-[4px]";
            } else if (isChecking) {
              if (isCurrentlyCorrect) {
                btnClass = "border-2 border-slate-900 bg-emerald-400 text-slate-900 shadow-none translate-x-[4px] translate-y-[4px]";
              } else if (isSelected && !isCurrentlyCorrect) {
                btnClass = "border-2 border-slate-900 bg-rose-400 text-white shadow-none translate-x-[4px] translate-y-[4px]";
              }
            }

            return (
              <button
                key={i}
                disabled={isChecking}
                onClick={() => setSelectedOption(opt)}
                className={`w-full text-left px-6 py-5 rounded-2xl font-black text-xl transition-all ${btnClass}`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      <div className={`p-6 border-t-4 border-slate-900 sm:px-8 mt-auto ${isChecking ? (isCorrect ? 'bg-emerald-50' : 'bg-rose-50') : 'bg-white'}`}>
         {isChecking && (
           <div className="mb-4 font-black flex items-center text-xl">
             {isCorrect ? (
               <span className="text-emerald-600 flex items-center"><span className="w-8 h-8 rounded-full bg-emerald-400 text-slate-900 border-2 border-slate-900 flex items-center justify-center mr-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"><Check size={20} className="relative top-[1px]" strokeWidth={4} /></span> Xuất sắc!</span>
             ) : (
               <span className="text-rose-600 flex items-center"><X size={28} className="mr-2" strokeWidth={4} /> Sai rồi. Đáp án: <span className="ml-2 text-rose-800 bg-white border-2 border-slate-900 px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">{word.vi}</span></span>
             )}
           </div>
         )}

         {isChecking ? (
           <Button 
             className="w-full tracking-widest text-lg" 
             variant={isCorrect ? 'correct' : 'incorrect'}
             size="lg" 
             onClick={handleNext}
           >
             TIẾP TỤC
           </Button>
         ) : (
           <Button 
             className="w-full tracking-widest text-lg opacity-100 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:translate-y-[4px] disabled:translate-x-[4px] disabled:border-slate-300" 
             size="lg" 
             disabled={!selectedOption} 
             onClick={handleCheck}
           >
             KIỂM TRA
           </Button>
         )}
      </div>
    </div>
  );
}
