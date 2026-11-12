import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Moon,
  Apple,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { UserProfile, FitnessGoal } from '../types/wellness';
import { INITIAL_USER } from '../data/initialData';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(26);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [weightKg, setWeightKg] = useState(65);
  const [heightCm, setHeightCm] = useState(170);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('endurance');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDemoLogin = () => {
    onLogin(INITIAL_USER);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (password.length < 4) {
        setErrorMsg('Password should be at least 4 characters.');
        return;
      }

      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        age: Number(age) || 28,
        gender,
        weightKg: Number(weightKg) || 70,
        heightCm: Number(heightCm) || 175,
        restingHeartRate: 60,
        fitnessGoal,
        activityBaseline: 'moderately_active',
        bio: `Focused on ${fitnessGoal.replace('_', ' ')} and peak daily vitality.`,
      };
      onLogin(newUser);
    } else {
      if (!email.trim()) {
        setErrorMsg('Please enter your email.');
        return;
      }
      // Log in with existing or create standard user
      const loggedUser: UserProfile = {
        id: 'user_active',
        name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: email.trim(),
        age: 27,
        gender: 'female',
        weightKg: 64,
        heightCm: 168,
        restingHeartRate: 58,
        fitnessGoal: 'maintenance',
        activityBaseline: 'moderately_active',
        bio: 'Tracking workouts, sleep cycles, and daily nutrition targets.',
      };
      onLogin(loggedUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Brand & Hero Highlights */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PJ2 Personalized Wellness Dashboard</span>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Vital<span className="text-emerald-400">Pulse</span>
            </h1>
          </div>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            A comprehensive, personalized health and physical activity cockpit. Dynamic nutrition needs that adapt to your daily workouts, circadian sleep optimization, and customizable overview widgets.
          </p>

          {/* Value props bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-200">Physical Activity Log</div>
                <div className="text-xs text-slate-400">Detailed exertion, heart rate zones, and calories.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
                <Apple className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-200">Activity-Based Nutrition</div>
                <div className="text-xs text-slate-400">Dynamic macros & meal plans adjusting to training strain.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-200">Circadian Sleep Advisor</div>
                <div className="text-xs text-slate-400">Optimal bedtime, recovery duration, and wind-down ritual.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-200">Customizable Overview</div>
                <div className="text-xs text-slate-400">Toggle exactly what widgets you want to see.</div>
              </div>
            </div>
          </div>

          {/* Quick Demo One-Click Access */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <UserCheck className="w-5 h-5" />
              <span>Launch Demo Account (Alex Chen, Marathoner)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Instant access with preloaded workouts, meal logs, and sleep recovery metrics.
            </p>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Toggle Sign In / Sign Up */}
            <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  !isSignUp
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isSignUp
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                {isSignUp ? 'Create your Health Profile' : 'Welcome back to VitalPulse'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp
                  ? 'Set up your biometric baseline to generate customized nutrition & sleep targets.'
                  : 'Enter your credentials to access your personalized wellness cockpit.'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Taylor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="athlete@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Extra Biometrics for Sign Up */}
              {isSignUp && (
                <div className="space-y-4 pt-1 border-t border-slate-800/80">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Age</label>
                      <input
                        type="number"
                        min="14"
                        max="99"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        min="35"
                        max="220"
                        value={weightKg}
                        onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        min="120"
                        max="230"
                        value={heightCm}
                        onChange={(e) => setHeightCm(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Primary Fitness Goal</label>
                    <select
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="endurance">Endurance & Cardiovascular Performance</option>
                      <option value="muscle_gain">Muscle Hypertrophy & Strength</option>
                      <option value="weight_loss">Fat Loss & Caloric Deficit</option>
                      <option value="maintenance">General Vitality & Longevity</option>
                      <option value="stress_reduction">Recovery & Stress Reduction</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isSignUp ? 'Create Profile & Enter Dashboard' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Client-persisted session</span>
              </span>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2"
              >
                Skip & Use Demo Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
