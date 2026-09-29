import React from 'react';
import { motion } from 'motion/react';

export const CinematicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#EDF2F8] dark:bg-[#0B0F19] transition-colors duration-200">
      {/* 
        Ethereal Multi-Layered Soft Purple, Violet & Lavender Patch Gradients 
        Creates lush, luminous ambient lighting across top, sides, center, and bottom.
      */}

      {/* 1. Top-Left Soft Orchid Purple Patch */}
      <motion.div
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-24 -left-20 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full opacity-80 dark:opacity-35 blur-[95px] sm:blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.55) 0%, rgba(192, 132, 252, 0.38) 40%, rgba(216, 180, 254, 0.18) 70%, transparent 100%)',
        }}
      />

      {/* 2. Top-Right Soft Radiant Lavender Patch */}
      <motion.div
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 22, -18, 0],
          scale: [1, 1.06, 0.96, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute -top-28 -right-20 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] rounded-full opacity-75 dark:opacity-35 blur-[105px] sm:blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(192, 132, 252, 0.58) 0%, rgba(216, 180, 254, 0.38) 42%, rgba(238, 220, 255, 0.18) 72%, transparent 100%)',
        }}
      />

      {/* 3. Top-Center Soft Purple Glow behind Title / Hero */}
      <div 
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[550px] sm:w-[750px] h-[320px] sm:h-[420px] rounded-full opacity-60 dark:opacity-25 blur-[110px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.35) 0%, rgba(192, 132, 252, 0.22) 50%, transparent 80%)',
        }}
      />

      {/* 4. Mid-Left Floating Purple Cloud (Behind Filters / Directory Search) */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.1, 0.94, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[320px] sm:top-[280px] -left-28 w-[450px] sm:w-[580px] h-[450px] sm:h-[580px] rounded-full opacity-70 dark:opacity-30 blur-[95px] sm:blur-[125px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.48) 0%, rgba(192, 132, 252, 0.30) 48%, rgba(224, 231, 255, 0.12) 75%, transparent 100%)',
        }}
      />

      {/* 5. Mid-Right Ethereal Violet Patch */}
      <motion.div
        animate={{
          x: [0, -28, 18, 0],
          y: [0, 25, -20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-[420px] sm:top-[380px] -right-28 w-[480px] sm:w-[620px] h-[480px] sm:h-[620px] rounded-full opacity-70 dark:opacity-30 blur-[105px] sm:blur-[135px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(192, 132, 252, 0.50) 0%, rgba(216, 180, 254, 0.32) 52%, rgba(243, 232, 255, 0.15) 78%, transparent 100%)',
        }}
      />

      {/* 6. Subtle Floating Organic Rings & Soft Orbital Highlight Curves */}
      <svg
        className="absolute inset-0 w-full h-full opacity-45 dark:opacity-18 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="softRingGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#A855F7" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="softVioletOrb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#C084FC" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="linearCurveGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#C084FC" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Ambient decorative orbital contours */}
        <circle cx="8%" cy="16%" r="260" fill="url(#softRingGlow)" filter="blur(45px)" />
        <circle cx="94%" cy="28%" r="320" fill="url(#softRingGlow)" filter="blur(60px)" />
        <circle cx="50%" cy="58%" r="300" fill="url(#softVioletOrb)" filter="blur(70px)" />
        
        {/* Soft curving wave line contours in the background */}
        <path
          d="M -100 280 C 150 170, 320 370, 600 230 C 850 110, 1100 250, 1500 170"
          stroke="url(#linearCurveGlow)"
          strokeWidth="1.8"
          fill="none"
          opacity="0.65"
        />
        <path
          d="M -50 490 C 200 410, 420 630, 780 480 C 1080 360, 1280 570, 1600 430"
          stroke="url(#linearCurveGlow)"
          strokeWidth="1.8"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* 7. Center-Lower Radiant Lavender Bloom (Soft illumination behind tool grid) */}
      <motion.div
        animate={{
          scale: [1, 1.05, 0.97, 1],
          opacity: [0.55, 0.65, 0.52, 0.55],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[720px] sm:top-[680px] left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[500px] sm:h-[650px] rounded-full opacity-60 dark:opacity-25 blur-[125px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.38) 0%, rgba(192, 132, 252, 0.25) 45%, rgba(216, 180, 254, 0.14) 75%, transparent 100%)',
        }}
      />

      {/* 8. Deep Bottom Lavender Glow (Visible near footer) */}
      <div 
        className="absolute -bottom-24 left-1/4 w-[600px] sm:w-[800px] h-[400px] sm:h-[500px] rounded-full opacity-55 dark:opacity-20 blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.32) 0%, rgba(192, 132, 252, 0.20) 50%, transparent 80%)',
        }}
      />

      {/* Ultra-faint tactile texture for clay physical feel */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#7C3AED 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};
