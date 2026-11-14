export interface Question {
  id: number;
  topic: string;
  category: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
  diagramSvg?: string;
}

export interface Flashcard {
  id: number;
  title: string;
  category: string;
  formula?: string;
  definition: string;
  example: string;
}

export type TabType = 'quiz' | 'lab' | 'cards';

export type FontSizeLevel = 'normal' | 'large' | 'xlarge';

export interface AppSettings {
  projectorMode: boolean; // High-contrast bright mode optimized for classroom projectors
  fontSize: FontSizeLevel;
  soundEnabled: boolean;
  highContrastColors: boolean;
}
