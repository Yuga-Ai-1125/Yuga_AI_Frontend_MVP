export interface User {
  id: string;
  name: string;
  fullName: string;
  email: string;
  avatar?: string;
  preferences: {
    learningStyle: "visual" | "auditory" | "kinesthetic";
    difficulty: "beginner" | "intermediate" | "advanced";
    subjects: string[];
    notifications: boolean;
  };
  progress: UserProgress;
  createdAt: Date;
  lastLogin: Date;
}

// src/types/index.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  lessons: any[];
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  color: string;
  chapters: any[];
  instructor: string;
  rating: number;
  students: number;
  tags: string[];
  notesCount: number; // Add this required property
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: "video" | "reading" | "interactive" | "quiz";
  duration: string;
  completed: boolean;
  videoUrl?: string;
  transcript?: string;
  resources?: string[];
  dateAdded: string;
  thumbnailUrl?: string;
  images?: {
    url: string;
    alt?: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "voice" | "image";
  subject?: string;
  isDoubt?: boolean;
}

export interface UserProgress {
  totalCourses: number;
  completedCourses: number;
  currentStreak: number;
  totalHours: number;
  achievements: Achievement[];
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Doubt {
  id: string;
  question: string;
  subject: string;
  course?: string;
  answer?: string;
  status: "pending" | "answered" | "resolved";
  timestamp: Date;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
}

export type AuthProvider = "email" | "google" | "apple";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
