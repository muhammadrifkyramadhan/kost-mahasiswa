import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  Smartphone, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from '../../data/mockData';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    twoFactorModalOpen,
    setTwoFactorModalOpen,
    tempAuthUser,
    login,
    verify2FA,
    switchRole
  } = useApp();

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('dimas.rizky@ui.ac.id');
  const [password, setPassword] = useState('password123');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState(false);

  if (!authModalOpen && !twoFactorModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(identifier, loginMethod === 'phone', password);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verify2FA(otpCode);
    if (!success) {
      setOtpError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {twoFactorModalOpen ? 'Verifikasi Dua Faktor (2FA)' : 'Masuk ke KostMahasiswa'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {twoFactorModalOpen ? 'Perlindungan keamanan tingkat lanjut' : 'Akses mahasiswa & pengelola'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setAuthModalOpen(false);
              setTwoFactorModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2FA MODAL STEP */}
        {twoFactorModalOpen ? (
          <form onSubmit={handleOtpSubmit} className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center ring-4 ring-emerald-50">
                <Smartphone className="w-7 h-7" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900">Masukkan 6-Digit Kode OTP</h4>
              <p className="text-xs text-slate-500">
                Kode keamanan 2FA telah dikirimkan ke WhatsApp/SMS:
                <br />
                <span className="font-mono font-bold text-slate-800">
                  {tempAuthUser?.phone || '0812-****-3456'}
                </span>
              </p>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  setOtpError(false);
                }}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] font-mono font-black text-2xl py-3.5 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                autoFocus
              />
              {otpError && (
                <p className="text-xs text-rose-600 mt-1 text-center font-semibold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Kode verifikasi tidak valid. Coba kode demo: 123456
                </p>
              )}
            </div>

            {/* Quick Demo Helper Button */}
            <button
              type="button"
              onClick={() => {
                setOtpCode('123456');
                setOtpError(false);
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Isi Otomatis Kode Demo: 123456</span>
            </button>

            <button
              type="submit"
              disabled={otpCode.length !== 6}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verifikasi & Masuk Sekarang</span>
            </button>
          </form>
        ) : (
          /* LOGIN STEP */
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            
            {/* Toggle Login by Email or Phone */}
            <div className="p-1 bg-slate-100 rounded-2xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('email');
                  setIdentifier('dimas.rizky@ui.ac.id');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  loginMethod === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Kampus / Umum</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMethod('phone');
                  setIdentifier('081289123456');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  loginMethod === 'phone' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Nomor HP / WhatsApp</span>
              </button>
            </div>

            {/* Input Identifier */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                {loginMethod === 'email' ? 'Alamat Email' : 'Nomor HP (WhatsApp Aktif)'}
              </label>
              <input
                type={loginMethod === 'email' ? 'email' : 'tel'}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={loginMethod === 'email' ? 'nama@campus.ac.id' : '081234567890'}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* 2FA Protection Note */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Akun diamankan dengan 2FA (WhatsApp OTP).</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Verifikasi 2FA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
