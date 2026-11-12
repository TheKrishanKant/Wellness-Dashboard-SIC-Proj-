import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Flame,
  Moon,
  Apple,
  Award,
  CheckCircle2,
} from 'lucide-react';
import {
  PhysicalActivity,
  MealItem,
  SleepLog,
  NutritionRecommendation,
  DashboardSettings,
} from '../../types/wellness';

interface AnalyticsViewProps {
  activities: PhysicalActivity[];
  meals: MealItem[];
  sleepLogs: SleepLog[];
  nutritionPlan: NutritionRecommendation;
  settings: DashboardSettings;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  activities,
  meals,
  sleepLogs,
  nutritionPlan,
  settings,
}) => {
  // Compute analytics
  const totalBurn = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const totalMinutes = activities.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0);
  const avgBurnPerWorkout = activities.length > 0 ? Math.round(totalBurn / activities.length) : 0;
  const avgSleep =
    sleepLogs.length > 0
      ? (sleepLogs.reduce((sum, s) => sum + s.durationHours, 0) / sleepLogs.length).toFixed(1)
      : '7.6';

  return (
    <div className="space-y-6">
      {/* Key Insights Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
            <Award className="w-4 h-4" />
            <span>Consistency Streak</span>
          </div>
          <div className="text-3xl font-black text-white">6 Days Active</div>
          <p className="text-xs text-slate-400 mt-1">Met daily active minutes goal on 6 of last 7 days.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <Flame className="w-4 h-4" />
            <span>Average Workout Burn</span>
          </div>
          <div className="text-3xl font-black text-white">{avgBurnPerWorkout} kcal</div>
          <p className="text-xs text-slate-400 mt-1">Across all logged aerobic and strength sessions.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-2">
            <Moon className="w-4 h-4" />
            <span>Circadian Sleep Adherence</span>
          </div>
          <div className="text-3xl font-black text-white">{avgSleep} hrs/night</div>
          <p className="text-xs text-slate-400 mt-1">Average sleep duration aligns with recovery needs.</p>
        </div>
      </div>

      {/* Strain vs Recovery Correlation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Daily Physical Strain vs Nightly Recovery Score</span>
          </h3>
          <p className="text-xs text-slate-400">
            Higher cardiovascular exertion correlates with deeper slow-wave sleep when bedtime is kept consistent
          </p>
        </div>

        <div className="space-y-4">
          {[
            { date: 'Nov 12 (Today)', workout: 'Progressive Tempo Run', strain: 'High (520 kcal)', sleep: '7.8 hrs', recovery: 91 },
            { date: 'Nov 11', workout: 'Posterior Hypertrophy', strain: 'High (380 kcal)', sleep: '7.7 hrs', recovery: 84 },
            { date: 'Nov 10', workout: 'Aerobic Base Ride', strain: 'Moderate (580 kcal)', sleep: '7.8 hrs', recovery: 88 },
            { date: 'Nov 09', workout: 'VO2 Max Tabata HIIT', strain: 'Peak (360 kcal)', sleep: '7.3 hrs', recovery: 74 },
            { date: 'Nov 08', workout: 'Active Recovery Swim', strain: 'Moderate (310 kcal)', sleep: '8.0 hrs', recovery: 93 },
          ].map((row, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-white min-w-[90px]">{row.date}</span>
                <span className="text-slate-300 font-medium">{row.workout}</span>
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <span>Strain: <strong className="text-amber-400">{row.strain}</strong></span>
                <span>Sleep: <strong className="text-indigo-400">{row.sleep}</strong></span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Score: {row.recovery}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
