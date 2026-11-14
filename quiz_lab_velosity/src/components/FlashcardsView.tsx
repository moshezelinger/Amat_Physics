import React, { useState } from 'react';
import { ChevronDown, Search, BookMarked, Lightbulb } from 'lucide-react';
import { Flashcard } from '../types';
import { MathRenderer } from './MathRenderer';
import { playSound } from '../utils/audio';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  soundEnabled: boolean;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ flashcards, soundEnabled }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardIds, setExpandedCardIds] = useState<number[]>([1, 5, 8]); // default open a few

  const toggleCard = (id: number) => {
    playSound('click', soundEnabled);
    setExpandedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCards = flashcards.filter(
    (card) =>
      card.title.includes(searchQuery) ||
      card.definition.includes(searchQuery) ||
      card.category.includes(searchQuery) ||
      (card.formula && card.formula.includes(searchQuery))
  );

  return (
    <div className="ui-card rounded-2xl p-6 sm:p-8 space-y-6" role="region" aria-label="כרטיסיות מושגים">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2.5 py-1 rounded border border-purple-300 dark:border-purple-800 inline-block">
            מילון מושגים ונוסחאות
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">
            כרטיסיות חזרה מרוכזות - פיזיקה ח' עמ"ט
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-1">
            לחצו על כל כרטיסייה כדי לחשוף את ההגדרה המדעית המלאה, הנוסחה והדוגמה המעשית.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חיפוש מושג או נוסחה..."
            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl pr-9 pl-4 py-2 border border-slate-300 dark:border-slate-700 text-sm focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="חפש בכרטיסיות"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCards.map((card) => {
          const isExpanded = expandedCardIds.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => toggleCard(card.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCard(card.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              className={`rounded-xl p-5 cursor-pointer space-y-3 transition-all border-2 focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isExpanded
                  ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/20 shadow-sm'
                  : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                    {card.category}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-1.5 flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-sky-600" />
                    <span>{card.title}</span>
                  </h3>
                </div>

                <div
                  className={`p-1 rounded-lg text-slate-400 transition-transform ${
                    isExpanded ? 'rotate-180 text-sky-600' : ''
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-150">
                  {card.formula && (
                    <div className="text-center py-2 px-3 bg-white dark:bg-slate-950 rounded-lg border border-sky-200 dark:border-sky-800">
                      <MathRenderer content={`$$${card.formula}$$`} />
                    </div>
                  )}

                  <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
                    <strong className="text-sky-700 dark:text-sky-400">הגדרה מדעית: </strong>
                    <MathRenderer content={card.definition} />
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-slate-900 dark:text-white">דוגמה מעשית: </strong>
                      <MathRenderer content={card.example} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
