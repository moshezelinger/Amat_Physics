import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, StepForward, Gauge, Timer, Info } from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import { playSound } from '../utils/audio';

interface TickerTapeLabProps {
  soundEnabled: boolean;
}

export const TickerTapeLab: React.FC<TickerTapeLabProps> = ({ soundEnabled }) => {
  const [motionType, setMotionType] = useState<'constant-slow' | 'constant-fast' | 'accelerating' | 'decelerating'>('constant-slow');
  const [dt, setDt] = useState<number>(0.1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [visibleDotsCount, setVisibleDotsCount] = useState<number>(12);

  // Generate dots positions based on motion type
  const dotsData = React.useMemo(() => {
    let positions: number[] = [];
    let currentX = 40;

    if (motionType === 'constant-slow') {
      const step = dt === 0.1 ? 40 : 20;
      for (let i = 0; i < 16; i++) {
        positions.push(currentX);
        currentX += step;
      }
    } else if (motionType === 'constant-fast') {
      const step = dt === 0.1 ? 75 : 38;
      for (let i = 0; i < 11; i++) {
        positions.push(currentX);
        currentX += step;
      }
    } else if (motionType === 'accelerating') {
      let step = dt === 0.1 ? 14 : 7;
      const acc = dt === 0.1 ? 10 : 5;
      for (let i = 0; i < 12; i++) {
        positions.push(currentX);
        currentX += step;
        step += acc;
      }
    } else if (motionType === 'decelerating') {
      let step = dt === 0.1 ? 105 : 55;
      const dec = dt === 0.1 ? 12 : 6;
      for (let i = 0; i < 11; i++) {
        positions.push(currentX);
        currentX += step;
        step = Math.max(12, step - dec);
      }
    }

    return positions;
  }, [motionType, dt]);

  // Live animation loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisibleDotsCount((prev) => {
          if (prev >= dotsData.length) {
            setIsPlaying(false);
            return dotsData.length;
          }
          playSound('click', soundEnabled);
          return prev + 1;
        });
      }, dt * 1000 * 2.5);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, dotsData.length, dt, soundEnabled]);

  const handleTogglePlay = () => {
    playSound('click', soundEnabled);
    if (!isPlaying && visibleDotsCount >= dotsData.length) {
      setVisibleDotsCount(1);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStep = () => {
    playSound('click', soundEnabled);
    setIsPlaying(false);
    setVisibleDotsCount((prev) => Math.min(dotsData.length, prev + 1));
  };

  const handleReset = () => {
    playSound('click', soundEnabled);
    setIsPlaying(false);
    setVisibleDotsCount(dotsData.length);
  };

  // Explanations for each motion type
  const motionExplanations = {
    'constant-slow': {
      title: 'תנועה קצובה איטית (מהירות קבועה נמוכה)',
      description: 'המרחקים בין כל שתי נקודות עוקבות שווים זה לזה בדיוק ($\\Delta x = \\text{const}$). הגוף עובר העתקים שווים בפרקי זמן שווים. מהירות הגוף קבועה ונמוכה ($v = \\frac{\\Delta x}{\\Delta t}$).',
      xtPath: 'M 40 115 L 290 65',
      vtPath: 'M 40 85 L 290 85',
    },
    'constant-fast': {
      title: 'תנועה קצובה מהירה (מהירות קבועה גבוהה)',
      description: 'המרחקים בין הנקודות שווים, אך גדולים בהרבה בהשוואה לתנועה האיטית עבור אותו פרק זמן $\\Delta t$. שיפוע גרף $x-t$ תלול בהרבה, וגרף $v-t$ ממוקם גבוה יותר.',
      xtPath: 'M 40 115 L 290 25',
      vtPath: 'M 40 45 L 290 45',
    },
    'accelerating': {
      title: 'תנועה מואצת בקצב אחיד (המהירות הולכת וגדלה)',
      description: 'המרחקים בין הנקודות העוקבות הולכים וגדלים בכיוון התנועה. בכל פרק זמן $\\Delta t$ העגלה עוברת מרחק גדול יותר, כלומר המהירות הרגעית עולה. גרף $x-t$ הוא פרבולה קעורה, וגרף $v-t$ הוא קו ישר עולה.',
      xtPath: 'M 40 115 Q 160 110 290 20',
      vtPath: 'M 40 115 L 290 25',
    },
    'decelerating': {
      title: 'תנועה מאיטה (המהירות הולכת וקטנה עד עצירה)',
      description: 'המרחקים בין הנקודות העוקבות הולכים וקטנים לאורך הסרט. העגלה מאבדת מהירות עד לעצירה מלאה. גרף $v-t$ הוא קו ישר יורד לכיוון ציר הזמן.',
      xtPath: 'M 40 115 Q 180 30 290 30',
      vtPath: 'M 40 25 L 290 115',
    },
  };

  const currentExp = motionExplanations[motionType];

  return (
    <div className="ui-card rounded-2xl p-6 sm:p-8 space-y-6" role="region" aria-label="מעבדת רושם זמן">
      <div>
        <span className="text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-2.5 py-1 rounded border border-sky-300 dark:border-sky-800 inline-block">
          סימולטור פיזיקלי מונגש למקרן
        </span>
        <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">
          מעבדת רושם זמן וסרטי עקבות (Ticker Tape Timer Lab)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base mt-1 leading-relaxed">
          רושם הזמן דופק על סרט הנייר במרווחי זמן קבועים ($\Delta t$). שנו את סוג התנועה, לחצו על הדמיה חיה
          או התקדמו דפיקה אחר דפיקה מול התלמידים, ובחנו את הקשר לגרפים הקינמטיים!
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div>
          <label htmlFor="lab-motion-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-sky-600" />
            <span>סוג התנועה של העגלה:</span>
          </label>
          <select
            id="lab-motion-select"
            value={motionType}
            onChange={(e) => {
              setMotionType(e.target.value as typeof motionType);
              setVisibleDotsCount(12);
              setIsPlaying(false);
            }}
            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-700 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <option value="constant-slow">תנועה קצובה איטית (v קבועה נמוכה)</option>
            <option value="constant-fast">תנועה קצובה מהירה (v קבועה גבוהה)</option>
            <option value="accelerating">תנועה מואצת (מהירות הולכת וגדלה)</option>
            <option value="decelerating">תנועה מאיטה (מהירות הולכת וקטנה)</option>
          </select>
        </div>

        <div>
          <label htmlFor="lab-dt-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-indigo-600" />
            <span>מרווח זמן בין דפיקות ($\Delta t$):</span>
          </label>
          <select
            id="lab-dt-select"
            value={dt}
            onChange={(e) => {
              setDt(parseFloat(e.target.value));
              setVisibleDotsCount(12);
              setIsPlaying(false);
            }}
            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-700 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <option value="0.1">0.10 שניות (תדר f = 10Hz תקני)</option>
            <option value="0.05">0.05 שניות (תדר f = 20Hz)</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-end gap-2">
          <button
            onClick={handleTogglePlay}
            className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 shadow"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'השהה הדמיה' : 'הפעל תנועה חיה'}</span>
          </button>

          <button
            onClick={handleStep}
            className="py-2 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-sm transition-all flex items-center gap-1 border border-slate-300 dark:border-slate-700"
            title="התקדם דפיקה אחת נוספת (שלב אחר שלב)"
          >
            <StepForward className="w-4 h-4" />
            <span className="hidden sm:inline">+1 דפיקה</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm transition-all border border-slate-300 dark:border-slate-700"
            title="אפס תצוגת כל הנקודות"
            aria-label="אפס"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Ticker Tape Display */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-slate-200">
          <span>סרט הנייר של רושם הזמן:</span>
          <span className="text-xs text-sky-700 dark:text-sky-400 font-bold">
            {Math.min(visibleDotsCount, dotsData.length)} מתוך {dotsData.length} נקודות מוצגות
          </span>
        </div>

        <div className="rounded-xl p-3 border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto custom-scrollbar shadow-inner">
          <svg
            width="800"
            height="90"
            viewBox="0 0 800 90"
            className="w-full"
            aria-label="סרט עקבות של רושם זמן"
          >
            {/* Paper Strip */}
            <rect
              x="0"
              y="0"
              width="800"
              height="90"
              fill="#f8fafc"
              className="projector:fill-slate-100 dark:fill-slate-900"
              rx="8"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            {/* Center guide line */}
            <line
              x1="10"
              y1="45"
              x2="790"
              y2="45"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="6,6"
            />

            {/* Dots */}
            {dotsData.slice(0, visibleDotsCount).map((x, i) => (
              <g key={i}>
                <circle
                  cx={x}
                  cy={45}
                  r={6}
                  fill="#0284c7"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={73}
                  fill="#475569"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  t{i}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Kinematic Graphs (x-t and v-t) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <h4 className="text-xs font-bold text-sky-700 dark:text-sky-400 mb-2 flex items-center justify-between">
            <span>גרף מקום-זמן ($x-t$)</span>
            <span className="text-[10px] text-slate-500">השיפוע מייצג את המהירות</span>
          </h4>
          <svg viewBox="0 0 320 150" className="w-full h-44">
            <line x1="40" y1="120" x2="300" y2="120" stroke="#64748b" strokeWidth="2" />
            <line x1="40" y1="20" x2="40" y2="120" stroke="#64748b" strokeWidth="2" />
            <text x="300" y="135" fill="#64748b" fontSize="11" fontWeight="bold">
              t [s]
            </text>
            <text x="15" y="25" fill="#64748b" fontSize="11" fontWeight="bold">
              x [m]
            </text>
            <path
              d={currentExp.xtPath}
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center justify-between">
            <span>גרף מהירות-זמן ($v-t$)</span>
            <span className="text-[10px] text-slate-500">השטח מייצג את ההעתק</span>
          </h4>
          <svg viewBox="0 0 320 150" className="w-full h-44">
            <line x1="40" y1="120" x2="300" y2="120" stroke="#64748b" strokeWidth="2" />
            <line x1="40" y1="20" x2="40" y2="120" stroke="#64748b" strokeWidth="2" />
            <text x="300" y="135" fill="#64748b" fontSize="11" fontWeight="bold">
              t [s]
            </text>
            <text x="15" y="25" fill="#64748b" fontSize="11" fontWeight="bold">
              v [m/s]
            </text>
            <path
              d={currentExp.vtPath}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Scientific Explanation Box */}
      <div className="p-4 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sm sm:text-base text-sky-900 dark:text-sky-200 leading-relaxed font-medium space-y-1">
        <div className="font-bold text-sky-950 dark:text-sky-300 flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          <span>{currentExp.title}</span>
        </div>
        <div>
          <MathRenderer content={currentExp.description} asBlock />
        </div>
      </div>
    </div>
  );
};
