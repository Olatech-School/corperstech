import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/corperstech-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const BOOT_STEPS = [

"Preparing your learning experience...",

"Connecting career opportunities...",

"Loading recruitment intelligence...",

"Optimizing your dashboard...",

"Securing your workspace...",

"Almost ready...",

"Welcome to CorpersTech"

];

const FEATURE_PILLS = [
  "Secure Platform",
  "AI Ready",
  "Career Intelligence",
  "Cloud Sync"
];

const TOTAL_DURATION = 7000;

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {

  const [progress, setProgress] = useState(0);

  const [bootIndex, setBootIndex] = useState(0);

  const [finished, setFinished] = useState(false);

  const particles = useMemo(() => {

    return Array.from({ length: 10 }).map((_, i) => ({

      id: i,

      left: Math.random() * 100,

      size: 2 + Math.random() * 4,

      delay: Math.random() * 3,

      duration: 6 + Math.random() * 4

    }));

  }, []);

  useEffect(() => {

    let current = 0;

    const progressInterval = setInterval(() => {

      current += 1;

      setProgress(current);

      const stage = Math.floor((current / 100) * BOOT_STEPS.length);

      setBootIndex(Math.min(stage, BOOT_STEPS.length - 1));

      if (current >= 100) {

        clearInterval(progressInterval);

        setFinished(true);

      }

    }, TOTAL_DURATION / 100);

    return () => clearInterval(progressInterval);

  }, []);

  useEffect(() => {

    if (!finished) return;

    const timer = setTimeout(() => {

      onComplete();

    }, 700);

    return () => clearTimeout(timer);

  }, [finished, onComplete]);

  return (

    <AnimatePresence>

      <motion.div

        initial={{ opacity: 1 }}

        exit={{ opacity: 0 }}

        animate={{

          opacity: finished ? 0 : 1,

          scale: finished ? 1.02 : 1

        }}

        transition={{

          duration: 0.7

        }}

        className="fixed inset-0 z-[9999] overflow-hidden bg-[#04130B] flex items-center justify-center"

      >
        {/* ========================================================= */}
        {/* Animated Emerald Background */}
        {/* ========================================================= */}

        <div className="absolute inset-0 overflow-hidden">

          {/* Large Glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.18, 0.35, 0.18]
            }}
            transition={{
              duration: 8,
              repeat: Infinity
            }}
            className="absolute w-[700px] h-[700px] rounded-full bg-emerald-500/20 blur-[170px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />

          {/* Secondary Glow */}
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.10, 0.22, 0.10]
            }}
            transition={{
              duration: 6,
              repeat: Infinity
            }}
            className="absolute w-[500px] h-[500px] rounded-full bg-green-400/10 blur-[150px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />

          {/* Floating Particles */}

          {particles.map((particle) => (

            <motion.div
              key={particle.id}
              initial={{
                opacity: 0,
                y: 50
              }}
              animate={{
                opacity: [0, 0.18, 0],
                y: -900
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${particle.left}%`,
                width: particle.size,
                height: particle.size
              }}
              className="absolute bottom-0 rounded-full bg-emerald-300"
            />

          ))}

        </div>

        {/* ========================================================= */}
        {/* Rotating Orbital Rings */}
        {/* ========================================================= */}

        <div className="absolute flex items-center justify-center">

          {/* Outer Ring */}

          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-[260px] h-[260px] rounded-full border border-emerald-500/20"
          />

          {/* Middle Ring */}

          <motion.div
            animate={{
              rotate: -360
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-[210px] h-[210px] rounded-full border border-white/10"
          />

          {/* Inner Ring */}

          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-[170px] h-[170px] rounded-full border border-emerald-300/25"
          />

          {/* Orbiting Dot */}

          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-[320px] h-[320px]"
          >
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(34,197,94,.8)]" />
          </motion.div>

        </div>

        {/* ========================================================= */}
        {/* Logo Container */}
        {/* ========================================================= */}

        <div className="relative z-20 flex flex-col items-center">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 1
            }}
            className="relative"
          >

            <motion.img
              src={logo}
              alt="CorpersTech"
              className="w-32 h-32 object-contain select-none"
              animate={{
                scale: [1, 1.03, 1],
                filter: [
                  "drop-shadow(0 0 10px rgba(34,197,94,.25))",
                  "drop-shadow(0 0 18px rgba(34,197,94,.45))",
                  "drop-shadow(0 0 10px rgba(34,197,94,.25))"
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity
              }}
            />

            {/* Shine Sweep */}

            <motion.div
              initial={{
                x: -220
              }}
              animate={{
                x: 220
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                repeatDelay: 2.5
              }}
              className="absolute top-0 left-0 w-10 h-full rotate-12 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-sm"
            />
</motion.div>
        {/* ========================================================= */}
        {/* Brand & Status Content */}
        {/* ========================================================= */}

        <div className="mt-10 flex flex-col items-center max-w-xl px-8">

          {/* Brand Name */}

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .4 }}
            className="
              text-white
              text-3xl md:text-4xl
tracking-[0.32em]
              text-center
              select-none
            "
          >
            CORPERSTECH
          </motion.h1>

          {/* Subtitle */}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .8 }}
            className="
              mt-5
              text-emerald-300
              text-sm
              md:text-base
              tracking-[0.25em]
              uppercase
              text-center
            "
          >
            Learn • Build • Get Hired
          </motion.p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">

    {FEATURE_PILLS.map((item) => (

        <motion.span
            key={item}
            whileHover={{ scale: 1.05 }}
            className="
                rounded-full
                border
                border-emerald-500/20
                bg-white/5
                px-4
                py-2
                text-xs
                text-emerald-200
                backdrop-blur
            "
        >
            {item}
        </motion.span>

    ))}

</div>

          {/* Divider */}

          <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: .8 }}
    className="mt-6 h-px w-44 bg-emerald-500/30"
/>


          {/* Boot Message */}

          <motion.div
            className="mt-8 w-full max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            <div className="flex justify-between items-center mb-2">

              <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">

                {BOOT_STEPS[bootIndex]}

              </span>

              <span className="text-xs text-white">

                {progress}%

              </span>

            </div>

            {/* Progress Bar */}

            <div className="h-2 rounded-full bg-white/10 overflow-hidden">

              <motion.div

                animate={{
                  width: `${progress}%`
                }}

                transition={{
                  ease: "easeOut"
                }}

                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-emerald-400
                  via-emerald-500
                  to-green-600
                  shadow-[0_0_20px_rgba(34,197,94,.55)]
                "

              />

            </div>

          </motion.div>

         {/* Powered By */}

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 2 }}
  className="mt-20 text-center"
>

  <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">
    POWERED BY
  </p>

  <h3 className="mt-3 text-xl font-bold text-white tracking-tight">
    Olatech School of Programming
  </h3>

</motion.div>

        </div>
        {/* ========================================================= */}
        {/* Platform Certification */}
        {/* ========================================================= */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/5 px-4 py-2 backdrop-blur-sm">

            <motion.div
              animate={{
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
              }}
              className="w-2 h-2 rounded-full bg-emerald-400"
            />

         </div>
        </motion.div>

      </div>

    </motion.div>

  </AnimatePresence>

);

};

export default SplashScreen;
