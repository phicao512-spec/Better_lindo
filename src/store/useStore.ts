import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lesson } from '../data/lessons';

import { IeltsQuestion } from '../data/ieltsQuestions';

export type ViewState = 'home' | 'learn' | 'quiz' | 'profile' | 'practice' | 'create' | 'assessment' | 'assessment-fill' | 'paragraph-exam' | 'speaking-exam' | 'final-exam' | 'fill-blank-exam' | 'strict-exam' | 'generate-exam';

interface AppState {
  currentView: ViewState;
  activeLessonId: string | null;
  completedLessons: string[];
  customLessons: Lesson[];
  xp: number;
  streak: number;
  lastPlayedDate: string | null;
  geminiApiKey: string | null;
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
  notes: string;
  generatedIeltsTest: IeltsQuestion[] | null;
  
  
  // Actions
  setView: (view: ViewState, lessonId?: string) => void;
  completeLesson: (lessonId: string, earnedXp: number) => void;
  updateStreak: () => void;
  setGeminiApiKey: (key: string | null) => void;
  addCustomLesson: (lesson: Lesson) => void;
  updateExamScore: (difficulty: 'easy'|'medium'|'hard', score: number) => void;
  updateFillBlankScore: (difficulty: 'easy'|'medium'|'hard', score: number) => void;
  updateStrictScore: (difficulty: 'easy'|'medium'|'hard', score: number) => void;
  setNotes: (notes: string) => void;
  setGeneratedIeltsTest: (test: IeltsQuestion[] | null) => void;
  targetExamType: 'IELTS' | 'TOEIC';
  setTargetExamType: (type: 'IELTS' | 'TOEIC') => void;
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
      geminiApiKey: null,
      highestExamScore: { easy: 0, medium: 0, hard: 0 },
      highestFillBlankScore: { easy: 0, medium: 0, hard: 0 },
      highestStrictScore: { easy: 0, medium: 0, hard: 0 },
      notes: '',
      generatedIeltsTest: null,
      targetExamType: 'IELTS',

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

      setGeminiApiKey: (key) => set({ geminiApiKey: key }),

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

      setNotes: (notes) => set({ notes }),
      setGeneratedIeltsTest: (test) => set({ generatedIeltsTest: test }),
      setTargetExamType: (type) => set({ targetExamType: type }),
    }),
    {
      name: 'lingolearn-storage',
    }
  )
);
