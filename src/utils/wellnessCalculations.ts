import {
  UserProfile,
  PhysicalActivity,
  NutritionRecommendation,
  SleepRecommendation,
  DashboardSettings,
} from '../types/wellness';

// MET values (Metabolic Equivalent of Task) for standard physical activities
export const MET_VALUES: Record<string, number> = {
  running: 9.8,
  cycling: 7.5,
  swimming: 8.0,
  strength: 5.5,
  hiit: 10.0,
  walking: 3.5,
  yoga: 2.8,
  pilates: 3.8,
  rowing: 8.5,
  hiking: 6.5,
  boxing: 9.0,
  sports: 7.0,
};

/**
 * Calculates estimated calorie burn based on activity, duration, and user weight
 */
export function estimateCaloriesBurned(
  activityType: string,
  durationMinutes: number,
  weightKg: number
): number {
  const met = MET_VALUES[activityType] || 6.0;
  // Calories = MET * weight(kg) * duration(hours)
  const hours = durationMinutes / 60;
  return Math.round(met * weightKg * hours);
}

/**
 * Calculates Basal Metabolic Rate using Mifflin-St Jeor or Harris-Benedict formula
 */
export function calculateBMR(
  profile: UserProfile,
  formula: 'mifflin_st_jeor' | 'harris_benedict' = 'mifflin_st_jeor'
): number {
  const { weightKg, heightCm, age, gender } = profile;
  const isMale = gender === 'male';

  if (formula === 'harris_benedict') {
    return isMale
      ? Math.round(88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age)
      : Math.round(447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age);
  }

  // Mifflin-St Jeor (Default gold standard)
  return isMale
    ? Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5)
    : Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
}

/**
 * Dynamically computes daily nutrition needs based on physical activities logged today
 */
export function calculateDynamicNutritionNeeds(
  profile: UserProfile,
  activitiesToday: PhysicalActivity[],
  formula: 'mifflin_st_jeor' | 'harris_benedict' = 'mifflin_st_jeor'
): NutritionRecommendation {
  const bmr = calculateBMR(profile, formula);
  const totalBurnFromActivity = activitiesToday.reduce(
    (sum, a) => sum + (Number(a.caloriesBurned) || 0),
    0
  );
  const totalActiveMinutes = activitiesToday.reduce(
    (sum, a) => sum + (Number(a.durationMinutes) || 0),
    0
  );

  // Baseline TDEE (Sedentary baseline * 1.2 + non-exercise activity thermogenesis)
  let maintenanceCalories = Math.round(bmr * 1.25 + totalBurnFromActivity);

  let targetCalories = maintenanceCalories;
  if (profile.fitnessGoal === 'weight_loss') {
    targetCalories = Math.max(1450, Math.round(maintenanceCalories - 450));
  } else if (profile.fitnessGoal === 'muscle_gain') {
    targetCalories = Math.round(maintenanceCalories + 350);
  } else if (profile.fitnessGoal === 'endurance') {
    targetCalories = Math.round(maintenanceCalories + (totalBurnFromActivity > 500 ? 250 : 100));
  }

  // Protein targets based on training load and goal
  const proteinPerKg =
    profile.fitnessGoal === 'muscle_gain'
      ? 2.2
      : profile.fitnessGoal === 'weight_loss'
      ? 2.0
      : profile.fitnessGoal === 'endurance'
      ? 1.9
      : 1.7;

  const proteinGrams = Math.round(profile.weightKg * proteinPerKg);
  // Fats: ~25-28% of total calories
  const fatsGrams = Math.round((targetCalories * 0.25) / 9);
  // Carbs fill remaining caloric needs (4 kcal/g)
  const remainingCals = targetCalories - proteinGrams * 4 - fatsGrams * 9;
  const carbsGrams = Math.max(90, Math.round(remainingCals / 4));

  // Hydration: 35ml per kg baseline + 500ml per 30 min of exercise
  const hydrationLiters = Number(
    (profile.weightKg * 0.035 + (totalActiveMinutes / 30) * 0.45).toFixed(1)
  );

  const goalText = profile.fitnessGoal.replace('_', ' ');

  return {
    dailyCalories: targetCalories,
    bmr,
    burnFromActivity: totalBurnFromActivity,
    macros: {
      proteinGrams,
      carbsGrams,
      fatsGrams,
    },
    hydrationLiters,
    explanation: `Target adjusted to ${targetCalories} kcal based on ${totalActiveMinutes} mins of active training burning ~${totalBurnFromActivity} kcal today. High protein (${proteinGrams}g) supports muscular repair while ${carbsGrams}g of complex carbs refuels glycogen stores for your ${goalText} goal.`,
    mealPlan: [
      {
        meal: 'Breakfast (Metabolic Ignition)',
        targetCalories: Math.round(targetCalories * 0.25),
        suggestion: 'Rolled oats with Greek yogurt, organic blueberries, pumpkin seeds, and a scoop of protein powder.',
        focus: 'Complex low-glycemic carbohydrates & slow-release amino acids',
      },
      {
        meal: 'Pre/Post Workout Nutrient Window',
        targetCalories: Math.round(targetCalories * 0.15),
        suggestion: 'Fresh banana or dates with whey/pea protein shake in coconut water with a pinch of sea salt.',
        focus: 'Rapid glycogen resynthesis and electrolyte recovery',
      },
      {
        meal: 'Lunch (Performance Fuel)',
        targetCalories: Math.round(targetCalories * 0.35),
        suggestion: 'Grilled salmon or tofu over tri-color quinoa, roasted butternut squash, and massaged kale salad.',
        focus: 'Anti-inflammatory Omega-3 fatty acids and endurance micronutrients',
      },
      {
        meal: 'Dinner (Restorative & Sleep Support)',
        targetCalories: Math.round(targetCalories * 0.25),
        suggestion: 'Herb-roasted chicken breast or seitan steak with brown jasmine rice, steamed broccoli, and avocado.',
        focus: 'High tryptophan and zinc to facilitate nighttime growth hormone repair',
      },
    ],
    micronutrientHighlights: [
      'Magnesium Glycinate (400mg): Relaxes neuromuscular tension and supports deep sleep stages.',
      'Potassium & Sodium (Electrolytes): Rebalances osmotic pressure after workout perspiration.',
      'Vitamin D3 & Omega-3: Dampens post-exercise oxidative stress and enhances joint mobility.',
      'Zinc (15mg): Catalyzes cellular protein synthesis during nocturnal recovery.',
    ],
    timingAdvice:
      'Consume 30-40g protein every 3 to 4 hours. Keep high glycemic carbohydrates centered around your workout window, and prioritize magnesium-rich vegetables at dinner.',
  };
}

/**
 * Suggests circadian sleep patterns, ideal duration, and bedtime/wake window based on physical strain
 */
export function calculateSleepRecommendation(
  profile: UserProfile,
  activitiesToday: PhysicalActivity[],
  preferredWakeTime: string = '06:30'
): SleepRecommendation {
  const totalBurn = activitiesToday.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const totalMinutes = activitiesToday.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0);

  // High strain demands longer NREM Slow Wave sleep
  let targetHours = 7.5;
  if (totalMinutes >= 70 || totalBurn >= 600) {
    targetHours = 8.5; // 5 full 90m cycles + 45m deep sleep buffer
  } else if (totalMinutes >= 40 || totalBurn >= 400) {
    targetHours = 8.0;
  }

  // Calculate ideal bedtime based on preferred wake time
  const [wakeHour, wakeMin] = preferredWakeTime.split(':').map(Number);
  const wakeTotalMinutes = wakeHour * 60 + wakeMin;

  // Add 15 minutes of sleep latency (time to fall asleep)
  const totalSleepAndLatencyMin = Math.round(targetHours * 60) + 15;
  let bedTotalMinutes = (wakeTotalMinutes - totalSleepAndLatencyMin + 1440) % 1440;

  const bedHour = Math.floor(bedTotalMinutes / 60);
  const bedMin = bedTotalMinutes % 60;
  const idealBedtime = `${String(bedHour).padStart(2, '0')}:${String(bedMin).padStart(2, '0')}`;

  return {
    targetDurationHours: targetHours,
    idealBedtime,
    idealWakeTime: preferredWakeTime,
    circadianAdvice: `With ${totalMinutes} active minutes and ${totalBurn} kcal burned today, your physiological recovery index requires ${targetHours} hours of uninterrupted sleep to cycle through 5 essential NREM/REM recovery phases.`,
    windDownProtocol: [
      {
        time: 'T - 90 min',
        step: 'Dim ambient lighting to warm amber; activate Night Shift or blue-blocking glasses to stimulate melatonin synthesis.',
      },
      {
        time: 'T - 60 min',
        step: '10-minute warm shower or bath; the subsequent core body temperature reduction of ~1°C triggers the neural sleep switch.',
      },
      {
        time: 'T - 30 min',
        step: 'Power down electronic screens. Perform 5 minutes of 4-7-8 parasympathetic breathwork or gentle hamstring stretching.',
      },
      {
        time: 'T - 0 min',
        step: 'Maintain bedroom temperature between 65-68°F (18-20°C) with blackout curtains and silent environment.',
      },
    ],
    caffeineCurfew: '14:00 (Minimum 10 hours before planned bedtime to allow hepatic adenosine receptor clearance)',
    recoveryScoreEstimate: totalMinutes > 50 ? 94 : 88,
  };
}

/**
 * Format date string to friendly readable format
 */
export function formatFriendlyDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
