import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const {
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password validation: must contain both letters and numbers
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const isAlphanumericValid = hasLetters && hasNumbers && password.length >= 6;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Google Sign-In was cancelled or could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    // Alphanumeric password validation for both registration and strict signin check
    if (!hasLetters || !hasNumbers) {
      setError('Password must contain both letters and numbers.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
      } else {
        await registerWithEmail(email.trim(), password, name.trim());
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      const code = err?.code || '';

      if (code === 'auth/user-not-found') {
        setError('Account not found. Please check your email or register a new account.');
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Incorrect password. Please try again.');
      } else if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. It must be at least 6 characters and contain both letters and numbers.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network connection error. Please check your internet connection.');
      } else {
        setError(err?.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-100">
        
        {/* Header */}
        <div className="bg-[#071a23] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#ea580c]">
              LET'S TRAVEL • CUSTOM TOURS
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif">
            {mode === 'signin' ? 'Welcome Back, Traveller' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signin'
              ? 'Sign in to access your bookings, download e-tickets, and manage trips.'
              : 'Sign up to explore custom packages, hire guides, and save wishlist destinations.'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 text-xs font-bold text-center bg-slate-50">
          <button
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-3 cursor-pointer transition-colors ${
              mode === 'signin' ? 'bg-white text-[#ea580c] border-b-2 border-[#ea580c]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-3 cursor-pointer transition-colors ${
              mode === 'register' ? 'bg-white text-[#ea580c] border-b-2 border-[#ea580c]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-2 my-2 text-[11px] text-slate-400">
              <div className="h-px bg-slate-200 flex-1" />
              <span>Or sign in with email</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Hemant Badgujar"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#ea580c] outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="traveler@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#ea580c] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <span className="text-[10px] text-slate-400 font-medium">Both letters & numbers</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. Travel2026"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#ea580c] outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password rule helper */}
                <div className="mt-1.5 flex items-center gap-3 text-[11px]">
                  <span className={`flex items-center gap-1 ${hasLetters ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Letters (a-z)
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumbers ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Numbers (0-9)
                  </span>
                  <span className={`flex items-center gap-1 ${password.length >= 6 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Min 6 chars
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-2.5 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{mode === 'signin' ? 'Sign In to LET\'S TRAVEL' : 'Register Account'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
