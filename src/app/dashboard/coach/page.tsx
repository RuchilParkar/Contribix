'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '../../../lib/profile-context';
import { getAICoachingAdvice, CoachingReport } from '../../../lib/ai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  Sparkles,
  AlertTriangle,
  FolderLock,
  GitBranch,
  CalendarDays,
  Loader2,
  BookmarkPlus,
  Compass,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'coach';
  text: string;
}

export default function CoachPage() {
  const { profileData, score, isLoading } = useProfile();
  const [advice, setAdvice] = useState<CoachingReport | null>(null);
  const [activeTab, setActiveTab] = useState<'gaps' | 'repos' | 'roadmap' | 'os'>('gaps');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load initial advice and set up welcome message
  useEffect(() => {
    if (profileData && score) {
      // Load general advice
      const loadInitialAdvice = async () => {
        const res = await getAICoachingAdvice(profileData, score);
        setAdvice(res);
        setMessages([
          {
            role: 'coach',
            text: `Hi there! I am your Contribix AI GitHub Coach. I've analyzed your telemetry profile. Your score stands at **${score.overall}/100** (Rank: **${score.overall >= 70 ? 'Senior Engineer' : 'Developer'}**). 

${res.summary}

Ask me anything about learning new programming languages, improving repository quality, or formatting code for recruiter profiles!`,
          },
        ]);
      };
      loadInitialAdvice();
    }
  }, [profileData, score]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !profileData || !score || isTyping) return;

    const userText = chatInput.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Call coaching advice action with the user prompt
      const res = await getAICoachingAdvice(profileData, score, userText);
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'coach',
          text: res.chatResponse || `I've analyzed your profile and recommendation log. To address "${userText}", I suggest reviewing the Skill Gaps and Repository Review recommendations. Let me know if you want detailed notes on code reviews or CI/CD pipelines!`,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'coach', text: "I'm having some trouble analyzing your question right now. Try rephrasing or asking about language choices!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (isLoading) {
    return <div className="h-64 bg-slate-900/20 border border-slate-800 rounded-2xl animate-pulse" />;
  }

  if (!profileData || !score || !advice) {
    return (
      <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
        <Bot className="h-12 w-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No active coaching feed</h3>
        <p className="text-xs text-slate-400">Search for a developer username above to trigger AI analyses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          AI GitHub Coach
          <span className="px-2 py-0.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-[10px] text-blue-400 font-mono font-bold">
            {process.env.NEXT_PUBLIC_OPENAI_API_KEY ? 'OPENAI MODEL' : 'LOCAL ENGINE'}
          </span>
        </h1>
        <p className="text-xs text-slate-400">Personalized portfolio reviews, developer gaps detection, and customized career roadmaps.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Columns (3): Chat panel */}
        <div className="lg:col-span-3 flex flex-col h-[520px] rounded-2xl bg-slate-900/30 border border-slate-850/60 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-850/60 bg-slate-950/20 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20">
              <Bot className="h-4.5 w-4.5 text-blue-400" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">Contribix Coaching Advisor</span>
              <span className="text-[9px] text-slate-500 font-mono">STATUS: ONLINE • SIMULATION ACTIVE</span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`p-2 rounded-xl border flex-shrink-0 w-8 h-8 flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-purple-950/20 border-purple-900/25 text-purple-400'
                    : 'bg-blue-950/20 border-blue-900/25 text-blue-400'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-900/50 border border-slate-850/60 text-slate-300 rounded-tl-none whitespace-pre-wrap'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="p-2 rounded-xl border bg-blue-950/20 border-blue-900/25 text-blue-400 w-8 h-8 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-850/60 text-slate-500 text-xs rounded-tl-none flex items-center gap-1.5 font-mono">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-400" /> Thinking...
                </div>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-850/60 bg-slate-950/25 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask advice (e.g., How can I raise my quality score?)..."
              className="flex-1 px-4 py-2.5 bg-slate-950/50 border border-slate-850 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/80 text-xs"
            />
            <button
              type="submit"
              disabled={isTyping || !chatInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Columns (2): Structured report tables */}
        <div className="lg:col-span-2 flex flex-col h-[520px] rounded-2xl bg-slate-900/30 border border-slate-850/60 overflow-hidden">
          {/* Tabs header */}
          <div className="grid grid-cols-4 border-b border-slate-850/60 bg-slate-950/20 text-center text-[10px] font-mono font-semibold">
            {[
              { id: 'gaps', label: 'Gaps' },
              { id: 'repos', label: 'Repos' },
              { id: 'roadmap', label: 'Roadmap' },
              { id: 'os', label: 'OS Recs' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3.5 border-r border-slate-850 last:border-r-0 transition-colors uppercase ${
                  activeTab === t.id
                    ? 'bg-slate-900/50 text-white border-b-2 border-b-blue-500'
                    : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Details body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTab === 'gaps' && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block mb-1">Skill Gap Analysis</span>
                
                {advice.skillGaps.map((gap, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-purple-900/15 bg-purple-950/5 flex gap-3 text-xs text-slate-300">
                    <AlertTriangle className="h-4.5 w-4.5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{gap}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'repos' && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider block mb-1">Repository Codebase Audit</span>

                {advice.repoImprovements.map((repo, idx) => (
                  <div key={idx} className="space-y-2 p-3.5 rounded-xl border border-slate-850 bg-slate-950/20">
                    <p className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                      <FolderLock className="h-4 w-4 text-blue-400" /> {repo.repoName}
                    </p>
                    <ul className="space-y-1.5 pl-4 list-disc text-slate-400 text-xs leading-normal">
                      {repo.suggestions.map((s, sIdx) => (
                        <li key={sIdx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">Recommended Learning Roadmap</span>

                <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-800">
                  {advice.learningRoadmap.map((phase, idx) => (
                    <div key={idx} className="flex gap-4 items-start text-xs relative">
                      <div className="w-6 h-6 rounded-full border border-slate-850 bg-slate-950 flex items-center justify-center text-amber-400 flex-shrink-0 font-mono text-[10px] z-10">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-200">{phase.phase}</p>
                        <p className="text-[10px] text-amber-500 font-mono">Topic: {phase.topic}</p>
                        <p className="text-[10px] text-slate-400 leading-normal">{phase.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'os' && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">Open Source Recommendations</span>

                {advice.openSourceRecommendations.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-emerald-900/15 bg-emerald-950/5 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-slate-200 flex items-center gap-1.5">
                        <GitBranch className="h-4 w-4 text-emerald-400" /> {rec.title}
                      </p>
                      <span className="text-[9px] font-mono text-emerald-500 px-2 py-0.5 rounded bg-emerald-500/10 font-bold">{rec.issueLevel}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{rec.description}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Stack: {rec.tech}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-850/60 bg-slate-950/20 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>UPDATED REGULARLY</span>
            <span className="text-blue-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
              <BookmarkPlus className="h-3.5 w-3.5" /> Save Roadmap
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
