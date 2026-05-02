import React, { useState } from "react";
import { ieltsQuestions, IeltsCategory, IeltsQuestion } from "../data/ieltsQuestions";
import { MessageCircle, PenTool, Lightbulb, ChevronRight } from "lucide-react";
import * as motion from "motion/react-client";

export function Practice() {
  const [selectedCategory, setSelectedCategory] = useState<IeltsCategory | null>(null);

  const categories: { name: IeltsCategory; icon: React.ReactNode; color: string }[] = [
    { name: 'Speaking Part 1', icon: <MessageCircle />, color: 'bg-emerald-50 text-emerald-600 border-emerald-500' },
    { name: 'Speaking Part 2', icon: <MessageCircle />, color: 'bg-emerald-50 text-emerald-600 border-emerald-500' },
    { name: 'Speaking Part 3', icon: <MessageCircle />, color: 'bg-emerald-50 text-emerald-600 border-emerald-500' },
    { name: 'Writing Task 1', icon: <PenTool />, color: 'bg-blue-50 text-blue-600 border-blue-500' },
    { name: 'Writing Task 2', icon: <PenTool />, color: 'bg-blue-50 text-blue-600 border-blue-500' },
  ];

  if (selectedCategory) {
    const questions = ieltsQuestions.filter(q => q.category === selectedCategory);
    return (
      <div className="pb-32 pt-6 px-4 max-w-lg mx-auto w-full">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="mb-6 bg-white border-2 border-slate-900 rounded-xl px-4 py-2 font-black text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
        >
           Trở về
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-8 px-2">{selectedCategory}</h1>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] rounded-[32px] p-6">
              <span className="inline-block bg-slate-100 border-2 border-slate-900 rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider mb-4">
                Chủ đề: {q.topic}
              </span>
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
