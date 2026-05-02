import React, { useState, useRef } from "react";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { Copy, PlusCircle, Check, FileUp, Table } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export function Create() {
  const { addCustomLesson, setView } = useStore();
  const [inputText, setInputText] = useState("");
  const [title, setTitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title.trim()) {
      const fileName = file.name.split('.')[0];
      setTitle(fileName);
    }

    const reader = new FileReader();

    if (file.name.endsWith('.csv')) {
      reader.onload = (event) => {
        const csvData = event.target?.result as string;
        Papa.parse(csvData, {
          complete: (results) => {
            const parsedText = results.data
              .map((row: any) => {
                if (Array.isArray(row)) {
                  return row.filter(cell => cell && String(cell).trim()).join(" - ");
                }
                return "";
              })
              .filter(line => line.includes(" - "))
              .join("\n");
            setInputText(prev => prev ? prev + "\n" + parsedText : parsedText);
          }
        });
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const parsedText = json
          .map((row: any) => {
            if (Array.isArray(row)) {
              return row.filter(cell => cell && String(cell).trim()).join(" - ");
            }
            return "";
          })
          .filter(line => line.includes(" - "))
          .join("\n");
        setInputText(prev => prev ? prev + "\n" + parsedText : parsedText);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleParseAndCreate = () => {
    if (!title.trim() || !inputText.trim()) return;

    // Phân tích văn bản. Ví dụ: "Apple - Quả táo", "Banana : Quả chuối"
    const lines = inputText.split('\n');
    const words = lines.map((line, index) => {
      // Tách bằng '-', ':', hoặc khoảng trắng lớn
      const parts = line.split(/[-:]/).map(p => p.trim());
      if (parts.length >= 2) {
        return {
          id: `custom_${Date.now()}_${index}`,
          en: parts[0],
          vi: parts[1],
        }
      }
      return null;
    }).filter(w => w !== null) as any[];

    if (words.length > 0) {
      addCustomLesson({
        id: `custom_lesson_${Date.now()}`,
        level: 'basic', // hoặc có thể để level 'custom'
        title: title,
        description: `Bài học tự tạo có ${words.length} từ vựng`,
        icon: '📝',
        words: words
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setView('home');
      }, 2000);
    } else {
      alert("Không tìm thấy từ vựng nào. Vui lòng nhập theo định dạng: Tiếng Anh - Tiếng Việt");
    }
  };

  return (
    <div className="pb-32 pt-6 px-4 max-w-lg mx-auto w-full">
      <div className="mb-8 px-2">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Tạo bài học</h1>
        <p className="text-slate-600 font-bold">Copy và paste từ vựng từ PDF hoặc tài liệu của bạn vào đây để tạo danh sách học (Flashcard).</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border-4 border-slate-900 rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <label className="block text-sm font-black uppercase text-slate-500 tracking-widest mb-2">Tên bài học</label>
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Từ vựng PDF trang 1"
            className="w-full font-bold text-lg p-4 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-indigo-50 transition-colors"
          />
        </div>

        <div className="bg-white border-4 border-slate-900 rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <label className="block text-sm font-black uppercase text-slate-500 tracking-widest mb-4">Tải tệp lên (Excel / CSV)</label>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-400 hover:bg-slate-50 transition-all group"
            >
              <FileUp className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2" />
              <span className="text-xs font-black text-slate-500 group-hover:text-slate-900 uppercase">Chọn file</span>
            </button>
            <div className="flex flex-col justify-center">
               <p className="text-[10px] font-bold text-slate-400 leading-tight italic">
                 Hỗ trợ: .csv, .xlsx<br/>
                 Cột A (1): Tiếng Anh (Từ/Cụm từ)<br/>
                 Cột B (2): Tiếng Việt (Nghĩa)
               </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-slate-900 rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col">
          <div className="flex justify-between items-end mb-2">
             <label className="block text-sm font-black uppercase text-slate-500 tracking-widest">Danh sách từ</label>
             <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded border-2 border-indigo-200">Định dạng: Từ - Nghĩa</span>
          </div>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Apple - Quả táo&#10;Banana - Quả chuối&#10;Car - Xe ô tô"
            className="w-full h-64 font-bold p-4 bg-slate-50 border-2 border-slate-900 rounded-xl outline-none focus:bg-indigo-50 transition-colors resize-none"
          />
        </div>

        <Button 
          onClick={handleParseAndCreate}
          disabled={isSuccess || !title.trim() || !inputText.trim()}
          className={`w-full shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] ${isSuccess ? 'bg-emerald-400 text-slate-900 pointer-events-none' : ''}`} 
          size="lg"
        >
          {isSuccess ? (
            <><Check className="mr-2" /> Đã tạo thành công</>
          ) : (
            <><PlusCircle className="mr-2" /> Tạo bài học & Flashcard</>
          )}
        </Button>
      </div>

    </div>
  );
}
