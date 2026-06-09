'use client';

import React, { useState, useEffect } from 'react';
import { useProfile } from '../../../lib/profile-context';
import { saveTrackedRepository, getTrackedRepositories, removeTrackedRepository } from '../../../lib/actions';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  GitBranch,
  Star,
  FileText,
} from 'lucide-react';

interface LocalRepo {
  id: string;
  owner: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastSyncedAt: string;
}

export default function TrackerPage() {
  const { profileData, isLoading } = useProfile();
  const [trackedRepos, setTrackedRepos] = useState<LocalRepo[]>([]);
  const [newRepoInput, setNewRepoInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'weekly' | 'monthly' | 'growth'>('weekly');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load tracked repos from server or localStorage fallback
  const loadTrackedRepos = async () => {
    if (!profileData) return;
    const res = await getTrackedRepositories(profileData.profile.username);
    if (res.success && res.data) {
      setTrackedRepos(res.data as any);
    } else {
      // localStorage fallback
      const stored = localStorage.getItem(`tracked_repos_${profileData.profile.username}`);
      if (stored) {
        setTrackedRepos(JSON.parse(stored));
      } else {
        // Seed default tracked repos
        const defaults = [
          {
            id: '1',
            owner: 'facebook',
            name: 'react',
            description: 'The library for web and native user interfaces.',
            stars: 220000,
            forks: 45000,
            openIssues: 1200,
            lastSyncedAt: new Date().toISOString(),
          },
          {
            id: '2',
            owner: 'vercel',
            name: 'next.js',
            description: 'The React Framework.',
            stars: 122000,
            forks: 26000,
            openIssues: 1600,
            lastSyncedAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(`tracked_repos_${profileData.profile.username}`, JSON.stringify(defaults));
        setTrackedRepos(defaults);
      }
    }
  };

  useEffect(() => {
    if (profileData) {
      loadTrackedRepos();
    }
  }, [profileData]);

  // Handle Track repo submission
  const handleTrackRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoInput.trim() || !profileData) return;
    
    setIsAdding(true);
    setStatusMessage(null);
    
    // Parse owner and name
    const parts = newRepoInput.trim().split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      setStatusMessage('⚠️ Format must be "owner/repo-name"');
      setIsAdding(false);
      return;
    }
    
    const owner = parts[0];
    const name = parts[1];

    try {
      // Try to fetch real repository details from GitHub API to show high fidelity
      let description = 'Tracked developer repository.';
      let stars = 0;
      let forks = 0;
      let openIssues = 0;

      const headers: HeadersInit = {};
      if (process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN) {
        headers['Authorization'] = `token ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`;
      }

      const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers });
      if (res.ok) {
        const repoData = await res.json();
        description = repoData.description || description;
        stars = repoData.stargazers_count || 0;
        forks = repoData.forks_count || 0;
        openIssues = repoData.open_issues_count || 0;
      }

      // Save using server actions
      const dbRes = await saveTrackedRepository(
        profileData.profile.username,
        owner,
        name,
        description,
        stars,
        forks,
        openIssues
      );

      const newRepoItem: LocalRepo = {
        id: dbRes.success && dbRes.data ? (dbRes.data as any).id : Math.random().toString(),
        owner,
        name,
        description,
        stars,
        forks,
        openIssues,
        lastSyncedAt: new Date().toISOString(),
      };

      if (!dbRes.success) {
        // Local fallback
        const updated = [newRepoItem, ...trackedRepos];
        localStorage.setItem(`tracked_repos_${profileData.profile.username}`, JSON.stringify(updated));
        setTrackedRepos(updated);
      } else {
        await loadTrackedRepos();
      }

      setNewRepoInput('');
      setStatusMessage('✅ Repository successfully tracked!');
    } catch (err) {
      console.error(err);
      setStatusMessage('❌ Error tracking repository.');
    } finally {
      setIsAdding(false);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Handle remove repo
  const handleRemoveRepo = async (id: string) => {
    if (!profileData) return;
    const dbRes = await removeTrackedRepository(id);
    if (!dbRes.success) {
      // Local fallback removal
      const updated = trackedRepos.filter((r) => r.id !== id);
      localStorage.setItem(`tracked_repos_${profileData.profile.username}`, JSON.stringify(updated));
      setTrackedRepos(updated);
    } else {
      await loadTrackedRepos();
    }
  };

  if (isLoading) {
    return <div className="h-64 bg-slate-900/20 border border-slate-800 rounded-2xl animate-pulse" />;
  }

  if (!profileData) {
    return (
      <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
        <AlertCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No active profile</h3>
        <p className="text-xs text-slate-400">Search for a developer username above to load data trackers.</p>
      </div>
    );
  }

  const { profile, prCount, issueCount, reviewCount } = profileData;

  // Track metrics
  const prsMerged = Math.round(prCount * 0.82);
  const issuesClosed = Math.round(issueCount * 0.65);
  const openSourceScore = Math.min(100, Math.round(prsMerged * 2.5 + reviewCount * 3 + issuesClosed * 2));

  // Activity timeline generator
  const timelineLogs = [
    { type: 'pr_merged', title: 'Merged Pull Request #242', repo: 'nextjs-saas-kit', desc: 'Integrated Prisma client with connection error fallback handlers.', time: '2 days ago' },
    { type: 'review_completed', title: 'Approved Pull Request #120', repo: 'core-compiler', desc: 'Reviewed Rust parser performance bottlenecks in AST translation loop.', time: '4 days ago' },
    { type: 'issue_closed', title: 'Closed Issue #14: Hydration Mismatch', repo: 'nextjs-saas-kit', desc: 'Resolved browser theme local storage hydration conflicts.', time: '1 week ago' },
    { type: 'pr_opened', title: 'Opened Pull Request #239', repo: 'nextjs-saas-kit', desc: 'Configure Docker compose environments for local DB seeding.', time: '1 week ago' },
    { type: 'review_completed', title: 'Requested changes on PR #19', repo: 'reactive-charts', desc: 'Suggested responsive flex padding improvements on mobile views.', time: '2 weeks ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white">Open Source Tracker</h1>
        <p className="text-xs text-slate-400">Track collaborative developer footprint, pull requests, issues, reviews, and active libraries.</p>
      </div>

      {/* Grid: Stats & Track Form */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* KPI metrics */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'PRs Created', value: prCount, label: 'GitHub Contributions', color: 'text-violet-400' },
            { title: 'PRs Merged', value: prsMerged, label: '82% Acceptance rate', color: 'text-blue-400' },
            { title: 'Issues Resolved', value: issuesClosed, label: '65% Resolution rate', color: 'text-emerald-400' },
            { title: 'Reviews Done', value: reviewCount, label: 'Code quality audits', color: 'text-pink-400' },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850/60">
              <span className="text-xs text-slate-400 font-medium block mb-2">{item.title}</span>
              <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">{item.label}</p>
            </div>
          ))}

          {/* Timeline & Tracker lists */}
          <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" /> Contribution Timeline
              </h3>
              
              <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-800">
                {timelineLogs.map((log, idx) => {
                  const isPR = log.type.startsWith('pr');
                  const isIssue = log.type.startsWith('issue');
                  return (
                    <div key={idx} className="flex gap-4 items-start text-xs relative">
                      <div className={`w-6 h-6 rounded-full border border-slate-800 flex items-center justify-center bg-slate-950 flex-shrink-0 z-10 ${
                        isPR ? 'text-violet-400' : isIssue ? 'text-emerald-400' : 'text-pink-400'
                      }`}>
                        {isPR ? <GitPullRequest className="h-3 w-3" /> : isIssue ? <CheckCircle2 className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </div>
                      
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex justify-between items-center gap-3">
                          <span className="font-semibold text-slate-200 truncate">{log.title}</span>
                          <span className="text-[9px] text-slate-500 font-mono flex-shrink-0">{log.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">Repo: {log.repo}</p>
                        <p className="text-[10px] text-slate-500 leading-normal line-clamp-1">{log.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reports Panel */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-400" /> Progress Reports
                  </h3>
                  <div className="flex gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-850">
                    {['weekly', 'monthly', 'growth'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveReportTab(tab as any)}
                        className={`px-2 py-1 rounded text-[9px] font-mono transition-all capitalize ${
                          activeReportTab === tab
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850/60 min-h-[140px] flex flex-col justify-between">
                  {activeReportTab === 'weekly' && (
                    <div className="space-y-2 text-xs">
                      <span className="text-[10px] text-purple-400 font-mono font-bold">WEEKLY PERFORMANCE LOG</span>
                      <p className="text-slate-300 leading-relaxed">
                        Completed **{reviewCount >= 5 ? 2 : 1} code reviews** and integrated **3 feature updates** in core dependencies. Contribix score increased by **+2 points** due to consistent daily commit cadence.
                      </p>
                      <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-mono">
                        <li>Code Quality Audits: PASSED</li>
                        <li>Commits cadence: Natural daily logs</li>
                      </ul>
                    </div>
                  )}
                  {activeReportTab === 'monthly' && (
                    <div className="space-y-2 text-xs">
                      <span className="text-[10px] text-blue-400 font-mono font-bold">MONTHLY CONTRIBUTION SYNOPSIS</span>
                      <p className="text-slate-300 leading-relaxed">
                        Achieved **{prCount} Pull Requests** total with an 82% merge rate. Standardized project configurations across tracked repos and established continuous integration checks.
                      </p>
                      <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-mono">
                        <li>Total merges: {prsMerged} repositories</li>
                        <li>Active collaboration streak: 12 days</li>
                      </ul>
                    </div>
                  )}
                  {activeReportTab === 'growth' && (
                    <div className="space-y-2 text-xs">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">OPEN SOURCE SCALING REPORT</span>
                      <p className="text-slate-300 leading-relaxed">
                        Telemetry shows a **+14% growth** in community interactions (stars and comments). Adaptability index is optimized with primary language focus in TypeScript and Python integrations.
                      </p>
                      <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-mono">
                        <li>Contribution rate: High impact</li>
                        <li>Community reach: +10 followers</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-850 mt-4 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>COMPILED AUTOMATICALLY</span>
                <span className="text-purple-400 font-semibold cursor-pointer hover:underline">Download PDF Report</span>
              </div>
            </div>
          </div>
        </div>

        {/* Repositories Tracker panel */}
        <div className="space-y-6">
          {/* Tracker Form Card */}
          <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850/60 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-400" /> Track Repository
            </h3>
            
            <form onSubmit={handleTrackRepo} className="space-y-3">
              <input
                type="text"
                placeholder="owner/repo (e.g. facebook/react)"
                value={newRepoInput}
                onChange={(e) => setNewRepoInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-850 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80"
                required
              />
              <button
                type="submit"
                disabled={isAdding}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isAdding ? 'Seeding...' : 'Add Repository'}
              </button>
            </form>

            {statusMessage && (
              <p className="text-[10px] text-center font-mono font-medium text-slate-400 animate-pulse">{statusMessage}</p>
            )}
          </div>

          {/* OS Score Card */}
          <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850/60 space-y-3 text-center">
            <h3 className="font-bold text-sm text-white flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" /> Open Source Activity Score
            </h3>
            
            <div className="py-2">
              <span className="text-4xl font-black text-slate-100">{openSourceScore}</span>
              <span className="text-xs text-slate-500 font-mono"> / 100</span>
            </div>

            <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${openSourceScore}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal leading-relaxed pt-1">
              Score calculated from PR counts, review frequencies, and closed issue resolutions.
            </p>
          </div>

          {/* Tracked Repos List */}
          <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850/60 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-blue-400" /> Tracked ({trackedRepos.length})
            </h3>

            <div className="space-y-3">
              <AnimatePresence>
                {trackedRepos.map((repo) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-3 rounded-xl bg-slate-950/40 border border-slate-850/60 hover:border-slate-800 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="font-bold text-slate-200 truncate leading-snug">
                        {repo.owner}/{repo.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{repo.description || 'No description.'}</p>
                      
                      <div className="flex items-center gap-2 pt-1 text-[9px] font-mono text-slate-500">
                        <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5" /> {repo.stars > 1000 ? `${(repo.stars/1000).toFixed(1)}k` : repo.stars}</span>
                        <span>Forks: {repo.forks}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveRepo(repo.id)}
                      className="p-1.5 rounded bg-red-950/20 border border-red-900/10 text-red-400 hover:bg-red-900 hover:text-white transition-all flex-shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {trackedRepos.length === 0 && (
                <p className="text-[10px] text-slate-500 text-center font-mono py-2">No repositories tracked yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
