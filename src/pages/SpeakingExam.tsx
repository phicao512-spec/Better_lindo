import { useState, useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { X, Mic, Send, Settings, AlertTriangle, MessageCircle, MicOff, CheckCircle } from "lucide-react";

interface ChatMessage {
  role: 'user' | 'examiner';
  content: string; // The English text
  feedback?: string; // The Vietnamese feedback (if examiner)
}

export function SpeakingExam() {
  const { setView, geminiApiKey, setGeminiApiKey } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserInput(prev => (prev + " " + finalTranscript).trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    if (geminiApiKey && messages.length === 0) {
      // Start the conversation
      setMessages([
        {
          role: 'examiner',
          content: "Hello, I am your IELTS examiner. Could you please tell me your full name and what I should call you?",
          feedback: "Phòng thi Speaking đã sẵn sàng! Hãy trả lời câu hỏi của Giám khảo để bắt đầu nhé."
        }
      ]);
      playAudio("Hello, I am your IELTS examiner. Could you please tell me your full name and what I should call you?");
    }
  }, [geminiApiKey]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setUserInput("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    // try to find a natural English voice
    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Natural')));
    if (engVoice) utterance.voice = engVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    if (!userInput.trim() || !geminiApiKey) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userInput.trim() } as ChatMessage];
    setMessages(newMessages);
    setUserInput("");
    setIsProcessing(true);

    // Call Gemini API
    try {
      const systemPrompt = `You are an extremely strict IELTS Speaking Examiner. 
The user is taking a speaking test.
Read the user's latest message and evaluate it.
You MUST return your response as a JSON object with exactly two fields:
1. "feedback": A detailed, strict explanation in VIETNAMESE pointing out the user's grammar mistakes, unnatural vocabulary, or praising them if they did well. Explain why it is wrong and how to fix it.
2. "reply": Your spoken response in ENGLISH as the examiner to continue the conversation. Ask a follow-up question.

Conversation history:
${newMessages.map(m => `${m.role === 'user' ? 'Candidate' : 'Examiner'}: ${m.content}`).join('\n')}

Remember, ONLY output valid JSON. No markdown formatting around the JSON.
Example format:
{
  "feedback": "Bạn dùng sai thì hiện tại hoàn thành ở đoạn 'I have go'. Lẽ ra phải là 'I have gone'. Tuy nhiên, từ vựng khá tự nhiên.",
  "reply": "I see. Let's talk about your hobbies. What do you usually do in your free time?"
}`;

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
      
      if (data.error) {
        throw new Error(data.error.message || "Lỗi API");
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(textResponse);
      } catch (e) {
        console.error("Failed to parse JSON:", textResponse);
        parsedResponse = {
          feedback: "Đã xảy ra lỗi khi phân tích phản hồi của AI.",
          reply: "I'm sorry, I didn't quite catch that. Could you repeat?"
        };
      }

      setMessages(prev => [...prev, {
        role: 'examiner',
        content: parsedResponse.reply,
        feedback: parsedResponse.feedback
      }]);
      
      playAudio(parsedResponse.reply);

    } catch (error: any) {
      alert("Lỗi khi gọi API: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveApiKey = () => {
    if (!apiKeyInput.trim()) return;
    setGeminiApiKey(apiKeyInput.trim());
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
            Phòng thi Speaking AI yêu cầu <span className="text-indigo-600">Google Gemini API Key</span> để hoạt động miễn phí. Key của bạn chỉ được lưu trên trình duyệt này, hoàn toàn bảo mật.
          </p>
          <input
            type="password"
            placeholder="Nhập Gemini API Key của bạn..."
            value={apiKeyInput}
            onChange={e => setApiKeyInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-500 outline-none mb-6 font-mono"
          />
          <Button onClick={saveApiKey} className="w-full text-lg py-4">Bắt đầu thi Nói</Button>
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
        <button onClick={() => { window.speechSynthesis.cancel(); setView('practice'); }} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
        <div className="font-black text-slate-700 flex items-center gap-2">
          <MessageCircle size={20} className="text-indigo-500" /> Giám khảo AI (IELTS)
        </div>
        <button 
          onClick={() => {
            if (confirm("Bạn có muốn xóa API Key hiện tại để nhập lại không?")) {
              setGeminiApiKey(null);
            }
          }}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          title="Đổi API Key"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-slate-100">
        <div className="bg-amber-100 border-2 border-amber-300 text-amber-800 p-4 rounded-2xl flex gap-3 text-sm font-bold mb-8">
          <AlertTriangle className="shrink-0 mt-0.5" size={20} />
          <p>Hãy trả lời đầy đủ và dùng từ vựng nâng cao. Giám khảo sẽ soi lỗi ngữ pháp và phát âm của bạn cực kỳ gắt gao đấy!</p>
        </div>

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            
            {msg.role === 'examiner' && (
              <div className="flex items-center gap-2 mb-1 pl-1">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xs">AI</div>
                <span className="text-xs font-black text-slate-400 uppercase">Giám khảo</span>
              </div>
            )}
            
            <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-3xl border-2 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white border-slate-900 rounded-br-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]' 
                : 'bg-white text-slate-900 border-slate-900 rounded-bl-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
            }`}>
              <p className="font-bold text-lg leading-relaxed">{msg.content}</p>
            </div>

            {msg.role === 'examiner' && msg.feedback && (
              <div className="mt-3 bg-white border-2 border-rose-200 p-4 rounded-2xl max-w-[90%] md:max-w-[80%] shadow-sm relative">
                <div className="absolute -top-3 left-4 bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-rose-600">Sửa lỗi</div>
                <p className="text-sm text-rose-800 font-bold leading-relaxed">{msg.feedback}</p>
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-start">
             <div className="bg-slate-200 text-slate-500 px-4 py-3 rounded-3xl rounded-bl-none border-2 border-slate-300 font-bold animate-pulse">
              Giám khảo đang nghe và chấm điểm...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t-2 border-slate-200 shrink-0">
        <div className="max-w-4xl mx-auto w-full flex items-end gap-2">
          
          <button 
            onClick={toggleRecording}
            className={`p-4 rounded-full border-2 transition-all shrink-0 ${
              isRecording 
                ? 'bg-rose-500 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] animate-pulse' 
                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {isRecording ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isRecording ? "Đang nghe..." : "Nhập câu trả lời hoặc bấm micro để nói..."}
            className={`flex-1 border-2 border-slate-300 rounded-3xl p-3 px-5 focus:border-indigo-500 outline-none resize-none font-bold text-slate-700 min-h-[56px] max-h-[120px] transition-colors ${isRecording ? 'bg-rose-50' : ''}`}
            rows={1}
            disabled={isProcessing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <button 
            onClick={handleSubmit}
            disabled={!userInput.trim() || isProcessing}
            className="p-4 bg-indigo-600 text-white rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50 disabled:shadow-none transition-all shrink-0 hover:bg-indigo-700 active:translate-y-[2px]"
          >
            <Send size={24} />
          </button>

        </div>
      </div>
    </div>
  );
}
