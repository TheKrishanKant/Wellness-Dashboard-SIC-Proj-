import React, { useState } from 'react';
import {
  Settings,
  Eye,
  Sliders,
  User,
  Bell,
  Database,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DashboardSettings, UserProfile, FitnessGoal } from '../../types/wellness';

interface SettingsViewProps {
  user: UserProfile;
  settings: DashboardSettings;
  onUpdateSettings: (newSettings: DashboardSettings) => void;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  settings,
  onUpdateSettings,
  onUpdateProfile,
  onResetDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'basics' | 'profile' | 'data'>('overview');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Local state for profile edits
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [weightKg, setWeightKg] = useState(user.weightKg);
  const [heightCm, setHeightCm] = useState(user.heightCm);
  const [restingHeartRate, setRestingHeartRate] = useState(user.restingHeartRate);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(user.fitnessGoal);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const toggleWidget = (widgetKey: keyof DashboardSettings['visibleWidgets']) => {
    const updated = {
      ...settings,
      visibleWidgets: {
        ...settings.visibleWidgets,
        [widgetKey]: !settings.visibleWidgets[widgetKey],
      },
    };
    onUpdateSettings(updated);
    showToast(`Updated overview display settings.`);
  };

  const handleSetAllWidgets = (val: boolean) => {
    const updated = {
      ...settings,
      visibleWidgets: {
        quickMetrics: val,
        activityTrend: val,
        heartRateStrain: val,
        nutritionMacros: val,
        sleepRecovery: val,
        aiWellnessCoach: val,
        recentWorkouts: val,
        hydrationTracker: val,
        dailyChecklist: val,
      },
    };
    onUpdateSettings(updated);
    showToast(val ? 'All overview widgets enabled.' : 'Minimal overview mode enabled.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      ...user,
      name,
      age: Number(age) || user.age,
      gender,
      weightKg: Number(weightKg) || user.weightKg,
      heightCm: Number(heightCm) || user.heightCm,
      restingHeartRate: Number(restingHeartRate) || user.restingHeartRate,
      fitnessGoal,
    };
    onUpdateProfile(updatedUser);
    showToast('Biometric profile updated successfully!');
  };

  const handleExportData = () => {
    const dataToExport = {
      user,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitalpulse_health_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Health data exported successfully!');
  };

  const widgetDefinitions: {
    key: keyof DashboardSettings['visibleWidgets'];
    title: string;
    description: string;
  }[] = [
    {
      key: 'quickMetrics',
      title: 'Top Quick Metric Cards',
      description: 'Active calories burned, estimated steps, sleep duration, and water intake progress rings.',
    },
    {
      key: 'aiWellnessCoach',
      title: 'Gemini AI Health Strategic Coach Banner',
      description: 'Smart contextual AI synthesis summarizing dynamic nutrition and sleep requirements.',
    },
    {
      key: 'activityTrend',
      title: 'Weekly Physical Activity & Strain Chart',
      description: '7-day visual bar chart of workout durations and calorie expenditure.',
    },
    {
      key: 'recentWorkouts',
      title: 'Recent Workouts Logged Feed',
      description: 'Interactive cards for the latest physical activities with duration and heart rate.',
    },
    {
      key: 'heartRateStrain',
      title: 'Cardiovascular Intensity & Strain Zones',
      description: 'Heart rate zones (Zone 2 Endurance to Zone 5 Peak) distribution.',
    },
    {
      key: 'nutritionMacros',
      title: 'Activity-Tuned Nutrition & Macro Progress',
      description: 'Daily calories, protein, carbs, and fats consumed vs dynamic targets.',
    },
    {
      key: 'sleepRecovery',
      title: 'Circadian Sleep Window & Recommendation',
      description: 'Recommended bedtime, target sleep duration, and circadian advice.',
    },
    {
      key: 'hydrationTracker',
      title: 'Hydration Rapid Logger (+250ml / +500ml)',
      description: 'Clickable volume buttons to instantly log fluid intake.',
    },
    {
      key: 'dailyChecklist',
      title: 'Daily Recovery Checklist',
      description: 'Daily habit check-off for sunlight, hydration, and wind-down.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Overview Widgets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('basics')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'basics'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Basic Settings & Units</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Biometric Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'data'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data & Export</span>
        </button>
      </div>

      {/* 1. Overview Widgets Customization */}
      {activeTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Customize Overview Dashboard Widgets</span>
              </h3>
              <p className="text-xs text-slate-400">
                Choose exactly what components appear on your main Overview dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSetAllWidgets(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={() => handleSetAllWidgets(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Minimal View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {widgetDefinitions.map((w) => {
              const isEnabled = settings.visibleWidgets[w.key];
              return (
                <div
                  key={w.key}
                  onClick={() => toggleWidget(w.key)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isEnabled
                      ? 'bg-slate-950/80 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{w.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{w.description}</p>
                  </div>

                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${
                        isEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-4.5' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Basic Settings & Target Goals */}
      {activeTab === 'basics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Basic Settings & Daily Targets</span>
            </h3>
            <p className="text-xs text-slate-400">
              Configure measurement units, BMR formula, and daily wellness targets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preferred Units */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Measurement Units
              </label>
              <select
                value={settings.units}
                onChange={(e) => {
                  onUpdateSettings({ ...settings, units: e.target.value as any });
                  showToast(`Measurement units set to ${e.target.value}.`);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="metric">Metric (Kilograms, Centimeters, Kilometers)</option>
                <option value="imperial">Imperial (Pounds, Inches, Miles)</option>
              </select>
            </div>

            {/* BMR Formula */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Metabolic Burn Formula
              </label>
              <select
                value={settings.formula}
                onChange={(e) => {
                  onUpdateSettings({ ...settings, formula: e.target.value as any });
                  showToast(`Formula updated to ${e.target.value}.`);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="mifflin_st_jeor">Mifflin-St Jeor (Sports Standard)</option>
                <option value="harris_benedict">Harris-Benedict (Revised)</option>
              </select>
            </div>
          </div>

          {/* Daily Goals Tuning */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Daily Target Goals
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Daily Steps Target</label>
                <input
                  type="number"
                  step="500"
                  value={settings.targets.steps}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      targets: { ...settings.targets, steps: parseInt(e.target.value, 10) || 10000 },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Active Calorie Burn (kcal)</label>
                <input
                  type="number"
                  step="50"
                  value={settings.targets.caloriesBurned}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      targets: {
                        ...settings.targets,
                        caloriesBurned: parseInt(e.target.value, 10) || 600,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Sleep Duration (Hours)</label>
                <input
                  type="number"
                  step="0.25"
                  value={settings.targets.sleepHours}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      targets: {
                        ...settings.targets,
                        sleepHours: parseFloat(e.target.value) || 8.0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Biometric Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Biometric & Athlete Profile</span>
            </h3>
            <p className="text-xs text-slate-400">
              Used directly to calculate your personalized BMR, hydration rates, and recovery needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Resting Heart Rate (BPM)</label>
              <input
                type="number"
                value={restingHeartRate}
                onChange={(e) => setRestingHeartRate(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Primary Fitness Goal</label>
            <select
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="endurance">Endurance & Marathon Performance</option>
              <option value="muscle_gain">Muscle Hypertrophy & Strength</option>
              <option value="weight_loss">Fat Loss & Calorie Deficit</option>
              <option value="maintenance">General Vitality & Longevity</option>
              <option value="stress_reduction">Recovery & Stress Reduction</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* 4. Data Management & Export */}
      {activeTab === 'data' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Data Management & Health Export</span>
            </h3>
            <p className="text-xs text-slate-400">
              Download your health data records or restore full authentic demo dataset.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Export Health Data (JSON)</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Download your user profile, activities, meal logs, and sleep architecture records.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Data File</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Restore Alex Chen Demo Dataset</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Re-populates 6 rich workouts, meal logs, and sleep recovery records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onResetDemoData();
                  showToast('Demo dataset restored successfully!');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restore Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
