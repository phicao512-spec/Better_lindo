import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { ieltsReadingData, IeltsReadingParagraph } from "../data/ieltsReading";
import { Button } from "../components/ui/Button";
import { X, CheckCircle, XCircle, FileText, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export function ParagraphExam() {
  const { setView, updateStreak, completeLesson } = useStore();
  const [para, setPara] = useState<IeltsReadingParagraph | null>(null);
  const [inputs, setInputs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'finished'>('idle');

  useEffect(() => {
    // Pick a random paragraph
    const randomP = ieltsReadingData[Math.floor(Math.random() * ieltsReadingData.length)];
    setPara(randomP);
    setInputs(new Array(randomP.answers.length).fill(""));
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (status !== 'idle' || !para) return;

    setStatus('finished');
    updateStreak();

    let correctCount = 0;
    inputs.forEach((ans, idx) => {
      if (ans.toLowerCase().trim() === para.answers[idx].toLowerCase().trim()) {
        correctCount++;
      }
    });

    completeLesson('paragraph_exam', correctCount * 5); // 5 XP per correct word in a paragraph

    if (correctCount >= para.answers.length * 0.7) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const handleQuit = () => {
    setView('home');
  };

  const renderParagraph = () => {
    if (!para) return null;

    const parts = para.paragraph.split('[BLANK]');
    
    return (
      <div className="text-xl leading-loose text-slate-700">
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="inline-block relative mx-2 align-bottom">
                <input
                  type="text"
                  value={inputs[idx]}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  disabled={status === 'finished'}
                  className={`w-32 px-2 py-1 text-center font-bold border-b-4 focus:outline-none transition-all
                    ${status === 'idle' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 focus:border-emerald-500' : ''}
                    ${status === 'finished' && inputs[idx].toLowerCase().trim() === para.answers[idx].toLowerCase().trim() ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : ''}
                    ${status === 'finished' && inputs[idx].toLowerCase().trim() !== para.answers[idx].toLowerCase().trim() ? 'bg-rose-100 border-rose-500 text-rose-700 line-through' : ''}
                  `}
                  placeholder={(idx + 1).toString()}
                  autoComplete="off"
                  spellCheck="false"
                />
                {status === 'finished' && inputs[idx].toLowerCase().trim() !== para.answers[idx].toLowerCase().trim() && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-emerald-600 font-black text-sm px-2 py-0.5 rounded border-2 border-emerald-500 whitespace-nowrap shadow-sm z-10">
                    {para.answers[idx]}
                  </span>
                )}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  if (!para) {
    return <div className="p-6">Đang chuẩn bị đoạn văn...</div>;
  }

  let score = 0;
  if (status === 'finished') {
    inputs.forEach((ans, idx) => {
      if (ans.toLowerCase().trim() === para.answers[idx].toLowerCase().trim()) {
        score++;
      }
    });
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between shadow-sm border-b border-slate-200">
        <button onClick={handleQuit} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
        
        <div className="font-black text-slate-700 flex items-center gap-2">
          <FileText size={20} className="text-emerald-500" /> IELTS Reading
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto w-full">
          
          <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-8 border-l-8 border-emerald-500 pl-4">{para.title}</h2>
            {renderParagraph()}
          </div>

          {status === 'idle' && (
            <Button 
              onClick={handleSubmit}
              size="lg" 
              className="w-full py-6 text-xl tracking-widest gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" 
            >
              NỘP BÀI <ArrowRight size={24} />
            </Button>
          )}

          {status === 'finished' && (
            <div className="bg-white border-2 border-slate-200 p-8 rounded-3xl w-full mb-8 shadow-sm flex flex-col items-center">
              <div className="text-6xl font-black text-emerald-500 mb-2">{score}/{para.answers.length}</div>
              <div className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-4">Câu đúng</div>
              <p className="mt-2 text-emerald-600 font-bold">+ {score * 5} XP</p>
              
              <Button 
                onClick={() => setView('practice')}
                size="lg" 
                className="w-full mt-8 py-4 text-lg" 
              >
                Trở về Thực hành
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
