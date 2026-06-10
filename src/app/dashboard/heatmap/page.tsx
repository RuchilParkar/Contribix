'use client';

import React, { useState, useEffect } from 'react';
import {
  createEmptyGrid,
  convertTextToGrid,
  PRESETS,
  estimateCommitRequirements,
  generateCommitBashScript,
  DesignGrid,
} from '../../../lib/pattern-utils';
import { motion } from 'framer-motion';
import {
  Eraser,
  Play,
  RotateCcw,
  Download,
  Terminal,
  Type,
  LayoutGrid,
  Flame,
} from 'lucide-react';

const THEMES = {
  classic: {
    name: 'GitHub Classic',
    bg: '#0d1117',
    gridBorder: 'border-slate-800',
    cells: ['bg-[#161b22]', 'bg-[#0e4429]', 'bg-[#006d32]', 'bg-[#26a641]', 'bg-[#39d353]'],
    hex: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  },
  cyberpunk: {
    name: 'Cyberpunk',
    bg: '#0c0714',
    gridBorder: 'border-purple-900/30',
    cells: ['bg-[#1e1b4b]', 'bg-[#3b0764]', 'bg-[#6d28d9]', 'bg-[#d946ef]', 'bg-[#39ff14]'],
    hex: ['#1e1b4b', '#3b0764', '#6d28d9', '#d946ef', '#39ff14'],
  },
  ocean: {
    name: 'Ocean Blue',
    bg: '#030712',
    gridBorder: 'border-cyan-950',
    cells: ['bg-[#0f172a]', 'bg-[#0e7490]', 'bg-[#06b6d4]', 'bg-[#22d3ee]', 'bg-[#67e8f9]'],
    hex: ['#0f172a', '#0e7490', '#06b6d4', '#22d3ee', '#67e8f9'],
  },
  purple: {
    name: 'Midnight Purple',
    bg: '#05000a',
    gridBorder: 'border-pink-950',
    cells: ['bg-[#120024]', 'bg-[#4a044e]', 'bg-[#701a75]', 'bg-[#d946ef]', 'bg-[#f472b6]'],
    hex: ['#120024', '#4a044e', '#701a75', '#d946ef', '#f472b6'],
  },
  emerald: {
    name: 'Emerald',
    bg: '#010503',
    gridBorder: 'border-emerald-950',
    cells: ['bg-[#022c22]', 'bg-[#064e3b]', 'bg-[#047857]', 'bg-[#10b981]', 'bg-[#34d399]'],
    hex: ['#022c22', '#064e3b', '#047857', '#10b981', '#34d399'],
  },
};

type ThemeKey = keyof typeof THEMES;

export default function HeatmapStudioPage() {
  const [grid, setGrid] = useState<DesignGrid>(createEmptyGrid());
  const [brushLevel, setBrushLevel] = useState<number>(4); // Default to full color brush
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('classic');
  const [textModeInput, setTextModeInput] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState<number>(4); // multiplier for estimation

  const estimation = estimateCommitRequirements(grid, intensity);
  const selectedTheme = THEMES[currentTheme];

  // Mouse drag draw handlers
  const handleCellPaint = (r: number, c: number) => {
    if (isPlaying) return;
    const nextGrid = grid.map((rowArr, rowIdx) =>
      rowArr.map((cellVal, colIdx) => {
        if (rowIdx === r && colIdx === c) {
          return brushLevel;
        }
        return cellVal;
      })
    );
    setGrid(nextGrid);
  };

  const handleMouseDown = (r: number, c: number) => {
    setIsDrawing(true);
    handleCellPaint(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDrawing) {
      handleCellPaint(r, c);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Text Rendering trigger
  const applyTextToGrid = () => {
    if (!textModeInput.trim()) return;
    const textGrid = convertTextToGrid(textModeInput);
    setGrid(textGrid);
  };

  // Preset loading trigger
  const loadPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setGrid(preset.grid);
    }
  };

  // Replay Drawing Playback
  const handlePlayback = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Find all active pixels
    const activePixels: { r: number; c: number; level: number }[] = [];
    for (let c = 0; c < 53; c++) {
      for (let r = 0; r < 7; r++) {
        if (grid[r]?.[c] && (grid[r]?.[c] as number) > 0) {
          activePixels.push({ r, c, level: grid[r]![c] as number });
        }
      }
    }

    if (activePixels.length === 0) {
      setIsPlaying(false);
      return;
    }

    // Reset grid
    setGrid(createEmptyGrid());

    let i = 0;
    const interval = setInterval(() => {
      if (i >= activePixels.length) {
        clearInterval(interval);
        setIsPlaying(false);
        return;
      }
      
      const pixel = activePixels[i];
      if (pixel) {
        setGrid(prev => prev.map((rowArr, rowIdx) =>
          rowArr.map((cellVal, colIdx) => {
            if (rowIdx === pixel.r && colIdx === pixel.c) {
              return pixel.level;
            }
            return cellVal;
          })
        ));
      }
      i++;
    }, 40);
  };

  // Export SVG function
  const handleExportSVG = () => {
    const cellSize = 10;
    const gap = 2;
    const width = 53 * (cellSize + gap) + 20;
    const height = 7 * (cellSize + gap) + 20;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background: ${selectedTheme.bg}; padding: 10px; border-radius: 8px;">`;

    for (let c = 0; c < 53; c++) {
      for (let r = 0; r < 7; r++) {
        const val = grid[r]?.[c] || 0;
        const color = selectedTheme.hex[val];
        const x = c * (cellSize + gap) + 10;
        const y = r * (cellSize + gap) + 10;
        svgContent += `\n  <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="1.5" ry="1.5" fill="${color}" />`;
      }
    }

    svgContent += '\n</svg>';

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contribix-art.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download Commit Script
  const handleDownloadScript = () => {
    const script = generateCommitBashScript(estimation, 'contribix-art');
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'make-art.sh';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Heatmap Studio</h1>
          <p className="text-xs text-slate-400">Design art on your GitHub contribution calendar and compile backdated Git commits.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(THEMES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setCurrentTheme(key as ThemeKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                currentTheme === key
                  ? 'bg-slate-800 border-slate-700 text-white font-semibold shadow-inner'
                  : 'bg-slate-900/40 border-slate-850 text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Draw Board Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Calendar Drawing Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl border ${selectedTheme.gridBorder} transition-all duration-500`}
            style={{ backgroundColor: selectedTheme.bg }}
          >
            {/* Days list helper label */}
            <div className="flex gap-2">
              <div className="flex flex-col justify-between text-[8px] font-mono text-slate-600 h-[80px] w-6 pt-1 pr-1">
                <span>Sun</span>
                <span>Tue</span>
                <span>Thu</span>
                <span>Sat</span>
              </div>

              {/* Grid block */}
              <div className="flex-1 overflow-x-auto select-none pb-2">
                <div className="grid grid-rows-7 grid-flow-col gap-[3px] min-w-[580px]">
                  {Array(53)
                    .fill(0)
                    .map((_, col) =>
                      Array(7)
                        .fill(0)
                        .map((_, row) => {
                          const level = grid[row]?.[col] || 0;
                          const cellBg = selectedTheme.cells[level];
                          return (
                            <div
                              key={`${row}-${col}`}
                              onMouseDown={() => handleMouseDown(row, col)}
                              onMouseEnter={() => handleMouseEnter(row, col)}
                              className={`w-2.5 h-2.5 rounded-[1.5px] cursor-crosshair transition-colors duration-100 ${cellBg}`}
                            />
                          );
                        })
                    )}
                </div>
              </div>
            </div>
            
            {/* Month titles indicator header */}
            <div className="flex gap-2 text-[8px] font-mono text-slate-600 pl-8 pt-1">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                <span key={idx} className="flex-1 text-center">{m}</span>
              ))}
            </div>
          </motion.div>

          {/* Grid control bar */}
          <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850/60 flex flex-wrap items-center justify-between gap-4">
            {/* Paint brush levels */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Palette Level:</span>
              <div className="flex items-center gap-2">
                {selectedTheme.cells.map((cellBg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBrushLevel(idx)}
                    className={`w-6 h-6 rounded-md transition-all border ${cellBg} ${
                      brushLevel === idx
                        ? 'ring-2 ring-blue-500 scale-110 border-white/50'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    title={`Paint level ${idx}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setBrushLevel(0)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                  brushLevel === 0
                    ? 'bg-slate-800 border-slate-700 text-white font-bold'
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white'
                }`}
              >
                <Eraser className="h-3.5 w-3.5" /> Eraser
              </button>
            </div>

            {/* Playback Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayback}
                disabled={isPlaying}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 text-emerald-400" /> Playback
              </button>
              
              <button
                onClick={() => setGrid(createEmptyGrid())}
                disabled={isPlaying}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5 text-red-400" /> Reset Grid
              </button>
            </div>
          </div>
        </div>

        {/* Studio Sidebar Utilities */}
        <div className="space-y-6">
          {/* Preset templates */}
          <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850/60 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-purple-400" /> Presets Drawer
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {Object.entries(PRESETS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => loadPreset(key)}
                  className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-850 hover:bg-slate-900 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-center"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Text rendering tool */}
            <div className="pt-3 border-t border-slate-850 space-y-2">
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                <Type className="h-3 w-3" /> TEXT TO HEATMAP
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="HI!"
                  value={textModeInput}
                  onChange={(e) => setTextModeInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-950/60 border border-slate-850 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={applyTextToGrid}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Estimates Card */}
          <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850/60 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" /> Commit Estimation
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Commits Needed:</span>
                <span className="font-bold text-white">{estimation.totalCommits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Calendar Days:</span>
                <span className="font-bold text-white">{estimation.activeDaysCount}</span>
              </div>

              {/* Intensity multiplier */}
              <div className="pt-2 border-t border-slate-850 space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>Intensity Scale:</span>
                  <span className="text-slate-300 font-bold">{intensity}x</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer bg-slate-850 rounded-lg appearance-none h-1.5"
                />
              </div>
            </div>

            {/* Export options */}
            <div className="pt-4 border-t border-slate-850 space-y-2 flex flex-col">
              <button
                onClick={handleExportSVG}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Export SVG Board
              </button>
              
              <button
                onClick={handleDownloadScript}
                className="w-full py-2 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Terminal className="h-3.5 w-3.5 text-purple-400" /> Download Backdate Script
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
