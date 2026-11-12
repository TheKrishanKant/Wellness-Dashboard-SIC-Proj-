import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Apple,
  Moon,
  BarChart3,
  Settings,
  LogOut,
  User,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { NavTab, UserProfile } from '../types/wellness';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserProfile;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  todayCaloriesBurned: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  todayCaloriesBurned,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'nutrition', label: 'Nutrition & Diet', icon: Apple, badge: 'Dynamic' },
    { id: 'sleep', label: 'Sleep & Recovery', icon: Moon },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">VitalPulse</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  PJ2
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Personalized Wellness</p>
            </div>
          </div>
        </div>

        {/* User Mini Stat Card */}
        <div className="px-4 py-3 mx-4 my-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400 capitalize">{user.fitnessGoal.replace('_', ' ')}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md text-[11px] font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{todayCaloriesBurned} kcal</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-slate-950/30 text-slate-950'
                          : 'bg-emerald-500/15 text-emerald-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-slate-950" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* AI Assistant Banner in Sidebar */}
        <div className="p-3 mx-4 mb-3 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/30 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gemini AI Health Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Nutrition & sleep recommendations dynamically adapt whenever you log physical activities.
          </p>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[130px]">{user.email}</span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
