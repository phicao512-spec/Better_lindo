import { useState, useEffect, useMemo } from "react";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { X, Settings, Sparkles, MessageCircle, PenTool, Lightbulb, ChevronRight, RefreshCw, AlertTriangle, List, Type, CheckCircle2, BookOpen, Clock, PlayCircle, Flag } from "lucide-react";
import { IeltsQuestion, IeltsCategory } from "../data/ieltsQuestions";

export function GenerateExam() {
  const { setView, geminiApiKey, setGeminiApiKey, generatedIeltsTest, setGeneratedIeltsTest } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, {score?: string, feedback?: string, isProcessing?: boolean}>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const [examState, setExamState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const sections = useMemo(() => {
    if (!generatedIeltsTest) return [];
    return [
      { title: "PHẦN 1: ACADEMIC READING (20 Phút)", time: 20 * 60, items: generatedIeltsTest.filter(q => ['Reading', 'Grammar Fill Blank', 'Multiple Choice'].includes(q.category)) },
      { title: "PHẦN 2: ACADEMIC WRITING (60 Phút)", time: 60 * 60, items: generatedIeltsTest.filter(q => q.category.includes('Writing')) },
      { title: "PHẦN 3: SPEAKING (15 Phút)", time: 15 * 60, items: generatedIeltsTest.filter(q => q.category.includes('Speaking')) }
    ].filter(s => s.items.length > 0);
  }, [generatedIeltsTest]);

  useEffect(() => {
    if (examState !== 'running' || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentSectionIdx < sections.length - 1) {
            const nextIdx = currentSectionIdx + 1;
            setCurrentSectionIdx(nextIdx);
            return sections[nextIdx].time;
          } else {
            setExamState('finished');
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [examState, currentSectionIdx, timeLeft, sections]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    if (sections.length === 0) return;
    setExamState('running');
    setCurrentSectionIdx(0);
    setTimeLeft(sections[0].time);
    setUserAnswers({});
    setRevealedAnswers({});
    setFeedbacks({});
  };

  const saveApiKey = () => {
    if (!apiKeyInput.trim()) return;
    setGeminiApiKey(apiKeyInput.trim());
  };

  const handleGenerate = async () => {
    if (!geminiApiKey) return;
    setIsProcessing(true);
    setErrorMsg("");

    const systemPrompt = `You are an expert IELTS Examiner and Test Creator.
Your task is to generate a Mock IELTS Practice Test. 
The difficulty MUST be at IELTS Band 7.5 - 8.5 level. Use academic, complex vocabulary and advanced grammar structures.

You must generate exactly the following 20 items in this exact order:
--- SECTION 1: ACADEMIC READING (10 items) ---
Provide ONE challenging 600-word academic reading passage in the 'passage' field for the FIRST question ONLY. Do not repeat the passage.
Then generate 10 questions based on this exact passage:
- 5 items for "Reading Multiple Choice" (Category: Multiple Choice) - Advanced reading comprehension questions (A, B, C, D).
- 5 items for "Reading Fill Blank" (Category: Grammar Fill Blank) - A summary sentence of the passage with a blank (use "___"). The answer must be found in the passage.

--- SECTION 2: WRITING (2 items) ---
- 1 item for "Writing Task 1" (Category: Writing Task 1) - Academic describe a complex chart/graph/process/map.
- 1 item for "Writing Task 2" (Category: Writing Task 2) - an advanced academic essay topic.

--- SECTION 3: SPEAKING (8 items) ---
- 4 items for "Speaking Part 1" (Category: Speaking Part 1) - general questions about a specific familiar topic.
- 1 item for "Speaking Part 2" (Category: Speaking Part 2) - a difficult cue card topic.
- 3 items for "Speaking Part 3" (Category: Speaking Part 3) - abstract, extended discussion questions related to Part 2.

For each item, you must provide:
1. id: A unique string id (e.g. "gen_r_1")
2. category: Must be exactly one of: "Speaking Part 1", "Speaking Part 2", "Speaking Part 3", "Writing Task 1", "Writing Task 2", "Grammar Fill Blank", "Multiple Choice", "Reading"
3. topic: A short string topic (e.g. "Technology", "Education", etc.)
4. question: The full text of the question or task.
5. passage: (ONLY for the FIRST question) The 600-word reading passage text.
6. tips: An array of 2 to 3 string tips in VIETNAMESE on how to answer this specific question or why the answer is correct.
7. options: (ONLY for "Multiple Choice" and "Reading") An array of 4 strings representing the ABCD choices.
8. answer: (ONLY for "Grammar Fill Blank", "Multiple Choice", and "Reading") The exact correct answer string.

You MUST return the output as a valid JSON array of objects. No markdown formatting, just the raw JSON array.
Example structure:
[
  {
    "id": "gen_sp1_1",
    "category": "Speaking Part 1",
    "topic": "Hometown",
    "question": "What do you like most about your hometown?",
    "tips": ["Nêu điểm nổi bật nhất (đồ ăn, con người).", "Dùng từ vựng mô tả cảm xúc."]
  }
]`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            responseMimeType: "application/json",
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Lỗi API");
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      let parsedResponse: IeltsQuestion[];
      try {
        parsedResponse = JSON.parse(textResponse);
        if (!Array.isArray(parsedResponse)) throw new Error("Not an array");
      } catch (e) {
        throw new Error("Phản hồi từ AI không đúng định dạng JSON. Vui lòng thử lại.");
      }

      setGeneratedIeltsTest(parsedResponse);
      setExamState('idle');
    } catch (error: any) {
      setErrorMsg("Lỗi: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnswerChange = (id: string, value: string) => {
    setUserAnswers(prev => ({...prev, [id]: value}));
  };

  const toggleReveal = (id: string) => {
    setRevealedAnswers(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleGrade = async (q: IeltsQuestion) => {
    const answer = userAnswers[q.id];
    if (!answer || !answer.trim() || !geminiApiKey) return;

    setFeedbacks(prev => ({...prev, [q.id]: { isProcessing: true }}));

    const systemPrompt = `You are a strict but helpful IELTS Examiner.
Evaluate the following user's response to the given IELTS question.
Question Category: ${q.category}
Question/Topic: ${q.topic} - ${q.question}
User's Answer: ${answer}

Provide feedback strictly as a JSON object with two fields:
1. "score": An estimated IELTS band score (e.g. "6.5") or a general score out of 10 if not strictly IELTS.
2. "feedback": A detailed, encouraging explanation in VIETNAMESE pointing out what was good, what grammar/vocabulary mistakes were made, and how to improve.

Return ONLY the raw JSON. No markdown formatting.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const textResponse = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(textResponse);

      setFeedbacks(prev => ({...prev, [q.id]: { score: parsed.score, feedback: parsed.feedback, isProcessing: false }}));
    } catch (e) {
      setFeedbacks(prev => ({...prev, [q.id]: { feedback: "Đã có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.", isProcessing: false }}));
    }
  };

  const getIconForCategory = (cat: IeltsCategory) => {
    if (cat.includes('Speaking')) return <MessageCircle size={20} />;
    if (cat === 'Multiple Choice') return <List size={20} />;
    if (cat === 'Grammar Fill Blank') return <Type size={20} />;
    if (cat === 'Reading') return <BookOpen size={20} />;
    return <PenTool size={20} />;
  };

  const getColorForCategory = (cat: IeltsCategory) => {
    if (cat.includes('Speaking')) return 'text-emerald-600 bg-emerald-50 border-emerald-500';
    if (cat === 'Multiple Choice') return 'text-amber-600 bg-amber-50 border-amber-500';
    if (cat === 'Grammar Fill Blank') return 'text-cyan-600 bg-cyan-50 border-cyan-500';
    if (cat === 'Reading') return 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-500';
    return 'text-blue-600 bg-blue-50 border-blue-500';
  };

  if (!geminiApiKey) {
    return (
      <div className="flex flex-col h-[100dvh] bg-slate-50 items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900">
          <div className="w-16 h-16 bg-amber-400 rounded-full border-2 border-slate-900 flex items-center justify-center mb-6 shadow-sm">
            <Settings size={32} className="text-slate-900" />
          </div>
          <h2 className="text-3xl font-black mb-4">Cài đặt API Key</h2>
          <p className="text-slate-600 font-bold mb-6">
            Tính năng Tạo đề thi AI yêu cầu <span className="text-indigo-600">Google Gemini API Key</span> để hoạt động miễn phí. Key của bạn chỉ được lưu trên trình duyệt này, hoàn toàn bảo mật.
          </p>
          <input
            type="password"
            placeholder="Nhập Gemini API Key của bạn..."
            value={apiKeyInput}
            onChange={e => setApiKeyInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-500 outline-none mb-6 font-mono"
          />
          <Button onClick={saveApiKey} className="w-full text-lg py-4">Bắt đầu tạo đề</Button>
          <div className="mt-6 text-center text-sm font-bold text-slate-400">
            Nhận API Key miễn phí tại <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-indigo-500 underline">aistudio.google.com</a>
          </div>
          <button onClick={() => setView('practice')} className="w-full text-slate-500 font-bold mt-4 hover:text-slate-900">Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between shadow-sm border-b border-slate-200 shrink-0">
        <button onClick={() => setView('practice')} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
        <div className="font-black text-slate-700 flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-500" /> Tạo Đề Thi Bằng AI
        </div>
        <button 
          onClick={() => setGeminiApiKey(null)}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          title="Đổi API Key"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50">
        <div className="max-w-7xl mx-auto w-full">
          {!generatedIeltsTest && !isProcessing && (
            <div className="text-center py-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Sparkles size={48} className="text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Tạo Đề Thi IELTS Cá Nhân Hóa</h2>
              <p className="text-slate-600 font-bold mb-8">
                Hệ thống sẽ sử dụng Gemini 2.5 Flash để biên soạn một đề thi Mini Mock Test (chuẩn IELTS Academic) gồm: 1 Passage Reading (20p), Writing Task 1&2 (60p) và Speaking Full 3 Parts (15p).
              </p>
              <button 
                onClick={handleGenerate}
                className="px-8 py-4 bg-indigo-600 text-white font-black text-xl rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
              >
                Tạo Đề Mới Ngay
              </button>
              {errorMsg && (
                <div className="mt-6 p-4 bg-rose-50 border-2 border-rose-300 text-rose-700 font-bold rounded-xl flex items-center gap-2 justify-center">
                  <AlertTriangle size={20} /> {errorMsg}
                </div>
              )}
            </div>
          )}

          {generatedIeltsTest && !isProcessing && examState === 'idle' && (
            <div className="text-center py-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 size={48} className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Đề Thi Đã Sẵn Sàng!</h2>
              <p className="text-slate-600 font-bold mb-8">
                Đề thi gồm {sections.length} phần, tổng thời gian: {sections.reduce((acc, s) => acc + s.time, 0) / 60} phút.<br/>Khi bắt đầu, đồng hồ sẽ đếm ngược. Nếu hết giờ, hệ thống sẽ tự động chuyển sang phần tiếp theo giống hệt thi thật.
              </p>
              <button 
                onClick={startExam}
                className="px-8 py-4 bg-emerald-500 text-white font-black text-xl rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all flex items-center gap-2 mx-auto"
              >
                <PlayCircle size={24} /> Bắt Đầu Làm Bài
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-20 flex flex-col items-center">
              <RefreshCw size={48} className="text-indigo-500 animate-spin mb-6" />
              <h3 className="text-2xl font-black text-slate-900 mb-2">Đang biên soạn đề thi...</h3>
              <p className="text-slate-500 font-bold">Vui lòng chờ AI xử lý trong vài giây. Gemini đang làm việc chăm chỉ để tạo đề thi chất lượng nhất.</p>
            </div>
          )}

          {generatedIeltsTest && !isProcessing && examState !== 'idle' && (
            <div className="flex flex-col xl:flex-row gap-8 items-start relative">
              {examState === 'running' && (
                <div className="xl:w-80 shrink-0 sticky top-0 xl:top-4 z-30 w-full mb-6 xl:mb-0">
                  <div className="bg-white/90 backdrop-blur-md text-slate-800 p-4 xl:p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-row xl:flex-col items-center xl:items-start justify-between transition-all duration-300 gap-4">
                    <div className="font-bold text-sm uppercase tracking-widest text-slate-500 hidden sm:block xl:block">
                      {sections[currentSectionIdx]?.title}
                    </div>
                    <div className="flex xl:flex-col items-center xl:items-stretch gap-4 w-full sm:w-auto xl:w-full justify-between sm:justify-end xl:justify-start">
                      <div className={`font-black flex justify-center items-center gap-3 px-5 py-3 rounded-xl transition-colors ${timeLeft < 60 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-indigo-50 text-indigo-700'}`}>
                        <Clock size={24} />
                        <span className="text-2xl xl:text-3xl tracking-wider">{formatTime(timeLeft)}</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (currentSectionIdx < sections.length - 1) {
                            setCurrentSectionIdx(prev => prev + 1);
                            setTimeLeft(sections[currentSectionIdx + 1].time);
                          } else {
                            setExamState('finished');
                          }
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 text-center"
                      >
                        Nộp Sớm
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 w-full min-w-0">
                {examState === 'finished' && (
                <div className="flex items-center justify-between mb-8 bg-emerald-100 p-6 rounded-3xl border-4 border-emerald-500 shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]">
                  <div>
                    <h2 className="text-2xl font-black text-emerald-900 flex items-center gap-2 mb-1">
                      <Flag size={24} /> Đã Nộp Bài
                    </h2>
                    <p className="text-emerald-700 font-bold">Hãy xem lại đáp án và nhờ AI chấm điểm các bài viết/nói.</p>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    className="flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 border-2 border-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    <RefreshCw size={18} /> Tạo đề mới
                  </button>
                </div>
              )}

              {sections.map((section, sIdx) => {
                if (examState === 'running' && sIdx !== currentSectionIdx) return null;
                return (
                  <div key={sIdx} className="mb-12 max-w-4xl mx-auto xl:mx-0 w-full">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <h3 className="text-xl font-black text-slate-800 tracking-wide">
                      {section.title}
                    </h3>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>
                  
                  <div className="space-y-8">
                    {section.items.map((q, i) => (
                      <div key={q.id || i} className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 md:p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                          <span className="inline-block bg-slate-50 border border-slate-200 text-slate-600 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                            Chủ đề: {q.topic}
                          </span>
                          <span className={`flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-full ${getColorForCategory(q.category)}`}>
                            {getIconForCategory(q.category)}
                            {q.category}
                          </span>
                        </div>

                        {q.passage && (
                          <div className="mb-8 bg-slate-50/80 border-l-4 border-indigo-500 rounded-r-2xl p-6 md:p-8 text-slate-800 font-serif leading-loose shadow-inner max-h-[500px] overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-2 font-bold text-indigo-600 uppercase tracking-widest text-xs mb-4 font-sans">
                              <BookOpen size={16} /> Academic Reading Passage
                            </div>
                            <p className="whitespace-pre-line text-[1.05rem] text-justify">{q.passage}</p>
                          </div>
                        )}

                        <h3 className="text-xl font-semibold text-slate-800 mb-8 whitespace-pre-line leading-relaxed">{q.question}</h3>
                        
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = userAnswers[q.id] === opt;
                              const isRevealed = revealedAnswers[q.id];
                              const isCorrect = isRevealed && opt === q.answer;
                              const isWrong = isRevealed && isSelected && opt !== q.answer;
                              
                              let btnClass = "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50";
                              if (isSelected && !isRevealed) btnClass = "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm ring-1 ring-indigo-500";
                              if (isCorrect) btnClass = "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm ring-1 ring-emerald-500";
                              if (isWrong) btnClass = "bg-rose-50 border-rose-500 text-rose-700 shadow-sm ring-1 ring-rose-500";

                              return (
                                <button 
                                  key={oIdx} 
                                  onClick={() => examState === 'running' && handleAnswerChange(q.id, opt)}
                                  disabled={examState === 'finished'}
                                  className={`border-2 p-5 rounded-xl font-medium flex items-center gap-4 text-left transition-all duration-200 ${btnClass} ${examState === 'finished' ? 'cursor-default' : ''}`}
                                >
                                  <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                                    isCorrect ? 'bg-emerald-500 text-white' : 
                                    isWrong ? 'bg-rose-500 text-white' : 
                                    isSelected ? 'bg-indigo-600 text-white' : 
                                    'bg-slate-100 text-slate-500'
                                  }`}>
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span className="leading-relaxed">{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {q.category === 'Grammar Fill Blank' && (
                          <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <input 
                              type="text"
                              placeholder="Nhập từ cần điền..."
                              value={userAnswers[q.id] || ""}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              disabled={examState === 'finished'}
                              className={`w-full md:w-1/2 border-2 border-slate-200 p-4 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-semibold text-slate-800 bg-slate-50 shadow-sm ${examState === 'finished' ? 'opacity-70 bg-slate-100 cursor-not-allowed' : ''}`}
                            />
                            {revealedAnswers[q.id] && userAnswers[q.id] && (
                              <div className={`px-5 py-3 rounded-xl font-bold text-white flex items-center gap-2 shadow-sm ${userAnswers[q.id].trim().toLowerCase() === q.answer?.toLowerCase() ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                {userAnswers[q.id].trim().toLowerCase() === q.answer?.toLowerCase() ? <><CheckCircle2 size={20}/> Chính xác</> : <><X size={20}/> Sai rồi</>}
                              </div>
                            )}
                          </div>
                        )}

                        {['Reading', 'Grammar Fill Blank', 'Multiple Choice'].includes(q.category) && examState === 'finished' && (
                          <div className="mt-2 border-t-2 border-slate-100 pt-4">
                            {!revealedAnswers[q.id] ? (
                              <button 
                                onClick={() => toggleReveal(q.id)} 
                                className="text-indigo-600 bg-indigo-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 mb-4 hover:bg-indigo-100 transition-colors"
                              >
                                <CheckCircle2 size={20} /> Kiểm tra đáp án
                              </button>
                            ) : (
                              <button 
                                onClick={() => toggleReveal(q.id)} 
                                className="text-slate-500 bg-slate-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 mb-4 hover:bg-slate-200 transition-colors"
                              >
                                <X size={20} /> Đóng đáp án
                              </button>
                            )}

                            {revealedAnswers[q.id] && (
                              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                {q.answer && (
                                  <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-4 font-black flex items-center gap-2">
                                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                                    Đáp án chuẩn: <span className="text-xl ml-1">{q.answer}</span>
                                  </div>
                                )}
                                
                                {q.tips && q.tips.length > 0 && (
                                  <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
                                    <div className="flex items-center gap-2 text-amber-700 font-black mb-3 text-lg">
                                      <Lightbulb size={24} /> Giải thích chi tiết:
                                    </div>
                                    <ul className="space-y-3">
                                      {q.tips.map((tip, idx) => (
                                        <li key={idx} className="flex gap-3 text-slate-800 font-bold leading-relaxed">
                                          <ChevronRight size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                          <span>{tip}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {(q.category.includes('Speaking') || q.category.includes('Writing')) && (
                          <div className="mt-4 border-t-2 border-slate-100 pt-6">
                            <h4 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3">Thực hành trả lời</h4>
                            <textarea
                              value={userAnswers[q.id] || ""}
                              onChange={e => handleAnswerChange(q.id, e.target.value)}
                              disabled={examState === 'finished'}
                              placeholder="Nhập bài làm bằng tiếng Anh của bạn vào đây..."
                              className={`w-full border-2 border-slate-200 rounded-xl p-5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-y min-h-[180px] mb-4 font-medium text-slate-700 bg-white shadow-sm leading-relaxed ${examState === 'finished' ? 'opacity-70 bg-slate-50 cursor-not-allowed' : ''}`}
                            />
                            
                            {examState === 'finished' && (
                              <button
                                onClick={() => handleGrade(q)}
                                disabled={!userAnswers[q.id] || feedbacks[q.id]?.isProcessing}
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-md hover:shadow-lg active:scale-95"
                              >
                                {feedbacks[q.id]?.isProcessing ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} className="text-indigo-200" />}
                                {feedbacks[q.id]?.isProcessing ? "AI Đang phân tích bài làm..." : "Nhờ AI Chấm điểm"}
                              </button>
                            )}

                            {feedbacks[q.id]?.feedback && !feedbacks[q.id]?.isProcessing && (
                              <div className="mt-8 bg-indigo-50/50 border border-indigo-100 p-6 md:p-8 rounded-2xl relative shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="absolute -top-3.5 right-6 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase px-3 py-1.5 rounded-full border border-indigo-200 flex items-center gap-1.5 shadow-sm">
                                  <Sparkles size={14}/> AI Examiner Feedback
                                </div>
                                {feedbacks[q.id]?.score && (
                                  <div className="inline-flex items-center gap-4 bg-white border border-slate-200 text-slate-800 px-5 py-3 rounded-2xl mb-6 shadow-sm">
                                    <span className="text-slate-500 uppercase text-xs font-bold tracking-wider">Band Score Estimate</span>
                                    <span className="text-3xl font-black text-indigo-600">{feedbacks[q.id]?.score}</span>
                                  </div>
                                )}
                                <p className="text-[1.05rem] text-slate-700 whitespace-pre-line leading-loose">
                                  {feedbacks[q.id]?.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {examState === 'running' && (
                      <div className="mt-12 bg-white p-8 md:p-10 rounded-2xl text-center border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500"></div>
                        <h4 className="text-2xl font-black text-slate-800 mb-3">Đã làm xong phần này?</h4>
                        <p className="text-slate-500 font-medium mb-8">Bạn sẽ không thể quay lại phần này sau khi đã xác nhận nộp.</p>
                        <button 
                          onClick={() => {
                            if (currentSectionIdx < sections.length - 1) {
                              setCurrentSectionIdx(prev => prev + 1);
                              setTimeLeft(sections[currentSectionIdx + 1].time);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              setExamState('finished');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="px-8 py-4 bg-emerald-500 text-white font-bold text-lg rounded-full hover:bg-emerald-600 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 mx-auto"
                        >
                          <CheckCircle2 size={24} /> 
                          {currentSectionIdx < sections.length - 1 ? "Xác nhận Nộp & Sang phần kế tiếp" : "Nộp Toàn Bộ Bài Thi"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
