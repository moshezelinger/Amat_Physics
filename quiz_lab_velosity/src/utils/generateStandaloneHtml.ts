import { physicsQuestions } from '../data/questions';
import { physicsFlashcards } from '../data/flashcards';

export function generateStandaloneHtml(): string {
  const questionsJson = JSON.stringify(physicsQuestions, null, 2);
  const flashcardsJson = JSON.stringify(physicsFlashcards, null, 2);

  return `<!DOCTYPE html>
<html lang="he" dir="rtl" class="projector">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>חידון דיאגנוסטי ומעבדת תנועה בפיזיקה - כיתה ח' עמ"ט</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts: Rubik -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- KaTeX for crisp LaTeX Math Rendering -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Rubik', 'system-ui', 'sans-serif'],
          },
        }
      }
    }
  </script>

  <style>
    /* High-contrast styles optimized for Classroom Projectors & Accessibility */
    :root {
      --font-scale: 1;
    }
    
    html.projector {
      background-color: #f8fafc;
      color: #0f172a;
    }
    html.dark {
      background-color: #090d16;
      color: #f8fafc;
    }

    body {
      font-family: 'Rubik', sans-serif;
      font-size: calc(1rem * var(--font-scale));
      line-height: 1.6;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .projector .ui-card {
      background-color: #ffffff;
      border: 2px solid #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      color: #0f172a;
    }
    .dark .ui-card {
      background-color: #111827;
      border: 1px solid #1f2937;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      color: #f8fafc;
    }

    .projector .ui-interactive:hover, .projector .ui-interactive:focus-visible {
      border-color: #0284c7;
      background-color: #f0f9ff;
    }
    .dark .ui-interactive:hover, .dark .ui-interactive:focus-visible {
      border-color: #38bdf8;
      background-color: #1e293b;
    }

    /* Clear focus ring for accessibility */
    button:focus-visible, a:focus-visible, select:focus-visible {
      outline: 3px solid #0284c7;
      outline-offset: 2px;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #e2e8f0;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-track {
      background: #111827;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 4px;
    }

    @media print {
      .no-print { display: none !important; }
      body { background: white !important; color: black !important; font-size: 12pt; }
      .ui-card { border: 1px solid #000 !important; box-shadow: none !important; }
    }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between antialiased selection:bg-sky-500 selection:text-white">

  <!-- Classroom Announcement Live Region for Screen Readers -->
  <div id="sr-announcements" class="sr-only" aria-live="polite" aria-atomic="true"></div>

  <!-- Accessible Header Bar -->
  <header class="border-b sticky top-0 z-50 backdrop-blur-md transition-colors projector:bg-white/95 projector:border-slate-300 dark:bg-slate-900/95 dark:border-slate-800" role="banner">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      
      <!-- Title & Branding -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-sm" aria-hidden="true">
          ⚛️
        </div>
        <div>
          <h1 class="text-base sm:text-xl font-bold tracking-tight">פיזיקה ח' עמ"ט</h1>
          <p class="text-xs text-sky-700 dark:text-sky-400 font-medium">חידון דיאגנוסטי ומעבדת תנועה (20 שאלות תקניות)</p>
        </div>
      </div>

      <!-- Center Navigation Tabs -->
      <nav class="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-950 p-1 rounded-xl border border-slate-300 dark:border-slate-800 text-sm font-semibold" aria-label="ניווט ראשי">
        <button id="nav-quiz-btn" onclick="switchTab('quiz')" class="px-3.5 py-1.5 rounded-lg transition-all text-white bg-sky-600 shadow-sm flex items-center gap-1.5" aria-current="page">
          <span>📝 החידון</span>
        </button>
        <button id="nav-lab-btn" onclick="switchTab('lab')" class="px-3.5 py-1.5 rounded-lg transition-all text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white flex items-center gap-1.5">
          <span>⏱️ מעבדת עקבות</span>
        </button>
        <button id="nav-cards-btn" onclick="switchTab('cards')" class="px-3.5 py-1.5 rounded-lg transition-all text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white flex items-center gap-1.5">
          <span>📚 מושגי יסוד</span>
        </button>
      </nav>

      <!-- Projector & Accessibility Controls Toolbar -->
      <div class="flex items-center gap-2">
        <!-- Projector Mode Toggle -->
        <button onclick="toggleProjectorMode()" id="btn-projector" class="px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all projector:bg-amber-100 projector:border-amber-400 projector:text-amber-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200" title="מעבר בין מצב מקרן בהיר למצב כהה (מקש P)" aria-label="מצב מקרן בהיר">
          <span id="projector-icon">📽️</span>
          <span id="projector-text" class="hidden md:inline">מצב מקרן: פעיל</span>
        </button>

        <!-- Font Size Scaler -->
        <div class="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-900" role="group" aria-label="הגדלת גופן למקרן">
          <button onclick="setFontScale(1)" id="font-btn-1" class="px-2 py-1 text-xs font-bold rounded bg-white dark:bg-slate-800 shadow-sm" title="גודל רגיל">א</button>
          <button onclick="setFontScale(1.2)" id="font-btn-2" class="px-2 py-1 text-sm font-bold rounded text-slate-600 dark:text-slate-400" title="מוגדל למקרן">א+</button>
          <button onclick="setFontScale(1.4)" id="font-btn-3" class="px-2 py-1 text-base font-bold rounded text-slate-600 dark:text-slate-400" title="גדול מאוד לכיתה">א++</button>
        </div>

        <!-- Audio Mute Toggle -->
        <button onclick="toggleAudio()" id="btn-audio" class="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm" title="הפעלת/השתקת צלילים (מקש M)" aria-label="צלילי משוב">
          <span id="audio-icon">🔊</span>
        </button>

        <!-- Fullscreen Button -->
        <button onclick="toggleFullscreen()" class="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm" title="מסך מלא למקרן (מקש F)" aria-label="מסך מלא">
          🖥️
        </button>
      </div>

    </div>
  </header>

  <!-- Main Content View -->
  <main class="max-w-5xl mx-auto px-4 py-6 flex-grow w-full" id="main-content">

    <!-- VIEW 1: QUIZ -->
    <section id="view-quiz" class="space-y-6" role="region" aria-label="חידון דיאגנוסטי">
      
      <!-- Welcome Screen -->
      <div id="quiz-start-screen" class="ui-card rounded-2xl p-6 sm:p-10 text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
          🎓 תוכנית הלימודים בפיזיקה - כיתה ח' עתודה מדעית טכנולוגית (עמ"ט)
        </div>

        <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
          חידון דיאגנוסטי מקיף בפיזיקה <br>
          <span class="text-sky-600 dark:text-sky-400">מבוא לפיזיקה, מדידות, רושם זמן וקינמטיקה</span>
        </h2>

        <p class="text-slate-700 dark:text-slate-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
          מבחן דיאגנוסטי אינטראקטיבי הכולל <strong>20 שאלות תקניות</strong> בפיזיקה. כל שאלה מלווה בהסבר מדעי מפורט, דיוק ביחידות SI, ניתוח שגיאות ופענוח סרטי עקבות וגרפים קינמטיים.
        </p>

        <!-- Feature Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center font-medium">
          <div class="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div class="text-2xl font-black text-sky-600 dark:text-sky-400">20</div>
            <div class="text-xs text-slate-600 dark:text-slate-400">שאלות מקיפות</div>
          </div>
          <div class="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
            <div class="text-xs text-slate-600 dark:text-slate-400">משוב והסבר מדעי</div>
          </div>
          <div class="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div class="text-2xl font-black text-amber-600 dark:text-amber-400">📽️</div>
            <div class="text-xs text-slate-600 dark:text-slate-400">מותאם למקרן כיתתי</div>
          </div>
          <div class="p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div class="text-2xl font-black text-purple-600 dark:text-purple-400">⌨️</div>
            <div class="text-xs text-slate-600 dark:text-slate-400">ניווט מקלדת נגיש</div>
          </div>
        </div>

        <!-- Mode selection (full 20 questions or quick 10) -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button onclick="startQuiz(20)" class="px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-base sm:text-lg rounded-xl shadow-md transition-all flex items-center gap-2">
            <span>התחל את החידון המלא (20 שאלות)</span>
            <span>←</span>
          </button>
          <button onclick="startQuiz(10)" class="px-6 py-3.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-base rounded-xl transition-all">
            <span>חידון מקוצר (10 שאלות)</span>
          </button>
        </div>
      </div>

      <!-- Active Quiz Interface -->
      <div id="quiz-player-screen" class="hidden space-y-5">
        
        <!-- Header status bar: Question number, Topic, Progress Bar -->
        <div class="ui-card rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <span id="question-number-badge" class="w-12 h-10 rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400 font-black flex items-center justify-center border border-sky-300 dark:border-sky-800 text-base shrink-0">
              1/20
            </span>
            <div>
              <span id="question-category-tag" class="text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                קטגוריה
              </span>
              <h3 id="question-topic-title" class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                נושא השאלה
              </h3>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full sm:w-1/3 space-y-1">
            <div class="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
              <span>התקדמות</span>
              <span id="progress-percent-label">5%</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
              <div id="quiz-progress-bar" class="bg-sky-600 h-full w-0 transition-all duration-300" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="5"></div>
            </div>
          </div>

          <!-- Speak Question Aloud (Accessibility) -->
          <button onclick="readQuestionAloud()" class="text-slate-700 dark:text-slate-300 hover:text-sky-600 text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 font-bold" title="הקרא את השאלה בקול רם">
            <span>🗣️ הקרא שאלה</span>
          </button>
        </div>

        <!-- Question Card -->
        <div class="ui-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div class="space-y-3">
            <h2 id="question-text" class="text-lg sm:text-2xl font-bold leading-relaxed text-slate-900 dark:text-white" tabindex="0">
              טוען שאלה...
            </h2>
          </div>

          <!-- Options Grid -->
          <div id="options-container" class="grid grid-cols-1 gap-3" role="radiogroup" aria-labelledby="question-text">
          </div>

          <!-- Scientific Explanation Card -->
          <div id="explanation-card" class="hidden rounded-xl p-5 border transition-all space-y-2" role="region" aria-live="polite">
            <div class="flex items-center gap-2 font-black text-base sm:text-lg" id="explanation-status">
            </div>
            <div id="explanation-text" class="text-sm sm:text-base leading-relaxed">
            </div>
          </div>

          <!-- Navigation & Shortcuts Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              💡 מקשי קיצור: <kbd class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">1-4</kbd> לבחירה | <kbd class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">Enter</kbd> לשאלה הבאה
            </div>

            <div class="flex items-center gap-3">
              <button id="prev-btn" onclick="navigateQuestion(-1)" class="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold border border-slate-300 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5">
                <span>→ קודם</span>
              </button>

              <button id="next-btn" onclick="navigateQuestion(1)" disabled class="px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold shadow disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all">
                <span>הבא ←</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      <!-- Results Summary Screen -->
      <div id="quiz-summary-screen" class="hidden space-y-6">
        <div class="ui-card rounded-2xl p-6 sm:p-10 text-center space-y-6">
          <div class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 dark:border-emerald-800 mx-auto flex items-center justify-center text-4xl">
            🏆
          </div>

          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">סיכום תוצאות - חידון דיאגנוסטי בפיזיקה ח' עמ"ט</h2>
            <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">השלמת את החידון בהצלחה!</p>
          </div>

          <div class="inline-block px-10 py-6 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div id="final-score-percent" class="text-5xl sm:text-7xl font-black text-sky-600 dark:text-sky-400">0%</div>
            <div id="final-score-details" class="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 mt-2">0 מתוך 20 תשובות נכונות</div>
          </div>

          <div id="performance-feedback-badge" class="p-4 rounded-xl max-w-xl mx-auto text-sm sm:text-base border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 font-medium">
          </div>

          <div class="flex flex-wrap justify-center gap-4 pt-2">
            <button onclick="restartQuiz()" class="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2">
              <span>🔄 בצע חידון שוב</span>
            </button>
            <button onclick="switchTab('lab')" class="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center gap-2">
              <span>⏱️ עבור למעבדת עקבות</span>
            </button>
          </div>
        </div>
      </div>

    </section>

    <!-- VIEW 2: TICKER TAPE LAB (רושם זמן) -->
    <section id="view-lab" class="hidden space-y-6" role="region" aria-label="מעבדת רושם זמן">
      <div class="ui-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <span class="text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-2.5 py-1 rounded border border-sky-300 dark:border-sky-800 inline-block">
            סימולטור פיזיקלי מונגש למקרן
          </span>
          <h2 class="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">מעבדת רושם זמן וסרטי עקבות (Ticker Tape Timer)</h2>
          <p class="text-slate-700 dark:text-slate-300 text-sm sm:text-base mt-1 leading-relaxed">
            רושם הזמן דופק על סרט נייר במרווחי זמן קבועים ($\\Delta t$). עקוב אחר פריסת הנקודות על הסרט וצפה בגרפים הקינמטיים התואמים ($x-t$ ו-$v-t$).
          </p>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div>
            <label for="sim-motion-type" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">סוג התנועה של העגלה:</label>
            <select id="sim-motion-type" onchange="updateSimulation()" class="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-700 text-sm font-semibold">
              <option value="constant-slow">תנועה קצובה איטית (v = const נמוך)</option>
              <option value="constant-fast">תנועה קצובה מהירה (v = const גבוה)</option>
              <option value="accelerating">תנועה מואצת (מהירות הולכת וגדלה)</option>
              <option value="decelerating">תנועה מאיטה (מהירות הולכת וקטנה)</option>
            </select>
          </div>

          <div>
            <label for="sim-dt" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">מרווח זמן בין דפיקות ($\\Delta t$):</label>
            <select id="sim-dt" onchange="updateSimulation()" class="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-700 text-sm font-semibold">
              <option value="0.1">0.1 שניות (תדר f = 10Hz תקני)</option>
              <option value="0.05">0.05 שניות (תדר f = 20Hz)</option>
            </select>
          </div>

          <div class="flex items-end gap-2">
            <button onclick="animateSimulation()" class="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 shadow">
              <span>▶ הפעל תנועה חיה</span>
            </button>
            <button onclick="stepSimulation()" class="py-2 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-sm transition-all" title="התקדם דפיקה אחת קדימה">
              <span>+1 דפיקה</span>
            </button>
          </div>
        </div>

        <!-- SVG Ticker Tape Container -->
        <div class="space-y-2">
          <div class="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-slate-200">
            <span>סרט הנייר של רושם הזמן:</span>
            <span class="text-xs text-sky-700 dark:text-sky-400 font-semibold" id="sim-points-count">10 נקודות רשומות</span>
          </div>
          <div class="rounded-xl p-3 border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto custom-scrollbar">
            <svg id="sim-tape-svg" width="800" height="90" viewBox="0 0 800 90" class="w-full" aria-label="סרט עקבות של רושם זמן">
            </svg>
          </div>
        </div>

        <!-- Graphs Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <h4 class="text-xs font-bold text-sky-700 dark:text-sky-400 mb-2">גרף מקום-זמן ($x-t$)</h4>
            <svg id="sim-xt-graph" viewBox="0 0 320 150" class="w-full h-44"></svg>
          </div>

          <div class="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <h4 class="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-2">גרף מהירות-זמן ($v-t$)</h4>
            <svg id="sim-vt-graph" viewBox="0 0 320 150" class="w-full h-44"></svg>
          </div>
        </div>

        <!-- Explanation card -->
        <div id="sim-explanation-box" class="p-4 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sm sm:text-base text-sky-900 dark:text-sky-200 leading-relaxed font-medium">
        </div>
      </div>
    </section>

    <!-- VIEW 3: STUDY FLASHCARDS -->
    <section id="view-cards" class="hidden space-y-6" role="region" aria-label="כרטיסיות מושגים">
      <div class="ui-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2.5 py-1 rounded border border-purple-300 dark:border-purple-800 inline-block">
              מילון מושגים ונוסחאות
            </span>
            <h2 class="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">כרטיסיות חזרה מרוכזות - פיזיקה ח' עמ"ט</h2>
            <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-1">לחצו על כרטיסייה לפתיחת ההגדרה והדוגמה המדעית המלאה.</p>
          </div>

          <!-- Quick Search -->
          <div class="w-full sm:w-64">
            <input type="text" id="cards-search-input" oninput="filterFlashcards()" placeholder="חפש מושג או נוסחה..." class="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-sky-500">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="flashcards-container">
        </div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-300 dark:border-slate-800 py-4 text-center text-xs text-slate-600 dark:text-slate-400 transition-colors">
    <div class="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
      <div>
        מערך למידה דיאגנוסטי בפיזיקה • מותאם לכיתות ח' עמ"ט ומקרן כיתתי
      </div>
      <div class="flex gap-4 font-semibold">
        <span>⌨️ נגיש למקלדת</span>
        <span>📽️ מותאם למקרן</span>
        <span>📐 דיוק מדעי תקני</span>
      </div>
    </div>
  </footer>

  <!-- DATA & SCRIPTS -->
  <script>
    const questionsData = ${questionsJson};
    const flashcardsData = ${flashcardsJson};

    let activeQuestions = [...questionsData];
    let currentQuestionIdx = 0;
    let userAnswers = [];
    let audioEnabled = true;

    // Web Audio Synthesizer
    let audioCtx = null;
    function playTone(type) {
      if (!audioEnabled) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;
        if (type === 'correct') {
          const osc1 = audioCtx.createOscillator();
          const osc2 = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc1.type = 'sine'; osc2.type = 'sine';
          osc1.frequency.setValueAtTime(523.25, now);
          osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
          osc2.frequency.setValueAtTime(783.99, now + 0.1);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc1.connect(gain); osc2.connect(gain); gain.connect(audioCtx.destination);
          osc1.start(now); osc1.stop(now + 0.2);
          osc2.start(now + 0.1); osc2.stop(now + 0.35);
        } else if (type === 'incorrect') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.25);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'click') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.start(now); osc.stop(now + 0.04);
        }
      } catch (e) {}
    }

    function toggleAudio() {
      audioEnabled = !audioEnabled;
      document.getElementById('audio-icon').innerText = audioEnabled ? '🔊' : '🔇';
      announce(audioEnabled ? 'צלילים הופעלו' : 'צלילים הושתקו');
    }

    function toggleProjectorMode() {
      const html = document.documentElement;
      if (html.classList.contains('projector')) {
        html.classList.remove('projector');
        html.classList.add('dark');
        document.getElementById('projector-icon').innerText = '🌙';
        document.getElementById('projector-text').innerText = 'מצב כהה';
        announce('הופעל מצב כהה');
      } else {
        html.classList.remove('dark');
        html.classList.add('projector');
        document.getElementById('projector-icon').innerText = '📽️';
        document.getElementById('projector-text').innerText = 'מצב מקרן: פעיל';
        announce('הופעל מצב מקרן בהיר ומודגש');
      }
    }

    function setFontScale(scale) {
      document.documentElement.style.setProperty('--font-scale', scale);
      ['1', '2', '3'].forEach(id => {
        const btn = document.getElementById('font-btn-' + id);
        if (btn) btn.className = 'px-2 py-1 text-xs font-bold rounded text-slate-600 dark:text-slate-400';
      });
      const activeId = scale === 1 ? '1' : scale === 1.2 ? '2' : '3';
      const activeBtn = document.getElementById('font-btn-' + activeId);
      if (activeBtn) activeBtn.className = 'px-2 py-1 font-bold rounded bg-white dark:bg-slate-800 shadow-sm text-sky-600 dark:text-sky-400';
      announce('גודל גופן שונה');
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }

    function announce(text) {
      const sr = document.getElementById('sr-announcements');
      if (sr) sr.innerText = text;
    }

    function switchTab(tabId) {
      playTone('click');
      ['quiz', 'lab', 'cards'].forEach(v => {
        const view = document.getElementById('view-' + v);
        const nav = document.getElementById('nav-' + v + '-btn');
        if (view) view.classList.add('hidden');
        if (nav) {
          nav.className = 'px-3.5 py-1.5 rounded-lg transition-all text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white flex items-center gap-1.5';
          nav.removeAttribute('aria-current');
        }
      });

      const activeView = document.getElementById('view-' + tabId);
      const activeNav = document.getElementById('nav-' + tabId + '-btn');
      if (activeView) activeView.classList.remove('hidden');
      if (activeNav) {
        activeNav.className = 'px-3.5 py-1.5 rounded-lg transition-all text-white bg-sky-600 shadow-sm flex items-center gap-1.5';
        activeNav.setAttribute('aria-current', 'page');
      }

      if (tabId === 'lab') updateSimulation();
      if (tabId === 'cards') renderFlashcards();
      renderMath();
    }

    function renderMath() {
      if (window.renderMathInElement) {
        window.renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
          ],
          throwOnError: false
        });
      }
    }

    // ================= QUIZ LOGIC =================
    function startQuiz(count = 20) {
      playTone('click');
      activeQuestions = questionsData.slice(0, count);
      userAnswers = Array(activeQuestions.length).fill(null);
      currentQuestionIdx = 0;

      document.getElementById('quiz-start-screen').classList.add('hidden');
      document.getElementById('quiz-summary-screen').classList.add('hidden');
      document.getElementById('quiz-player-screen').classList.remove('hidden');

      renderQuestion();
    }

    function renderQuestion() {
      const q = activeQuestions[currentQuestionIdx];
      const total = activeQuestions.length;

      document.getElementById('question-number-badge').innerText = (currentQuestionIdx + 1) + '/' + total;
      document.getElementById('question-category-tag').innerText = q.category || 'פיזיקה';
      document.getElementById('question-topic-title').innerText = q.topic;
      document.getElementById('question-text').innerText = q.text;

      const pct = Math.round(((currentQuestionIdx + 1) / total) * 100);
      document.getElementById('quiz-progress-bar').style.width = pct + '%';
      document.getElementById('quiz-progress-bar').setAttribute('aria-valuenow', pct);
      document.getElementById('progress-percent-label').innerText = pct + '%';

      const optionsContainer = document.getElementById('options-container');
      optionsContainer.innerHTML = '';

      const selected = userAnswers[currentQuestionIdx];

      q.options.forEach((optText, idx) => {
        const isSelected = selected === idx;
        const isCorrect = idx === q.correctAnswer;
        
        let cardStyle = "border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 ui-interactive";
        let statusBadge = "";

        if (selected !== null) {
          if (isCorrect) {
            cardStyle = "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 font-bold";
            statusBadge = "<span class='text-emerald-600 dark:text-emerald-400 font-bold text-sm'>✓ תשובה נכונה</span>";
          } else if (isSelected) {
            cardStyle = "border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 font-bold";
            statusBadge = "<span class='text-rose-600 dark:text-rose-400 font-bold text-sm'>✗ לא נכון</span>";
          } else {
            cardStyle = "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 opacity-50";
          }
        }

        const hebrewLetters = ['א', 'ב', 'ג', 'ד'];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'w-full text-right p-4 rounded-xl transition-all flex items-center justify-between gap-3 text-base sm:text-lg ' + cardStyle;
        btn.onclick = () => selectOption(idx);
        btn.disabled = selected !== null;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        btn.id = 'opt-btn-' + idx;

        btn.innerHTML = 
          '<div class="flex items-center gap-3.5 leading-relaxed">' +
            '<span class="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black flex items-center justify-center shrink-0 border border-slate-400 dark:border-slate-700 text-sm">' +
              hebrewLetters[idx] +
            '</span>' +
            '<span>' + optText + '</span>' +
          '</div>' +
          statusBadge;

        optionsContainer.appendChild(btn);
      });

      const expCard = document.getElementById('explanation-card');
      const nextBtn = document.getElementById('next-btn');
      const prevBtn = document.getElementById('prev-btn');

      if (selected !== null) {
        expCard.classList.remove('hidden');
        const isUserCorrect = selected === q.correctAnswer;
        if (isUserCorrect) {
          expCard.className = "rounded-xl p-5 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 space-y-1";
          document.getElementById('explanation-status').innerHTML = '<span>✓</span><span>מצוין, תשובה נכונה!</span>';
        } else {
          expCard.className = "rounded-xl p-5 border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 space-y-1";
          document.getElementById('explanation-status').innerHTML = '<span>✗</span><span>תשובה שגויה - שימו לב להסבר:</span>';
        }
        document.getElementById('explanation-text').innerText = q.explanation;
        nextBtn.disabled = false;
        nextBtn.focus();
      } else {
        expCard.classList.add('hidden');
        nextBtn.disabled = true;
      }

      prevBtn.disabled = currentQuestionIdx === 0;
      renderMath();
    }

    function selectOption(idx) {
      if (userAnswers[currentQuestionIdx] !== null) return;
      userAnswers[currentQuestionIdx] = idx;
      const q = activeQuestions[currentQuestionIdx];
      const isCorrect = idx === q.correctAnswer;
      playTone(isCorrect ? 'correct' : 'incorrect');
      announce(isCorrect ? 'נכון!' : 'שגוי.');
      renderQuestion();
    }

    function navigateQuestion(dir) {
      playTone('click');
      currentQuestionIdx += dir;
      if (currentQuestionIdx >= activeQuestions.length) {
        showResults();
      } else {
        renderQuestion();
      }
    }

    function showResults() {
      document.getElementById('quiz-player-screen').classList.add('hidden');
      document.getElementById('quiz-summary-screen').classList.remove('hidden');

      let correct = 0;
      userAnswers.forEach((ans, i) => {
        if (ans === activeQuestions[i].correctAnswer) correct++;
      });

      const pct = Math.round((correct / activeQuestions.length) * 100);
      document.getElementById('final-score-percent').innerText = pct + '%';
      document.getElementById('final-score-details').innerText = correct + ' מתוך ' + activeQuestions.length + ' תשובות נכונות';

      const feedback = document.getElementById('performance-feedback-badge');
      if (pct >= 90) {
        feedback.innerHTML = '<strong class="text-emerald-600">ציון מצטיין (90-100)!</strong> שליטה מדעית יוצאת דופן בכל מושגי היסוד, מדידות, רושם זמן וקינמטיקה.';
      } else if (pct >= 75) {
        feedback.innerHTML = '<strong class="text-sky-600">שליטה טובה מאוד (75-89)!</strong> הבנה ברורה של החומר. מומלץ לעבור על השאלות שבהן טעיתם ועל כרטיסיות המושגים.';
      } else {
        feedback.innerHTML = '<strong class="text-amber-600">מומלץ לחזק מושגים (מתחת ל-75)!</strong> חזרו לכרטיסיות החזרה ולמעבדת העקבות כדי להעמיק בנושאי שגיאות מדידה וגרפים.';
      }
      playTone('correct');
      announce('סיום החידון. הציון הסופי הוא ' + pct + ' אחוזים.');
    }

    function restartQuiz() {
      startQuiz(activeQuestions.length);
    }

    function readQuestionAloud() {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const q = activeQuestions[currentQuestionIdx];
      const textToRead = 'שאלה ' + (currentQuestionIdx + 1) + '. ' + q.topic + '. ' + q.text;
      const utt = new SpeechSynthesisUtterance(textToRead);
      utt.lang = 'he-IL';
      utt.rate = 0.95;
      window.speechSynthesis.speak(utt);
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Numbers 1-4 for options
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key) - 1;
        const btn = document.getElementById('opt-btn-' + optIdx);
        if (btn && !btn.disabled) selectOption(optIdx);
      }
      if (e.key === 'p' || e.key === 'P') toggleProjectorMode();
      if (e.key === 'm' || e.key === 'M') toggleAudio();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'Enter') {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn && !nextBtn.disabled && !document.getElementById('quiz-player-screen').classList.contains('hidden')) {
          navigateQuestion(1);
        }
      }
      if (e.key === 'ArrowRight') {
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn && !prevBtn.disabled) navigateQuestion(-1);
      }
      if (e.key === 'ArrowLeft') {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn && !nextBtn.disabled) navigateQuestion(1);
      }
    });

    // ================= LAB SIMULATOR LOGIC =================
    let simStepIndex = 0;

    function updateSimulation() {
      const motionType = document.getElementById('sim-motion-type').value;
      const svgTape = document.getElementById('sim-tape-svg');
      const expBox = document.getElementById('sim-explanation-box');

      svgTape.innerHTML = 
        '<rect x="0" y="0" width="800" height="90" fill="#f8fafc" class="projector:fill-slate-100 dark:fill-slate-900" rx="8" stroke="#cbd5e1" stroke-width="2" />' +
        '<line x1="10" y1="45" x2="790" y2="45" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6,6" />';

      let dots = [];
      let currentX = 40;

      if (motionType === 'constant-slow') {
        for (let i = 0; i < 15; i++) {
          dots.push(currentX);
          currentX += 45;
        }
        expBox.innerHTML = '<strong>תנועה קצובה איטית:</strong> המרחקים בין כל שתי נקודות עוקבות שווים בדיוק ($$\\Delta x = \\text{const}$$). זה מצביע על תנועה במהירות קבועה נמוכה ($$v = \\frac{\\Delta x}{\\Delta t}$$).';
      } else if (motionType === 'constant-fast') {
        for (let i = 0; i < 10; i++) {
          dots.push(currentX);
          currentX += 75;
        }
        expBox.innerHTML = '<strong>תנועה קצובה מהירה:</strong> המרחקים בין הנקודות שווים ביניהם, אך גדולים בהרבה מהתנועה האיטית עבור אותו פרק זמן $$\\Delta t$$. מהירות הגוף קבועה וגבוהה.';
      } else if (motionType === 'accelerating') {
        let step = 15;
        for (let i = 0; i < 11; i++) {
          dots.push(currentX);
          currentX += step;
          step += 12;
        }
        expBox.innerHTML = '<strong>תנועה מואצת:</strong> המרחק בין הנקודות העוקבות הולך וגדל ככל שהזמן עובר. מכיוון שרושם הזמן דופק בפרקי זמן קבועים ($$\\Delta t$$), מרחק גדל מעיד שהמהירות עולה ($$v$$ גדלה).';
      } else if (motionType === 'decelerating') {
        let step = 110;
        for (let i = 0; i < 10; i++) {
          dots.push(currentX);
          currentX += step;
          step = Math.max(10, step - 14);
        }
        expBox.innerHTML = '<strong>תנועה מאיטה:</strong> המרחק בין הנקודות העוקבות הולך וקטן עד שהעגלה נעצרת. הדבר מעיד על ירידה רציפה במהירות.';
      }

      document.getElementById('sim-points-count').innerText = dots.length + ' נקודות רשומות על הסרט';

      dots.forEach((x, i) => {
        if (x <= 780) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', x);
          circle.setAttribute('cy', 45);
          circle.setAttribute('r', 5.5);
          circle.setAttribute('fill', '#0284c7');
          circle.setAttribute('stroke', '#0f172a');
          circle.setAttribute('stroke-width', '1.5');
          svgTape.appendChild(circle);

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', x);
          text.setAttribute('y', 72);
          text.setAttribute('fill', '#475569');
          text.setAttribute('font-size', '11');
          text.setAttribute('font-weight', 'bold');
          text.setAttribute('text-anchor', 'middle');
          text.textContent = 't' + i;
          svgTape.appendChild(text);
        }
      });

      renderGraphs(motionType);
      renderMath();
    }

    function renderGraphs(type) {
      const xt = document.getElementById('sim-xt-graph');
      const vt = document.getElementById('sim-vt-graph');

      const baseSvg = (path, color, labelY) => 
        '<line x1="40" y1="120" x2="300" y2="120" stroke="#64748b" stroke-width="2" />' +
        '<line x1="40" y1="20" x2="40" y2="120" stroke="#64748b" stroke-width="2" />' +
        '<text x="300" y="135" fill="#64748b" font-size="11" font-weight="bold">t [s]</text>' +
        '<text x="15" y="25" fill="#64748b" font-size="11" font-weight="bold">' + labelY + '</text>' +
        '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="3.5" stroke-linecap="round" />';

      if (type === 'constant-slow') {
        xt.innerHTML = baseSvg("M 40 115 L 290 65", "#0284c7", "x [m]");
        vt.innerHTML = baseSvg("M 40 85 L 290 85", "#4f46e5", "v [m/s]");
      } else if (type === 'constant-fast') {
        xt.innerHTML = baseSvg("M 40 115 L 290 25", "#0284c7", "x [m]");
        vt.innerHTML = baseSvg("M 40 45 L 290 45", "#4f46e5", "v [m/s]");
      } else if (type === 'accelerating') {
        xt.innerHTML = baseSvg("M 40 115 Q 160 110 290 20", "#0284c7", "x [m]");
        vt.innerHTML = baseSvg("M 40 115 L 290 25", "#4f46e5", "v [m/s]");
      } else if (type === 'decelerating') {
        xt.innerHTML = baseSvg("M 40 115 Q 180 30 290 30", "#0284c7", "x [m]");
        vt.innerHTML = baseSvg("M 40 25 L 290 115", "#4f46e5", "v [m/s]");
      }
    }

    function animateSimulation() {
      playTone('click');
      updateSimulation();
    }

    function stepSimulation() {
      playTone('click');
      updateSimulation();
    }

    // ================= FLASHCARDS LOGIC =================
    function renderFlashcards(filter = '') {
      const container = document.getElementById('flashcards-container');
      container.innerHTML = '';

      const filtered = flashcardsData.filter(c => 
        c.title.includes(filter) || c.definition.includes(filter) || (c.formula && c.formula.includes(filter))
      );

      filtered.forEach((c) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'ui-card rounded-xl p-5 cursor-pointer space-y-3 transition-all ui-interactive border-2 border-slate-300 dark:border-slate-800';
        cardEl.tabIndex = 0;
        cardEl.onclick = () => {
          playTone('click');
          const body = cardEl.querySelector('.card-details');
          body.classList.toggle('hidden');
        };
        cardEl.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            cardEl.click();
          }
        };

        let formulaHtml = c.formula ? '<div class="text-sm font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 p-2 rounded-lg border border-sky-200 dark:border-sky-800 text-center">$$' + c.formula + '$$</div>' : '';

        cardEl.innerHTML = 
          '<div class="flex items-center justify-between">' +
            '<div>' +
              '<span class="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">' + c.category + '</span>' +
              '<h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-1">' + c.title + '</h3>' +
            '</div>' +
            '<span class="text-slate-400 text-xs font-bold">לחצו להרחבה ▼</span>' +
          '</div>' +
          '<div class="card-details hidden space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">' +
            formulaHtml +
            '<p class="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300"><strong>הגדרה:</strong> ' + c.definition + '</p>' +
            '<p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">💡 <strong>דוגמה:</strong> ' + c.example + '</p>' +
          '</div>';

        container.appendChild(cardEl);
      });

      renderMath();
    }

    function filterFlashcards() {
      const val = document.getElementById('cards-search-input').value.trim();
      renderFlashcards(val);
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
      updateSimulation();
      renderFlashcards();
      renderMath();
    });
  </script>
</body>
</html>`;
}
