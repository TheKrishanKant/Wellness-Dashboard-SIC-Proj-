import React, { useState } from 'react';
import {
  Apple,
  Flame,
  Droplet,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  NutritionRecommendation,
  MealItem,
  PhysicalActivity,
  UserProfile,
  DashboardSettings,
} from '../../types/wellness';

interface NutritionViewProps {
  user: UserProfile;
  nutritionPlan: NutritionRecommendation;
  meals: MealItem[];
  activities: PhysicalActivity[];
  settings: DashboardSettings;
  waterLoggedMl: number;
  onOpenLogMeal: () => void;
  onDeleteMeal: (id: string) => void;
  onAddWater: (amountMl: number) => void;
  onRefreshAI: () => void;
  onAddSuggestedMeal: (suggestion: { name: string; calories: number }) => void;
  isAiLoading: boolean;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  user,
  nutritionPlan,
  meals,
  activities,
  settings,
  waterLoggedMl,
  onOpenLogMeal,
  onDeleteMeal,
  onAddWater,
  onRefreshAI,
  onAddSuggestedMeal,
  isAiLoading,
}) => {
  const [selectedMealCategory, setSelectedMealCategory] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter((m) => m.date === todayStr || m.date === '2026-11-12');
  const todayActivities = activities.filter((a) => a.date === todayStr || a.date === '2026-11-12');

  const totalCaloriesConsumed = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProteinConsumed = todayMeals.reduce((sum, m) => sum + m.proteinG, 0);
  const totalCarbsConsumed = todayMeals.reduce((sum, m) => sum + m.carbsG, 0);
  const totalFatsConsumed = todayMeals.reduce((sum, m) => sum + m.fatsG, 0);

  const totalBurnedToday = todayActivities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const totalWorkoutMinutes = todayActivities.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0);

  const calRemaining = Math.max(0, nutritionPlan.dailyCalories - totalCaloriesConsumed);
  const calPercent = Math.min(100, Math.round((totalCaloriesConsumed / nutritionPlan.dailyCalories) * 100));

  const filteredMeals = todayMeals.filter(
    (m) => selectedMealCategory === 'all' || m.mealType === selectedMealCategory
  );

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Science Banner: Activity-Driven Needs */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Activity-Based Nutrition Engine</span>
            </div>
            <h2 className="text-xl font-black text-white">
              Daily Target: {nutritionPlan.dailyCalories} kcal ({calRemaining} kcal remaining)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {nutritionPlan.explanation}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onRefreshAI}
              disabled={isAiLoading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'Computing Needs...' : 'Regenerate with Gemini AI'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic breakdown bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Basal Metabolic Rate</span>
            <span className="text-base font-bold text-slate-200">{nutritionPlan.bmr} kcal</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Today's Workout Burn</span>
            <span className="text-base font-bold text-amber-400">+{totalBurnedToday} kcal</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Active Training Load</span>
            <span className="text-base font-bold text-emerald-400">{totalWorkoutMinutes} mins</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Target Hydration</span>
            <span className="text-base font-bold text-sky-400">{nutritionPlan.hydrationLiters} L / day</span>
          </div>
        </div>
      </div>

      {/* 2. Macro Distribution Targets vs Consumed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Protein Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Protein</span>
            <span className="text-xs font-semibold text-slate-400">Muscle Protein Synthesis</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-white">{totalProteinConsumed}g</span>
            <span className="text-xs text-slate-400">/ {nutritionPlan.macros.proteinGrams}g target</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((totalProteinConsumed / nutritionPlan.macros.proteinGrams) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Targeting ~{(nutritionPlan.macros.proteinGrams / user.weightKg).toFixed(1)}g per kg of bodyweight for rapid micro-tear tissue healing.
          </p>
        </div>

        {/* Carbohydrates Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Carbohydrates</span>
            <span className="text-xs font-semibold text-slate-400">Glycogen Replenishment</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-white">{totalCarbsConsumed}g</span>
            <span className="text-xs text-slate-400">/ {nutritionPlan.macros.carbsGrams}g target</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((totalCarbsConsumed / nutritionPlan.macros.carbsGrams) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Essential high-octane fuel to prevent central nervous system fatigue during intensive training.
          </p>
        </div>

        {/* Healthy Fats Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Healthy Fats</span>
            <span className="text-xs font-semibold text-slate-400">Hormonal & Joint Support</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-white">{totalFatsConsumed}g</span>
            <span className="text-xs text-slate-400">/ {nutritionPlan.macros.fatsGrams}g target</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((totalFatsConsumed / nutritionPlan.macros.fatsGrams) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Omega-3s and monounsaturated lipids optimize hormone synthesis and reduce systemic inflammation.
          </p>
        </div>
      </div>

      {/* 3. AI Suggested Meal Plan Based on Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Activity-Aligned Daily Meal Suggestions</span>
            </h3>
            <p className="text-xs text-slate-400">
              Whole-food options designed specifically to fuel and recover from today's workouts
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLogMeal}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Log Custom Food</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nutritionPlan.mealPlan.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    {item.meal}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                    ~{item.targetCalories} kcal
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-100 mb-2">{item.suggestion}</p>
                <div className="text-[11px] text-slate-400 bg-slate-900/90 p-2 rounded-lg border border-slate-800/60">
                  <span className="font-semibold text-slate-300">Biochemical Focus:</span> {item.focus}
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    onAddSuggestedMeal({
                      name: item.suggestion.split(',')[0],
                      calories: item.targetCalories,
                    })
                  }
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Today's Food Log</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Micronutrient Priority Callouts */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Key Micronutrients & Electrolytes Required for Today's Strain</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {nutritionPlan.micronutrientHighlights.map((micro, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{micro}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Today's Logged Meals History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-400" />
              <span>Today's Logged Meals & Snacks</span>
            </h3>
            <p className="text-xs text-slate-400">
              {todayMeals.length} items logged ({totalCaloriesConsumed} kcal total)
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenLogMeal}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Log Food Entry</span>
          </button>
        </div>

        {todayMeals.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No meals logged for today yet. Use the button above or quick-add from suggestions.
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
                    {meal.mealType.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{meal.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="capitalize">{meal.mealType.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{meal.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <span className="font-extrabold text-white text-sm">{meal.calories} kcal</span>
                    <div className="text-[11px] text-slate-400">
                      P: {meal.proteinG}g | C: {meal.carbsG}g | F: {meal.fatsG}g
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
