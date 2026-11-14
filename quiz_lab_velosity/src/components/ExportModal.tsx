import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Globe, HardDrive, Sparkles } from 'lucide-react';
import { generateStandaloneHtml } from '../utils/generateStandaloneHtml';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const standaloneCode = React.useMemo(() => generateStandaloneHtml(), []);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(standaloneCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = standaloneCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([standaloneCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'physics-grade-8-quiz.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-sm">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-lg font-bold">
                ייצוא והעתקה כקובץ HTML עצמאי
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                קובץ יחיד (Single-File) מלא הפועל מקומית בכל מחשב או ברשת ללא שום התקנה
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="סגור חלון"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
          
          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50 dark:bg-sky-950/30 flex items-start gap-3">
              <HardDrive className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sky-900 dark:text-sky-300 font-bold">הרצה מקומית מלאה</strong>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  שמרו את הקובץ במחשב (Disk-on-Key / שולחן עבודה), לחצו לחיצה כפולה וזה פועל מיד בכל דפדפן (Chrome, Edge).
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/30 flex items-start gap-3">
              <Globe className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-indigo-900 dark:text-indigo-300 font-bold">פרסום קל כאתר אינטרנט</strong>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  ניתן להעלות את הקובץ ישירות כ-<code>index.html</code> ל-GitHub Pages, שרת בית הספר או Google Drive.
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'קוד ה-HTML הועתק ללוח!' : 'העתק את כל קוד ה-HTML ללוח'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-3 px-5 rounded-xl font-bold text-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>הורד קובץ HTML למחשב</span>
            </button>
          </div>

          {/* Code Preview Box */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>תצוגה מקדימה של הקוד (כולל את 20 השאלות, הסימולטור והכרטיסיות):</span>
              <span>{(standaloneCode.length / 1024).toFixed(1)} KB</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs max-h-48 overflow-y-auto border border-slate-800 select-all" dir="ltr">
              <pre>{standaloneCode.slice(0, 1500)}...</pre>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="rounded-xl p-4 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>מה שופר בקוד עבור כיתה ח' והמקרן הכיתתי?</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pr-1">
              <li><strong>תיקון שגיאות כתיבה ומינוח מדעי:</strong> כתיב תקני, נוסחאות פיזיקליות מדויקות, וניסוח שאלות המותאם בדיוק לתוכנית הלימודים בפיזיקה ח' עמ"ט.</li>
              <li><strong>השלמת 20 שאלות מלאות:</strong> מגוון רחב המכסה גוף ותופעה, שגיאות, מדידות, רושם זמן, המרות וגרפים קינמטיים.</li>
              <li><strong>מצב מקרן ייעודי (Projector Mode):</strong> ניגודיות גבוהה (שחור על לבן צח), גופנים מוגדלים ומסגרות עבות הנראות בבירור גם מסוף הכיתה.</li>
              <li><strong>נגישות מלאה:</strong> תמיכה מלאה במקלדת (1-4, Enter, חיצים), תמיכה בקוראי מסך, ואפשרות הקראה קולית של השאלות.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            סגור
          </button>
        </div>

      </div>
    </div>
  );
};
