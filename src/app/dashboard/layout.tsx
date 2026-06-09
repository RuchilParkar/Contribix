'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  GitPullRequest,
  Award,
  Bot,
  FileText,
  GraduationCap,
  Search,
  Menu,
  X,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { ProfileProvider, useProfile } from '../../lib/profile-context';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { username, profileData, isLoading, searchProfile, error } = useProfile();
  
  const [searchInput, setSearchInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Profile Visualizer', href: '/dashboard/visualizer', icon: BarChart3, color: 'text-blue-500' },
    { name: 'Heatmap Studio', href: '/dashboard/heatmap', icon: Calendar, color: 'text-emerald-500' },
    { name: 'Open Source Tracker', href: '/dashboard/tracker', icon: GitPullRequest, color: 'text-violet-500' },
    { name: 'Developer Score', href: '/dashboard/score', icon: Award, color: 'text-amber-500' },
    { name: 'AI GitHub Coach', href: '/dashboard/coach', icon: Bot, color: 'text-fuchsia-500' },
    { name: 'Resume Assistant', href: '/dashboard/resume', icon: FileText, color: 'text-indigo-500' },
    { name: 'Internship Readiness', href: '/dashboard/readiness', icon: GraduationCap, color: 'text-cyan-500' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchProfile(searchInput);
      setSearchInput('');
      setIsMobileMenuOpen(false);
    }
  };

  const activeUser = profileData?.profile;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans grid-bg">
      {/* Glow overlays */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none animate-pulse-slow"></div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900/40 border-r border-slate-800/60 backdrop-blur-md sticky top-0 h-screen z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-850/60">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-md">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Contribix
            </span>
            <span className="text-[10px] block text-slate-500 font-mono">DEV ENGINE v1.0</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  isActive
                    ? 'bg-slate-800/60 border border-slate-700/50 shadow-inner text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/30 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? item.color : 'text-slate-500 group-hover:text-slate-300'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-850/60 bg-slate-950/20">
          {isLoading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ) : activeUser ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/30 border border-slate-800/40">
              <img
                src={activeUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={activeUser.name}
                className="w-9 h-9 rounded-full border border-slate-700/60 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{activeUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate">@{activeUser.username}</p>
              </div>
              <a
                href={`https://github.com/${activeUser.username}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center">No profile active</p>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 bg-slate-950/70 border-b border-slate-850/60 backdrop-blur-md py-4 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-white md:hidden transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Breadcrumb or title */}
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-slate-400 font-mono">
                {pathname?.split('/').pop()?.toUpperCase() || 'DASHBOARD'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="relative w-44 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search github username..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/60 border border-slate-800 rounded-full focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 text-slate-200 placeholder-slate-500 transition-all duration-300"
              />
            </form>

            {/* Quick stats / profile link */}
            {!isLoading && activeUser && (
              <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400 border-l border-slate-850 pl-4">
                <div>
                  <span className="text-slate-500 font-mono">REPOS:</span>{' '}
                  <span className="font-semibold text-slate-300">{activeUser.publicRepos}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono">FOLLOWERS:</span>{' '}
                  <span className="font-semibold text-slate-300">{activeUser.followers}</span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <span className="font-bold text-lg text-white">Contribix Navigation</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                      isActive ? 'bg-slate-900 border border-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-slate-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Primary Page Canvas */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-900/30 bg-red-950/20 text-red-400 text-sm flex justify-between items-center">
              <span>⚠️ {error} Using offline mock simulation instead.</span>
              <button
                onClick={() => searchProfile(username)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-900/30 hover:bg-red-900/50 text-xs font-medium text-white transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <DashboardShell>{children}</DashboardShell>
    </ProfileProvider>
  );
}
