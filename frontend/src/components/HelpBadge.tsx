import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { GLOSSARY } from '../data/glossary';

interface HelpBadgeProps {
  term: string;
  children?: React.ReactNode;
  className?: string;
  placement?: 'top' | 'bottom';
  align?: 'left' | 'right' | 'center';
}

interface Coords {
  top: number;
  left: number;
  isAbove: boolean;
  width: number;
}

export const HelpBadge: React.FC<HelpBadgeProps> = ({
  term,
  children,
  className = '',
  placement = 'bottom',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const entry = GLOSSARY[term];

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = Math.min(320, window.innerWidth - 32);
    const estimatedHeight = 220;

    // Viewport boundaries
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    // Determine whether to place above or below
    const shouldPlaceAbove =
      placement === 'top'
        ? spaceAbove >= estimatedHeight || spaceAbove > spaceBelow
        : spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    // Vertical top coordinate (fixed in viewport)
    const top = shouldPlaceAbove ? rect.top - 8 : rect.bottom + 8;

    // Horizontal left coordinate
    let left = rect.left;
    if (align === 'right') {
      left = rect.right - popoverWidth;
    } else if (align === 'center') {
      left = rect.left + rect.width / 2 - popoverWidth / 2;
    }

    // Keep completely inside screen boundaries with 16px safety margin
    left = Math.max(16, Math.min(left, window.innerWidth - popoverWidth - 16));

    setCoords({
      top,
      left,
      isAbove: shouldPlaceAbove,
      width: popoverWidth,
    });
  }, [placement, align]);

  // Track position when open + handle scroll / resize / Escape key
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  if (!entry) {
    return <>{children}</>;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Clickable ! Mark Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        title={`Click to learn what "${entry.title}" means!`}
        aria-label={`Learn about ${entry.title}`}
        aria-expanded={isOpen}
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-accent/70 bg-accent/15 text-[11px] font-mono font-bold text-accent shadow-sm transition-all hover:scale-110 hover:border-accent hover:bg-accent hover:text-black focus:outline-none focus:ring-1 focus:ring-accent group cursor-pointer"
      >
        <span className="leading-none group-hover:scale-110">!</span>
      </button>

      {/* Optional Wrapped Child Text */}
      {children && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="cursor-pointer border-b border-dotted border-accent/50 hover:border-accent hover:text-accent transition-colors"
        >
          {children}
        </span>
      )}

      {/* Popover Portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && coords && (
              <>
                {/* Backdrop Click Dismiss Overlay */}
                <div
                  className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[1px] transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  aria-hidden="true"
                />

                {/* Popover Floating Modal */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`glossary-title-${term}`}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: coords.isAbove ? 8 : -8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    y: coords.isAbove ? 8 : -8,
                  }}
                  transition={{ type: 'spring', damping: 24, stiffness: 380 }}
                  style={{
                    position: 'fixed',
                    top: coords.top,
                    left: coords.left,
                    width: coords.width,
                    transform: coords.isAbove ? 'translateY(-100%)' : undefined,
                  }}
                  className="z-[9999] rounded-xl border-2 border-accent/70 bg-[#0c1420] p-4 text-left shadow-[0_24px_50px_rgba(0,0,0,0.95)] ring-1 ring-white/10"
                >
                  {/* Popover Header */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-mono font-bold text-xs border border-accent/40">
                        !
                      </span>
                      <h4
                        id={`glossary-title-${term}`}
                        className="font-heading text-xs font-semibold text-foreground tracking-wide"
                      >
                        {entry.title}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Close glossary explanation"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  {/* Content Body */}
                  <div className="mt-3 space-y-2.5 text-xs leading-relaxed">
                    <p className="text-foreground/95 font-sans">
                      {entry.simpleDef}
                    </p>

                    <div className="rounded-lg bg-secondary/80 p-2.5 text-[11px] text-accent/90 border border-border">
                      <strong className="text-accent block mb-0.5 font-mono text-[10px] uppercase tracking-wider">
                        Think of it like:
                      </strong>
                      <span className="text-foreground/90">{entry.analogy}</span>
                    </div>

                    {entry.funFact && (
                      <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                        <Sparkles className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-primary font-mono text-[10px] uppercase tracking-wide">Fun fact:</strong>{' '}
                          {entry.funFact}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </span>
  );
};
