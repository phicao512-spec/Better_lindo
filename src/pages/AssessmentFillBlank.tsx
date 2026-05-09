import { useState, useEffect, useRef } from "react";
import { lessons, Word } from "../data/lessons";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { X, CheckCircle, XCircle, Lightbulb, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

const NUM_QUESTIONS = 20;

export function AssessmentFillBlank() {
  const { setView, updateStreak, completeLesson, customLessons } = useStore();
  const [testWords, setTestWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const allLessons = [...lessons, ...customLessons];
    const allWords = allLessons.flatMap(l => l.words).filter(w => {
      if (!w.exampleEn || !w.exampleVi || !w.en) return false;
      // Ensure the exact word appears in the example sentence so it can be blanked
      const escapedWord = w.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(escapedWord, 'gi').test(w.exampleEn);
    });
    const uniqueWords = Array.from(new Map(allWords.map(w => [w.en, w])).values());
    const shuffled = uniqueWords.sort(() => 0.5 - Math.random());
    setTestWords(shuffled.slice(0, Math.min(NUM_QUESTIONS, shuffled.length)));
  }, []);

  useEffect(() => {
    if (status === 'idle' && !isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, status, isFinished]);

  const handleFinish = (finalScore: number) => {
    setIsFinished(true);
    updateStreak();
    completeLesson('assessment_fill', finalScore * 2); // 2 XP per correct word

    if (finalScore >= testWords.length * 0.8) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentInput.trim() || status !== 'idle') return;

    const word = testWords[currentIndex];
    const isCorrect = currentInput.toLowerCase().trim() === word.en.toLowerCase().trim();
    
    if (isCorrect) {
      setStatus('correct');
      setScore(s => s + 1);
    } else {
      setStatus('incorrect');
    }

    setTimeout(() => {
      if (currentIndex < testWords.length - 1) {
        setCurrentIndex(c => c + 1);
        setCurrentInput("");
        setStatus('idle');
      } else {
        handleFinish(isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  const handleQuit = () => {
    setView('practice');
  };

  if (testWords.length === 0) {
    return <div className="p-6">Đang chuẩn bị câu hỏi...</div>;
  }

  if (isFinished) {
    const percentage = Math.round((score / testWords.length) * 100);
    return (
      <div className="flex flex-col h-[100dvh] bg-slate-50 p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full">
          <div className="w-24 h-24 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-cyan-200">
             {percentage >= 80 ? <CheckCircle size={48} /> : <Lightbulb size={48} />}
          </div>
          <h2 className="text-4xl font-black mb-2 text-slate-800">Hoàn thành!</h2>
          <p className="text-slate-500 font-bold mb-8">Bạn đã hoàn thành bài kiểm tra điền từ.</p>

          <div className="bg-white border-2 border-slate-200 p-8 rounded-3xl w-full mb-8 shadow-sm">
            <div className="text-6xl font-black text-cyan-500 mb-2">{score}/{testWords.length}</div>
            <div className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-4">Câu đúng</div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="mt-4 text-slate-600 font-bold">+ {score * 2} XP</p>
          </div>

          <Button className="w-full text-lg" size="lg" onClick={() => setView('practice')}>Trở về Thực hành</Button>
        </div>
      </div>
    );
  }

  const word = testWords[currentIndex];
  const escapedWord = word.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const maskedSentence = word.exampleEn?.replace(new RegExp(escapedWord, 'gi'), '___________') || '';

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between shadow-sm border-b border-slate-200">
        <button onClick={handleQuit} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
        
        <div className="flex-1 mx-6 relative">
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-300 rounded-full"
              style={{ width: `${(currentIndex / testWords.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="font-black text-slate-400">
          {currentIndex + 1}/{testWords.length}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full mt-4">
        
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600 font-extrabold mb-3">
            <Lightbulb size={24} /> Nghĩa tiếng Việt:
          </div>
          <p className="text-2xl font-black text-slate-800">{word.exampleVi}</p>
        </div>

        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-700 leading-relaxed">
              {maskedSentence.split('___________').map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="inline-block border-b-4 border-cyan-500 w-24 mx-2"></span>
                  )}
                </span>
              ))}
            </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-auto flex flex-col gap-4">
          <div className="relative">
             <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                disabled={status !== 'idle'}
                placeholder="Gõ từ còn thiếu..."
                className={`w-full px-8 py-6 text-2xl font-black text-center bg-white border-4 rounded-[2rem] shadow-sm focus:outline-none transition-all placeholder:text-slate-300
                  ${status === 'idle' ? 'border-slate-200 focus:border-cyan-500 focus:shadow-md' : ''}
                  ${status === 'correct' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : ''}
                  ${status === 'incorrect' ? 'border-rose-500 text-rose-600 bg-rose-50' : ''}
                `}
                autoComplete="off"
                spellCheck="false"
              />
              {status === 'correct' && <CheckCircle size={32} className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500" />}
              {status === 'incorrect' && <XCircle size={32} className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-500" />}
          </div>

          {status === 'incorrect' && (
             <div className="bg-rose-100 border-2 border-rose-200 text-rose-700 p-4 rounded-xl font-bold text-center">
                Đáp án đúng: <span className="text-rose-900 font-black">{word.en}</span>
             </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            className={`w-full py-6 text-xl tracking-widest gap-2 text-white
              ${status === 'idle' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-slate-300 cursor-not-allowed opacity-50'}
            `} 
            disabled={!currentInput.trim() || status !== 'idle'}
          >
            KIỂM TRA <ArrowRight size={24} />
          </Button>
        </form>
      </div>
    </div>
  );
}
