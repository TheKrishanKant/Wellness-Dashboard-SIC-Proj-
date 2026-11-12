import React, { useState } from 'react';
import { X, Moon, Clock, Star } from 'lucide-react';
import { SleepLog } from '../../types/wellness';

interface LogSleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSleep: (sleep: SleepLog) => void;
}

export const LogSleepModal: React.FC<LogSleepModalProps> = ({
  isOpen,
  onClose,
  onSaveSleep,
}) => {
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:45');
  const [durationHours, setDurationHours] = useState(8.25);
  const [qualityRating, setQualityRating] = useState(5);
  const [deepSleepMinutes, setDeepSleepMinutes] = useState(110);
  const [remSleepMinutes, setRemSleepMinutes] = useState(105);
  const [awakeningsCount, setAwakeningsCount] = useState(1);
  const [notes, setNotes] = useState('Woke up refreshed and ready for morning tempo session.');

  if (!isOpen) return null;

  // Auto-calculate duration from bedtime and wakeTime
  const handleTimeChange = (newBed: string, newWake: string) => {
    setBedtime(newBed);
    setWakeTime(newWake);

    const [bH, bM] = newBed.split(':').map(Number);
    const [wH, wM] = newWake.split(':').map(Number);
    let diffMinutes = wH * 60 + wM - (bH * 60 + bM);
    if (diffMinutes < 0) diffMinutes += 1440; // overnight wrap
    const hours = Number((diffMinutes / 60).toFixed(2));
    setDurationHours(hours);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Compute restfulness score based on quality, deep sleep, and awakenings
    const score = Math.min(
      100,
      Math.max(
        50,
        Math.round(qualityRating * 16 + (deepSleepMinutes / 120) * 15 - awakeningsCount * 4)
      )
    );

    const newLog: SleepLog = {
      id: `sleep_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      bedtime,
      wakeTime,
      durationHours: Number(durationHours) || 8.0,
      qualityRating,
      deepSleepMinutes: Number(deepSleepMinutes) || 90,
      remSleepMinutes: Number(remSleepMinutes) || 90,
      awakeningsCount: Number(awakeningsCount) || 0,
      restfulnessScore: score,
      notes: notes.trim(),
    };

    onSaveSleep(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Sleep Session</h3>
              <p className="text-xs text-slate-400">Record last night's rest & recovery phases</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bedtime</label>
              <input
                type="time"
                required
                value={bedtime}
                onChange={(e) => handleTimeChange(e.target.value, wakeTime)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Wake Time</label>
              <input
                type="time"
                required
                value={wakeTime}
                onChange={(e) => handleTimeChange(bedtime, e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Calculated Sleep Duration:</span>
            <span className="text-base font-bold text-indigo-300">{durationHours} hours</span>
          </div>

          {/* Quality Rating Stars */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Subjective Sleep Quality
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setQualityRating(star)}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 text-amber-400 transition-colors cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= qualityRating ? 'fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-400 ml-2">
                {qualityRating === 5
                  ? 'Excellent'
                  : qualityRating === 4
                  ? 'Good'
                  : qualityRating === 3
                  ? 'Fair'
                  : 'Poor'}
              </span>
            </div>
          </div>

          {/* Deep and REM sleep */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Deep Sleep (mins)</label>
              <input
                type="number"
                min="0"
                value={deepSleepMinutes}
                onChange={(e) => setDeepSleepMinutes(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">REM Sleep (mins)</label>
              <input
                type="number"
                min="0"
                value={remSleepMinutes}
                onChange={(e) => setRemSleepMinutes(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nightly Awakenings</label>
            <input
              type="number"
              min="0"
              max="20"
              value={awakeningsCount}
              onChange={(e) => setAwakeningsCount(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Sleep Notes & Observations</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Magnesium taken, room kept at 66F, woke up refreshed..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer"
            >
              Save Sleep Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
