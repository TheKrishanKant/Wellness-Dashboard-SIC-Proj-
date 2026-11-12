export type FitnessGoal =
  | 'weight_loss'
  | 'muscle_gain'
  | 'endurance'
  | 'maintenance'
  | 'stress_reduction';

export type ActivityType =
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'strength'
  | 'hiit'
  | 'walking'
  | 'yoga'
  | 'pilates'
  | 'rowing'
  | 'hiking'
  | 'boxing'
  | 'sports';

export type IntensityLevel = 'low' | 'moderate' | 'high' | 'peak';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  restingHeartRate: number;
  fitnessGoal: FitnessGoal;
  activityBaseline: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete';
  bio?: string;
}

export interface PhysicalActivity {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  activityType: ActivityType;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number;
  avgHeartRate: number;
  peakHeartRate?: number;
  perceivedEffort: number; // 1 - 10
  intensityZone: IntensityLevel;
  notes?: string;
  cadenceOrReps?: string;
}

export interface MealItem {
  id: string;
  date: string;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
}

export interface SleepLog {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  durationHours: number;
  qualityRating: number; // 1-5
  deepSleepMinutes: number;
  remSleepMinutes: number;
  awakeningsCount: number;
  restfulnessScore: number; // 0-100
  notes?: string;
}

export interface SuggestedMeal {
  meal: string;
  targetCalories: number;
  suggestion: string;
  focus: string;
}

export interface WindDownStep {
  time: string;
  step: string;
}

export interface NutritionRecommendation {
  dailyCalories: number;
  bmr: number;
  burnFromActivity: number;
  macros: {
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
  };
  hydrationLiters: number;
  explanation: string;
  mealPlan: SuggestedMeal[];
  micronutrientHighlights: string[];
  timingAdvice: string;
}

export interface SleepRecommendation {
  targetDurationHours: number;
  idealBedtime: string;
  idealWakeTime: string;
  circadianAdvice: string;
  windDownProtocol: WindDownStep[];
  caffeineCurfew: string;
  recoveryScoreEstimate: number;
}

export interface DashboardSettings {
  visibleWidgets: {
    quickMetrics: boolean;
    activityTrend: boolean;
    heartRateStrain: boolean;
    nutritionMacros: boolean;
    sleepRecovery: boolean;
    aiWellnessCoach: boolean;
    recentWorkouts: boolean;
    hydrationTracker: boolean;
    dailyChecklist: boolean;
  };
  units: 'metric' | 'imperial';
  formula: 'mifflin_st_jeor' | 'harris_benedict';
  targets: {
    steps: number;
    activeMinutes: number;
    caloriesBurned: number;
    sleepHours: number;
    waterMilliliters: number;
  };
  notifications: {
    hydrationReminder: boolean;
    sleepWindDown: boolean;
    workoutEncouragement: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export type NavTab =
  | 'overview'
  | 'activity'
  | 'nutrition'
  | 'sleep'
  | 'analytics'
  | 'settings';
