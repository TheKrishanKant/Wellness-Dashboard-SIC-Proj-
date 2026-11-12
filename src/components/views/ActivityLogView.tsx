import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Flame,
  Clock,
  Heart,
  Search,
  Filter,
  Trash2,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PhysicalActivity, ActivityType, IntensityLevel, DashboardSettings } from '../../types/wellness';
import { formatFriendlyDate } from '../../utils/wellnessCalculations';

interface ActivityLogViewProps {
  activities: PhysicalActivity[];
  settings: DashboardSettings;
  onOpenLogModal: () => void;
  onDeleteActivity: (id: string) => void;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({
  activities,
  settings,
  onOpenLogModal,
  onDeleteActivity,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedIntensity, setSelectedIntensity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { units } = settings;

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesType = selectedType === 'all' || act.activityType === selectedType;
    const matchesIntensity = selectedIntensity === 'all' || act.intensityZone === selectedIntensity;
    const matchesSearch =
      searchQuery.trim() === '' ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.notes && act.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesIntensity && matchesSearch;
  });

  // Calculate summary metrics
  const totalBurn = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const totalMinutes = activities.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0);
  const avgHR =
    activities.length > 0
      ? Math.round(activities.reduce((sum, a) => sum + (Number(a.avgHeartRate) || 0), 0) / activities.length)
      : 0;
  const totalDistance = activities.reduce((sum, a) => sum + (Number(a.distanceKm) || 0), 0);

  const activityTypesList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Activities' },
    { id: 'running', label: 'Running' },
    { id: 'cycling', label: 'Cycling' },
    { id: 'strength', label: 'Strength' },
    { id: 'hiit', label: 'HIIT' },
    { id: 'swimming', label: 'Swimming' },
    { id: 'yoga', label: 'Yoga & Mobility' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Hero Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Workouts</span>
          </div>
          <div className="text-2xl font-black text-white">{activities.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Logged in profile</div>
        </div>

        <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Total Active Time</span>
          </div>
          <div className="text-2xl font-black text-white">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{totalMinutes} total minutes</div>
        </div>

        <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Calories Burned</span>
          </div>
          <div className="text-2xl font-black text-white">{totalBurn.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">kcal expended</div>
        </div>

        <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Average Heart Rate</span>
          </div>
          <div className="text-2xl font-black text-white">{avgHR} bpm</div>
          <div className="text-[11px] text-slate-500 mt-1">Cardiovascular average</div>
        </div>
      </div>

      {/* Action Toolbar & Search Filters */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workouts by title, notes, or focus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filters and Log Button */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Intensity selector */}
          <select
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Intensities</option>
            <option value="low">Low (Recovery)</option>
            <option value="moderate">Moderate (Aerobic)</option>
            <option value="high">High (Threshold)</option>
            <option value="peak">Peak (Max Effort)</option>
          </select>

          {/* New workout button */}
          <button
            type="button"
            onClick={onOpenLogModal}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Log New Activity</span>
          </button>
        </div>
      </div>

      {/* Activity Type Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {activityTypesList.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedType(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === tab.id
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Physical Activity Detail Cards List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <Activity className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-300">No matching activities found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or log a new physical workout.
            </p>
            <button
              type="button"
              onClick={onOpenLogModal}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Your First Activity</span>
            </button>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isExpanded = expandedId === act.id;
            const distanceText = act.distanceKm
              ? units === 'imperial'
                ? `${(act.distanceKm * 0.621371).toFixed(1)} mi`
                : `${act.distanceKm} km`
              : null;

            return (
              <div
                key={act.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-all shadow-sm"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white">{act.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            act.intensityZone === 'peak'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : act.intensityZone === 'high'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {act.intensityZone} intensity
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800">
                          {act.activityType}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{formatFriendlyDate(act.date)} at {act.time}</span>
                        </span>
                        {distanceText && (
                          <span className="text-emerald-400 font-semibold">
                            {distanceText}
                          </span>
                        )}
                        {act.cadenceOrReps && (
                          <span className="text-slate-400">
                            • {act.cadenceOrReps}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick metrics & expand toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <div className="font-extrabold text-sm text-white">{act.caloriesBurned} kcal</div>
                        <div className="text-[10px] text-slate-500">Expended</div>
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-slate-200">{act.durationMinutes} min</div>
                        <div className="text-[10px] text-slate-500">Duration</div>
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-emerald-400">{act.avgHeartRate} bpm</div>
                        <div className="text-[10px] text-slate-500">Avg HR</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : act.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse details' : 'Expand physical details'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteActivity(act.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete workout entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">Perceived Exertion (RPE)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white">{act.perceivedEffort} / 10</span>
                          <span className="text-[11px] text-slate-400">
                            ({act.perceivedEffort >= 8 ? 'Very Hard / Anaerobic' : act.perceivedEffort >= 5 ? 'Challenging Aerobic' : 'Light Recovery'})
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">Cardiovascular Peak HR</span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-rose-400">
                            {act.peakHeartRate || act.avgHeartRate + 18} bpm
                          </span>
                          <span className="text-[11px] text-slate-400">(Zone 4/5 Peak)</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">Caloric Burn Rate</span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-amber-400">
                            {(act.caloriesBurned / act.durationMinutes).toFixed(1)} kcal/min
                          </span>
                          <span className="text-[11px] text-slate-400">Average burn</span>
                        </div>
                      </div>
                    </div>

                    {act.notes && (
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                        <span className="text-slate-400 font-semibold block mb-1">Athlete Notes & Sensations:</span>
                        <p className="text-slate-200 leading-relaxed">{act.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
