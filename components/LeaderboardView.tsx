
import React from 'react';
import { ScoreEntry } from '../types';
import { Trophy, ArrowLeft, Star } from 'lucide-react';

interface LeaderboardViewProps {
  scores: ScoreEntry[];
  onBack: () => void;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ scores, onBack }) => {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-8 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-pink-50 rounded-full text-pink-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-fun text-sky-500 text-center flex-1">HALL OF FAME</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-3">
        {scores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
            <Star size={48} className="opacity-20" />
            <p className="font-bold uppercase tracking-widest">No legends yet!</p>
          </div>
        ) : (
          scores.map((entry, index) => (
            <div 
              key={entry.id}
              className={`flex items-center p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                index === 0 ? 'bg-pink-50 border-pink-200 shadow-md' : 'bg-white border-sky-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-fun text-xl mr-4 ${
                index === 0 ? 'bg-yellow-400 text-white shadow-sm' : 
                index === 1 ? 'bg-slate-300 text-white' :
                index === 2 ? 'bg-orange-300 text-white' : 'bg-sky-100 text-sky-400'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-700 truncate">{entry.name}</div>
                <div className="text-xs text-slate-400 truncate">{entry.email}</div>
              </div>

              <div className="text-right">
                <div className={`text-2xl font-fun ${index === 0 ? 'text-pink-500' : 'text-sky-500'}`}>
                  {entry.score}
                </div>
                <div className="text-[10px] text-slate-300 uppercase font-bold">Points</div>
              </div>

              {index === 0 && (
                <div className="ml-4 text-yellow-500">
                  <Trophy size={20} fill="currentColor" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-8 bg-sky-50 border-t border-sky-100 text-center">
        <p className="text-sm font-bold text-sky-600 uppercase tracking-widest">
          The best catchers get the best discounts!
        </p>
      </div>
    </div>
  );
};

export default LeaderboardView;
