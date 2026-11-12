import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Flame,
  Clock,
  Heart,
  Gauge,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  PhysicalActivity,
  ActivityType,
  IntensityLevel,
  UserProfile,
  DashboardSettings,
} from '../../types/wellness';
import { estimateCaloriesBurned } from '../../utils/wellnessCalculations';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  settings: DashboardSettings;
  onSaveActivity: (activity: PhysicalActivity) => void;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  onSaveActivity,
}) => {
  const [activityType, setActivityType] = useState<ActivityType>('running');
  const [title, setTitle] = useState('Afternoon Workout');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  );
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState(420);
  const [distanceKm, setDistanceKm] = useState<number | undefined>(6.5);
  const [avgHeartRate, setAvgHeartRate] = useState(148);
  const [peakHeartRate, setPeakHeartRate] = useState(168);
  const [perceivedEffort, setPerceivedEffort] = useState(7);
  const [notes, setNotes] = useState('');
  const [cadenceOrReps, setCadenceOrReps] = useState('');

  // Auto-estimate calories burned when type or duration changes
  useEffect(() => {
    const est = estimateCaloriesBurned(activityType, durationMinutes, user.weightKg);
    setCaloriesBurned(est);
  }, [activityType, durationMinutes, user.weightKg]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let intensityZone: IntensityLevel = 'moderate';
    if (perceivedEffort >= 9 || avgHeartRate >= 165) intensityZone = 'peak';
    else if (perceivedEffort >= 7 || avgHeartRate >= 145) intensityZone = 'high';
    else if (perceivedEffort <= 4 && avgHeartRate <= 115) intensityZone = 'low';

    const newActivity: PhysicalActivity = {
      id: `act_${Date.now()}`,
      userId: user.id,
      date,
      time,
      activityType,
      title: title.trim() || `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} Session`,
      durationMinutes: Number(durationMinutes) || 30,
      caloriesBurned: Number(caloriesBurned) || 250,
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
      avgHeartRate: Number(avgHeartRate) || 130,
      peakHeartRate: peakHeartRate ? Number(peakHeartRate) : undefined,
      perceivedEffort: Number(perceivedEffort) || 6,
      intensityZone,
      notes: notes.trim(),
      cadenceOrReps: cadenceOrReps.trim() || undefined,
    };

    onSaveActivity(newActivity);

    // Fire rewarding confetti!
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Physical Activity</h3>
              <p className="text-xs text-slate-400">
                Details will dynamically calibrate your daily nutrition & sleep recommendations
              </p>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Activity Type Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Activity Type</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { id: 'running', label: 'Running' },
                { id: 'cycling', label: 'Cycling' },
                { id: 'strength', label: 'Strength' },
                { id: 'hiit', label: 'HIIT' },
                { id: 'swimming', label: 'Swimming' },
                { id: 'walking', label: 'Walking' },
                { id: 'yoga', label: 'Yoga' },
                { id: 'rowing', label: 'Rowing' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActivityType(t.id as ActivityType)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer ${
                    activityType === t.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Session Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 10k Tempo Run, Lower Body Squats, Fasted Walk"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Duration & Calories */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Duration (Minutes)</span>
              </label>
              <input
                type="number"
                min="5"
                max="600"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Calories Burned (kcal)</span>
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                required
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Distance & Cadence / Reps */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Distance ({settings.units === 'imperial' ? 'Miles' : 'Kilometers'})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Optional"
                value={distanceKm ?? ''}
                onChange={(e) => setDistanceKm(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Cadence / Sets & Reps
              </label>
              <input
                type="text"
                placeholder="e.g. 176 spm or 4x10 squats"
                value={cadenceOrReps}
                onChange={(e) => setCadenceOrReps(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Heart Rate: Avg & Peak */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-emerald-400" />
                <span>Average Heart Rate (BPM)</span>
              </label>
              <input
                type="number"
                min="40"
                max="220"
                required
                value={avgHeartRate}
                onChange={(e) => setAvgHeartRate(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Peak Heart Rate (BPM)</span>
              </label>
              <input
                type="number"
                min="40"
                max="230"
                value={peakHeartRate}
                onChange={(e) => setPeakHeartRate(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Perceived Exertion (RPE 1-10) */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200">Perceived Exertion (RPE Scale)</span>
              <span className="font-bold text-emerald-400 text-sm">{perceivedEffort} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={perceivedEffort}
              onChange={(e) => setPerceivedEffort(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 - Very Light</span>
              <span>5 - Moderate Aerobic</span>
              <span>8 - Vigorous</span>
              <span>10 - Max Sprint</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Athlete Notes & Sensations</label>
            <textarea
              rows={2}
              placeholder="How did you feel? Hydration, muscle fatigue, elevation, or energy..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Save Physical Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
