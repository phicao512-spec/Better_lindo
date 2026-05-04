import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lesson } from '../data/lessons';

export type ViewState = 'home' | 'learn' | 'quiz' | 'profile' | 'practice' | 'create' | 'assessment' | 'assessment-fill' | 'paragraph-exam' | 'final-exam' | 'fill-blank-exam' | 'strict-exam';

interface AppState {
  currentView: ViewState;
  activeLessonId: string | null;
  completedLessons: string[];
  customLessons: Lesson[];
  xp: number;
  streak: number;
  lastPlayedDate: string | null;
  highestExamScore: {
    easy: number;
    medium: number;
    hard: number;
  };
  highestFillBlankScore: {
    easy: number;
    medium: number;
    hard: number;
  };
  highestStrictScore: {
    easy: number;
    medium: number;
    hard: number;
  };
  
  
  // Actions
  setView: (view: ViewState, lessonId?: string) => void;
  completeLesson: (lessonId: string, earnedXp: number) => void;
  updateStreak: () => void;
  addCustomLesson: (lesson: Lesson) => void;
  updateExamScore: (difficulty: 'easy'|'medium'|'hard', score: number) => void;
  updateFillBlankScore: (difficulty: 'easy'|'medium'|'hard', score: number) => void;
  updateStrictScore: (difficulty: 'easy'|'medium'|'hard', score: number) => void;
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
      highestExamScore: { easy: 0, medium: 0, hard: 0 },
      highestFillBlankScore: { easy: 0, medium: 0, hard: 0 },
      highestStrictScore: { easy: 0, medium: 0, hard: 0 },

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

      updateExamScore: (difficulty, score) => set((state) => ({
        highestExamScore: {
          ...state.highestExamScore,
          [difficulty]: Math.max(state.highestExamScore[difficulty] || 0, score)
        }
      })),

      updateFillBlankScore: (difficulty, score) => set((state) => ({
        highestFillBlankScore: {
          ...state.highestFillBlankScore,
          [difficulty]: Math.max(state.highestFillBlankScore[difficulty] || 0, score)
        }
      })),

      updateStrictScore: (difficulty, score) => set((state) => ({
        highestStrictScore: {
          ...state.highestStrictScore,
          [difficulty]: Math.max(state.highestStrictScore[difficulty] || 0, score)
        }
      })),
    }),
    {
      name: 'lingolearn-storage',
    }
  )
);
