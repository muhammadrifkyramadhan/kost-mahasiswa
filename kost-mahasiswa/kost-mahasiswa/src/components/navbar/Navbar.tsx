import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Bell, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  ChevronDown, 
  Sparkles,
  Laptop2,
  Lock,
  Layers,
  PhoneCall,
  Menu,
  X,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { downloadProjectZip } from '../../utils/downloadProject';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setChatDrawerOpen,
    activeTab,
    setActiveTab,
    setAuthModalOpen,
    isLoggedIn,
    logout
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Institutional Notification Bar */}
      <div className="bg-slate-950 text-slate-400 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Sistem Operasional Optimal (99.98% SLA)
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:inline text-slate-400">
              Layanan Penghuni 24 Jam • Terhubung QRIS Bank Indonesia
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadProjectZip()}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 transition-all text-[11px] cursor-pointer"
              title="Unduh seluruh folder dan file kode proyek format .ZIP"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span>Unduh Folder Proyek (.ZIP)</span>
            </button>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden md:inline text-slate-500">Bantuan Darurat Kos:</span>
            <span className="font-mono text-slate-300 font-bold">0812-8912-3456</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('browse')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  Kost<span className="text-emerald-600">Mahasiswa</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Kampus ID
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Sistem Informasi & Booking Kos Terpadu</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Cari Kos
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'map'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              Peta Lokasi Kampus
            </button>
            <button
              onClick={() => setActiveTab('tenant-tickets')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'tenant-tickets'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              Lapor Kendala
            </button>

            {/* Role specific quick tabs */}
            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Dashboard Pengelola
              </button>
            )}
            {currentRole === 'superadmin' && (
              <button
                onClick={() => setActiveTab('superadmin-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'superadmin-dashboard'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                Super Admin Hub
              </button>
            )}
            {currentRole === 'developer' && (
              <button
                onClick={() => setActiveTab('dev-dashboard')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dev-dashboard'
                    ? 'bg-amber-50 text-amber-800 font-semibold'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Laptop2 className="w-4 h-4" />
                Backend Infra
              </button>
            )}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Chat Trigger */}
            <button
              onClick={() => setChatDrawerOpen(true)}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Obrolan Kost & Pesan Langsung"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Real-time Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Pusat Notifikasi Real-time"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Notifikasi Real-Time</h4>
                      <p className="text-xs text-slate-500">Pembaruan transaksi & kendala kos</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        Tidak ada notifikasi baru
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.linkAction) {
                              setActiveTab(notif.linkAction as any);
                            }
                            setNotifOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                            !notif.isRead ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                            notif.type === 'payment_due' ? 'bg-amber-100 text-amber-700' :
                            notif.type === 'maintenance' ? 'bg-blue-100 text-blue-700' :
                            notif.type === 'booking' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {notif.type === 'payment_due' ? <AlertCircle className="w-4 h-4" /> :
                             notif.type === 'maintenance' ? <Wrench className="w-4 h-4" /> :
                             notif.type === 'booking' ? <CheckCircle2 className="w-4 h-4" /> :
                             <Bell className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-xs font-semibold ${!notif.isRead ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notif.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Login Button */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.phone}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>2FA Terproteksi ({currentUser.twoFactorMethod?.toUpperCase() || 'AKTIF'})</span>
                      </div>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        Profil & Riwayat Sewa Saya
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('tenant-tickets');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                      >
                        <Wrench className="w-4 h-4 text-slate-500" />
                        Status Tiket Perbaikan
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 mt-1 border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Keluar Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Masuk / 2FA
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab('browse');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cari Kos
          </button>
          <button
            onClick={() => {
              setActiveTab('map');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            Peta Lokasi Kampus
          </button>
          <button
            onClick={() => {
              setActiveTab('tenant-tickets');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Wrench className="w-4 h-4 text-amber-500" />
            Lapor Kendala Kamar
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <User className="w-4 h-4 text-slate-500" />
            Profil Pengguna & Riwayat Sewa
          </button>
        </div>
      )}
    </header>
  </>
  );
};
