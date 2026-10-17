import React, { useState, useRef, useCallback } from 'react';
import { MoveHorizontal, Eye, SplitSquareVertical } from 'lucide-react';

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "Raw / Wireframe", 
  afterLabel = "Finished Artwork",
  aspectRatio = "16:9" 
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="flex flex-col space-y-2 select-none w-full">
      <div className="flex items-center justify-between text-xs font-mono text-gray-700 dark:text-gray-300 px-1">
        <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-medium">
          <SplitSquareVertical className="w-3.5 h-3.5 text-indigo-500" />
          INTERACTIVE CRAFT INSPECTION SLIDER
        </span>
        <span className="text-[11px] text-gray-700 dark:text-gray-300">Drag to compare layers</span>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full overflow-hidden rounded-2xl cursor-ew-resize bg-black/20 border border-gray-200 dark:border-white/10"
      >
        {/* Base: After Image (Full width background) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-auto max-h-[70vh] block object-contain mx-auto pointer-events-none"
        />

        {/* After Label */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold backdrop-blur-md bg-black/70 text-emerald-400 border border-white/10">
            {afterLabel}
          </span>
        </div>

        {/* Overlay: Before Image clipped */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="w-full h-auto max-h-[70vh] block object-contain mx-auto max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
              height: '100%'
            }}
          />

          {/* Before Label */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold backdrop-blur-md bg-black/70 text-amber-400 border border-white/10">
              {beforeLabel}
            </span>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
        >
          <div className="w-8 h-8 -ml-3.5 rounded-full bg-white text-gray-900 shadow-xl flex items-center justify-center border-2 border-indigo-600 transition-transform hover:scale-110 active:scale-95">
            <MoveHorizontal className="w-4 h-4 text-indigo-600" />
          </div>
        </div>

      </div>
    </div>
  );
}
