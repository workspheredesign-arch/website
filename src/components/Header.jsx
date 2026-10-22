import React from "react";
import { Sparkles, Sun, Moon, PlusCircle, Send, Layers } from "lucide-react";

export default function Header({
  theme,
  toggleTheme,
  onOpenAdmin,
  onOpenContact,
  projectCount,
  isAdmin,
}) {
  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 glass-panel border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Official Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="group flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-[#0F1521] p-1.5 flex items-center justify-center border border-sky-500/20 shadow-md shadow-sky-500/10 group-hover:border-sky-400/40 group-hover:shadow-sky-500/20 transition-all duration-300">
              <img
                src="./logo-emblem-transparent.png"
                alt="WorkSphere Logo Emblem"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
                  Work<span className="text-[#38BDF8]">Sphere</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800/60">
                  .design
                </span>
              </div>
              <span className="text-[10px] tracking-wider uppercase text-gray-700 dark:text-gray-300 font-medium">
                Visual & Interactive Studio
              </span>
            </div>
          </a>
        </div>

        {/* Studio Status & Quick Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#work"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
          >
            Showcase
          </a>
          <a
            href="#disciplines"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
          >
            Disciplines
          </a>
          <a
            href="#calculator"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
          >
            Scope Estimator
          </a>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Available for Q4 Commissions
          </div>
        </div>

        {/* Actions: Theme Toggle, Admin Studio, Inquire */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/30 transition-all duration-200 shadow-sm"
            title={
              theme === "dark"
                ? "Switch to Light Studio"
                : "Switch to Dark Luxury"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Admin Studio Management Button (signed-in team members only) */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-gray-800 dark:text-gray-200 hover:border-indigo-500/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all duration-200 shadow-sm"
              title="Studio Admin: Upload or Manage Designs"
            >
              <PlusCircle className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">Studio Admin</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                {projectCount}
              </span>
            </button>
          )}

          {/* Inquire Button */}
          <button
            onClick={onOpenContact}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gray-900 hover:bg-black text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Inquire</span>
          </button>
        </div>
      </div>
    </header>
  );
}
