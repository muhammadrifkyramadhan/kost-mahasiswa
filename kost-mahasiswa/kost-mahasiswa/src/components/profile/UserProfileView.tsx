import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Save, 
  QrCode, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';

export const UserProfileView: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    bookings,
    setActivePaymentBooking,
    addNotification,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [campus, setCampus] = useState(currentUser.campus || '');
  const [major, setMajor] = useState(currentUser.major || '');
  const [studentId, setStudentId] = useState(currentUser.studentId || '');
  const [emergencyContact, setEmergencyContact] = useState(currentUser.emergencyContact || '');

  const myBookings = bookings.filter((b) => b.tenantId === currentUser.id || b.tenantName === currentUser.name);
  const activeBooking = myBookings[0] || bookings[0];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSaveProfile = () => {
    updateCurrentUser({
      name,
      phone,
      campus,
      major,
      studentId,
      emergencyContact,
    });
    setIsEditing(false);
    addNotification({
      type: 'system',
      title: 'Profil Diperbarui',
      message: 'Perubahan data identitas Anda berhasil disimpan ke database.',
    });
  };

  const handleToggle2FA = () => {
    const nextState = !currentUser.twoFactorEnabled;
    updateCurrentUser({ twoFactorEnabled: nextState });
    addNotification({
      type: 'system',
      title: nextState ? '2FA Berhasil Diaktifkan' : '2FA Dinonaktifkan',
      message: nextState
        ? 'Akun Anda kini terlindungi verifikasi dua faktor saat login berikutnya.'
        : 'Peringatan: Verifikasi 2FA dinonaktifkan.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white text-xs">
              ✓
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentUser.name}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Penyewa Terverifikasi
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentUser.campus} • {currentUser.major} (NIM: {currentUser.studentId || '2106728190'})
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.phone}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Batal Edit' : 'Edit Biodata'}</span>
        </button>
      </div>

      {/* Edit Form Drawer if active */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
            Edit Data Identitas & Kampus
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Kampus</label>
              <input
                type="text"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Program Studi / Jurusan</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Nomor Induk Mahasiswa (NIM)</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Kontak Darurat (Wali)</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      )}

      {/* Payment Reminder & Active Lease Spotlight */}
      {activeBooking && (
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Clock className="w-3.5 h-3.5" />
                Pemberitahuan Tagihan & Status Sewa Aktif
              </span>

              <div>
                <h3 className="text-xl sm:text-2xl font-black">{activeBooking.kostName}</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Kamar No. <span className="font-extrabold text-white">{activeBooking.roomNumber}</span> • Periode: {activeBooking.startDate} s/d {activeBooking.endDate}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tarif Sewa Bulanan:</span>
                  <span className="font-extrabold text-white">{formatRupiah(activeBooking.monthlyRent)}/bln</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Jatuh Tempo Pembayaran:</span>
                  <span className="font-extrabold text-amber-400">{activeBooking.nextPaymentDue}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status Tagihan Terkini:</span>
                  <span className="font-extrabold text-emerald-400 capitalize">
                    {activeBooking.paymentStatus === 'paid' ? 'LUNAS (Terverifikasi)' : 'Menunggu Pembayaran'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <button
                onClick={() => setActivePaymentBooking(activeBooking)}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>Lihat Kuitansi / Bayar Ulang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication (2FA) Security Control Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  Keamanan Autentikasi Dua Faktor (2FA)
                </h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  currentUser.twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {currentUser.twoFactorEnabled ? 'AKTIF' : 'NON-AKTIF'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Lindungi akun Anda dari akses tidak sah. Saat 2FA aktif, setiap kali masuk menggunakan email atau nomor telepon akan meminta verifikasi 6 digit kode OTP via WhatsApp/SMS.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggle2FA}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-xs ${
              currentUser.twoFactorEnabled
                ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {currentUser.twoFactorEnabled ? 'Nonaktifkan 2FA' : 'Aktifkan 2FA Sekarang'}
          </button>
        </div>
      </div>

      {/* Lease History & Invoices List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Riwayat Sewa & Transaksi Pembayaran
            </h3>
            <p className="text-xs text-slate-500">Semua riwayat tagihan, kuitansi digital, dan periode sewa</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
            {myBookings.length} Transaksi Terdata
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {myBookings.map((b) => (
            <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={b.kostImage}
                  alt={b.kostName}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{b.kostName}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                      {b.bookingCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Kamar {b.roomNumber} • {b.durationMonths} Bulan ({b.startDate} s/d {b.endDate})
                  </p>
                  <span className="text-xs font-bold text-emerald-600 mt-0.5 block">
                    {formatRupiah(b.totalAmount)} ({b.paymentMethod.replace('_', ' ').toUpperCase()})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  LUNAS
                </span>
                <button
                  onClick={() => setActivePaymentBooking(b)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Kuitansi Digital</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
