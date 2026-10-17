import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../data/initialProjects';

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalResults,
  activeToolFilter,
  onClearToolFilter
}) {
  return (
    <div id="work" className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none no-scrollbar">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                    : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Search & Active filter indicators */}
        <div className="flex items-center gap-3">
          
          {/* Active Tool Badge (if tool filter is applied from Hero) */}
          {activeToolFilter && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs font-mono text-indigo-600 dark:text-indigo-400">
              <span>Tool: {activeToolFilter}</span>
              <button 
                onClick={onClearToolFilter}
                className="hover:opacity-75 transition-opacity"
                title="Clear tool filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search works, tools, tags..."
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Result Count */}
          <div className="hidden sm:flex items-center text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-nowrap">
            <span>{totalResults} {totalResults === 1 ? 'Design' : 'Designs'}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
