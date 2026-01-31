
import React from 'react';
import { Trophy, Play, Instagram } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  onViewLeaderboard: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onViewLeaderboard }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500 overflow-y-auto">
      <div className="relative mb-4">
        <div className="w-48 h-56 flex items-center justify-center animate-float">
          <div className="relative scale-[1.6]">
             <svg width="120" height="150" viewBox="0 0 120 150">
                {/* Umbrella with tassels */}
                <path d="M10 55 L10 60 L15 55 L20 60 L25 55 L30 60 L35 55 L40 60 L45 55 L50 60 L55 55 L60 60 L65 55 L70 60 L75 55 L80 60 L85 55 L90 60 L95 55 L100 60 L105 55 L110 60 L110 55" fill="#f3f4f6" />
                <path d="M10 55 Q60 10 110 55 Z" fill="#fff" />
                <path d="M10 55 Q30 25 50 15 L60 55 Z" fill="#fbcfe8" />
                <path d="M70 15 Q90 25 110 55 L60 55 Z" fill="#fbcfe8" />
                
                {/* Pole */}
                <rect x="58" y="55" width="4" height="40" fill="#713F12" />
                
                {/* Body */}
                <rect x="25" y="90" width="70" height="45" rx="2" fill="#0EA5E9" />
                <path d="M25 90 L95 90 L95 105 L25 105 Z" fill="#DB2777" />
                
                {/* Clouds/Stars */}
                <circle cx="40" cy="115" r="8" fill="#7dd3fc" fillOpacity="0.6" />
                <circle cx="50" cy="120" r="10" fill="#7dd3fc" fillOpacity="0.6" />
                <path d="M35 110 l2 2 l-2 2 l-2 -2 z" fill="#fbbf24" />
                <path d="M85 125 l2 2 l-2 2 l-2 -2 z" fill="#fbbf24" />
                
                {/* Logo */}
                <rect x="40" y="102" width="40" height="25" fill="white" fillOpacity="0.9" rx="2" />
                <text x="60" y="112" textAnchor="middle" fill="#0EA5E9" fontSize="6" fontWeight="bold" fontStyle="italic">GONUTS</text>
                <text x="60" y="122" textAnchor="middle" fill="#DB2777" fontSize="6" fontWeight="bold">DONUTS</text>
                
                {/* Wheels */}
                <circle cx="35" cy="138" r="4" fill="#333" />
                <circle cx="85" cy="138" r="4" fill="#333" />
             </svg>
          </div>
        </div>
        <div className="absolute top-0 -right-6 bg-yellow-400 text-white px-3 py-1 rounded-full font-bold text-xs rotate-12 shadow-md">
          FRESH!
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-4xl font-fun text-pink-500 drop-shadow-sm">GONUTS</h1>
        <h2 className="text-2xl font-fun text-sky-500">DONUT CATCHER</h2>
        <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm px-4">
          Move the umbrella to catch falling donuts. The faster they fall, the more you win!
        </p>
      </div>

      <div className="flex flex-col w-full gap-3 max-w-[280px]">
        <button 
          onClick={onStart}
          className="group flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl text-lg font-bold transition-all shadow-lg active:scale-95"
        >
          <Play fill="currentColor" size={20} />
          START CATCHING
        </button>

        <button 
          onClick={onViewLeaderboard}
          className="flex items-center justify-center gap-2 bg-sky-100 hover:bg-sky-200 text-sky-600 py-3 rounded-2xl font-bold transition-all text-sm"
        >
          <Trophy size={18} />
          LEADERBOARD
        </button>

        <a 
          href="https://www.instagram.com/gonuts.donut/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white py-3 rounded-2xl font-bold transition-all text-sm shadow-sm"
        >
          <Instagram size={18} />
          FOLLOW US
        </a>
      </div>
    </div>
  );
};

export default StartScreen;
