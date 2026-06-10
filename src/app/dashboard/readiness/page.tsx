'use client';

import React, { useState } from 'react';
import { useProfile } from '../../../lib/profile-context';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Terminal,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

const TRACKS = {
  frontend: {
    name: 'Frontend Engineer',
    requiredLangs: ['TypeScript', 'JavaScript', 'HTML', 'CSS'],
    requiredRepos: 5,
    minStars: 20,
    skills: ['TypeScript Basics', 'React / Next.js Frameworks', 'Tailwind CSS Styling', 'Automated Component Testing'],
    learningPath: 'Advanced React patterns, testing with Jest/Vitest, profiling rendering performance.',
    projects: ['Dynamic Chart Dashboard', 'Real-time Chat App with glassmorphic UI'],
  },
  backend: {
    name: 'Backend Engineer',
    requiredLangs: ['Python', 'Go', 'Rust', 'TypeScript'],
    requiredRepos: 6,
    minStars: 30,
    skills: ['API Endpoint Routing', 'Database migrations (Prisma/SQL)', 'Caching layers (Redis)', 'Concurrency models'],
    learningPath: 'Design RESTful / GraphQL APIs, study query optimizations in PostgreSQL, learn Go/Rust concurrency.',
    projects: ['High-performance microservice compiler', 'Auth.js custom OAuth system'],
  },
  fullstack: {
    name: 'Full Stack Engineer',
    requiredLangs: ['TypeScript', 'JavaScript', 'Python', 'HTML'],
    requiredRepos: 8,
    minStars: 50,
    skills: ['Next.js App Routing', 'Database Schemas', 'State providers context', 'E2E Testing setups'],
    learningPath: 'Master Next.js Server Actions, study Prisma ORM design, practice Cypress E2E integrations.',
    projects: ['Contribix growth tracker platform', 'E-Commerce SaaS Boilerplate'],
  },
  aiml: {
    name: 'AI / ML Engineer',
    requiredLangs: ['Python'],
    requiredRepos: 4,
    minStars: 15,
    skills: ['Data Wrangling (Pandas/NumPy)', 'Model tuning (Scikit-Learn)', 'Neural Network structures', 'OpenAI API schemas'],
    learningPath: 'Study gradient descents, read OpenAI developer logs, optimize data pipelines for LLM fine-tuning.',
    projects: ['Intelligent advice matching model', 'Image classification backend'],
  },
  cybersecurity: {
    name: 'Cybersecurity Engineer',
    requiredLangs: ['Python', 'Go', 'Rust'],
    requiredRepos: 3,
    minStars: 10,
    skills: ['Penetration scripting', 'OAuth Security checks', 'SSL encryption logs', 'Network socket binding'],
    learningPath: 'Study OWASP Top 10 vulnerabilities, build network packet sniffers, learn secure Auth setups.',
    projects: ['Custom token validation checker', 'Secured reverse-proxy server'],
  },
  devops: {
    name: 'DevOps / Site Reliability',
    requiredLangs: ['Go', 'Rust'],
    requiredRepos: 4,
    minStars: 10,
    skills: ['YAML GitHub Actions', 'Docker compose scaling', 'Kubernetes clusters', 'Terraform infrastructure'],
    learningPath: 'Write custom CI/CD build scripts, study Docker image optimizations, configure auto-deployments on Vercel.',
    projects: ['Self-deploying compiler sandbox', 'GitHub Action runner benchmark'],
  },
};

type TrackKey = keyof typeof TRACKS;

export default function ReadinessPage() {
  const { profileData, score, isLoading } = useProfile();
  const [activeTrack, setActiveTrack] = useState<TrackKey>('fullstack');

  if (isLoading) {
    return <div className="h-64 bg-slate-900/20 border border-slate-800 rounded-2xl animate-pulse" />;
  }

  if (!profileData || !score) {
    return (
      <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
        <GraduationCap className="h-12 w-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No active developer profile</h3>
        <p className="text-xs text-slate-400">Search for a developer username above to analyze internship readiness.</p>
      </div>
    );
  }

  const { languages, repos } = profileData;
  const currentTrack = TRACKS[activeTrack];

  // REAL READINESS SCORING ALGORITHM
  // 1. Base score is 45% of overall score
  let readinessScore = Math.round(score.overall * 0.45);

  // 2. Language match bonus (+10% per required language in profile, max 30%)
  currentTrack.requiredLangs.forEach((lang) => {
    if (languages[lang] !== undefined) {
      readinessScore += 10;
    }
  });

  // 3. Repository count matches (+15% if publicRepos >= requiredRepos)
  const repoMeet = repos.length >= currentTrack.requiredRepos;
  if (repoMeet) {
    readinessScore += 15;
  } else {
    readinessScore += Math.round((repos.length / currentTrack.requiredRepos) * 10);
  }

  // 4. Star matches (+10% if totalStars >= minStars)
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const starMeet = totalStars >= currentTrack.minStars;
  if (starMeet) {
    readinessScore += 10;
  } else {
    readinessScore += Math.round((totalStars / currentTrack.minStars) * 5);
  }

  // Cap score at 100%
  readinessScore = Math.min(100, readinessScore);

  // Check missing elements
  const missingLangs = currentTrack.requiredLangs.filter((l) => languages[l] === undefined);
  const missingRepos = repos.length < currentTrack.requiredRepos ? currentTrack.requiredRepos - repos.length : 0;
  const missingStars = totalStars < currentTrack.minStars ? currentTrack.minStars - totalStars : 0;

  // Track descriptions
  let statusBanner = 'border-slate-850/60 bg-slate-900/10';
  let scoreColor = 'text-blue-400';
  let rankLabel = 'BASIC READINESS';

  if (readinessScore >= 80) {
    statusBanner = 'border-emerald-500/20 bg-emerald-950/5';
    scoreColor = 'text-emerald-400';
    rankLabel = 'EXCELLENT FIT';
  } else if (readinessScore >= 60) {
    statusBanner = 'border-purple-500/20 bg-purple-950/5';
    scoreColor = 'text-purple-400';
    rankLabel = 'AVERAGE READINESS';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Internship Readiness</h1>
          <p className="text-xs text-slate-400">Match your GitHub telemetry index against standard engineering career track requirements.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-900/50 p-1 rounded-xl border border-slate-850">
          {Object.entries(TRACKS).map(([key, track]) => (
            <button
              key={key}
              onClick={() => setActiveTrack(key as TrackKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTrack === key
                  ? 'bg-slate-800 text-white font-bold shadow-inner'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              {track.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Readiness gauge & missing gaps */}
        <div className="flex flex-col gap-6">
          {/* Radial progress card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${statusBanner} flex flex-col items-center justify-center text-center h-[260px] relative transition-all duration-500`}
          >
            <div className="absolute top-2.5 right-3 font-mono text-[9px] text-slate-500">TRACK INDEX</div>
            
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(30, 41, 59, 0.4)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={351.8}
                  strokeDashoffset={351.8 - (351.8 * readinessScore) / 100}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ease-out ${scoreColor}`}
                />
              </svg>
              
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">{readinessScore}%</span>
                <span className="text-[9px] text-slate-500 font-mono font-bold">READY</span>
              </div>
            </div>

            <div>
              <p className={`text-xs font-bold font-mono ${scoreColor}`}>{rankLabel}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Target track: {currentTrack.name}</p>
            </div>
          </motion.div>

          {/* Missing Checklist */}
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-purple-400" /> Track Gap Checklist
            </h3>
            
            <div className="space-y-3.5">
              {/* Language checklist */}
              <div className="flex gap-3 text-xs">
                {missingLangs.length === 0 ? (
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4.5 w-4.5 text-purple-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-bold text-slate-200">Required Programming Languages</p>
                  <p className="text-[10px] text-slate-500 font-mono leading-normal pt-0.5">
                    {missingLangs.length === 0 
                      ? '✓ Fully matches: ' + currentTrack.requiredLangs.join(', ')
                      : 'Missing: ' + missingLangs.join(', ')}
                  </p>
                </div>
              </div>

              {/* Repos count checklist */}
              <div className="flex gap-3 text-xs">
                {repoMeet ? (
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4.5 w-4.5 text-purple-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-bold text-slate-200">Codebase Repositories Footprint</p>
                  <p className="text-[10px] text-slate-500 font-mono leading-normal pt-0.5">
                    {repoMeet 
                      ? `✓ Met target: ${repos.length} public repos (target: ${currentTrack.requiredRepos})`
                      : `Requires ${missingRepos} more public repository assets`}
                  </p>
                </div>
              </div>

              {/* Stars checklist */}
              <div className="flex gap-3 text-xs">
                {starMeet ? (
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4.5 w-4.5 text-purple-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-bold text-slate-200">Total Project Star Engagement</p>
                  <p className="text-[10px] text-slate-500 font-mono leading-normal pt-0.5">
                    {starMeet 
                      ? `✓ Met target: ${totalStars} stars accrued (target: ${currentTrack.minStars})`
                      : `Requires ${missingStars} more stars across portfolio repositories`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns (2): Path recommendations & suggested projects */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/30 border border-slate-850/60 flex flex-col justify-between min-h-[460px]">
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-400" /> Career Development Guide
            </h3>

            {/* Core learning path */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-950/20 border border-slate-850">
              <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-wider block">RECOMMENDED LEARNING ROADMAP</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentTrack.learningPath}</p>
            </div>

            {/* Sub-skills list */}
            <div className="space-y-2.5">
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest block">CORE SKILLSETS DEMANDED</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentTrack.skills.map((skill, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950/30 border border-slate-850/40 text-xs text-slate-300 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Project templates */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest block">SUGGESTED PORTFOLIO PROJECTS</span>
              <div className="space-y-2">
                {currentTrack.projects.map((proj, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-850 hover:border-slate-800 bg-slate-950/20 flex justify-between items-center text-xs transition-colors">
                    <div className="flex gap-2.5 items-center">
                      <Terminal className="h-4 w-4 text-purple-400" />
                      <span className="font-semibold text-slate-200">{proj}</span>
                    </div>
                    <span className="text-[10px] text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1.5">
                      Explore spec <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-850 mt-6 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>READINESS MATRIX UPDATE ACCURATE</span>
            <span className="text-blue-400 hover:underline cursor-pointer flex items-center gap-1">
              Save Target Track
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
