import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, Sparkles, Maximize2, MonitorPlay, 
  Smartphone, Monitor, RefreshCw, Send, CheckCircle2,
  SplitSquareVertical, Copy, Check, Palette
} from 'lucide-react';
import { TOOLS_LIST } from '../data/initialProjects';
import BeforeAfterSlider from './BeforeAfterSlider';

export default function ProjectModal({ project, onClose, onOpenContactWithProject }) {
  const [deviceViewport, setDeviceViewport] = useState('full'); // 'full', 'mobile'
  const [iframeKey, setIframeKey] = useState(0);
  const [activeView, setActiveView] = useState('artwork'); // 'artwork' | 'compare'
  const [copiedColor, setCopiedColor] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const getToolMeta = (toolName) => {
    return TOOLS_LIST.find((t) => t.name.toLowerCase() === toolName.toLowerCase()) || {
      name: toolName,
      color: '#6366F1',
      bg: 'rgba(99, 102, 241, 0.15)',
      short: toolName.slice(0, 2)
    };
  };

  const isInteractive = project.mediaType === 'interactive';
  const hasComparison = Boolean(project.beforeMediaUrl);

  const handleCopyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-fade-in">
      
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-6xl z-10 bg-white dark:bg-[#0D0E13] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-white/70 dark:bg-[#0D0E13]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
              {project.category}
            </span>
            <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
              Ratio: <strong className="text-gray-900 dark:text-gray-100">{project.aspectRatio || 'Native'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Before / After Layer Slider Toggle */}
            {hasComparison && (
              <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10 text-xs">
                <button
                  onClick={() => setActiveView('artwork')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeView === 'artwork'
                      ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-xs font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Final Output
                </button>
                <button
                  onClick={() => setActiveView('compare')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    activeView === 'compare'
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  <span>Inspect Layers</span>
                </button>
              </div>
            )}

            {/* Interactive Prototype Controls */}
            {isInteractive && (
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10 text-xs">
                <button
                  onClick={() => setDeviceViewport('mobile')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    deviceViewport === 'mobile'
                      ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-xs font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Mobile Preview Frame"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
                <button
                  onClick={() => setDeviceViewport('full')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    deviceViewport === 'full'
                      ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-xs font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Full Viewport"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Full</span>
                </button>
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="p-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  title="Restart Prototype"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Media Preview + Project Narrative */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Media Viewport (Uncropped, True Aspect Ratio) */}
          <div className="w-full lg:w-7/12 flex-shrink-0 flex items-center justify-center bg-gray-50 dark:bg-black/40 rounded-2xl p-2 sm:p-4 border border-gray-200/60 dark:border-white/5 min-h-[340px]">
            {activeView === 'compare' && hasComparison ? (
              <BeforeAfterSlider
                beforeImage={project.beforeMediaUrl}
                afterImage={project.mediaUrl}
                beforeLabel="Raw Wireframe / Vector"
                afterLabel="Final Studio Render"
                aspectRatio={project.aspectRatio}
              />
            ) : isInteractive ? (
              <div 
                className={`relative w-full transition-all duration-300 flex items-center justify-center ${
                  deviceViewport === 'mobile' ? 'max-w-[360px] shadow-2xl rounded-[36px] p-3 border-4 border-gray-800 bg-gray-950' : 'w-full'
                }`}
              >
                <iframe
                  key={iframeKey}
                  src={project.embedUrl || "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Ffile%2F1122247035415758066"}
                  className="w-full h-[520px] rounded-xl border border-gray-200 dark:border-white/10 bg-white"
                  allowFullScreen
                  title="Live Interactive Prototype"
                />
              </div>
            ) : project.mediaType === 'video' ? (
              <video
                src={project.mediaUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full max-h-[72vh] h-auto rounded-xl shadow-lg object-contain"
              />
            ) : (
              <img
                src={project.mediaUrl}
                alt={project.title}
                className="w-auto max-w-full max-h-[72vh] h-auto rounded-xl shadow-lg object-contain transition-transform duration-300 hover:scale-[1.01]"
              />
            )}
          </div>

          {/* Project Details & Narrative Column */}
          <div className="w-full lg:w-5/12 flex flex-col justify-between space-y-6">
            <div>
              {/* Client & Date */}
              <div className="flex items-center justify-between text-xs font-mono text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-white/10 mb-4">
                <span>Client: <strong className="text-gray-900 dark:text-gray-100">{project.client}</strong></span>
                <span>Year: <strong className="text-gray-900 dark:text-gray-100">{project.year}</strong></span>
              </div>

              {/* Title */}
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white leading-tight mb-4">
                {project.title}
              </h2>

              {/* Tools Stack Badges */}
              <div className="mb-5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 block mb-2 font-medium">
                  Authoring Tools & Software
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {project.tools?.map((toolName) => {
                    const meta = getToolMeta(toolName);
                    return (
                      <span
                        key={toolName}
                        style={{ borderColor: meta.color }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border bg-white dark:bg-white/5 shadow-xs"
                      >
                        <span
                          className="w-4 h-4 rounded text-[9px] font-mono font-bold text-white flex items-center justify-center"
                          style={{ backgroundColor: meta.color }}
                        >
                          {meta.short}
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">{toolName}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Color Palette & Tokens (Feature: Click to Copy HEX) */}
              {project.colorPalette && project.colorPalette.length > 0 && (
                <div className="mb-5 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-indigo-500" />
                      Studio Color Palette
                    </span>
                    <span className="text-[10px] font-mono text-gray-700 dark:text-gray-300">
                      {copiedColor ? `Copied ${copiedColor}!` : 'Click swatch to copy'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.colorPalette.map((hex) => (
                      <button
                        key={hex}
                        onClick={() => handleCopyColor(hex)}
                        title={`Copy ${hex}`}
                        className="group relative flex-1 h-9 rounded-xl border border-white/20 shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: hex }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white font-mono text-[9px] px-1 py-0.5 rounded">
                          {hex}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Narrative / Creative Rationale */}
              <div className="mb-5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 block mb-2 font-medium">
                  Creative Rationale & Specifications
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mb-6">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 block mb-2 font-medium">
                    Disciplines & Deliverables
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-gray-100 dark:border-white/10 space-y-3">
              {project.embedUrl && (
                <a
                  href={project.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Full Canvas / Prototype in New Tab</span>
                </a>
              )}

              <button
                onClick={() => {
                  onClose();
                  onOpenContactWithProject(project);
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-gray-900 hover:bg-black text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inquire About Similar Project</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
