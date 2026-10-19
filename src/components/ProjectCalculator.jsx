import React, { useState } from 'react';
import { Calculator, Sparkles, Check, ArrowRight, ShieldCheck, Clock, Layers } from 'lucide-react';

const DISCIPLINES = [
  { id: 'branding', label: 'Brand Identity & Guidelines', basePrice: 1200, time: 2, icon: '✦', tools: 'Illustrator & Photoshop' },
  { id: 'packaging', label: 'Packaging & Print Die-lines', basePrice: 950, time: 2, icon: '📦', tools: 'CorelDraw & AI' },
  { id: 'ui_system', label: 'Interactive UI/UX Design System', basePrice: 2400, time: 3, icon: '⚡', tools: 'Figma & Lunacy' },
  { id: 'prototype', label: 'High-Fidelity Living Prototypes', basePrice: 1400, time: 2, icon: '📱', tools: 'Figma Auto-layout' },
  { id: 'vector_art', label: 'Custom Key Visuals & 3D Vectors', basePrice: 850, time: 1, icon: '🎨', tools: 'Photoshop & Vector' },
  { id: 'motion', label: 'Kinetic Motion & Walkthroughs', basePrice: 1100, time: 2, icon: '🎬', tools: 'After Effects & Video' },
];

const SPEED_OPTIONS = [
  { id: 'standard', label: 'Standard Atelier Pace', multiplier: 1.0, extraWeeks: 0, desc: 'Balanced collaborative review sprints' },
  { id: 'sprint', label: 'Priority Sprint Delivery', multiplier: 1.35, extraWeeks: -1, desc: 'Accelerated turnarounds & dedicated focus' }
];

export default function ProjectCalculator({ onLaunchInquiry }) {
  const [selectedDisciplines, setSelectedDisciplines] = useState(['branding', 'ui_system']);
  const [speed, setSpeed] = useState('standard');

  const toggleDiscipline = (id) => {
    if (selectedDisciplines.includes(id)) {
      if (selectedDisciplines.length > 1) {
        setSelectedDisciplines(selectedDisciplines.filter((d) => d !== id));
      }
    } else {
      setSelectedDisciplines([...selectedDisciplines, id]);
    }
  };

  const selectedData = DISCIPLINES.filter((d) => selectedDisciplines.includes(d.id));
  const rawTotal = selectedData.reduce((acc, curr) => acc + curr.basePrice, 0);
  const totalWeeks = Math.max(2, selectedData.reduce((acc, curr) => acc + curr.time, 0) - (speed === 'sprint' ? 1 : 0));
  const speedObj = SPEED_OPTIONS.find((s) => s.id === speed);
  const calculatedTotal = Math.round(rawTotal * (speedObj?.multiplier || 1));

  const handleProceed = () => {
    const summary = selectedData.map((d) => d.label).join(', ');
    const brief = `Estimated Scope: ${summary} (Pace: ${speedObj.label}, Est. Timeline: ${totalWeeks} weeks, Est. Investment: $${calculatedTotal.toLocaleString()})`;
    onLaunchInquiry(brief);
  };

  return (
    <div className="my-16 glass-panel rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-white/10 shadow-lg relative overflow-hidden">
      
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Interactive Commission Estimator</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
          Configure Your Custom Scope & Timeline
        </h2>
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2">
          Select the craft disciplines needed for your brand. Real-time estimate calibrated for bespoke studio production.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Disciplines Grid */}
        <div className="lg:col-span-2 space-y-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold">
            1. Select Required Studio Disciplines
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DISCIPLINES.map((item) => {
              const isSelected = selectedDisciplines.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleDiscipline(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start justify-between ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-sm'
                      : 'border-gray-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {item.label}
                      </h4>
                    </div>
                    <p className="text-[11px] font-mono text-gray-700 dark:text-gray-300">
                      Tools: {item.tools}
                    </p>
                  </div>

                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white' : 'border border-gray-300 dark:border-white/15'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Pace */}
          <div className="pt-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold mb-2">
              2. Production Pace & Sprints
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPEED_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSpeed(opt.id)}
                  className={`p-3.5 text-left rounded-2xl border transition-all ${
                    speed === opt.id
                      ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/30 text-gray-900 dark:text-white'
                      : 'border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{opt.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10">
                      {opt.id === 'sprint' ? '+35%' : 'Standard'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Summary Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121319] border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
          <div className="border-b border-gray-100 dark:border-white/10 pb-4">
            <span className="text-xs font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-1">
              Estimated Investment
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
                ${calculatedTotal.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-gray-700 dark:text-gray-300">USD (Est.)</span>
            </div>
          </div>

          {/* Time & Deliverables metrics */}
          <div className="space-y-3 text-xs font-mono text-gray-700 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                Est. Sprints
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">~{totalWeeks} Weeks</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                Disciplines Selected
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedDisciplines.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                IP & Vector Ownership
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Client Owned</span>
            </div>
          </div>

          <button
            onClick={handleProceed}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gray-900 hover:bg-black text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <span>Proceed With This Scope</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

