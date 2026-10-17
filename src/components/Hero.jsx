import React from 'react';
import { Sparkles, Maximize2, MousePointer, ShieldCheck, Palette } from 'lucide-react';
import { TOOLS_LIST } from '../data/initialProjects';

export default function Hero({ selectedTool, onSelectTool, onOpenContact }) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-600/15 dark:via-purple-600/10 dark:to-cyan-600/10 blur-[120px] pointer-events-none -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 shadow-sm backdrop-blur-md">
            <img src="./logo-emblem-transparent.png" alt="WorkSphere Emblem" className="w-4 h-4 object-contain" />
            <span>WorkSphere • Creative Visual & Prototyping Lab</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-gray-900 dark:text-white leading-[1.08] mb-6">
            Static Graphics to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
              Living Prototypes.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            WorkSphere is a bespoke design atelier bridging high-craft static visual arts with fluid, interactive digital product systems.
          </p>
        </div>

        {/* Tool Spectrum interactive bar */}
        <div id="disciplines" className="max-w-4xl mx-auto mb-10">
          <div className="glass-panel p-4 sm:p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-gray-700 dark:text-gray-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                STUDIO TOOLING & PRODUCTION STACK
              </span>
              <span>FILTER BY TOOL</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <button
                onClick={() => onSelectTool(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  selectedTool === null
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                }`}
              >
                All Tools
              </button>

              {TOOLS_LIST.map((tool) => {
                const isActive = selectedTool === tool.name;
                return (
                  <button
                    key={tool.name}
                    onClick={() => onSelectTool(isActive ? null : tool.name)}
                    style={{
                      borderColor: isActive ? tool.color : 'transparent',
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                      isActive
                        ? 'bg-white dark:bg-white/10 shadow-sm font-semibold'
                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border-transparent'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-xs"
                      style={{ backgroundColor: tool.color }}
                    >
                      {tool.short}
                    </span>
                    <span>{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fidelity & Aspect Ratio Guarantee banner */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-gray-700 dark:text-gray-300 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-semibold">
            <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>True Aspect Ratio Guarantee</span>
          </div>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
          <span className="text-center sm:text-left">
            Containers adapt dynamically to media bounds. Zero cropping.
          </span>
        </div>

      </div>
    </section>
  );
}
