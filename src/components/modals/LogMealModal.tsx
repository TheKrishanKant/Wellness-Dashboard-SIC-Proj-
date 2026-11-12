import React, { useState } from 'react';
import { X, Apple, Flame, Plus } from 'lucide-react';
import { MealItem } from '../../types/wellness';

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeal: (meal: MealItem) => void;
}

export const LogMealModal: React.FC<LogMealModalProps> = ({ isOpen, onClose, onSaveMeal }) => {
  const [mealType, setMealType] = useState<MealItem['mealType']>('breakfast');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState(450);
  const [proteinG, setProteinG] = useState(30);
  const [carbsG, setCarbsG] = useState(50);
  const [fatsG, setFatsG] = useState(15);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMeal: MealItem = {
      id: `meal_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time,
      mealType,
      name: name.trim(),
      calories: Number(calories) || 300,
      proteinG: Number(proteinG) || 20,
      carbsG: Number(carbsG) || 30,
      fatsG: Number(fatsG) || 10,
    };

    onSaveMeal(newMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Food or Meal</h3>
              <p className="text-xs text-slate-400">Track daily caloric & macronutrient consumption</p>
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
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Meal Timing / Category</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="post_workout">Post-Workout Recovery</option>
              <option value="pre_workout">Pre-Workout Fuel</option>
              <option value="snack">Nutrient Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Meal / Food Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Grilled Chicken Breast with Brown Rice & Avocado"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Calories (kcal)</label>
              <input
                type="number"
                min="0"
                required
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Macro breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-emerald-400 mb-1">Protein (g)</label>
              <input
                type="number"
                min="0"
                value={proteinG}
                onChange={(e) => setProteinG(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-amber-400 mb-1">Carbs (g)</label>
              <input
                type="number"
                min="0"
                value={carbsG}
                onChange={(e) => setCarbsG(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-indigo-400 mb-1">Fats (g)</label>
              <input
                type="number"
                min="0"
                value={fatsG}
                onChange={(e) => setFatsG(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer"
            >
              Save Meal Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
