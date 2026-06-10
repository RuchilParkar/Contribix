'use client';

import React from 'react';
import { useProfile } from '../../../lib/profile-context';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  User,
  GitCommit,
  GitPullRequest,
  CheckSquare,
  Users,
  Folder,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#64748b'];

export default function VisualizerPage() {
  const { profileData, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-slate-900/40 border border-slate-800/60 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900/40 border border-slate-800/60 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-900/40 border border-slate-800/60 rounded-2xl" />
          <div className="h-80 bg-slate-900/40 border border-slate-800/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
        <User className="h-12 w-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No Profile Telemetry Available</h3>
        <p className="text-xs text-slate-400">Search for a developer username in the top header bar to inspect detailed statistics.</p>
      </div>
    );
  }

  const { profile, repos, languages, commitsOverTime, prCount, issueCount, reviewCount, heatmapData } = profileData;

  // Language Distribution Data
  const langData = Object.entries(languages)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  
  const totalLangSize = Object.values(languages).reduce((sum, v) => sum + v, 0);

  // Commit aggregate by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const commitsByMonth = commitsOverTime.reduce((acc, commit) => {
    try {
      const date = new Date(commit.date);
      const m = months[date.getMonth()];
      if (m) {
        acc[m] = (acc[m] || 0) + commit.count;
      }
    } catch {}
    return acc;
  }, {} as Record<string, number>);

  const chartCommitData = months.map(m => ({
    month: m,
    commits: commitsByMonth[m] || 0,
  }));

  // Top 5 Repositories by Star Count
  const topRepos = repos.slice(0, 5).map(r => ({
    name: r.name,
    stars: r.stars,
    forks: r.forks,
  }));

  const totalCommits = heatmapData.reduce((sum, d) => sum + d.count, 0);
  const activeDays = heatmapData.filter(d => d.count > 0).length;

  // Consistency and Health details
  const repoWithDescCount = repos.filter(r => r.description && r.description.length > 5).length;
  const descPercent = repos.length > 0 ? Math.round((repoWithDescCount / repos.length) * 100) : 100;
  const followRatio = profile.following > 0 ? (profile.followers / profile.following).toFixed(1) : profile.followers;
  const consistencyPercent = Math.min(100, Math.round((activeDays / 120) * 100));

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 md:p-8 rounded-2xl glass-panel glow-blue flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden"
      >
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-blue-500/50 shadow-lg object-cover"
        />
        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">{profile.name}</h1>
            <p className="text-sm text-blue-400 font-mono">@{profile.username}</p>
          </div>
          <p className="text-xs sm:text-sm text-slate-350 max-w-2xl leading-relaxed">{profile.bio}</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-slate-500" /> {profile.followers} Followers
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-slate-500" /> {profile.following} Following
            </span>
            <span className="flex items-center gap-1.5">
              <Folder className="h-4 w-4 text-slate-500" /> {profile.publicRepos} Repos
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-500" /> Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Commits', val: totalCommits, label: 'Past year', icon: GitCommit, color: 'text-blue-400' },
          { title: 'Pull Requests', val: prCount, label: 'Contributions', icon: GitPullRequest, color: 'text-violet-400' },
          { title: 'Issues Open/Engaged', val: issueCount, label: 'Problem solving', icon: CheckSquare, color: 'text-emerald-400' },
          { title: 'Active Days', val: `${activeDays} / 365`, label: `${consistencyPercent}% Consistency`, icon: Calendar, color: 'text-amber-400' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * idx }}
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850/60 hover:border-slate-800 transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-400 font-medium">{item.title}</span>
                <Icon className={`h-4.5 w-4.5 ${item.color}`} />
              </div>
              <p className="text-2xl font-black text-white">{item.val}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">{item.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Main Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 flex flex-col h-[350px]"
        >
          <div className="mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" /> Language Distribution
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">By byte volume computed across public repositories</p>
          </div>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            {langData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={langData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {langData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#cbd5e1', fontSize: '12px' }}
                    formatter={(val) => {
                      const numVal = Number(val || 0);
                      return [`${Math.round((numVal / totalLangSize) * 100)}%`, 'Bytes'];
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500">No language data found.</p>
            )}
          </div>
        </motion.div>

        {/* Commit Activity Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 flex flex-col h-[350px]"
        >
          <div className="mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Commit Activity Trends
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Aggregate monthly contributions throughout the calendar year</p>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartCommitData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#cbd5e1', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="commits" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCommits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 4. Repository Leaderboards & Health Audit Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repo Stars & Forks Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 flex flex-col h-[350px]"
        >
          <div className="mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Folder className="h-4 w-4 text-purple-400" /> Repository Leaderboard
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Top public repositories ranked by star and fork engagement</p>
          </div>
          <div className="flex-1 min-h-0">
            {topRepos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRepos} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#cbd5e1', fontSize: '11px' }}
                  />
                  <Bar dataKey="stars" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Stars" maxBarSize={30} />
                  <Bar dataKey="forks" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Forks" maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500">No public repositories found.</p>
            )}
          </div>
        </motion.div>

        {/* Profile Health Report & Growth Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Growth & Health Audit
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-slate-400">Documentation Coverage</span>
                  <span className="text-slate-200">{descPercent}%</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${descPercent}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">Ratio of repositories with taglines or descriptions</span>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-slate-400">Activity Cadence</span>
                  <span className="text-slate-200">{consistencyPercent}%</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${consistencyPercent}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">Active commit days relative to the 120-day standard</span>
              </div>

              <div className="pt-2 border-t border-slate-850 flex flex-col gap-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono">Peer Reviews Completed:</span>
                  <span className="font-semibold text-slate-200">{reviewCount} reviews</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono">Follower Ratio:</span>
                  <span className="font-semibold text-slate-200">{followRatio}x (followers/following)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono">Language Adaptability:</span>
                  <span className="font-semibold text-slate-200">{Object.keys(languages).length} distinct stacks</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-850 mt-6 flex justify-between gap-3 text-[10px] font-mono text-slate-500">
            <span>AUDIT STATUS: ACTIVE</span>
            <span className="text-emerald-400 font-bold">SECURE REPORT</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
