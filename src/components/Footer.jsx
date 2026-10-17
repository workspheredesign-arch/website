import React from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';

export default function Footer({ onOpenAdmin, onOpenContact }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-24 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-200/60 dark:border-white/5">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0F1521] p-1 flex items-center justify-center border border-sky-500/20 shadow-sm">
                <img
                  src="./logo-emblem-transparent.png"
                  alt="WorkSphere Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
                  Work<span className="text-[#38BDF8]">Sphere</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800/60">
                  .design
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 max-w-sm leading-relaxed">
              Bespoke visual architecture studio. From print-ready static vector masterpieces in CorelDraw & Illustrator, to high-fidelity interactive systems in Figma & Lunacy.
            </p>
          </div>

          {/* Col 2: Supported Toolchain */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold">
              Toolchain Matrix
            </h4>
            <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1 font-mono">
              <li>• Adobe Photoshop (PSD)</li>
              <li>• Adobe Illustrator (AI / SVG)</li>
              <li>• CorelDraw (CDR / Vector)</li>
              <li>• Figma (Auto-layout / Prototypes)</li>
              <li>• Lunacy (Cross-platform UI)</li>
            </ul>
          </div>

          {/* Col 3: Studio Operations */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold">
              Studio Platform
            </h4>
            <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Studio Upload Manager</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-300">Admin</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                >
                  Commission Inquiry
                </button>
              </li>
              <li>
                <span className="text-emerald-500 font-mono text-[11px]">
                  ● Global Studio Available
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & scroll-to-top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-700 dark:text-gray-300">
          <div>
            © {new Date().getFullYear()} WorkSphere.design. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300">
              Preserving 100% uncropped aspect ratio fidelity
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
