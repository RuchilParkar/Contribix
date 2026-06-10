'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  BarChart3,
  Calendar,
  GitPullRequest,
  Award,
  Bot,
  FileText,
  GraduationCap,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Home() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      router.push(`/dashboard/visualizer?user=${encodeURIComponent(usernameInput.trim())}`);
    }
  };

  const features = [
    {
      title: 'Profile Visualizer',
      description: 'Analyze language breakdowns, repo statistics, and consistency trends with interactive analytics.',
      icon: BarChart3,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Heatmap Studio',
      description: 'Design custom contribution maps using grid drawing, typography rendering, and custom color themes.',
      icon: Calendar,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Open Source Tracker',
      description: 'Track pull requests, review metrics, and active issue threads with an open-source score.',
      icon: GitPullRequest,
      color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
      iconColor: 'text-violet-400',
    },
    {
      title: 'Developer Score Engine',
      description: 'Get an objective 0-100 rating based on commits, complexity, community, and code quality benchmarks.',
      icon: Award,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      title: 'AI GitHub Coach',
      description: 'Receive personalized portfolio recommendations and repository reviews from our simulated AI mentor.',
      icon: Bot,
      color: 'from-fuchsia-500/20 to-fuchsia-600/10 border-fuchsia-500/30',
      iconColor: 'text-fuchsia-400',
    },
    {
      title: 'Resume & Portfolio Assistant',
      description: 'Convert repository data into ATS-friendly bullets, LinkedIn summaries, and custom README structures.',
      icon: FileText,
      color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'Internship Readiness',
      description: 'Select engineering career tracks (Backend, Full Stack, DevOps) to identify missing skills and paths.',
      icon: GraduationCap,
      color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans grid-bg relative overflow-hidden flex flex-col justify-between">
      {/* Background Glow Filters */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none animate-pulse-slow"></div>

      {/* Navigation Header */}
      <header className="border-b border-slate-900/60 bg-slate-950/45 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600">
              <Zap className="h-5.5 w-5.5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Contribix
            </span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 hover:text-white transition-all duration-300"
          >
            <GithubIcon className="h-4 w-4" /> Connect GitHub
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center z-10">
        <div className="text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide animate-pulse">
            <Zap className="h-3.5 w-3.5" /> REVOLUTIONIZING DEVELOPER GROWTH & ANALYTICS
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Your GitHub Activity, <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Supercharged & Visualized
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Analyze code metrics, design custom calendar grids, audit developer score health, and get AI-driven career path guidelines to ship like a production full-stack engineer.
          </p>

          {/* Search/Enter Form */}
          <form onSubmit={handleSubmit} className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter GitHub Username (e.g., RuchilParkar)"
                className="w-full pl-5 pr-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-200 placeholder-slate-500 shadow-inner text-sm transition-all duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-semibold text-sm text-white shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Analyze Profile <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Prompt suggestions */}
          <div className="flex items-center justify-center gap-2.5 text-xs text-slate-500">
            <span>Try searching:</span>
            {['RuchilParkar', 'yyx990803', 'addyosmani'].map((name) => (
              <button
                key={name}
                onClick={() => setUsernameInput(name)}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 hover:text-slate-300 border border-slate-850 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Grid Overview */}
        <div className="pt-24 space-y-8 w-full">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Advanced Modules</h2>
            <p className="text-xs text-slate-400">Everything you need to visualize contributions, build resumes, and scale technical portfolios.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  onClick={() => router.push(`/dashboard/visualizer?user=RuchilParkar`)}
                  className={`p-6 rounded-2xl bg-gradient-to-b ${feat.color} border backdrop-blur-sm hover:scale-[1.02] hover:bg-slate-900/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between`}
                >
                  <div>
                    <div className={`p-2.5 rounded-xl bg-slate-950/80 w-11 h-11 flex items-center justify-center mb-4 border border-slate-850 group-hover:scale-110 transition-transform ${feat.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-slate-200">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-300 text-xs font-semibold pt-4">
                    Explore module <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Impact Section */}
        <section className="pt-28 pb-12 w-full max-w-5xl">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-tr from-slate-900/60 to-purple-950/20 border border-slate-850/60 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl md:text-3xl font-black text-white">Portfolios with Proof, Not Placeholders.</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Contribix empowers developers to audit their actual contributions, identify coding gaps, learn missing elements, and download structured resume highlights based directly on raw commit data.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  '100% Offline Mode Mock Data',
                  'Dynamic Score Checklists',
                  'Framer Motion UI Glows',
                  'AI Portfolio Advisory',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-[320px] h-[220px] rounded-2xl bg-gradient-to-br from-blue-600/10 via-purple-600/15 to-emerald-600/10 border border-slate-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              {/* Card visual elements */}
              <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest block mb-1">Developer Score Card</span>
                <span className="text-2xl font-black text-white">Contribix Index</span>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">87</span>
                <span className="text-sm font-mono text-slate-500">/ 100</span>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-3">
                <span className="text-slate-400 font-mono">RANK: SENIOR DEV</span>
                <span className="text-emerald-400 font-bold font-mono">PASSED</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950/20 py-8 text-center text-xs text-slate-500">
        <p>© 2026 Contribix Platform. Empowering code quality, contribution consistency, and developer portfolios.</p>
      </footer>
    </div>
  );
}
