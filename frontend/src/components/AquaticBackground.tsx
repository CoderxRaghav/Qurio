import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Fish {
  id: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  direction: "left" | "right";
}

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

const AquaticBackground = () => {
  const [fishes] = useState<Fish[]>(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      y: 15 + Math.random() * 70,
      size: 12 + Math.random() * 20,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 10,
      direction: Math.random() > 0.5 ? "left" : "right",
    }))
  );

  const [bubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 4 + Math.random() * 12,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
    }))
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Deep ocean gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,80%,4%)] via-[hsl(200,70%,8%)] to-[hsl(195,60%,5%)]" />

      {/* Animated water caustics overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 600px 200px at 30% 40%, hsl(195 80% 50% / 0.3), transparent),
            radial-gradient(ellipse 400px 300px at 70% 60%, hsl(210 70% 40% / 0.2), transparent)
          `,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 50%", "0% 100%", "0% 0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Water flow waves */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              hsl(195 80% 50% / 0.02) 2px,
              transparent 4px
            )
          `,
          backgroundSize: "100% 100px",
        }}
        animate={{ y: [0, -100] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Flowing light rays */}
      <motion.div
        className="absolute -top-20 left-1/4 w-[200px] h-[120%] rotate-[15deg] opacity-[0.03]"
        style={{ background: "linear-gradient(180deg, hsl(195 80% 60%), transparent 70%)" }}
        animate={{ x: [-100, 200, -100], opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-20 right-1/4 w-[150px] h-[120%] rotate-[-10deg] opacity-[0.03]"
        style={{ background: "linear-gradient(180deg, hsl(200 70% 50%), transparent 60%)" }}
        animate={{ x: [100, -150, 100], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating glow blobs - aquatic */}
      <motion.div
        className="glow-blob w-[500px] h-[500px] -top-40 -left-40"
        style={{ background: "hsl(195 80% 50% / 0.06)" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="glow-blob w-[400px] h-[400px] top-1/2 -right-20"
        style={{ background: "hsl(210 70% 40% / 0.05)" }}
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="glow-blob w-[350px] h-[350px] bottom-20 left-1/3"
        style={{ background: "hsl(180 60% 40% / 0.04)" }}
        animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fishes */}
      {fishes.map((fish) => (
        <motion.div
          key={fish.id}
          className="absolute"
          style={{ top: `${fish.y}%` }}
          initial={{ x: fish.direction === "right" ? "-5vw" : "105vw" }}
          animate={{ x: fish.direction === "right" ? "105vw" : "-5vw" }}
          transition={{
            duration: fish.duration,
            delay: fish.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.svg
            width={fish.size}
            height={fish.size * 0.6}
            viewBox="0 0 40 24"
            animate={{ y: [0, -8, 0, 6, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: fish.direction === "left" ? "scaleX(-1)" : undefined }}
          >
            {/* Fish body */}
            <ellipse cx="20" cy="12" rx="14" ry="8" fill="hsl(195 80% 50% / 0.15)" />
            <ellipse cx="20" cy="12" rx="10" ry="5" fill="hsl(195 80% 60% / 0.1)" />
            {/* Tail */}
            <polygon points="34,12 42,4 42,20" fill="hsl(195 80% 50% / 0.12)" />
            {/* Eye */}
            <circle cx="12" cy="10" r="1.5" fill="hsl(195 80% 70% / 0.3)" />
          </motion.svg>
        </motion.div>
      ))}

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            left: `${bubble.x}%`,
            width: bubble.size,
            height: bubble.size,
            border: "1px solid hsl(195 80% 60% / 0.15)",
            background: "hsl(195 80% 60% / 0.05)",
          }}
          initial={{ bottom: "-5%", opacity: 0 }}
          animate={{
            bottom: ["- 5%", "105%"],
            opacity: [0, 0.6, 0.4, 0],
            x: [0, Math.random() * 30 - 15, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-10" />

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(210,80%,4%)]" />
    </div>
  );
};

export default AquaticBackground;
