import React from 'react';
import ProjectCard from './ProjectCard';
import { Layers, Sparkles } from 'lucide-react';

export default function MasonryGrid({ projects, onSelectProject, onOpenAdmin }) {
  if (projects.length === 0) {
    return (
      <div className="py-24 text-center glass-panel rounded-3xl p-8 max-w-xl mx-auto border border-gray-200 dark:border-white/10">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-500">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">
          No matching designs found
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          Try clearing your search query or tool filters, or upload a new design to this category using the Studio Admin.
        </p>
        <button
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Upload Design to Studio</span>
        </button>
      </div>
    );
  }

  return (
    <div className="masonry-container">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelectProject={onSelectProject}
        />
      ))}
    </div>
  );
}
