import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Volume2, Award, Sparkles, BookOpen } from 'lucide-react';
import { Question, AppSettings } from '../types';
import { MathRenderer } from './MathRenderer';
import { playSound, speakText, stopSpeaking } from '../utils/audio';

interface QuizPlayerProps {
  questions: Question[];
  settings: AppSettings;
  onSwitchToLab: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ questions, settings, onSwitchToLab }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = (count: number) => {
    playSound('click', settings.soundEnabled);
    const selected = questions.slice(0, count);
    setActiveQuestions(selected);
    setUserAnswers(new Array(selected.length).fill(null));
    setCurrentIndex(0);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  const currentQ = activeQuestions[currentIndex];
  const selectedAnswer = userAnswers[currentIndex];
  const isAnswered = selectedAnswer !== null;

  const handleSelectOption = useCallback((optionIndex: number) => {
    if (isAnswered) return;
    const isCorrect = optionIndex === currentQ.correctAnswer;
    playSound(isCorrect ? 'correct' : 'incorrect', settings.soundEnabled);

    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = optionIndex;
      return updated;
    });
  }, [isAnswered, currentQ, currentIndex, settings.soundEnabled]);

  const handleNavigate = useCallback((direction: number) => {
    playSound('click', settings.soundEnabled);
    stopSpeaking();
    const nextIndex = currentIndex + direction;
    if (nextIndex >= activeQuestions.length) {
      setQuizFinished(true);
      playSound('complete', settings.soundEnabled);
    } else if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, activeQuestions.length, settings.soundEnabled]);

  // Keyboard navigation
  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1, 2, 3, 4 to select options
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (idx < currentQ.options.length) {
          handleSelectOption(idx);
        }
      } else if (e.key === 'Enter') {
        if (isAnswered) {
          handleNavigate(1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex > 0) handleNavigate(-1);
      } else if (e.key === 'ArrowLeft') {
        if (isAnswered) handleNavigate(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quizStarted, quizFinished, isAnswered, currentQ, currentIndex, handleSelectOption, handleNavigate]);

  const handleReadAloud = () => {
    if (!currentQ) return;
    const textToSpeak = `שאלה ${currentIndex + 1}. נושא: ${currentQ.topic}. ${currentQ.text}`;
    speakText(textToSpeak);
  };

  const hebrewLetters = ['א', 'ב', 'ג', 'ד'];

  // Start Screen
  if (!quizStarted) {
    return (
      <div className="ui-card rounded-2xl p-6 sm:p-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>תוכנית הלימודים בפיזיקה - כיתה ח' עתודה מדעית טכנולוגית (עמ"ט)</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          חידון דיאגנוסטי מקיף בפיזיקה <br />
          <span className="text-sky-600 dark:text-sky-400">
            מבוא לפיזיקה, מדידות ושגיאות, רושם זמן וקינמטיקה
          </span>
        </h2>

        <p className="text-slate-700 dark:text-slate-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
          מבחן דיאגנוסטי אינטראקטיבי הכולל <strong>20 שאלות תקניות</strong> שנכתבו במיוחד עבור כיתות עמ"ט.
          החידון מותאם להקרנה מול כיתה (Projector Mode), נגיש למקלדת ולסיוע קולי, ומספק הסבר מדעי מעמיק לכל שאלה.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center font-medium">
          <div className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400">20</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">שאלות מקיפות</div>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">הסבר מדעי מפורט</div>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">📽️</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">מותאם למקרן כיתתי</div>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">⌨️</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">ניווט מקלדת נגיש</div>
          </div>
        </div>

        {/* Start buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => startQuiz(20)}
            className="px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-base sm:text-lg rounded-xl shadow-md transition-all flex items-center gap-2 focus-visible:ring-4 focus-visible:ring-sky-400"
          >
            <span>התחל את החידון המלא (20 שאלות)</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => startQuiz(10)}
            className="px-6 py-3.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-base rounded-xl transition-all"
          >
            <span>חידון מקוצר (10 שאלות)</span>
          </button>
        </div>
      </div>
    );
  }

  // Summary Screen
  if (quizFinished) {
    let correctCount = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === activeQuestions[idx].correctAnswer) correctCount++;
    });
    const percentage = Math.round((correctCount / activeQuestions.length) * 100);

    return (
      <div className="ui-card rounded-2xl p-6 sm:p-10 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 dark:border-emerald-800 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-4xl shadow-sm">
          <Award className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            סיכום תוצאות - חידון דיאגנוסטי בפיזיקה ח' עמ"ט
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
            כל הכבוד על סיום המבחן הדיאגנוסטי!
          </p>
        </div>

        <div className="inline-block px-10 py-6 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 shadow-inner">
          <div className="text-5xl sm:text-7xl font-black text-sky-600 dark:text-sky-400">
            {percentage}%
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 mt-2">
            {correctCount} מתוך {activeQuestions.length} תשובות נכונות
          </div>
        </div>

        <div className="p-4 rounded-xl max-w-xl mx-auto text-sm sm:text-base border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 font-medium text-slate-800 dark:text-slate-200">
          {percentage >= 90 ? (
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              🌟 ציון מצטיין! הפגנת שליטה מדעית יוצאת דופן בכל מושגי היסוד, מדידות ושגיאות, רושם זמן וקינמטיקה.
            </span>
          ) : percentage >= 75 ? (
            <span className="text-sky-700 dark:text-sky-400 font-bold">
              👍 שליטה טובה מאוד! מומלץ לעבור על השאלות בהן טעיתם ועל כרטיסיות המושגים לחיזוק סופי.
            </span>
          ) : (
            <span className="text-amber-700 dark:text-amber-400 font-bold">
              📖 מומלץ לחזק מושגים: מומלץ לחזור על כרטיסיות המושגים ומעבדת רושם הזמן כדי להעמיק בהבנת הנושאים.
            </span>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={() => startQuiz(activeQuestions.length)}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>בצע את החידון שוב</span>
          </button>
          <button
            onClick={onSwitchToLab}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>מעבדת רושם זמן</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Question View
  const progressPct = Math.round(((currentIndex + 1) / activeQuestions.length) * 100);

  return (
    <div className="space-y-5" role="region" aria-label={`שאלה ${currentIndex + 1} מתוך ${activeQuestions.length}`}>
      {/* Question Header & Status Bar */}
      <div className="ui-card rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span
            className="w-12 h-10 rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400 font-black flex items-center justify-center border border-sky-300 dark:border-sky-800 text-base shrink-0"
            aria-label={`שאלה ${currentIndex + 1} מתוך ${activeQuestions.length}`}
          >
            {currentIndex + 1}/{activeQuestions.length}
          </span>
          <div>
            <span className="text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800 inline-block">
              {currentQ.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {currentQ.topic}
            </h3>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-1/3 space-y-1">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
            <span>התקדמות במבחן</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
            <div
              className="bg-sky-600 h-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Text-to-Speech Button */}
        <button
          onClick={handleReadAloud}
          className="text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 font-bold transition-colors"
          title="הקרא את השאלה בקול רם"
          aria-label="הקרא את השאלה"
        >
          <Volume2 className="w-4 h-4 text-sky-600" />
          <span>הקרא שאלה</span>
        </button>
      </div>

      {/* Main Question Box */}
      <div className="ui-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2
            className="text-lg sm:text-2xl font-bold leading-relaxed text-slate-900 dark:text-white"
            tabIndex={0}
          >
            <MathRenderer content={currentQ.text} />
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label="אפשרויות תשובה">
          {currentQ.options.map((optionText, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQ.correctAnswer;

            let cardStyle =
              'border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-slate-800/80';

            if (isAnswered) {
              if (isCorrect) {
                cardStyle =
                  'border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-bold';
              } else if (isSelected) {
                cardStyle =
                  'border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-950 dark:text-rose-100 font-bold';
              } else {
                cardStyle =
                  'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                role="radio"
                aria-checked={isSelected}
                className={`w-full text-right p-4 rounded-xl transition-all flex items-center justify-between gap-3 text-base sm:text-lg focus-visible:ring-4 focus-visible:ring-sky-500 ${cardStyle}`}
              >
                <div className="flex items-center gap-3.5 leading-relaxed">
                  <span
                    className={`w-8 h-8 rounded-lg font-black flex items-center justify-center shrink-0 border text-sm ${
                      isSelected || (isAnswered && isCorrect)
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-400 dark:border-slate-700'
                    }`}
                  >
                    {hebrewLetters[idx]}
                  </span>
                  <span>
                    <MathRenderer content={optionText} />
                  </span>
                </div>

                {isAnswered && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>תשובה נכונה</span>
                      </span>
                    ) : isSelected ? (
                      <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
                        <XCircle className="w-5 h-5" />
                        <span>לא נכון</span>
                      </span>
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Pedagogical Explanation Card */}
        {isAnswered && (
          <div
            className={`rounded-xl p-5 border-2 transition-all space-y-1.5 ${
              selectedAnswer === currentQ.correctAnswer
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200'
            }`}
            role="region"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 font-black text-base sm:text-lg">
              {selectedAnswer === currentQ.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>מצוין, תשובה נכונה!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>תשובה שגויה - שימו לב להסבר המדעי:</span>
                </>
              )}
            </div>

            <div className="text-sm sm:text-base leading-relaxed font-medium">
              <MathRenderer content={currentQ.explanation} asBlock />
            </div>
          </div>
        )}

        {/* Navigation & Shortcuts Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            💡 קיצורי מקלדת: <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">1-4</kbd> לבחירה | <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">Enter</kbd> להמשך
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate(-1)}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold border border-slate-300 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>קודם</span>
            </button>

            <button
              onClick={() => handleNavigate(1)}
              disabled={!isAnswered}
              className="px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold shadow disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
            >
              <span>{currentIndex === activeQuestions.length - 1 ? 'סיים חידון' : 'הבא'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
