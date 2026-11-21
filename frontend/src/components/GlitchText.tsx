import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
  // Occasional deep space radiation glitch micro-flicker on characters
  const [displayText, setDisplayText] = useState(text);
  const glitchChars = '!<>-_\\/[]{}—=+*^?#01';

  useEffect(() => {
    const interval = setInterval(() => {
      // 40% chance of a micro-glitch spike
      if (Math.random() < 0.4) {
        const chars = text.split('');
        const glitchIndex = Math.floor(Math.random() * chars.length);
        if (chars[glitchIndex] !== ' ') {
          chars[glitchIndex] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
          setDisplayText(chars.join(''));
          setTimeout(() => {
            setDisplayText(text);
          }, 90);
        }
      }
    }, 1300);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={`glitch-wrapper relative inline-block select-none ${className}`}>
      {/* Base font layer */}
      <span className="relative z-10 glitch-base-text text-foreground block">
        {displayText}
      </span>

      {/* Cyan chromatic aberration & moving slice layer */}
      <span
        aria-hidden="true"
        className="glitch-layer glitch-layer-cyan"
      >
        {displayText}
      </span>

      {/* Magenta chromatic aberration & moving slice layer */}
      <span
        aria-hidden="true"
        className="glitch-layer glitch-layer-magenta"
      >
        {displayText}
      </span>
    </span>
  );
};
