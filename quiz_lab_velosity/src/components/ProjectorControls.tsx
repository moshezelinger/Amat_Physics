import React from 'react';
import { Projector, Sun, Moon, Volume2, VolumeX, Maximize2, Minimize2, Download, Code } from 'lucide-react';
import { AppSettings, FontSizeLevel } from '../types';

interface ProjectorControlsProps {
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenExport: () => void;
}

export const ProjectorControls: React.FC<ProjectorControlsProps> = ({
  settings,
  onUpdateSettings,
  isFullscreen,
  onToggleFullscreen,
  onOpenExport,
}) => {
  const fontSizes: { level: FontSizeLevel; label: string; tooltip: string }[] = [
    { level: 'normal', label: 'א', tooltip: 'גודל רגיל' },
    { level: 'large', label: 'א+', tooltip: 'גופן מוגדל (מומלץ למקרן כיתתי)' },
    { level: 'xlarge', label: 'א++', tooltip: 'גופן ענק לכיתה גדולה' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="הגדרות תצוגה והנגשה למקרן">
      {/* Projector Mode Toggle */}
      <button
        onClick={() => onUpdateSettings({ projectorMode: !settings.projectorMode })}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sky-500 ${
          settings.projectorMode
            ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm'
            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
        }`}
        title="מעבר בין מצב מקרן בהיר ומודגש למצב כהה (קיצור: P)"
        aria-pressed={settings.projectorMode}
      >
        <Projector className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span>{settings.projectorMode ? 'מצב מקרן (בהיר)' : 'מצב כהה'}</span>
        {settings.projectorMode ? (
          <Sun className="w-3.5 h-3.5 text-amber-600" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {/* Font Scaling Buttons */}
      <div
        className="inline-flex rounded-xl border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-900"
        role="group"
        aria-label="התאמת גודל גופן"
      >
        {fontSizes.map((f) => {
          const isActive = settings.fontSize === f.level;
          return (
            <button
              key={f.level}
              onClick={() => onUpdateSettings({ fontSize: f.level })}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={f.tooltip}
              aria-label={f.tooltip}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Audio Sound Toggle */}
      <button
        onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
        className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        title={settings.soundEnabled ? 'השתק צלילי משוב (קיצור: M)' : 'הפעל צלילי משוב (קיצור: M)'}
        aria-label={settings.soundEnabled ? 'השתק צלילים' : 'הפעל צלילים'}
      >
        {settings.soundEnabled ? (
          <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={onToggleFullscreen}
        className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        title={isFullscreen ? 'צא ממסך מלא (קיצור: F)' : 'מסך מלא למקרן (קיצור: F)'}
        aria-label="מסך מלא"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Single-File HTML Exporter Button */}
      <button
        onClick={onOpenExport}
        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sky-400"
        title="העתק או הורד כקובץ HTML יחיד ועצמאי"
      >
        <Code className="w-3.5 h-3.5" />
        <span>ייצוא HTML יחיד</span>
        <Download className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
