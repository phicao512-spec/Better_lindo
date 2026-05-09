import React, { useState } from "react";
import { ieltsQuestions, IeltsCategory, IeltsQuestion } from "../data/ieltsQuestions";
import { MessageCircle, PenTool, Lightbulb, ChevronRight, CheckSquare, BookOpen, CheckCircle, Clock, FileText, Mic, Sparkles } from "lucide-react";
import * as motion from "motion/react-client";
import { useStore } from "../store/useStore";

export function Practice() {
  const { setView, setTargetExamType } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<IeltsCategory | 'Random' | null>(null);
  const [randomQuestions, setRandomQuestions] = useState<IeltsQuestion[]>([]);

  const categories: { name: IeltsCategory; icon: React.ReactNode; color: string }[] = [
    { name: 'Speaking Part 1', icon: <MessageCircle />, color: 'bg-emerald-50 text-emerald-600 border-emerald-500' },
    { name: 'Speaking Part 2', icon: <MessageCircle />, color: 'bg-emerald-50 text-emerald-600 border-emerald-500' },
    { name: 'Speaking Part 3', icon: <MessageCircle />, color: 'bg-emerald-50 text-emerald-600 border-emerald-500' },
    { name: 'Writing Task 1', icon: <PenTool />, color: 'bg-blue-50 text-blue-600 border-blue-500' },
    { name: 'Writing Task 2', icon: <PenTool />, color: 'bg-blue-50 text-blue-600 border-blue-500' },
  ];

  if (selectedCategory) {
    let questions = ieltsQuestions.filter(q => q.category === selectedCategory);
    let title = selectedCategory;

    if (selectedCategory === 'Random') {
      questions = randomQuestions;
      title = "Luyện tập ngẫu nhiên";
    }

    return (
      <div className="pb-32 pt-6 px-4 max-w-lg mx-auto w-full">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="mb-6 bg-white border-2 border-slate-900 rounded-xl px-4 py-2 font-black text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
        >
           Trở về
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-8 px-2">{title}</h1>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] rounded-[32px] p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-slate-100 border-2 border-slate-900 rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider">
                  Chủ đề: {q.topic}
                </span>
                {selectedCategory === 'Random' && (
                  <span className="text-xs font-bold text-slate-500 bg-white border-2 border-slate-200 px-2 py-1 rounded-md">
                    {q.category}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 whitespace-pre-line">{q.question}</h3>
              
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-amber-600 font-extrabold mb-3">
                  <Lightbulb size={20} /> Tips trả lời:
                </div>
                <ul className="space-y-2">
                  {q.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-700 font-medium">
                      <ChevronRight size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="text-center text-slate-500 font-bold p-8">Đang cập nhật thêm câu hỏi...</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-6 px-4 max-w-lg mx-auto w-full">
      <div className="mb-8 px-2">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Thực hành IELTS</h1>
        <p className="text-slate-600 font-bold">Các câu hỏi và tips hay gặp nhất trong kỳ thi thật.</p>
      </div>

      <div className="space-y-4">
        {/* Progress Test Button - Multiple Choice */}
        <button
          onClick={() => setView('assessment')}
          className="w-full flex items-center justify-between p-6 bg-indigo-600 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all text-left text-white"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl border-2 bg-indigo-500 border-slate-900 text-white">
              <CheckSquare size={24} />
            </div>
            <div>
              <span className="block text-xl font-black">Kiểm tra trắc nghiệm</span>
              <span className="block text-sm font-bold text-indigo-200">Đánh giá nhanh ABCD</span>
            </div>
          </div>
          <ChevronRight className="text-indigo-300" size={28} />
        </button>

        {/* Progress Test Button - Fill in the blanks */}
        <button
          onClick={() => setView('assessment-fill')}
          className="w-full flex items-center justify-between p-6 bg-cyan-500 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all text-left text-slate-900"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl border-2 bg-white border-slate-900 text-cyan-600">
              <PenTool size={24} />
            </div>
            <div>
              <span className="block text-xl font-black">Kiểm tra điền chữ</span>
              <span className="block text-sm font-bold text-cyan-800">Kiểm tra chính tả</span>
            </div>
          </div>
          <ChevronRight className="text-cyan-800" size={28} />
        </button>

        {/* Paragraph Fill-in-the-blank Button */}
        <button
          onClick={() => setView('paragraph-exam')}
          className="w-full flex items-center justify-between p-6 bg-emerald-400 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all text-left text-slate-900"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl border-2 bg-white border-slate-900 text-emerald-600">
              <FileText size={24} />
            </div>
            <div>
              <span className="block text-xl font-black">Điền từ đoạn văn</span>
              <span className="block text-sm font-bold text-emerald-800">Reading Gap Fill (IELTS)</span>
            </div>
          </div>
          <ChevronRight className="text-emerald-800" size={28} />
        </button>

        {/* AI Speaking Room Button */}
        <button
          onClick={() => setView('speaking-exam')}
          className="w-full flex items-center justify-between p-6 bg-rose-400 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all text-left text-slate-900"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl border-2 bg-white border-slate-900 text-rose-600">
              <Mic size={24} />
            </div>
            <div>
              <span className="block text-xl font-black">Phòng thi Nói (AI)</span>
              <span className="block text-sm font-bold text-rose-800">Luyện IELTS Speaking với Giám khảo AI</span>
            </div>
          </div>
          <ChevronRight className="text-rose-800" size={28} />
        </button>

        {/* Generate AI Exam Button (IELTS) */}
        <button
          onClick={() => {
            setTargetExamType('IELTS');
            setView('generate-exam');
          }}
          className="w-full flex items-center justify-between p-6 mb-6 bg-fuchsia-400 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all text-left text-slate-900"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl border-2 bg-white border-slate-900 text-fuchsia-600">
              <Lightbulb size={24} />
            </div>
            <div>
              <span className="block text-xl font-black">Tạo Đề Thi IELTS (AI)</span>
              <span className="block text-sm font-bold text-fuchsia-900">Sinh đề IELTS Academic mới tinh bằng Gemini 2.5 Flash</span>
            </div>
          </div>
          <ChevronRight className="text-fuchsia-900" size={28} />
        </button>

        {/* Generate AI Exam Button (TOEIC) */}
        <button
          onClick={() => {
            setTargetExamType('TOEIC');
            setView('generate-exam');
          }}
          className="w-full flex items-center justify-between p-6 bg-cyan-400 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all text-left text-slate-900"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl border-2 bg-white border-slate-900 text-cyan-600">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="block text-xl font-black">Tạo Đề Thi TOEIC (AI)</span>
              <span className="block text-sm font-bold text-cyan-900">Sinh đề TOEIC Full (Reading & Speaking/Writing)</span>
            </div>
          </div>
          <ChevronRight className="text-cyan-900" size={28} />
        </button>

        {/* Random IELTS Questions Button */}
        <button
          onClick={() => {
            const shuffled = [...ieltsQuestions].sort(() => 0.5 - Math.random());
            setRandomQuestions(shuffled.slice(0, 5));
            setSelectedCategory('Random');
          }}
          className="w-full flex items-center justify-between p-6 mb-8 bg-amber-400 border-4 border-slate-900 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all text-left text-slate-900"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl border-2 bg-amber-300 border-slate-900 text-slate-900">
              <Lightbulb size={24} />
            </div>
            <div>
              <span className="block text-xl font-black">Luyện tập ngẫu nhiên</span>
              <span className="block text-sm font-bold text-slate-700">Trộn ngẫu nhiên các câu hỏi IELTS</span>
            </div>
          </div>
          <ChevronRight className="text-slate-900" size={28} />
        </button>

        <h2 className="text-xl font-black text-slate-900 mb-4 px-2 uppercase tracking-tight">Chọn theo kỹ năng</h2>

        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat.name)}
            className="w-full flex items-center justify-between p-6 bg-white border-4 border-slate-900 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl border-2 ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="text-xl font-black text-slate-900">{cat.name}</span>
            </div>
            <ChevronRight className="text-slate-400" size={28} />
          </button>
        ))}
      </div>
    </div>
  );
}
