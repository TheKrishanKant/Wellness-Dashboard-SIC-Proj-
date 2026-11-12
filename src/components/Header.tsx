import React from 'react';
import {
  Menu,
  Plus,
  Activity,
  Apple,
  Moon,
  Sparkles,
  Calendar,
  Droplet,
} from 'lucide-react';
import { NavTab, UserProfile } from '../types/wellness';

interface HeaderProps {
  currentTab: NavTab;
  user: UserProfile;
  onOpenMobileSidebar: () => void;
  onOpenLogActivity: () => void;
  onOpenLogMeal: () => void;
  onOpenLogSleep: () => void;
  onOpenAICoach: () => void;
  onQuickAddWater: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  user,
  onOpenMobileSidebar,
  onOpenLogActivity,
  onOpenLogMeal,
  onOpenLogSleep,
  onOpenAICoach,
  onQuickAddWater,
}) => {
  const getTabTitles = (tab: NavTab) => {
    switch (tab) {
      case 'overview':
        return {
          title: `Welcome back, ${user.name.split(' ')[0]}`,
          subtitle: "Today's personalized wellness telemetry & activity balance",
        };
      case 'activity':
        return {
          title: 'Physical Activity Log',
          subtitle: 'Track workout exertion, heart rate zones, cadence, and caloric burn',
        };
      case 'nutrition':
        return {
          title: 'Dynamic Nutrition & Diet',
          subtitle: 'Nutritional caloric & macronutrient targets tuned to your workout strain',
        };
      case 'sleep':
        return {
          title: 'Circadian Sleep & Recovery',
          subtitle: 'Optimal bedtime windows, sleep cycles, and cellular recovery protocol',
        };
      case 'analytics':
        return {
          title: 'Wellness Analytics & Trends',
          subtitle: 'Long-term strain vs recovery correlation and habit consistency',
        };
      case 'settings':
        return {
          title: 'Dashboard Settings',
          subtitle: 'Customize overview widget visibility, biometrics, targets, and units',
        };
    }
  };

  const { title, subtitle } = getTabTitles(currentTab);
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{title}</h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>{todayStr}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Quick Water Button */}
          <button
            type="button"
            onClick={onQuickAddWater}
            title="Quick +250ml water intake"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Droplet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">+250ml</span>
            <span>Water</span>
          </button>

          {/* Log Workout Button */}
          <button
            type="button"
            onClick={onOpenLogActivity}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Log Activity</span>
          </button>

          {/* AI Health Coach Trigger */}
          <button
            type="button"
            onClick={onOpenAICoach}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Coach</span>
          </button>
        </div>
      </div>
    </header>
  );
};
