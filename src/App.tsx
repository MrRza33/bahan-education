import React, { useState, useEffect } from 'react';
import { ScreenType, LanguageCode, SavedAccount } from './types';
import LoginSaved from './components/LoginSaved';
import LoginStandard from './components/LoginStandard';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import MockDashboard from './components/MockDashboard';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Always light white mode
  const darkMode = false;

  // Simple state routing supporting path check - default is standard-login
  const [screen, setScreen] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/paneladmin' || path.endsWith('/paneladmin') || window.location.hash === '#/paneladmin') {
      return 'admin';
    }
    return 'standard-login';
  });
  
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);

  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [lang, setLang] = useState<LanguageCode>('id');

  // Sync state changes with current path hashes for consistent router state on reload
  useEffect(() => {
    if (screen === 'admin') {
      window.history.pushState(null, '', '/paneladmin');
    } else if (screen === 'standard-login') {
      window.history.pushState(null, '', '/');
    }
  }, [screen]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/paneladmin' || path.endsWith('/paneladmin')) {
        setScreen('admin');
      } else {
        setScreen('standard-login');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const handleRemoveAccount = (id: string) => {
    const filtered = savedAccounts.filter(acc => acc.id !== id);
    setSavedAccounts(filtered);
    if (filtered.length === 0) {
      setScreen('standard-login');
    }
  };

  const handleLoginSuccess = (username: string) => {
    setCurrentUsername(username);
    setScreen('dashboard');

    const exists = savedAccounts.some(acc => acc.username.toLowerCase() === username.toLowerCase());
    if (!exists && username !== 'facebook_user') {
      const newSaved: SavedAccount = {
        id: `saved_${Date.now()}`,
        username: username.toLowerCase(),
        fullName: username.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=0095f6`,
        followers: Math.floor(Math.random() * 5000),
        unseenStories: false
      };
      setSavedAccounts(prev => [...prev, newSaved]);
    }
  };

  const handleSignUpSuccess = (username: string, fullName: string) => {
    const newSaved: SavedAccount = {
      id: `saved_${Date.now()}`,
      username: username.toLowerCase(),
      fullName: fullName,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=0095f6`,
      followers: 0,
      unseenStories: false
    };

    setSavedAccounts(prev => [...prev, newSaved]);
    setCurrentUsername(username);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUsername('');
    setScreen(savedAccounts.length > 0 ? 'saved-login' : 'standard-login');
  };

  // If on admin panel, load direct administrative control
  if (screen === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div 
      id="app-root" 
      className="min-h-screen w-full flex flex-col items-center justify-between bg-white text-black font-sans relative"
    >
      
      {/* Main Authentic View Centering Wrapper */}
      <div className="flex-1 w-full flex flex-col justify-center py-6 bg-white">
        
        <div className="w-full bg-white flex flex-col">
          
          {screen === 'saved-login' && (
            <LoginSaved
              savedAccounts={savedAccounts}
              onRemoveAccount={handleRemoveAccount}
              onLoginSuccess={handleLoginSuccess}
              setScreen={(scr) => setScreen(scr as string)}
              lang={lang}
              setLang={setLang}
            />
          )}

          {screen === 'standard-login' && (
            <LoginStandard
              onLoginSuccess={handleLoginSuccess}
              setScreen={(scr) => setScreen(scr as string)}
              lang={lang}
              setLang={setLang}
            />
          )}

          {screen === 'signup' && (
            <SignUp
              onSignUpSuccess={handleSignUpSuccess}
              setScreen={(scr) => setScreen(scr as string)}
              lang={lang}
            />
          )}

          {screen === 'forgot-password' && (
            <ForgotPassword
              setScreen={(scr) => setScreen(scr as string)}
              lang={lang}
            />
          )}

          {screen === 'dashboard' && (
            <MockDashboard
              currentUsername={currentUsername}
              onLogout={handleLogout}
              darkMode={darkMode}
            />
          )}

        </div>
      </div>

      {/* Clean Bottom Meta Branding Footer (Emulating Instagram style footer) */}
      <footer className="w-full py-6 text-center select-none shrink-0 border-t border-gray-100 dark:border-zinc-900/50 bg-white dark:bg-black/20">
        <div className="max-w-screen-md mx-auto px-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-400 dark:text-zinc-500 font-sans tracking-wide">
          <span>Meta</span>
          <span>Tentang</span>
          <span>Blog</span>
          <span>Pekerjaan</span>
          <span>Bantuan</span>
          <span>API</span>
          <span>Privasi</span>
          <span>Ketentuan</span>
          <span>Lokasi</span>
          <span>Instagram Lite</span>
          <span>Hubungi Pengunggah</span>
        </div>
        <p className="text-[10px] text-gray-400/80 dark:text-zinc-650 mt-4 font-mono">
          © 2026 Instagram from Meta
        </p>
      </footer>

    </div>
  );
}
