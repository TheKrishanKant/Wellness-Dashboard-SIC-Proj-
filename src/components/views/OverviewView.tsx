import React from 'react';
import {
  Activity,
  Flame,
  Footprints,
  Moon,
  Droplet,
  Apple,
  Sparkles,
  ArrowRight,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  ShieldAlert,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  UserProfile,
  PhysicalActivity,
  MealItem,
  SleepLog,
  DashboardSettings,
  NutritionRecommendation,
  SleepRecommendation,
  NavTab,
} from '../../types/wellness';

interface OverviewViewProps {
  user: UserProfile;
  settings: DashboardSettings;
  activities: PhysicalActivity[];
  meals: MealItem[];
  sleepLogs: SleepLog[];
  nutritionPlan: NutritionRecommendation;
  sleepPlan: SleepRecommendation;
  waterLoggedMl: number;
  onNavigateTab: (tab: NavTab) => void;
  onOpenLogActivity: () => void;
  onOpenLogMeal: () => void;
  onOpenLogSleep: () => void;
  onAddWater: (amountMl: number) => void;
  onRefreshAI: () => void;
  isAiLoading: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  settings,
  activities,
  meals,
  sleepLogs,
  nutritionPlan,
  sleepPlan,
  waterLoggedMl,
  onNavigateTab,
  onOpenLogActivity,
  onOpenLogMeal,
  onOpenLogSleep,
  onAddWater,
  onRefreshAI,
  isAiLoading,
}) => {
  const { visibleWidgets, targets, units } = settings;

  // Filter today's activities (defaults to latest date or today)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter((a) => a.date === todayStr || a.date === '2026-11-12');
  const todayMeals = meals.filter((m) => m.date === todayStr || m.date === '2026-11-12');
  const latestSleep = sleepLogs[0];

  const totalCaloriesBurned = todayActivities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const totalActiveMinutes = todayActivities.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0);

  // Approximate steps from activities (running ~1200 steps/km, walking ~1350/km, other ~100/min)
  const estimatedSteps = todayActivities.reduce((sum, a) => {
    if (a.distanceKm) {
      return sum + Math.round(a.distanceKm * (a.activityType === 'running' ? 1200 : 1350));
    }
    return sum + a.durationMinutes * 95;
  }, 4200);

  // Meal totals
  const totalCaloriesConsumed = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProteinConsumed = todayMeals.reduce((sum, m) => sum + m.proteinG, 0);
  const totalCarbsConsumed = todayMeals.reduce((sum, m) => sum + m.carbsG, 0);
  const totalFatsConsumed = todayMeals.reduce((sum, m) => sum + m.fatsG, 0);

  // Percentages towards goals
  const calBurnPct = Math.min(100, Math.round((totalCaloriesBurned / (targets.caloriesBurned || 600)) * 100));
  const stepsPct = Math.min(100, Math.round((estimatedSteps / (targets.steps || 10000)) * 100));
  const waterPct = Math.min(100, Math.round((waterLoggedMl / (targets.waterMilliliters || 3000)) * 100));
  const sleepPct = Math.min(
    100,
    Math.round(((latestSleep?.durationHours || 7.5) / (targets.sleepHours || 8.0)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* 1. Quick Metrics Cards */}
      {visibleWidgets.quickMetrics && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Active Calorie Burn */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all shadow-sm group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Active Calories Burned</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{totalCaloriesBurned}</span>
              <span className="text-xs text-slate-400">/ {targets.caloriesBurned} kcal</span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${calBurnPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400">
                <span>{calBurnPct}% of daily burn goal</span>
                <span className="text-amber-400 font-semibold">{totalActiveMinutes} mins active</span>
              </div>
            </div>
          </div>

          {/* Card: Estimated Steps & Distance */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all shadow-sm group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Daily Steps & Motion</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Footprints className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{estimatedSteps.toLocaleString()}</span>
              <span className="text-xs text-slate-400">/ {targets.steps.toLocaleString()}</span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${stepsPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400">
                <span>{stepsPct}% completed</span>
                <span className="text-emerald-400 font-semibold">
                  {units === 'imperial'
                    ? `${(estimatedSteps * 0.00045).toFixed(1)} miles`
                    : `${(estimatedSteps * 0.00075).toFixed(1)} km`}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Sleep Duration & Quality */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all shadow-sm group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Sleep & Restoration</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <Moon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">
                {latestSleep ? `${latestSleep.durationHours}h` : '7.5h'}
              </span>
              <span className="text-xs text-slate-400">
                / {sleepPlan.targetDurationHours}h recommended
              </span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${sleepPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400">
                <span>Score: {latestSleep?.restfulnessScore || 88}/100</span>
                <span className="text-indigo-400 font-semibold">Bed: {sleepPlan.idealBedtime}</span>
              </div>
            </div>
          </div>

          {/* Card: Hydration Balance */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all shadow-sm group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Hydration Volume</span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                <Droplet className="w-4 h-4 fill-sky-400/30" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">
                {(waterLoggedMl / 1000).toFixed(1)}L
              </span>
              <span className="text-xs text-slate-400">/ {nutritionPlan.hydrationLiters}L target</span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${waterPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400">
                <span>{waterPct}% met</span>
                <button
                  type="button"
                  onClick={() => onAddWater(250)}
                  className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2"
                >
                  +250ml
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. AI Wellness Coach Callout Banner */}
      {visibleWidgets.aiWellnessCoach && (
        <section className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 p-5 sm:p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gemini Health Intelligence Analysis</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Dynamic Nutrition & Circadian Sleep Strategy
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {nutritionPlan.explanation}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onRefreshAI}
                disabled={isAiLoading}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${isAiLoading ? 'animate-spin' : ''}`} />
                <span>{isAiLoading ? 'Analyzing...' : 'Re-calculate AI Plan'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('nutrition')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Nutrition Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. Middle Grid: Activity Trends & Nutrition/Sleep Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Activity Trend & Recent Workouts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Activity Trend Chart */}
          {visibleWidgets.activityTrend && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Weekly Physical Activity & Calorie Strain</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Daily caloric expenditure across recent workout sessions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('activity')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>All Activities</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Visual mini bar chart representation */}
              <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 px-2 border-b border-slate-800/80">
                {[
                  { day: 'Fri', cal: 310, mins: 40, label: 'Swim' },
                  { day: 'Sat', cal: 360, mins: 30, label: 'HIIT' },
                  { day: 'Sun', cal: 580, mins: 70, label: 'Cycle' },
                  { day: 'Mon', cal: 380, mins: 55, label: 'Strength' },
                  { day: 'Tue', cal: 110, mins: 25, label: 'Yoga' },
                  { day: 'Wed', cal: 520, mins: 48, label: 'Run' },
                  { day: 'Today', cal: totalCaloriesBurned || 630, mins: totalActiveMinutes || 73, label: 'Active', isToday: true },
                ].map((item, idx) => {
                  const maxCal = 700;
                  const heightPercent = Math.min(100, Math.max(15, Math.round((item.cal / maxCal) * 100)));
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap">
                        {item.cal} kcal
                      </div>
                      <div
                        className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${
                          item.isToday
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          item.isToday ? 'text-emerald-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-slate-400 px-1">
                <span>Avg Daily Burn: 410 kcal</span>
                <span className="text-emerald-400 font-medium">Optimal Aerobic Base Maintained</span>
              </div>
            </div>
          )}

          {/* Recent Workouts Logged */}
          {visibleWidgets.recentWorkouts && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Recent Physical Activities</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Latest logged workout metrics & physiological load
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenLogActivity}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Workout</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {activities.slice(0, 3).map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{act.title}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                              act.intensityZone === 'peak'
                                ? 'bg-red-500/20 text-red-400'
                                : act.intensityZone === 'high'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {act.intensityZone} intensity
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{act.notes}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <div className="font-bold text-slate-200">{act.caloriesBurned} kcal</div>
                        <div className="text-slate-500">{act.durationMinutes} mins</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">{act.avgHeartRate} bpm</div>
                        <div className="text-slate-500">Avg Heart Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Heart Rate Strain Zones */}
          {visibleWidgets.heartRateStrain && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Cardiovascular Intensity & Strain Zones</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Time spent in aerobic vs anaerobic thresholds today (Target Max HR: 192 bpm)
              </p>

              <div className="space-y-3">
                {[
                  { name: 'Zone 5: Neuromuscular / Peak (>172 bpm)', minutes: 12, pct: 16, color: 'bg-rose-500' },
                  { name: 'Zone 4: Anaerobic Threshold (153-172 bpm)', minutes: 26, pct: 36, color: 'bg-amber-500' },
                  { name: 'Zone 3: Aerobic Capacity (134-153 bpm)', minutes: 20, pct: 28, color: 'bg-emerald-500' },
                  { name: 'Zone 2: Endurance Base & Fat Max (115-134 bpm)', minutes: 15, pct: 20, color: 'bg-sky-500' },
                ].map((zone, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{zone.name}</span>
                      <span className="text-slate-400 font-semibold">{zone.minutes} mins</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`${zone.color} h-1.5 rounded-full`}
                        style={{ width: `${zone.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Nutrition Progress, Sleep Card, Hydration */}
        <div className="lg:col-span-4 space-y-6">
          {/* Nutrition & Daily Macro Needs */}
          {visibleWidgets.nutritionMacros && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Apple className="w-4 h-4 text-emerald-400" />
                  <span>Activity-Tuned Nutrition</span>
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigateTab('nutrition')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Details
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-slate-400">Calories Consumed</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {totalCaloriesConsumed} / {nutritionPlan.dailyCalories} kcal
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((totalCaloriesConsumed / nutritionPlan.dailyCalories) * 100)
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Burn from activity (+{totalCaloriesBurned} kcal) factored into today's target.
                </div>
              </div>

              {/* Macro Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Protein (Tissue Repair)</span>
                    <span className="text-emerald-400 font-bold">
                      {totalProteinConsumed}g / {nutritionPlan.macros.proteinGrams}g
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((totalProteinConsumed / nutritionPlan.macros.proteinGrams) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Carbohydrates (Glycogen)</span>
                    <span className="text-amber-400 font-bold">
                      {totalCarbsConsumed}g / {nutritionPlan.macros.carbsGrams}g
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((totalCarbsConsumed / nutritionPlan.macros.carbsGrams) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Healthy Fats (Hormones)</span>
                    <span className="text-indigo-400 font-bold">
                      {totalFatsConsumed}g / {nutritionPlan.macros.fatsGrams}g
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-400 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((totalFatsConsumed / nutritionPlan.macros.fatsGrams) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenLogMeal}
                className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Food or Meal</span>
              </button>
            </div>
          )}

          {/* Sleep & Circadian Recommendation Card */}
          {visibleWidgets.sleepRecovery && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Tonight's Sleep Window</span>
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigateTab('sleep')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Protocol
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 mb-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-900/60">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Recommended Bedtime</div>
                    <div className="text-base font-extrabold text-indigo-300 mt-0.5">
                      {sleepPlan.idealBedtime}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Target Duration</div>
                    <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                      {sleepPlan.targetDurationHours} hrs
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 mt-2.5 leading-snug">
                  {sleepPlan.circadianAdvice}
                </p>
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Caffeine Curfew:</span>
                <span className="font-semibold text-amber-400">{sleepPlan.caffeineCurfew}</span>
              </div>

              <button
                type="button"
                onClick={onOpenLogSleep}
                className="w-full mt-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>+ Log Sleep Session</span>
              </button>
            </div>
          )}

          {/* Hydration Interactive Tracker */}
          {visibleWidgets.hydrationTracker && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-sky-400" />
                  <span>Hydration Rapid Logger</span>
                </h3>
                <span className="text-xs text-sky-400 font-semibold">
                  {waterLoggedMl} / {nutritionPlan.hydrationLiters * 1000} ml
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onAddWater(250)}
                  className="py-2.5 px-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  +250 ml
                  <span className="block text-[10px] font-normal text-slate-400">Glass</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddWater(500)}
                  className="py-2.5 px-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  +500 ml
                  <span className="block text-[10px] font-normal text-slate-400">Bottle</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddWater(750)}
                  className="py-2.5 px-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  +750 ml
                  <span className="block text-[10px] font-normal text-slate-400">Flask</span>
                </button>
              </div>
            </div>
          )}

          {/* Daily Habit Checklist */}
          {visibleWidgets.dailyChecklist && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Daily Recovery Checklist</span>
              </h3>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 cursor-pointer hover:bg-slate-950 transition-colors">
                  <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                  <span className="text-slate-300">Morning sunlight exposure (15 mins)</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 cursor-pointer hover:bg-slate-950 transition-colors">
                  <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                  <span className="text-slate-300">Primary workout logged with HR zones</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 cursor-pointer hover:bg-slate-950 transition-colors">
                  <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                  <span className="text-slate-300">Post-exercise protein replenishment</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 cursor-pointer hover:bg-slate-950 transition-colors">
                  <input type="checkbox" className="rounded accent-emerald-500" />
                  <span className="text-slate-300">Blue-light curfew activated at 21:00</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
