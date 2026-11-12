import React, { useState } from 'react';
import {
  Moon,
  Clock,
  Sparkles,
  ShieldCheck,
  Coffee,
  Sun,
  Flame,
  Zap,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  SleepRecommendation,
  SleepLog,
  PhysicalActivity,
  UserProfile,
  DashboardSettings,
} from '../../types/wellness';
import { calculateSleepRecommendation, formatFriendlyDate } from '../../utils/wellnessCalculations';

interface SleepViewProps {
  user: UserProfile;
  sleepPlan: SleepRecommendation;
  sleepLogs: SleepLog[];
  activities: PhysicalActivity[];
  settings: DashboardSettings;
  onOpenLogSleep: () => void;
  onDeleteSleep: (id: string) => void;
  onUpdateSleepPlan: (updatedPlan: SleepRecommendation) => void;
}

export const SleepView: React.FC<SleepViewProps> = ({
  user,
  sleepPlan,
  sleepLogs,
  activities,
  settings,
  onOpenLogSleep,
  onDeleteSleep,
  onUpdateSleepPlan,
}) => {
  const [preferredWakeTime, setPreferredWakeTime] = useState<string>(sleepPlan.idealWakeTime || '06:30');

  // Recalculate plan when wake time is adjusted
  const handleWakeTimeChange = (newWakeTime: string) => {
    setPreferredWakeTime(newWakeTime);
    const updated = calculateSleepRecommendation(user, activities, newWakeTime);
    onUpdateSleepPlan(updated);
  };

  const latestSleep = sleepLogs[0];
  const avgSleepHours =
    sleepLogs.length > 0
      ? (sleepLogs.reduce((sum, s) => sum + s.durationHours, 0) / sleepLogs.length).toFixed(1)
      : '7.6';

  const totalBurn = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const totalMinutes = activities.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Top Circadian Sleep Recommendation Hero */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Circadian Rhythm & Neuro-Endocrine Optimization</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Recommended Tonight: {sleepPlan.targetDurationHours} hrs (Bedtime at {sleepPlan.idealBedtime})
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {sleepPlan.circadianAdvice}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span>Caffeine Curfew: <strong className="text-amber-400">{sleepPlan.caffeineCurfew}</strong></span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recovery Score: <strong className="text-emerald-400">{sleepPlan.recoveryScoreEstimate}/100</strong></span>
              </span>
            </div>
          </div>

          {/* Interactive Bedtime & Wake Time Tuner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 shrink-0 space-y-3 min-w-[280px]">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interactive Sleep Tuner</span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Your Target Wake Time:</label>
              <input
                type="time"
                value={preferredWakeTime}
                onChange={(e) => handleWakeTimeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-center">
              <span className="text-[10px] text-slate-400 block">Computed Ideal Bedtime</span>
              <span className="text-xl font-black text-indigo-300">{sleepPlan.idealBedtime}</span>
              <span className="text-[10px] text-slate-500 block">Includes 15 min sleep latency buffer</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Sleep Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Last Night Duration</span>
          <div className="text-2xl font-black text-white">
            {latestSleep ? `${latestSleep.durationHours} hrs` : '7.8 hrs'}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">96% of recommended</span>
        </div>

        <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Deep Slow-Wave Sleep</span>
          <div className="text-2xl font-black text-indigo-400">
            {latestSleep ? `${latestSleep.deepSleepMinutes} min` : '112 min'}
          </div>
          <span className="text-[11px] text-slate-400">Growth hormone release</span>
        </div>

        <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">REM Dream Sleep</span>
          <div className="text-2xl font-black text-sky-400">
            {latestSleep ? `${latestSleep.remSleepMinutes} min` : '104 min'}
          </div>
          <span className="text-[11px] text-slate-400">Memory consolidation</span>
        </div>

        <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Restfulness Index</span>
          <div className="text-2xl font-black text-emerald-400">
            {latestSleep ? `${latestSleep.restfulnessScore}/100` : '91/100'}
          </div>
          <span className="text-[11px] text-slate-400">Low nocturnal awakenings</span>
        </div>
      </div>

      {/* 3. Step-by-Step Circadian Wind-Down Protocol */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Circadian Wind-Down Protocol for Peak Physiological Recovery</span>
          </h3>
          <p className="text-xs text-slate-400">
            Follow this chronological sequence to trigger the brain's natural melatonin surge and lower core temperature
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sleepPlan.windDownProtocol.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{item.step}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Phase {idx + 1} Habit</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Logged Sleep History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Logged Sleep Sessions & Architecture</span>
            </h3>
            <p className="text-xs text-slate-400">Historical sleep duration and recovery score logs</p>
          </div>

          <button
            type="button"
            onClick={onOpenLogSleep}
            className="px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Log Night's Sleep</span>
          </button>
        </div>

        <div className="space-y-3">
          {sleepLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {log.durationHours} hrs ({log.bedtime} → {log.wakeTime})
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      Score: {log.restfulnessScore}/100
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>Deep: {log.deepSleepMinutes}m</span>
                    <span>•</span>
                    <span>REM: {log.remSleepMinutes}m</span>
                    <span>•</span>
                    <span>Awakenings: {log.awakeningsCount}</span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-slate-300 mt-1.5 italic">"{log.notes}"</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs text-slate-500">{formatFriendlyDate(log.date)}</span>
                <button
                  type="button"
                  onClick={() => onDeleteSleep(log.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
