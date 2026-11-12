/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  PhysicalActivity,
  MealItem,
  SleepLog,
  DashboardSettings,
  NutritionRecommendation,
  SleepRecommendation,
  NavTab,
} from './types/wellness';
import {
  INITIAL_USER,
  INITIAL_SETTINGS,
  INITIAL_ACTIVITIES,
  INITIAL_MEALS,
  INITIAL_SLEEP_LOGS,
  INITIAL_NUTRITION_PLAN,
  INITIAL_SLEEP_RECOMMENDATION,
} from './data/initialData';
import {
  calculateDynamicNutritionNeeds,
  calculateSleepRecommendation,
} from './utils/wellnessCalculations';

// Components
import { AuthScreen } from './components/AuthScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/views/OverviewView';
import { ActivityLogView } from './components/views/ActivityLogView';
import { NutritionView } from './components/views/NutritionView';
import { SleepView } from './components/views/SleepView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { LogActivityModal } from './components/modals/LogActivityModal';
import { LogMealModal } from './components/modals/LogMealModal';
import { LogSleepModal } from './components/modals/LogSleepModal';
import { AICoachModal } from './components/modals/AICoachModal';

const STORAGE_KEYS = {
  USER: 'vitalpulse_user',
  SETTINGS: 'vitalpulse_settings',
  ACTIVITIES: 'vitalpulse_activities',
  MEALS: 'vitalpulse_meals',
  SLEEP: 'vitalpulse_sleep',
  WATER: 'vitalpulse_water',
};

export default function App() {
  // Authentication state (Starts on Login/Sign Up page as requested)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Current active navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');

  // Application data states
  const [settings, setSettings] = useState<DashboardSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [activities, setActivities] = useState<PhysicalActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [meals, setMeals] = useState<MealItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEALS);
      return saved ? JSON.parse(saved) : INITIAL_MEALS;
    } catch {
      return INITIAL_MEALS;
    }
  });

  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SLEEP);
      return saved ? JSON.parse(saved) : INITIAL_SLEEP_LOGS;
    } catch {
      return INITIAL_SLEEP_LOGS;
    }
  });

  const [waterLoggedMl, setWaterLoggedMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATER);
      return saved ? JSON.parse(saved) : 2250;
    } catch {
      return 2250;
    }
  });

  // Dynamic recommendations
  const [nutritionPlan, setNutritionPlan] = useState<NutritionRecommendation>(INITIAL_NUTRITION_PLAN);
  const [sleepPlan, setSleepPlan] = useState<SleepRecommendation>(INITIAL_SLEEP_RECOMMENDATION);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Modals state
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [isLogMealOpen, setIsLogMealOpen] = useState(false);
  const [isLogSleepOpen, setIsLogSleepOpen] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Persist states to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SLEEP, JSON.stringify(sleepLogs));
  }, [sleepLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(waterLoggedMl));
  }, [waterLoggedMl]);

  // Dynamic recalculation of nutrition needs and sleep patterns whenever activities or profile change
  const recalculatePlans = useCallback(
    (currentUser: UserProfile, currentActivities: PhysicalActivity[], currentSleep: SleepLog[]) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayActs = currentActivities.filter(
        (a) => a.date === todayStr || a.date === '2026-11-12'
      );

      const computedNutrition = calculateDynamicNutritionNeeds(
        currentUser,
        todayActs,
        settings.formula
      );
      const computedSleep = calculateSleepRecommendation(
        currentUser,
        todayActs,
        sleepPlan.idealWakeTime || '06:30'
      );

      setNutritionPlan(computedNutrition);
      setSleepPlan(computedSleep);
    },
    [settings.formula, sleepPlan.idealWakeTime]
  );

  // Initial and reactive plan calculation
  useEffect(() => {
    if (user) {
      recalculatePlans(user, activities, sleepLogs);
    }
  }, [user, activities, sleepLogs, recalculatePlans]);

  // Gemini AI generation trigger
  const handleRefreshAI = async () => {
    if (!user) return;
    setIsAiLoading(true);

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayActs = activities.filter(
        (a) => a.date === todayStr || a.date === '2026-11-12'
      );

      const response = await fetch('/api/gemini/wellness-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: user,
          activities: todayActs,
          sleepLogs,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI insights');
      const data = await response.json();

      if (data.nutrition) {
        setNutritionPlan(data.nutrition);
      }
      if (data.sleep) {
        setSleepPlan(data.sleep);
      }
    } catch (err) {
      console.warn('AI call fallback to local sports science formulas:', err);
      recalculatePlans(user, activities, sleepLogs);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Auth actions
  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    recalculatePlans(newUser, activities, sleepLogs);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentTab('overview');
  };

  // Activity actions
  const handleSaveActivity = (activity: PhysicalActivity) => {
    const updated = [activity, ...activities];
    setActivities(updated);
    if (user) {
      recalculatePlans(user, updated, sleepLogs);
    }
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((a) => a.id !== id);
    setActivities(updated);
    if (user) {
      recalculatePlans(user, updated, sleepLogs);
    }
  };

  // Meal actions
  const handleSaveMeal = (meal: MealItem) => {
    setMeals((prev) => [meal, ...prev]);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddSuggestedMeal = (suggestion: { name: string; calories: number }) => {
    const newMeal: MealItem = {
      id: `meal_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      mealType: 'lunch',
      name: suggestion.name,
      calories: suggestion.calories,
      proteinG: Math.round((suggestion.calories * 0.25) / 4),
      carbsG: Math.round((suggestion.calories * 0.5) / 4),
      fatsG: Math.round((suggestion.calories * 0.25) / 9),
    };
    handleSaveMeal(newMeal);
  };

  // Sleep actions
  const handleSaveSleep = (log: SleepLog) => {
    const updated = [log, ...sleepLogs];
    setSleepLogs(updated);
  };

  const handleDeleteSleep = (id: string) => {
    setSleepLogs((prev) => prev.filter((s) => s.id !== id));
  };

  // Hydration
  const handleAddWater = (amountMl: number) => {
    setWaterLoggedMl((prev) => Math.min(8000, prev + amountMl));
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    setUser(INITIAL_USER);
    setSettings(INITIAL_SETTINGS);
    setActivities(INITIAL_ACTIVITIES);
    setMeals(INITIAL_MEALS);
    setSleepLogs(INITIAL_SLEEP_LOGS);
    setWaterLoggedMl(2250);
    setNutritionPlan(INITIAL_NUTRITION_PLAN);
    setSleepPlan(INITIAL_SLEEP_RECOMMENDATION);
  };

  // If user is not logged in, show AuthScreen (Login & Sign Up)
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Calculate today's total active burn for the mini card
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCaloriesBurned = activities
    .filter((a) => a.date === todayStr || a.date === '2026-11-12')
    .reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* 1. Interactive Sidebar with working navigation tabs */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        todayCaloriesBurned={todayCaloriesBurned}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          user={user}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenLogActivity={() => setIsLogActivityOpen(true)}
          onOpenLogMeal={() => setIsLogMealOpen(true)}
          onOpenLogSleep={() => setIsLogSleepOpen(true)}
          onOpenAICoach={() => setIsAICoachOpen(true)}
          onQuickAddWater={() => handleAddWater(250)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewView
              user={user}
              settings={settings}
              activities={activities}
              meals={meals}
              sleepLogs={sleepLogs}
              nutritionPlan={nutritionPlan}
              sleepPlan={sleepPlan}
              waterLoggedMl={waterLoggedMl}
              onNavigateTab={setCurrentTab}
              onOpenLogActivity={() => setIsLogActivityOpen(true)}
              onOpenLogMeal={() => setIsLogMealOpen(true)}
              onOpenLogSleep={() => setIsLogSleepOpen(true)}
              onAddWater={handleAddWater}
              onRefreshAI={handleRefreshAI}
              isAiLoading={isAiLoading}
            />
          )}

          {currentTab === 'activity' && (
            <ActivityLogView
              activities={activities}
              settings={settings}
              onOpenLogModal={() => setIsLogActivityOpen(true)}
              onDeleteActivity={handleDeleteActivity}
            />
          )}

          {currentTab === 'nutrition' && (
            <NutritionView
              user={user}
              nutritionPlan={nutritionPlan}
              meals={meals}
              activities={activities}
              settings={settings}
              waterLoggedMl={waterLoggedMl}
              onOpenLogMeal={() => setIsLogMealOpen(true)}
              onDeleteMeal={handleDeleteMeal}
              onAddWater={handleAddWater}
              onRefreshAI={handleRefreshAI}
              onAddSuggestedMeal={handleAddSuggestedMeal}
              isAiLoading={isAiLoading}
            />
          )}

          {currentTab === 'sleep' && (
            <SleepView
              user={user}
              sleepPlan={sleepPlan}
              sleepLogs={sleepLogs}
              activities={activities}
              settings={settings}
              onOpenLogSleep={() => setIsLogSleepOpen(true)}
              onDeleteSleep={handleDeleteSleep}
              onUpdateSleepPlan={setSleepPlan}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              activities={activities}
              meals={meals}
              sleepLogs={sleepLogs}
              nutritionPlan={nutritionPlan}
              settings={settings}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              user={user}
              settings={settings}
              onUpdateSettings={setSettings}
              onUpdateProfile={(updatedUser) => {
                setUser(updatedUser);
                recalculatePlans(updatedUser, activities, sleepLogs);
              }}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* 3. Interactive Modals */}
      <LogActivityModal
        isOpen={isLogActivityOpen}
        onClose={() => setIsLogActivityOpen(false)}
        user={user}
        settings={settings}
        onSaveActivity={handleSaveActivity}
      />

      <LogMealModal
        isOpen={isLogMealOpen}
        onClose={() => setIsLogMealOpen(false)}
        onSaveMeal={handleSaveMeal}
      />

      <LogSleepModal
        isOpen={isLogSleepOpen}
        onClose={() => setIsLogSleepOpen(false)}
        onSaveSleep={handleSaveSleep}
      />

      <AICoachModal
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
        user={user}
        activities={activities}
        nutritionPlan={nutritionPlan}
        sleepPlan={sleepPlan}
      />
    </div>
  );
}
