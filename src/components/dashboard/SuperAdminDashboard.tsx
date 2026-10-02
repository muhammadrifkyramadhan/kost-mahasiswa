import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Download,
  Filter,
  Search,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SuperAdminDashboard: React.FC = () => {
  const { kosts, bookings, auditLogs, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'verifikasi' | 'sengketa' | 'audit'>('overview');

  const totalGMV = bookings.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalListings = kosts.length;
  const verifiedListings = kosts.filter((k) => k.isVerifiedByPlatform).length;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleApproveProperty = (name: string) => {
    addNotification({
      type: 'system',
      title: 'Properti Kos Disetujui',
      message: `Properti ${name} telah diverifikasi resmi secara platform nasional.`,
    });
  };

  const handleResolveDispute = (disputeId: string) => {
    addNotification({
      type: 'system',
      title: 'Perselisihan Transaksi Diselesaikan',
      message: `Sengketa #${disputeId} telah dimediasi. Dana escrow disesuaikan sesuai klausul sewa.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Super Admin Master Control
              </h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Pusat Otoritas
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Kendali sistem agregator, arbitrase perselisihan transaksi, verifikasi izin usaha kost, dan audit trail nasional.
            </p>
          </div>
        </div>
      </div>

      {/* High-level Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Nilai Transaksi (GMV)</div>
          <div className="text-xl sm:text-2xl font-black text-purple-700">{formatRupiah(totalGMV)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Real-time Gateway Settled</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Properti Terdaftar</div>
          <div className="text-2xl font-black text-slate-900">{totalListings} Kos</div>
          <span className="text-[11px] text-slate-500">6 Kota Kampus Utama</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Tingkat Verifikasi Legal</div>
          <div className="text-2xl font-black text-emerald-600">
            {Math.round((verifiedListings / totalListings) * 100)}%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Terverifikasi Tim Hukum</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Audit Trail Log Terkumpul</div>
          <div className="text-2xl font-black text-slate-900">{auditLogs.length} Events</div>
          <span className="text-[11px] text-slate-500">Immutable Logging</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua Properti Kos ({totalListings})
        </button>
        <button
          onClick={() => setActiveTab('sengketa')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'sengketa' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Kelola Perselisihan Transaksi</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Trail Keamanan & 2FA</span>
        </button>
      </div>

      {/* TAB 1: ALL PROPERTIES OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Daftar Seluruh Properti Kos Nasional
          </h3>
          <div className="divide-y divide-slate-100">
            {kosts.map((k) => (
              <div key={k.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={k.images[0]} alt={k.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{k.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {k.isVerifiedByPlatform ? 'Terverifikasi' : 'Menunggu Dokumen'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{k.address} • {k.city}</p>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Pemilik: <span className="font-bold text-slate-700">{k.ownerName}</span> ({k.ownerPhone})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black text-slate-800">
                    {formatRupiah(k.pricePerMonth)}/bln
                  </span>
                  <button
                    onClick={() => handleApproveProperty(k.name)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200"
                  >
                    Audit Kepatuhan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DISPUTE MANAGEMENT */}
      {activeTab === 'sengketa' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Pusat Resolusi Sengketa & Perselisihan Transaksi
              </h3>
              <p className="text-xs text-slate-500">
                Menangani mediasi refund deposit, pembatalan booking sepihak, atau ketidaksesuaian fasilitas kamar
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              0 Kasus Menunggak (Terkendali)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-700">DISPUTE-2025-0041</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Tuntas Melalui Mediasi
              </span>
            </div>
            <p className="text-slate-700">
              Kasus: Klaim pengembalian deposit jaminan kamar sebesar Rp 500.000 atas kamar 104 yang telah check-out tepat waktu tanpa kerusakan.
            </p>
            <div className="text-[11px] text-slate-500">
              Pihak terkait: Mahasiswa (Rizky A.) vs Pengelola Kos Margonda
            </div>
            <button
              onClick={() => handleResolveDispute('DISPUTE-2025-0041')}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              Simulasi Mediasi Ulang
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Sistem Audit Log & Rekam Jejak Otentikasi 2FA
              </h3>
              <p className="text-xs text-slate-500">Mencatat setiap login, verifikasi 2FA, dan transaksi digital</p>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3">Waktu (WIB)</th>
                  <th className="p-3">Akun / Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Aksi Terdata</th>
                  <th className="p-3">Detail & IP Address</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900">{log.user}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">{log.action}</td>
                    <td className="p-3 text-slate-600">
                      <div>{log.detail}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.ipAddress}</div>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                        log.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
