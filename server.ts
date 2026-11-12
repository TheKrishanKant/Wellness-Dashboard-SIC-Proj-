import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client with recommended telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback algorithm for nutrition and sleep calculation based on exercise science
function calculateAlgorithmicInsights(profile: any, activities: any[], sleepLogs: any[]) {
  const weight = profile?.weightKg || 70;
  const height = profile?.heightCm || 175;
  const age = profile?.age || 28;
  const isMale = profile?.gender === 'male';
  const goal = profile?.fitnessGoal || 'maintenance';

  // Mifflin-St Jeor BMR
  const bmr = isMale
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  // Total logged active calories today
  const totalBurnedToday = (activities || []).reduce(
    (sum: number, act: any) => sum + (Number(act.caloriesBurned) || 0),
    0
  );
  const totalActiveMinutes = (activities || []).reduce(
    (sum: number, act: any) => sum + (Number(act.durationMinutes) || 0),
    0
  );

  // Baseline TDEE + exercise burn
  let maintenanceCalories = Math.round(bmr * 1.35 + totalBurnedToday);

  let targetCalories = maintenanceCalories;
  if (goal === 'weight_loss') {
    targetCalories = Math.max(1400, Math.round(maintenanceCalories - 450));
  } else if (goal === 'muscle_gain') {
    targetCalories = Math.round(maintenanceCalories + 350);
  } else if (goal === 'endurance') {
    targetCalories = Math.round(maintenanceCalories + (totalBurnedToday > 400 ? 250 : 100));
  }

  // Protein calculation: 1.8g to 2.2g per kg for active individuals
  const proteinMultiplier = goal === 'muscle_gain' ? 2.2 : goal === 'weight_loss' ? 2.0 : 1.8;
  const proteinGrams = Math.round(weight * proteinMultiplier);
  const fatsGrams = Math.round((targetCalories * 0.25) / 9);
  const remainingCals = targetCalories - proteinGrams * 4 - fatsGrams * 9;
  const carbsGrams = Math.max(80, Math.round(remainingCals / 4));

  // Hydration calculation: 35ml per kg baseline + 500ml per 30m exercise
  const hydrationLiters = Number(
    ((weight * 0.035) + (totalActiveMinutes / 30) * 0.45).toFixed(1)
  );

  // Sleep duration recommendation: baseline 7.5h + extra recovery for high strain
  let suggestedSleepHours = 7.5;
  if (totalActiveMinutes > 60 || totalBurnedToday > 600) {
    suggestedSleepHours = 8.5;
  } else if (totalActiveMinutes > 30) {
    suggestedSleepHours = 8.0;
  }

  const primaryActivity = activities && activities[0] ? activities[0].activityType : 'training';

  return {
    nutrition: {
      dailyCalories: targetCalories,
      bmr: Math.round(bmr),
      burnFromActivity: totalBurnedToday,
      macros: {
        proteinGrams,
        carbsGrams,
        fatsGrams,
      },
      hydrationLiters,
      explanation: `Based on your ${totalActiveMinutes} mins of active training burning ~${totalBurnedToday} kcal today and your goal of ${goal.replace('_', ' ')}, your intake has been adjusted to ${targetCalories} kcal with high-quality protein (${proteinGrams}g) for muscular recovery and ${carbsGrams}g carbohydrates for glycogen replenishment.`,
      mealPlan: [
        {
          meal: 'Breakfast (Energy & Metabolism)',
          targetCalories: Math.round(targetCalories * 0.25),
          suggestion: 'Steel-cut oats topped with whey/plant protein, chia seeds, fresh blueberries, and a dollop of almond butter.',
          focus: 'Complex carbohydrates & sustained amino acid release',
        },
        {
          meal: 'Pre/Post Workout Refuel',
          targetCalories: Math.round(targetCalories * 0.15),
          suggestion: 'Greek yogurt with banana slices and honey, or a recovery shake with electrolyte water.',
          focus: 'Fast glycogen uptake and immediate muscle protein synthesis',
        },
        {
          meal: 'Lunch (Sustained Performance)',
          targetCalories: Math.round(targetCalories * 0.35),
          suggestion: 'Grilled salmon or seasoned tofu bowl with quinoa, roasted sweet potatoes, avocado, and leafy greens.',
          focus: 'Omega-3 fatty acids, anti-inflammatory micronutrients, clean carbs',
        },
        {
          meal: 'Dinner (Restorative Fuel)',
          targetCalories: Math.round(targetCalories * 0.25),
          suggestion: 'Lean chicken breast or tempeh stir-fry with broccoli, bell peppers, brown rice, and extra virgin olive oil drizzle.',
          focus: 'Magnesium-rich greens & tryptophan for nocturnal recovery',
        },
      ],
      micronutrientHighlights: [
        'Magnesium (400mg): Essential for nocturnal muscle relaxation and ATP synthesis.',
        'Potassium & Sodium: Replenishes electrolytes lost through sweat.',
        'Vitamin D3 & Omega-3: Accelerates tissue repair and dampens oxidative soreness.',
      ],
      timingAdvice: 'Aim to consume your largest carbohydrate portions in the meal immediately following your workout to shuttle glucose directly into muscle glycogen stores.',
    },
    sleep: {
      targetDurationHours: suggestedSleepHours,
      idealBedtime: '22:30',
      idealWakeTime: '06:45',
      circadianAdvice: `With ${totalActiveMinutes} minutes of physical exertion, your central nervous system needs ${suggestedSleepHours} hours of consolidated sleep to complete 5 full 90-minute NREM/REM sleep cycles.`,
      windDownProtocol: [
        { time: 'T - 90 min (21:00)', step: 'Dim overhead lights and activate blue-light filters on all screens to prompt natural melatonin surge.' },
        { time: 'T - 60 min (21:30)', step: 'Warm shower or sauna session; peripheral vasodilation cools core body temperature, triggering deep sleep readiness.' },
        { time: 'T - 30 min (22:00)', step: 'Light stretching or 5 minutes of 4-7-8 box breathing to downregulate sympathetic tone.' },
        { time: 'T - 0 min (22:30)', step: 'Ensure bedroom ambient temperature is between 65-68°F (18-20°C) with blacked-out room.' },
      ],
      caffeineCurfew: '14:00 (10 hours prior to bedtime to clear adenosine receptors)',
      recoveryScoreEstimate: totalActiveMinutes > 60 ? 92 : 85,
    },
    generatedBy: 'algorithm',
  };
}

// API endpoint for generating tailored nutrition and sleep recommendations
app.post('/api/gemini/wellness-insights', async (req: Request, res: Response) => {
  const { profile, activities, sleepLogs } = req.body;

  // If Gemini is available, attempt high-precision GenAI synthesis
  if (ai) {
    try {
      const prompt = `You are a world-class sports scientist, registered clinical dietitian, and sleep physiologist.
Analyze the following user health & physical activity profile to generate personalized, science-backed Daily Nutrition Needs and Circadian Sleep Optimization recommendations.

User Profile:
- Name: ${profile?.name || 'Athlete'}
- Age: ${profile?.age || 28}
- Gender: ${profile?.gender || 'not specified'}
- Height: ${profile?.heightCm || 175} cm
- Weight: ${profile?.weightKg || 70} kg
- Fitness Goal: ${profile?.fitnessGoal || 'maintenance'}
- Resting Heart Rate: ${profile?.restingHeartRate || 62} bpm

Physical Activities Logged Today:
${JSON.stringify(activities || [], null, 2)}

Recent Sleep Data:
${JSON.stringify(sleepLogs?.slice(0, 3) || [], null, 2)}

Provide your response in strictly valid JSON format matching this structure:
{
  "nutrition": {
    "dailyCalories": number,
    "bmr": number,
    "burnFromActivity": number,
    "macros": {
      "proteinGrams": number,
      "carbsGrams": number,
      "fatsGrams": number
    },
    "hydrationLiters": number,
    "explanation": "Detailed explanation connecting their logged workouts today to these caloric & macro numbers",
    "mealPlan": [
      {
        "meal": "Breakfast / Lunch / Dinner / Snack name",
        "targetCalories": number,
        "suggestion": "Specific delicious nutrient-dense whole food meal",
        "focus": "Why this specific nutrient combination works for today"
      }
    ],
    "micronutrientHighlights": ["string list of 3-4 key micronutrients needed for today's strain"],
    "timingAdvice": "Nutrient timing advice around their workouts"
  },
  "sleep": {
    "targetDurationHours": number,
    "idealBedtime": "HH:MM",
    "idealWakeTime": "HH:MM",
    "circadianAdvice": "Personalized circadian and sleep architecture advice based on today's physical load",
    "windDownProtocol": [
      { "time": "e.g. 21:00", "step": "Actionable sleep preparation ritual" }
    ],
    "caffeineCurfew": "e.g. 14:00 (Cutoff rationale)",
    "recoveryScoreEstimate": number (0-100)
  }
}
Do not enclose in markdown blocks if possible, just return JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction:
            'You are an expert sports performance doctor, nutritionist, and sleep scientist. Always output strict valid JSON.',
        },
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({
        ...parsed,
        generatedBy: 'gemini-3.8-flash',
      });
    } catch (err) {
      console.error('Gemini API call failed, falling back to evidence-based algorithm:', err);
      // Fallback seamlessly to algorithm
      const fallback = calculateAlgorithmicInsights(profile, activities, sleepLogs);
      return res.json(fallback);
    }
  }

  // If no API key configured, use comprehensive science-backed calculations
  const algorithmicResult = calculateAlgorithmicInsights(profile, activities, sleepLogs);
  return res.json(algorithmicResult);
});

// Interactive AI Coach chat endpoint
app.post('/api/gemini/coach-chat', async (req: Request, res: Response) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are VitalPulse AI Coach, a supportive, ultra-knowledgeable personal wellness coach.
Context about the user:
${JSON.stringify(context || {}, null, 2)}

User asks: "${message}"

Give a warm, concise, scientifically accurate response (2-3 short paragraphs max). Include actionable tips on training, nutrition, or sleep if applicable.`,
      });

      return res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Coach chat error:', err);
      return res.json({
        reply: `Based on your active training and wellness targets, prioritizing adequate protein intake (1.8-2.0g/kg), 3+ liters of hydration, and 8 hours of restorative sleep will give you optimal recovery. Let me know if you want specific meal or routine ideas!`,
      });
    }
  }

  return res.json({
    reply: `Great question! When engaging in consistent physical activity, matching your caloric expenditure with complex carbs before workouts and high-leucine protein post-workout ensures steady energy and muscular recovery. Maintaining a consistent sleep and wake window (+/- 20 mins) also stabilizes circadian melatonin release.`,
  });
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiEnabled: Boolean(geminiApiKey),
    timestamp: new Date().toISOString(),
  });
});

// Start server with Vite middleware in dev or static in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VitalPulse Wellness Dashboard server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
