
import React, { useState, useMemo } from 'react';
import { Mail, User, Send, RefreshCw, Gift, Instagram, CheckCircle } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  onSave: (entry: { name: string, email: string, score: number, verificationCode: string }) => void;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onSave, onRestart }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Generate a unique verification code that includes the score
  const verificationCode = useMemo(() => {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GN-${score}-${random}`;
  }, [score]);

  const getCoupon = () => {
    if (score >= 1500) return "GOLDEN-GONUT-50";
    if (score >= 800) return "DONUT-LOVER-25";
    if (score >= 300) return "GONUTS-10";
    return "SWEET-TRY-5";
  };

  const coupon = getCoupon();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitting(true);

    // 1. Save to local leaderboard
    onSave({ name, email, score, verificationCode });

    // 2. Format email to lababesh@gmail.com
    const subject = encodeURIComponent(`Gonut Donut Prize Won by ${name}!`);
    const body = encodeURIComponent(
      `Player Name: ${name}\n` +
      `Player Email: ${email}\n` +
      `Final Score: ${score}\n` +
      `Verification Code: ${verificationCode}\n` +
      `Coupon Unlocked: ${coupon}\n\n` +
      `This message was generated from the Gonut Donut Catcher game.`
    );
    
    // Redirect to mail client
    window.location.href = `mailto:lababesh@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1000);
  };

  if (isSent) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
          <CheckCircle size={64} />
        </div>
        <h2 className="text-3xl font-fun text-green-600">REWARD SAVED!</h2>
        <p className="text-slate-500 font-medium max-w-xs">
          Your score and verification code have been recorded. Show your email or this screen to the owner to redeem your donut!
        </p>
        <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-100 w-full max-w-sm">
           <div className="text-[10px] font-bold text-sky-400 uppercase mb-1">YOUR UNIQUE CODE</div>
           <div className="font-mono text-xl font-bold text-sky-700">{verificationCode}</div>
        </div>
        <button 
          onClick={onRestart}
          className="bg-sky-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-md"
        >
          PLAY AGAIN
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-6 animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-2xl font-fun text-pink-500 uppercase tracking-wider">AWESOME CATCHING!</h2>
        <div className="text-6xl font-fun text-sky-500 py-2 drop-shadow-md">
          {score}
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Points Collected</p>
      </div>

      <div className="w-full max-w-sm bg-pink-50 border-4 border-dashed border-pink-200 rounded-[2rem] p-6 relative overflow-hidden text-center space-y-3 shadow-inner">
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-[10px] font-bold px-3 py-1 rounded-full rotate-12 shadow-sm">
          UNLOCKED!
        </div>
        <Gift className="mx-auto text-pink-400" size={32} />
        <h3 className="text-xl font-bold text-pink-600">Your Reward!</h3>
        <div className="bg-white py-3 px-4 rounded-xl font-mono text-2xl text-pink-700 tracking-wider border-2 border-pink-100 font-extrabold shadow-sm">
          {coupon}
        </div>
        <div className="flex flex-col items-center mt-2">
           <span className="text-[10px] text-pink-400 font-bold uppercase tracking-tight">VERIFICATION CODE</span>
           <span className="font-mono text-xs text-pink-500 font-bold">{verificationCode}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div className="space-y-3 bg-white/60 backdrop-blur-sm p-5 rounded-3xl border-2 border-sky-100 shadow-lg">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={18} />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-sky-50 rounded-2xl focus:border-sky-300 outline-none transition-all font-bold text-sm"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-sky-50 rounded-2xl focus:border-sky-300 outline-none transition-all font-bold text-sm"
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Send size={20} />
            {isSubmitting ? 'SENDING...' : 'SAVE & SEND TO STORE'}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <a 
          href="https://www.instagram.com/gonuts.donut/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white py-3.5 rounded-2xl font-bold transition-all shadow-md text-sm"
        >
          <Instagram size={20} />
          FOLLOW @GONUTS.DONUT
        </a>
        
        <button 
          onClick={onRestart}
          className="flex items-center justify-center gap-2 text-sky-400 hover:text-sky-600 font-bold transition-all uppercase tracking-widest text-xs py-2"
        >
          <RefreshCw size={14} />
          Discard & Try Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
