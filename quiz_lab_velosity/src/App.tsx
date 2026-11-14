import React, { useState, useEffect } from 'react';
import { Atom, ClipboardList, Timer, Layers } from 'lucide-react';
import { TabType, AppSettings } from './types';
import { physicsQuestions } from './data/questions';
import { physicsFlashcards } from './data/flashcards';
import { ProjectorControls } from './components/ProjectorControls';
import { ExportModal } from './components/ExportModal';
import { QuizPlayer } from './components/QuizPlayer';
import { TickerTapeLab } from './components/TickerTapeLab';
import { FlashcardsView } from './components/FlashcardsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('quiz');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Settings: default projectorMode to true as requested by user ("זה אמור להתאים למקרן")
  const [settings, setSettings] = useState<AppSettings>({
    projectorMode: true,
    fontSize: 'large', // Default to large font for classroom visibility
    soundEnabled: true,
    highContrastColors: true,
  });

  const handleUpdateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Sync Projector Mode / Dark Mode class on documentElement
  useEffect(() => {
    const html = document.documentElement;
    if (settings.projectorMode) {
      html.classList.remove('dark');
      html.classList.add('projector');
    } else {
      html.classList.remove('projector');
      html.classList.add('dark');
    }
  }, [settings.projectorMode]);

  // Sync font size scaling
  useEffect(() => {
    const scale = settings.fontSize === 'xlarge' ? '1.35' : settings.fontSize === 'large' ? '1.18' : '1';
    document.documentElement.style.setProperty('--font-scale', scale);
  }, [settings.fontSize]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Keyboard shortcut listener for global actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'p' || e.key === 'P') {
        handleUpdateSettings({ projectorMode: !settings.projectorMode });
      } else if (e.key === 'm' || e.key === 'M') {
        handleUpdateSettings({ soundEnabled: !settings.soundEnabled });
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.projectorMode, settings.soundEnabled]);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between antialiased transition-colors duration-200 ${
        settings.projectorMode
          ? 'bg-[#f8fafc] text-slate-900'
          : 'bg-[#090d16] text-slate-100'
      }`}
      style={{ fontSize: 'calc(1rem * var(--font-scale, 1.18))' }}
    >
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        מצב מקרן {settings.projectorMode ? 'פעיל' : 'כבוי'}
      </div>

      {/* Header Bar */}
      <header
        className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
          settings.projectorMode
            ? 'bg-white/95 border-slate-300 shadow-sm'
            : 'bg-slate-900/95 border-slate-800'
        }`}
        role="banner"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & School Subject */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <Atom className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight">פיזיקה ח' עמ"ט</h1>
              <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">
                חידון דיאגנוסטי ומעבדת תנועה (20 שאלות תקניות)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav
            className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-950 p-1 rounded-xl border border-slate-300 dark:border-slate-800 text-sm font-semibold"
            aria-label="ניווט בין חלקי המערכת"
          >
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'text-white bg-sky-600 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white'
              }`}
              aria-current={activeTab === 'quiz' ? 'page' : undefined}
            >
              <ClipboardList className="w-4 h-4" />
              <span>החידון</span>
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'lab'
                  ? 'text-white bg-sky-600 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white'
              }`}
              aria-current={activeTab === 'lab' ? 'page' : undefined}
            >
              <Timer className="w-4 h-4" />
              <span>מעבדת עקבות</span>
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'cards'
                  ? 'text-white bg-sky-600 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white'
              }`}
              aria-current={activeTab === 'cards' ? 'page' : undefined}
            >
              <Layers className="w-4 h-4" />
              <span>מושגי יסוד</span>
            </button>
          </nav>

          {/* Projector & Accessibility Toolbar */}
          <ProjectorControls
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onOpenExport={() => setIsExportOpen(true)}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex-grow w-full" id="main-content">
        {activeTab === 'quiz' && (
          <QuizPlayer
            questions={physicsQuestions}
            settings={settings}
            onSwitchToLab={() => setActiveTab('lab')}
          />
        )}

        {activeTab === 'lab' && <TickerTapeLab soundEnabled={settings.soundEnabled} />}

        {activeTab === 'cards' && (
          <FlashcardsView
            flashcards={physicsFlashcards}
            soundEnabled={settings.soundEnabled}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-4 text-center text-xs transition-colors ${
          settings.projectorMode
            ? 'bg-slate-100/80 border-slate-300 text-slate-600'
            : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            מערך למידה דיאגנוסטי בפיזיקה • נבנה עבור כיתות ח' עמ"ט ומקרן כיתתי
          </div>
          <div className="flex gap-4 font-semibold">
            <span>⌨️ נגיש למקלדת (1-4, P, F, M)</span>
            <span>📽️ מותאם למקרן</span>
            <span>📐 דיוק מדע תקני SI</span>
          </div>
        </div>
      </footer>

      {/* Single-File HTML Export Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
