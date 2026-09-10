'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-600/60 backdrop-blur-sm"
    >
      <div className="relative flex items-center justify-center">
        {/* 3D Coin Flipper Container */}
        <div className="relative w-24 h-24 perspective-1000">
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.0,
              ease: "linear"
            }}
            className="w-full h-full relative preserve-3d"
          >
            {/* Front Face */}
            <div className="absolute inset-0 backface-hidden flex items-center justify-center">
              <img
                src="/Tequisquiapan-Presidencia-2.svg"
                alt="Loading..."
                className="w-20 h-20 object-contain brightness-0 invert"
              />
            </div>
            {/* Back Face */}
            <div className="absolute inset-0 backface-hidden flex items-center justify-center rotate-y-180">
              <img
                src="/Tequisquiapan-Presidencia-2.svg"
                alt="Loading..."
                className="w-20 h-20 object-contain brightness-0 invert"
              />
            </div>
          </motion.div>
        </div>
      </div>
      <p className="mt-10 text-white font-medium tracking-widest animate-pulse opacity-70">
        Cargando...
      </p>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </motion.div>
  )
}
