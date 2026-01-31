
import React, { useState, useEffect } from 'react';
import { GameState, ScoreEntry } from './types';
import StartScreen from './components/StartScreen';
import GameView from './components/GameView';
import GameOverScreen from './components/GameOverScreen';
import LeaderboardView from './components/LeaderboardView';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [lastScore, setLastScore] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gonut_leaderboard');
    if (saved) {
      try {
        setLeaderboard(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse leaderboard", e);
      }
    }
  }, []);

  const saveScore = (entry: Omit<ScoreEntry, 'id' | 'date'>) => {
    const newEntry: ScoreEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setLeaderboard(updated);
    localStorage.setItem('gonut_leaderboard', JSON.stringify(updated));
    setGameState(GameState.LEADERBOARD);
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    setGameState(GameState.GAME_OVER);
  };

  return (
    <div className="fixed inset-0 bg-sky-50 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Decorative background for desktop */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-sky-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md h-full sm:h-[90vh] sm:max-h-[850px] bg-white sm:rounded-[3.5rem] shadow-2xl overflow-hidden border-0 sm:border-[16px] border-white flex flex-col z-10">
        <div className="flex-1 relative bg-gradient-to-b from-sky-50/50 to-white">
          {gameState === GameState.START && (
            <StartScreen 
              onStart={() => setGameState(GameState.PLAYING)} 
              onViewLeaderboard={() => setGameState(GameState.LEADERBOARD)}
            />
          )}

          {gameState === GameState.PLAYING && (
            <GameView onGameOver={handleGameOver} />
          )}

          {gameState === GameState.GAME_OVER && (
            <GameOverScreen 
              score={lastScore} 
              onSave={saveScore} 
              onRestart={() => setGameState(GameState.PLAYING)} 
            />
          )}

          {gameState === GameState.LEADERBOARD && (
            <LeaderboardView 
              scores={leaderboard} 
              onBack={() => setGameState(GameState.START)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
