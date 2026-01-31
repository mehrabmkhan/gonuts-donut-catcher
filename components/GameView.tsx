
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Donut, DonutType } from '../types';

interface GameViewProps {
  onGameOver: (score: number) => void;
}

const GameView: React.FC<GameViewProps> = ({ onGameOver }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [cartX, setCartX] = useState(50);
  const [donuts, setDonuts] = useState<Donut[]>([]);
  
  const lastDonutId = useRef(0);
  const gameActive = useRef(true);
  const scoreRef = useRef(0);
  const requestRef = useRef<number | undefined>(undefined);
  const spawnTimeoutRef = useRef<number | undefined>(undefined);

  // Collision Configuration
  const UMBRELLA_WIDTH_PERCENT = 24; 
  const CATCH_Y_MIN = 62; 
  const CATCH_Y_MAX = 74; 

  const spawnDonut = useCallback(() => {
    if (!gameActive.current) return;

    const id = ++lastDonutId.current;
    const x = Math.random() * 80 + 10;
    const typeRoll = Math.random();
    let type = DonutType.PINK;
    if (typeRoll > 0.98) type = DonutType.GOLDEN;
    else if (typeRoll > 0.88) type = DonutType.BLUE;
    else if (typeRoll > 0.7) type = DonutType.CHOCO;

    // Difficulty increases as time passes, especially after 30s
    // Current time is from 60 down to 0. 
    // Difficulty phase: phase 1 (60-31s), phase 2 (30-0s)
    const elapsed = 60 - timeLeft;
    const isIntense = timeLeft <= 30;
    
    // baseSpeed ramp
    const phaseMultiplier = isIntense ? 1.8 : 1.0;
    const baseSpeed = (0.7 + (elapsed * 0.02)) * phaseMultiplier + (Math.random() * 0.4);

    const newDonut: Donut = {
      id,
      x,
      y: -10,
      size: type === DonutType.GOLDEN ? 55 : 45,
      speed: baseSpeed,
      type,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * (isIntense ? 12 : 8),
      isCaught: false
    };

    setDonuts(prev => [...prev, newDonut]);

    // Calculate next spawn delay
    // Starts at ~650ms, drops to ~180ms in intense phase
    let nextDelay = isIntense 
      ? Math.max(180, 400 - (elapsed - 30) * 10) 
      : Math.max(450, 650 - elapsed * 5);
    
    spawnTimeoutRef.current = window.setTimeout(spawnDonut, nextDelay);
  }, [timeLeft]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current || !gameActive.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setCartX(Math.max(12, Math.min(88, x)));
  };

  const animate = useCallback(() => {
    if (!gameActive.current) return;

    setDonuts(prev => {
      const updated = prev.map(d => {
        if (d.isCaught) return d;
        
        const nextY = d.y + d.speed;
        const nextRotation = d.rotation + d.rotationSpeed;

        const isWithinX = Math.abs(d.x - cartX) < UMBRELLA_WIDTH_PERCENT / 2;
        const isWithinY = nextY >= CATCH_Y_MIN && nextY <= CATCH_Y_MAX;

        if (isWithinX && isWithinY) {
          let points = 10;
          if (d.type === DonutType.GOLDEN) points = 100;
          else if (d.type === DonutType.BLUE) points = 30;
          else if (d.type === DonutType.CHOCO) points = 15;
          
          scoreRef.current += points;
          setScore(scoreRef.current);
          return { ...d, y: nextY, rotation: nextRotation, isCaught: true };
        }

        return { ...d, y: nextY, rotation: nextRotation };
      });

      return updated.filter(d => d.y < 110);
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [cartX]);

  // Game Animation Loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  // Dynamic Spawner Start
  useEffect(() => {
    spawnTimeoutRef.current = window.setTimeout(spawnDonut, 600);
    return () => {
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    };
  }, [spawnDonut]);

  // Stable Clock Timer
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          gameActive.current = false;
          clearInterval(clockTimer);
          if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
          onGameOver(scoreRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(clockTimer);
  }, [onGameOver]);

  const getDonutColor = (type: DonutType) => {
    switch (type) {
      case DonutType.GOLDEN: return '#FBBF24';
      case DonutType.CHOCO: return '#78350F';
      case DonutType.BLUE: return '#0EA5E9';
      default: return '#F472B6';
    }
  };

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative w-full h-full cursor-none overflow-hidden touch-none"
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-40 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border-2 border-pink-200">
          <div className="text-[10px] font-bold text-pink-400 uppercase tracking-widest text-center">SCORE</div>
          <div className="text-3xl font-fun text-pink-500 tabular-nums">{score}</div>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border-2 border-sky-200">
          <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest text-center">TIME</div>
          <div className={`text-3xl font-fun tabular-nums ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-sky-500'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Warning Message for Difficulty Spike */}
      {timeLeft === 31 && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-red-500 text-white font-fun text-4xl px-8 py-4 rounded-3xl shadow-2xl animate-bounce">
            INTENSE MODE!
          </div>
        </div>
      )}

      {/* Falling Donuts */}
      {donuts.map(donut => (
        <div
          key={donut.id}
          className={`absolute pointer-events-none ${donut.isCaught ? 'animate-caught' : ''}`}
          style={{
            left: `${donut.x}%`,
            top: `${donut.y}%`,
            width: `${donut.size}px`,
            height: `${donut.size}px`,
            transform: `translate(-50%, -50%) rotate(${donut.rotation}deg)`,
            zIndex: donut.isCaught ? 30 : 10,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill={getDonutColor(donut.type)} />
            <path d="M50 20 Q70 20 80 50 Q70 80 50 80 Q30 80 20 50 Q30 20 50 20" fill="white" fillOpacity="0.3" />
            <circle cx="50" cy="50" r="14" fill="white" />
          </svg>
        </div>
      ))}

      {/* Cart with Catching Umbrella */}
      <div 
        className="absolute bottom-24 transform -translate-x-1/2 animate-cart pointer-events-none z-20"
        style={{ left: `${cartX}%` }}
      >
        <div className="relative scale-[1.5] umbrella-glow">
           <svg width="120" height="150" viewBox="0 0 120 150">
              <path d="M10 55 L10 60 L15 55 L20 60 L25 55 L30 60 L35 55 L40 60 L45 55 L50 60 L55 55 L60 60 L65 55 L70 60 L75 55 L80 60 L85 55 L90 60 L95 55 L100 60 L105 55 L110 60 L110 55" fill="#f3f4f6" />
              <path d="M10 55 Q60 10 110 55 Z" fill="#fff" />
              <path d="M10 55 Q30 25 50 15 L60 55 Z" fill="#fbcfe8" />
              <path d="M70 15 Q90 25 110 55 L60 55 Z" fill="#fbcfe8" />
              <rect x="58" y="55" width="4" height="40" fill="#713F12" />
              <rect x="25" y="90" width="70" height="45" rx="2" fill="#0EA5E9" />
              <path d="M25 90 L95 90 L95 105 L25 105 Z" fill="#DB2777" />
              <rect x="40" y="102" width="40" height="25" fill="white" fillOpacity="0.9" rx="2" />
              <text x="60" y="112" textAnchor="middle" fill="#0EA5E9" fontSize="6" fontWeight="bold" fontStyle="italic">GONUTS</text>
              <text x="60" y="122" textAnchor="middle" fill="#DB2777" fontSize="6" fontWeight="bold">DONUTS</text>
              <circle cx="35" cy="138" r="4" fill="#333" />
              <circle cx="85" cy="138" r="4" fill="#333" />
           </svg>
        </div>
      </div>
      
      {timeLeft > 57 && (
        <div className="absolute inset-x-0 bottom-64 text-center animate-bounce z-40">
          <p className="text-pink-500 font-fun text-xl drop-shadow-sm px-4">
            MOVE TO CATCH!
          </p>
        </div>
      )}
    </div>
  );
};

export default GameView;
