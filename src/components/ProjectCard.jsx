import React, { useState, useRef } from 'react';
import { ExternalLink, Play, Pause, Layers, Sparkles, MonitorPlay } from 'lucide-react';
import { TOOLS_LIST } from '../data/initialProjects';

export default function ProjectCard({ project, onSelectProject }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Helper to get tool color styling
  const getToolMeta = (toolName) => {
    return TOOLS_LIST.find((t) => t.name.toLowerCase() === toolName.toLowerCase()) || {
      name: toolName,
      color: '#6366F1',
      bg: 'rgba(99, 102, 241, 0.15)',
      short: toolName.slice(0, 2)
    };
  };

  const handleVideoHover = (enter) => {
    setIsHovered(enter);
    if (project.mediaType === 'video' && videoRef.current) {
      if (enter) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      onClick={() => onSelectProject(project)}
      onMouseEnter={() => handleVideoHover(true)}
      onMouseLeave={() => handleVideoHover(false)}
      className="masonry-item group relative cursor-pointer rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#111217] shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-indigo-500/10 transition-all duration-300 transform-gpu hover:-translate-y-1"
    >
      {/* 
        Container strictly adapts to media's natural aspect ratio.
        No fixed height or object-fit: cover cropping.
      */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-black/40">
        
        {project.mediaType === 'video' ? (
          <div className="relative w-full">
            <video
              ref={videoRef}
              src={project.mediaUrl}
              poster={project.thumbnailUrl}
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-auto block rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]"
            />
            {/* Play indicator */}
            <div className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md bg-black/60 text-white text-xs transition-opacity duration-200 ${isPlaying ? 'opacity-0' : 'opacity-90'}`}>
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        ) : (
          <img
            src={project.thumbnailUrl || project.mediaUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-auto block rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        )}

        {/* Aspect Ratio Badge (Shows true proportions) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium tracking-wide backdrop-blur-md bg-black/60 text-white/90 border border-white/10 shadow-xs">
            {project.aspectRatio || 'Native'}
          </span>

          {project.mediaType === 'interactive' && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wide backdrop-blur-md bg-indigo-600/90 text-white shadow-xs border border-indigo-400/30 animate-pulse">
              <MonitorPlay className="w-2.5 h-2.5" />
              Interactive {project.interactiveType === 'figma' ? 'Figma' : 'Lunacy'}
            </span>
          )}
        </div>

        {/* Floating Tool Badges (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
          {project.tools?.slice(0, 3).map((toolName) => {
            const meta = getToolMeta(toolName);
            return (
              <span
                key={toolName}
                title={toolName}
                className="w-6 h-6 rounded-lg backdrop-blur-md flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-md border border-white/20 transition-transform group-hover:scale-105"
                style={{ backgroundColor: meta.color }}
              >
                {meta.short}
              </span>
            );
          })}
        </div>

        {/* Hover Information Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 rounded-2xl">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-medium block mb-1">
              {project.category} • {project.year}
            </span>
            <h3 className="text-white font-display font-bold text-base sm:text-lg leading-snug drop-shadow-sm mb-1.5">
              {project.title}
            </h3>
            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-3">
              {project.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs text-white/80 font-mono">
              <span>{project.client}</span>
              <span className="flex items-center gap-1 text-indigo-300 font-sans font-medium text-xs">
                Inspect Details ↗
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Compact Bottom Metadata (Visible without hover on clean aesthetic) */}
      <div className="p-3.5 flex items-center justify-between border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#111217]">
        <div className="min-w-0 pr-2">
          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
            {project.title}
          </h4>
          <p className="text-[11px] text-gray-700 dark:text-gray-300 truncate">
            {project.client}
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 shrink-0">
          {project.tools?.[0] || 'Design'}
        </span>
      </div>

    </div>
  );
}
