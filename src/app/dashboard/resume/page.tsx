'use client';

import React, { useState, useEffect } from 'react';
import { useProfile } from '../../../lib/profile-context';
import { generateLocalResumeData, ResumeData } from '../../../lib/ai';
import { motion } from 'framer-motion';
import {
  FileText,
  Briefcase,
  Clipboard,
  Check,
  Award,
  Sparkles,
  AlertCircle,
  FileCode,
} from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ResumePage() {
  const { profileData, isLoading } = useProfile();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'linkedin' | 'readme'>('resume');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (profileData) {
      const generated = generateLocalResumeData(profileData);
      setResumeData(generated);
    }
  }, [profileData]);

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return <div className="h-64 bg-slate-900/20 border border-slate-800 rounded-2xl animate-pulse" />;
  }

  if (!profileData || !resumeData) {
    return (
      <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
        <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No active developer telemetry</h3>
        <p className="text-xs text-slate-400">Search for a developer username above to generate resume sections.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white">Resume & Portfolio Assistant</h1>
        <p className="text-xs text-slate-400">Generate copy-paste ready resume bullets, LinkedIn summaries, and customized GitHub Readmes based on your actual coding activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Navigator tabs */}
        <div className="flex flex-col gap-3">
          {[
            { id: 'resume', label: 'Resume Bullets', icon: Briefcase, desc: 'ATS-Friendly accomplishments' },
            { id: 'linkedin', label: 'LinkedIn Summaries', icon: FileText, desc: 'Project descriptions for posts' },
            { id: 'readme', label: 'GitHub README', icon: GithubIcon, desc: 'Markdown portfolio profiles' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 group ${
                  isActive
                    ? 'bg-slate-900 border-slate-750 text-white shadow-inner'
                    : 'bg-slate-900/30 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-lg border mt-0.5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-slate-950 border-slate-850 text-slate-500'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs block leading-none mb-1">{tab.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono block leading-none">{tab.desc}</span>
                </div>
              </button>
            );
          })}

          <div className="p-4 rounded-xl bg-slate-900/10 border border-slate-850/40 text-xs text-slate-500 space-y-2 mt-4">
            <span className="font-bold text-[9px] font-mono text-slate-400 uppercase tracking-widest block">PORTFOLIO NOTE</span>
            <p className="leading-relaxed leading-normal">
              ATS screening systems scan for active metrics (stars, PR numbers, commits). These generators use your verified telemetry to maximize screening success rates.
            </p>
          </div>
        </div>

        {/* Right Columns (3): Active view details */}
        <div className="lg:col-span-3 min-h-[460px] flex flex-col rounded-2xl bg-slate-900/30 border border-slate-850/60 overflow-hidden justify-between">
          <div className="p-6 space-y-5">
            {activeTab === 'resume' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-white">ATS Resume Achievements</h3>
                    <p className="text-[10px] font-mono text-slate-500">Quantifiable performance bullets for your technical experience section</p>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(resumeData.bullets.join('\n'), 'all-bullets')}
                    className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900 text-[10px] font-mono font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === 'all-bullets' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
                    {copiedId === 'all-bullets' ? 'Copied' : 'Copy All'}
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {resumeData.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-850 bg-slate-950/20 group relative hover:border-slate-800 transition-colors"
                    >
                      <p className="text-xs text-slate-300 leading-relaxed pr-8">{bullet}</p>
                      
                      <button
                        onClick={() => handleCopyToClipboard(bullet, `b-${idx}`)}
                        className="absolute right-3.5 top-3.5 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Copy bullet"
                      >
                        {copiedId === `b-${idx}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'linkedin' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white">LinkedIn Project Summaries</h3>
                  <p className="text-[10px] font-mono text-slate-500">Sleek descriptive copy to showcase your creations to recruiters and developer connections</p>
                </div>

                <div className="space-y-4 pt-2">
                  {resumeData.linkedinDesc.map((project, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-850 bg-slate-950/20 space-y-2 relative group hover:border-slate-800 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-200">{project.projectName}</span>
                        <button
                          onClick={() => handleCopyToClipboard(project.description, `l-${idx}`)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
                          title="Copy project description"
                        >
                          {copiedId === `l-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'readme' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <FileCode className="h-4 w-4 text-purple-400" /> GitHub Profile README Template
                    </h3>
                    <p className="text-[10px] font-mono text-slate-500">Copy this markup code directly into your username's README repository</p>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(resumeData.profileReadme, 'readme-markdown')}
                    className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900 text-[10px] font-mono font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === 'readme-markdown' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
                    {copiedId === 'readme-markdown' ? 'Copied Markdown' : 'Copy README'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850/60 max-h-[300px] overflow-y-auto">
                  <pre className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap leading-normal">
                    {resumeData.profileReadme}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-850/60 bg-slate-950/20 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>RESUME SYNCHRONIZER ACTIVE</span>
            <span>VERIFIED ATS FORMAT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
