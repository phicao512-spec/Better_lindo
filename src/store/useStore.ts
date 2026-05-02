import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lesson } from '../data/lessons';

export type ViewState = 'home' | 'learn' | 'quiz' | 'profile' | 'practice' | 'create';

interface AppState {
  currentView: ViewState;
  activeLessonId: string | null;
  completedLessons: string[];
  customLessons: Lesson[];
  xp: number;
  streak: number;
  lastPlayedDate: string | null;
  
  // Actions
  setView: (view: ViewState, lessonId?: string) => void;
  completeLesson: (lessonId: string, earnedXp: number) => void;
  updateStreak: () => void;
  addCustomLesson: (lesson: Lesson) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentView: 'home',
      activeLessonId: null,
      completedLessons: [],
      customLessons: [],
      xp: 0,
      streak: 0,
      lastPlayedDate: null,

      setView: (view, lessonId) => set({ currentView: view, activeLessonId: lessonId || null }),
      
      completeLesson: (lessonId, earnedXp) => set((state) => {
        const isNewCompletion = !state.completedLessons.includes(lessonId);
        return {
          completedLessons: isNewCompletion 
            ? [...state.completedLessons, lessonId] 
            : state.completedLessons,
          xp: state.xp + earnedXp,
        };
      }),

      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        if (state.lastPlayedDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          let newStreak = state.streak;
          if (state.lastPlayedDate === yesterday.toDateString()) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
          return { streak: newStreak, lastPlayedDate: today };
        }
        return state;
      }),

      addCustomLesson: (lesson) => set((state) => ({
        customLessons: [...state.customLessons, lesson]
      })),
    }),
    {
      name: 'lingolearn-storage',
    }
  )
);
