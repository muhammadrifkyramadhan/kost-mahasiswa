import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Lock, 
  User, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Smartphone, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  Check, 
  Eye, 
  EyeOff,
  Wrench,
  MessageSquare,
  Award,
  Star,
  Users,
  BadgeCheck,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

import { downloadProjectZip } from '../../utils/downloadProject';

export const AuthGate: React.FC = () => {
  const { 
    login, 
    register, 
    verify2FA, 
    twoFactorModalOpen, 
    setTwoFactorModalOpen,
    tempAuthUser, 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [loginIdentifier, setLoginIdentifier] = useState('dimas.rizky@ui.ac.id');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('user');
  const [regCampus, setRegCampus] = useState('Universitas Indonesia (UI Depok)');
  const [regMajor, setRegMajor] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTermsAccepted, setRegTermsAccepted] = useState(true);

  // 2FA OTP State
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginIdentifier, loginMethod === 'phone', loginPassword);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regTermsAccepted) return;
    register({
      name: regName || 'Mahasiswa Baru',
      email: regEmail || 'mhs.baru@campus.ac.id',
      phone: regPhone || '081298765432',
      campus: regCampus,
      major: regMajor || 'Teknik Informatika',
      role: regRole,
    });
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    setOtpError(false);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    const success = verify2FA(fullCode);
    if (!success) {
      setOtpError(true);
    }
  };

  const fillQuickOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setOtpError(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-white">
      
      {/* Background Architectural Mesh & Subtle Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Corporate Institutional Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              Platform Terverifikasi Dikti & Kominfo
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Standar Keamanan Transaksi Perbankan ISO 27001
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadProjectZip()}
              className="font-bold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer"
              title="Unduh seluruh folder proyek format .ZIP"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unduh Folder (.ZIP)</span>
            </button>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">WhatsApp CS:</span>
            <a 
              href="https://wa.me/6281289123456" 
              target="_blank" 
              rel="noreferrer"
              className="font-bold text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 flex items-center gap-1 text-[11px] transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>0812-8912-3456</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Hero & Auth Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
          
          {/* Left Hero Section */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Logo & Headline */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Portal Sistem Informasi Kos Mahasiswa Indonesia</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-extrabold tracking-tight text-white leading-[1.15]">
                Solusi Cerdas & Aman <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                  Sewa Kos Sekitar Kampus
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                Platform resmi reservasi kamar kos mahasiswa terpadu dengan integrasi pembayaran digital otomatis (QRIS & Virtual Account), tur kamar 360°, pelaporan kendala teknisi, serta keamanan autentikasi 2FA.
              </p>
            </div>

            {/* Platform Credibility Metrics */}
            <div className="grid grid-cols-3 gap-4 border-y border-slate-800/80 py-4 max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">42.800+</div>
                <div className="text-[11px] text-slate-400 font-medium">Mahasiswa Terdaftar</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">1.450+</div>
                <div className="text-[11px] text-slate-400 font-medium">Kamar Terverifikasi</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-teal-400">99.8%</div>
                <div className="text-[11px] text-slate-400 font-medium">SLA Kepuasan Layanan</div>
              </div>
            </div>

            {/* Student University Badges */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Kemitraan Radius Kampus Unggulan:
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  🟡 UI Depok (Margonda & Salemba)
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  🔵 ITB Bandung (Dago & Dipatiukur)
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  🟢 UGM Yogyakarta (Pogung & Kaliurang)
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  🔴 UNDIP Tembalang
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  🔵 ITS Sukolilo Surabaya
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  🟣 UB Soekarno-Hatta Malang
                </span>
              </div>
            </div>

            {/* Trust and Safety Guarantee Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-3.5 max-w-xl shadow-sm">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Jaminan Keamanan & Kenyamanan Hunian</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Setiap transaksi sewa dilindungi sistem escrow resmi, verifikasi identitas mahasiswa, dan perlindungan privasi data pengguna berstandar enkripsi tinggi.
                </p>
              </div>
            </div>

          </div>

          {/* Right Card: Authentication Module */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-100 relative">
              
              {twoFactorModalOpen ? (
                /* STEP 2: PROFESSIONAL 2FA OTP VERIFICATION */
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50/60 shadow-xs">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Verifikasi Keamanan 2FA
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Masukkan 6 digit kode sandi sekali pakai (OTP) yang dikirimkan ke WhatsApp resmi akun Anda:
                    </p>
                    <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 font-mono font-bold text-xs text-slate-800">
                      {tempAuthUser?.phone || '0812-8912-3456'}
                    </div>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-5">
                    {/* 6 Discrete Digit Boxes */}
                    <div>
                      <div className="flex justify-center gap-2 sm:gap-2.5">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-black text-xl rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 shadow-xs"
                          />
                        ))}
                      </div>

                      {otpError && (
                        <p className="text-xs text-rose-600 mt-2 text-center font-semibold flex items-center justify-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Kode OTP tidak cocok. Klik tombol bantuan demo di bawah.
                        </p>
                      )}
                    </div>

                    {/* Quick Demo OTP Auto-fill */}
                    <button
                      type="button"
                      onClick={fillQuickOtp}
                      className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Isi Otomatis Kode OTP Demo: 123456</span>
                    </button>

                    <button
                      type="submit"
                      disabled={otpDigits.some((d) => !d)}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verifikasi & Masuk ke Sistem</span>
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setTwoFactorModalOpen(false)}
                        className="text-slate-500 hover:text-slate-900 font-semibold"
                      >
                        ← Kembali
                      </button>
                      <span className="text-slate-400">
                        Kirim ulang via SMS ({resendTimer}s)
                      </span>
                    </div>
                  </form>
                </div>
              ) : (
                /* STEP 1: LOGIN / REGISTER TABBED INTERFACE */
                <div className="space-y-6">
                  
                  {/* Segmented Control */}
                  <div className="p-1 bg-slate-100 rounded-2xl flex items-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                        mode === 'login'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Masuk Akun</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                        mode === 'register'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Daftar Akun Baru</span>
                    </button>
                  </div>

                  {/* LOGIN FORM */}
                  {mode === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      
                      {/* Method Toggle: Email vs WhatsApp Phone */}
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Metode Masuk:
                        </label>
                        <div className="flex items-center gap-1 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setLoginMethod('email');
                              setLoginIdentifier('dimas.rizky@ui.ac.id');
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                              loginMethod === 'email' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Email Kampus
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              setLoginMethod('phone');
                              setLoginIdentifier('081289123456');
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                              loginMethod === 'phone' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Nomor WhatsApp
                          </button>
                        </div>
                      </div>

                      {/* Identifier Input */}
                      <div>
                        <div className="relative">
                          {loginMethod === 'email' ? (
                            <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          ) : (
                            <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          )}
                          <input
                            type={loginMethod === 'email' ? 'email' : 'tel'}
                            required
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            placeholder={loginMethod === 'email' ? 'nama@campus.ac.id' : '081234567890'}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder-slate-400"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Kata Sandi
                          </label>
                          <span className="text-[11px] text-emerald-600 hover:underline cursor-pointer font-medium">
                            Lupa kata sandi?
                          </span>
                        </div>
                        <div className="relative">
                          <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder-slate-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember & Security badge */}
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="accent-emerald-600 rounded"
                          />
                          <span>Ingat sesi masuk</span>
                        </label>

                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          2FA Dilindungi
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Masuk & Lanjut ke Verifikasi 2FA</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  {/* REGISTER FORM */}
                  {mode === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                      
                      {/* Role selection */}
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Tipe Akun:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setRegRole('user')}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                              regRole === 'user'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <div>Mahasiswa</div>
                              <div className="text-[10px] text-slate-400 font-normal">Pencari / Penyewa Kos</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRegRole('admin')}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                              regRole === 'admin'
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-800 ring-1 ring-indigo-500'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            <div>
                              <div>Pemilik Kos</div>
                              <div className="text-[10px] text-slate-400 font-normal">Pengelola Properti</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Nama Lengkap Sesuai KTP / KTM
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Contoh: Rifky Ramadhan"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                        />
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Email Kampus / Aktif
                          </label>
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="nama@campus.ac.id"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Nomor WhatsApp (2FA)
                          </label>
                          <input
                            type="tel"
                            required
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="081234567890"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Campus Selection */}
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Afiliasi Kampus
                        </label>
                        <select
                          value={regCampus}
                          onChange={(e) => setRegCampus(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
                        >
                          <option value="Universitas Indonesia (UI Depok)">Universitas Indonesia (UI Depok)</option>
                          <option value="Institut Teknologi Bandung (ITB Dago)">Institut Teknologi Bandung (ITB Dago)</option>
                          <option value="Universitas Gadjah Mada (UGM Jogja)">Universitas Gadjah Mada (UGM Jogja)</option>
                          <option value="Universitas Diponegoro (UNDIP Semarang)">Universitas Diponegoro (UNDIP Semarang)</option>
                          <option value="Institut Teknologi Sepuluh Nopember (ITS Surabaya)">Institut Teknologi Sepuluh Nopember (ITS)</option>
                          <option value="Universitas Brawijaya (UB Malang)">Universitas Brawijaya (UB Malang)</option>
                          <option value="Universitas Lainnya">Universitas / Institut Lainnya</option>
                        </select>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Kata Sandi Akun
                        </label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Kombinasi minimal 8 karakter"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                        />
                      </div>

                      {/* Terms Acceptance */}
                      <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={regTermsAccepted}
                          onChange={(e) => setRegTermsAccepted(e.target.checked)}
                          className="mt-0.5 accent-emerald-600 rounded"
                        />
                        <span>
                          Saya menyetujui Ketentuan Layanan, Kode Etik Penghuni Kos, dan aktivasi keamanan 2FA WhatsApp OTP.
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={!regTermsAccepted}
                        className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Daftar Akun & Lanjut Verifikasi 2FA</span>
                      </button>

                    </form>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Corporate Footer Bar */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md relative z-20 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>© 2026 PT Kost Mahasiswa Indonesia. Seluruh hak cipta dilindungi undang-undang.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Enkripsi SSL 256-Bit</span>
            <span>Kebijakan Privasi</span>
            <span>Syarat & Ketentuan Sewa</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
