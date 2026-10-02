import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Bed, 
  DollarSign, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Calendar, 
  Wrench, 
  MessageSquare, 
  Search,
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Room } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    kosts,
    bookings,
    tickets,
    updateRoomAvailability,
    addKost,
    addNotification,
    setChatDrawerOpen,
    setChatTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kamar' | 'penghuni' | 'kendala' | 'tambah_kos'>('kamar');
  const [tenantSearch, setTenantSearch] = useState('');

  // New Kost Form State
  const [newKostName, setNewKostName] = useState('');
  const [newKostCity, setNewKostCity] = useState('Depok');
  const [newKostCampus, setNewKostCampus] = useState('Universitas Indonesia (UI) - 400m');
  const [newKostPrice, setNewKostPrice] = useState(1600000);
  const [newKostType, setNewKostType] = useState<'campur' | 'putra' | 'putri'>('campur');

  // Primary managed kost (First listing managed by Bu Endang)
  const managedKost = kosts[0];

  const totalRooms = managedKost ? managedKost.rooms.length : 12;
  const availableRoomsCount = managedKost ? managedKost.rooms.filter((r) => r.isAvailable).length : 3;
  const occupiedRoomsCount = totalRooms - availableRoomsCount;
  const occupancyRate = Math.round((occupiedRoomsCount / totalRooms) * 100);

  const monthlyRevenue = managedKost 
    ? managedKost.rooms.filter((r) => !r.isAvailable).reduce((acc, curr) => acc + curr.pricePerMonth, 0)
    : 18500000;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSendReminder = (tenantName: string, phone: string, room: string) => {
    addNotification({
      type: 'payment_due',
      title: `Pengingat Tagihan Terkirim ke ${tenantName}`,
      message: `Pesan WhatsApp otomatis pengingat jatuh tempo sewa Kamar ${room} telah diteruskan ke ${phone}.`,
    });
  };

  const handleCreateKost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKostName.trim()) return;

    addKost({
      name: newKostName,
      city: newKostCity,
      campusNearby: newKostCampus,
      pricePerMonth: newKostPrice,
      type: newKostType,
    });

    setNewKostName('');
    setActiveTab('kamar');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Dashboard Pengelola Kos & Pemilik
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Properti Utama: <span className="font-extrabold text-slate-800">{managedKost?.name}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tambah_kos')}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Unit Kos / Cabang</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>Okupansi Kamar</span>
            <Bed className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {occupancyRate}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {occupiedRoomsCount} terisi dari {totalRooms} total unit
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>Kamar Kosong</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {availableRoomsCount} Kamar
          </div>
          <p className="text-xs text-slate-500 mt-1">Siap disewakan calon penghuni baru</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>Estimasi Omset / Bulan</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-600">
            {formatRupiah(monthlyRevenue)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Tagihan sewa bulanan berjalan</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>Kendala Ditangani</span>
            <Wrench className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {tickets.filter((t) => t.status !== 'selesai').length} Tiket
          </div>
          <p className="text-xs text-slate-500 mt-1">Memerlukan perhatian teknisi</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('kamar')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'kamar' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ketersediaan & Status Kamar
        </button>
        <button
          onClick={() => setActiveTab('penghuni')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'penghuni' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Data Penghuni Terpusat
        </button>
        <button
          onClick={() => setActiveTab('kendala')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'kendala' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tiket Perbaikan ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab('tambah_kos')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'tambah_kos' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          + Daftarkan Kos Baru
        </button>
      </div>

      {/* TAB 1: ROOM MANAGEMENT */}
      {activeTab === 'kamar' && managedKost && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Manajemen Status Kamar ({managedKost.name})
              </h3>
              <p className="text-xs text-slate-500">Klik toggle untuk mengubah status kamar langsung</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Tersedia
              </span>
              <span className="flex items-center gap-1 text-slate-600 font-semibold ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Terisi
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {managedKost.rooms.map((room) => (
              <div
                key={room.id}
                className={`p-4 rounded-2xl border transition-all ${
                  room.isAvailable
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-base text-slate-900">
                    Kamar {room.number}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    room.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {room.isAvailable ? 'KOSONG' : 'TERISI'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Lantai {room.floor} • Tipe {room.type} ({room.size})
                </div>

                <div className="text-xs font-extrabold text-slate-800 mt-2">
                  {formatRupiah(room.pricePerMonth)} / bulan
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Ganti Ketersediaan:</span>
                  <button
                    onClick={() => updateRoomAvailability(managedKost.id, room.id, !room.isAvailable)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      room.isAvailable
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {room.isAvailable ? 'Tandai Terisi' : 'Tandai Kosong'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CENTRALIZED TENANTS DIRECTORY */}
      {activeTab === 'penghuni' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Database Penghuni Aktif & Tagihan Bulanan
              </h3>
              <p className="text-xs text-slate-500">Monitor kontak, tanggal sewa, dan pengingat jatuh tempo</p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tenantSearch}
                onChange={(e) => setTenantSearch(e.target.value)}
                placeholder="Cari nama penghuni / kamar..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Penghuni & Kampus</th>
                  <th className="p-3">Kamar</th>
                  <th className="p-3">Kontak WA</th>
                  <th className="p-3">Masa Sewa</th>
                  <th className="p-3">Status Tagihan</th>
                  <th className="p-3 rounded-r-xl text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{b.tenantName}</div>
                      <div className="text-[11px] text-slate-400">{b.tenantCampus}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">
                      Kamar {b.roomNumber}
                    </td>
                    <td className="p-3 text-slate-600">
                      {b.tenantPhone}
                    </td>
                    <td className="p-3 text-slate-600">
                      {b.startDate} s/d {b.endDate}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        Lunas s/d {b.nextPaymentDue}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleSendReminder(b.tenantName, b.tenantPhone, b.roomNumber)}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 ml-auto"
                      >
                        <Send className="w-3 h-3 text-amber-600" />
                        <span>Kirim Tagihan WA</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TICKETS & COMPLAINTS */}
      {activeTab === 'kendala' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Daftar Laporan Kendala Penghuni Kos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500">#{t.ticketCode}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {t.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{t.title}</h4>
                <p className="text-xs text-slate-600">{t.description}</p>
                <div className="text-[11px] text-slate-400">
                  Pelapor: {t.tenantName} ({t.kostName} - Kamar {t.roomNumber})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ADD NEW KOST */}
      {activeTab === 'tambah_kos' && (
        <form onSubmit={handleCreateKost} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Pendaftaran Unit Properti Kos Baru
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Kos</label>
            <input
              type="text"
              required
              value={newKostName}
              onChange={(e) => setNewKostName(e.target.value)}
              placeholder="Contoh: Kost Margonda Ceria UI"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kota</label>
              <input
                type="text"
                required
                value={newKostCity}
                onChange={(e) => setNewKostCity(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipe Kos</label>
              <select
                value={newKostType}
                onChange={(e) => setNewKostType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="campur">Campur</option>
                <option value="putri">Khusus Putri</option>
                <option value="putra">Khusus Putra</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Harga Mulai (Rp/bulan)</label>
            <input
              type="number"
              required
              value={newKostPrice}
              onChange={(e) => setNewKostPrice(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-colors"
          >
            Publikasikan Unit Kos Baru
          </button>
        </form>
      )}

    </div>
  );
};
