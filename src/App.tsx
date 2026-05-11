import { useStore } from './store/useStore';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Quiz } from './pages/Quiz';
import { Profile } from './pages/Profile';
import { Practice } from './pages/Practice';
import { Create } from './pages/Create';
import { BottomNav } from './components/layout/BottomNav';
import { Sidebar } from './components/layout/Sidebar';
import { AssessmentTest } from './pages/AssessmentTest';
import { AssessmentFillBlank } from './pages/AssessmentFillBlank';
import { ParagraphExam } from './pages/ParagraphExam';
import { SpeakingExam } from './pages/SpeakingExam';
import { FinalExam } from './pages/FinalExam';
import { FillBlankExam } from './pages/FillBlankExam';
import { StrictExam } from './pages/StrictExam';
import { Notepad } from './components/layout/Notepad';
import { GenerateExam } from './pages/GenerateExam';
import { Login } from './pages/Login';

export default function App() {
  const { currentView } = useStore();
  const showNav = ['home', 'profile', 'practice', 'create'].includes(currentView);

  return (
    <div className="h-[100dvh] bg-[#F1F5F9] text-slate-900 font-sans selection:bg-indigo-200 antialiased overflow-hidden flex">
      {showNav && <Sidebar />}
      
      <main className={`flex-1 relative flex flex-col h-full overflow-y-auto custom-scrollbar ${showNav ? 'pb-24 md:pb-0' : ''}`}>
        <div className="w-full h-full">
          {currentView === 'home' && <Home />}
          {currentView === 'learn' && <Learn />}
          {currentView === 'quiz' && <Quiz />}
          {currentView === 'profile' && <Profile />}
          {currentView === 'practice' && <Practice />}
          {currentView === 'create' && <Create />}
          {currentView === 'assessment' && <AssessmentTest />}
          {currentView === 'assessment-fill' && <AssessmentFillBlank />}
          {currentView === 'paragraph-exam' && <ParagraphExam />}
          {currentView === 'speaking-exam' && <SpeakingExam />}
          {currentView === 'final-exam' && <FinalExam />}
          {currentView === 'fill-blank-exam' && <FillBlankExam />}
          {currentView === 'strict-exam' && <StrictExam />}
          {currentView === 'generate-exam' && <GenerateExam />}
          {currentView === 'login' && <Login />}
        </div>
        
        {showNav && <div className="md:hidden"><BottomNav /></div>}
      </main>
      <Notepad />
    </div>
  );
}

