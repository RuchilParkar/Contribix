'use client';

import React, { useEffect } from 'react';
import { useProfile } from '../../../lib/profile-context';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileCheck,
  Zap,
  BookOpen,
  Users,
  GitPullRequest,
  Sparkles,
} from 'lucide-react';

export default function ScorePage() {
  const { profileData, score, isLoading } = useProfile();

  useEffect(() => {
    if (score && score.overall >= 75) {
      // Fire confetti celebration for high score developers!
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 50 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [score]);

  if (isLoading) {
    return <div className="h-64 bg-slate-900/20 border border-slate-800 rounded-2xl animate-pulse" />;
  }

  if (!profileData || !score) {
    return (
      <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
        <Award className="h-12 w-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No score details computed</h3>
        <p className="text-xs text-slate-400">Search for a developer username above to analyze core scoring indices.</p>
      </div>
    );
  }

  // Score categorizations
  let rankName = 'Junior Contributor';
  let rankColor = 'text-slate-400';
  let bannerColor = 'border-slate-800/40 bg-slate-900/10';

  if (score.overall >= 85) {
    rankName = 'Principal Architect';
    rankColor = 'text-amber-400';
    bannerColor = 'border-amber-500/30 bg-amber-950/10 glow-purple';
  } else if (score.overall >= 70) {
    rankName = 'Senior Engineer';
    rankColor = 'text-purple-400';
    bannerColor = 'border-purple-500/30 bg-purple-950/10';
  } else if (score.overall >= 50) {
    rankName = 'Mid-level Engineer';
    rankColor = 'text-blue-400';
    bannerColor = 'border-blue-500/30 bg-blue-950/10';
  }

  const triggerManualConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Developer Score Engine</h1>
          <p className="text-xs text-slate-400">Evaluate technical capabilities across code volume, repository setups, code reviews, and forks.</p>
        </div>

        <button
          onClick={triggerManualConfetti}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-500/15 transition-all duration-300"
        >
          <Sparkles className="h-3.5 w-3.5" /> Celebrate Score
        </button>
      </div>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overall Circular Gauge & Sub-categories breakdown */}
        <div className="flex flex-col gap-6">
          {/* Circular Gauge Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl border ${bannerColor} flex flex-col items-center justify-center text-center h-[260px] relative overflow-hidden transition-all duration-500`}
          >
            <div className="absolute top-2 right-3 font-mono text-[9px] text-slate-500">ENGINE v1.2</div>
            
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              {/* Radial Progress Track */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(30, 41, 59, 0.6)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={351.8}
                  strokeDashoffset={351.8 - (351.8 * score.overall) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">{score.overall}</span>
                <span className="text-[10px] text-slate-500 font-mono font-semibold">OVERALL SCORE</span>
              </div>
            </div>

            <div>
              <p className={`text-sm font-bold font-mono ${rankColor}`}>{rankName}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Weighted average across telemetry categories</p>
            </div>
          </motion.div>

          {/* Categories list progress */}
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" /> Score Breakdown
            </h3>
            
            <div className="space-y-3">
              {[
                { name: 'Code Activity', score: score.activity, weight: '30%', icon: Zap, color: 'bg-blue-500' },
                { name: 'Project Quality', score: score.quality, weight: '20%', icon: BookOpen, color: 'bg-emerald-500' },
                { name: 'Open Source participation', score: score.openSource, weight: '30%', icon: GitPullRequest, color: 'bg-violet-500' },
                { name: 'Community Reach', score: score.community, weight: '20%', icon: Users, color: 'bg-pink-500' },
              ].map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-slate-500" /> {cat.name}
                      </span>
                      <span className="font-bold text-white font-mono">{cat.score} <span className="text-[9px] text-slate-500 font-normal">w:{cat.weight}</span></span>
                    </div>
                    
                    <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-1.5 rounded-full ${cat.color}`} style={{ width: `${cat.score}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Code Audits Log Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-400" /> Active Profile Audits
            </h3>
            <p className="text-xs text-slate-400">List of scoring checks processed from repository descriptions, contributions count, and code review activity.</p>

            <div className="space-y-3.5 pt-2">
              {score.audits.map((audit, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-4 transition-all duration-350 ${
                    audit.passed
                      ? 'bg-emerald-950/5 border-emerald-900/15 text-emerald-400/80'
                      : 'bg-red-950/5 border-red-900/15 text-red-400/80'
                  }`}
                >
                  <div className="flex gap-3 items-start min-w-0">
                    <div className="mt-0.5 flex-shrink-0">
                      {audit.passed ? (
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
                      )}
                    </div>
                    
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-slate-100 text-xs leading-none">{audit.title}</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{audit.description}</p>
                      <span className="text-[9px] text-slate-500 font-mono capitalize block pt-1">Category: {audit.category}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    {audit.passed ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">PASSED</span>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">DEDUCT</span>
                        <span className="text-[9px] font-mono text-slate-500 block">-{audit.scoreImpact} pts</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-850 mt-6 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>AUDIT COMPILATION: COMPLETED</span>
            <span>VERIFIED BY CONTRIBIX SCORE KERNEL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
