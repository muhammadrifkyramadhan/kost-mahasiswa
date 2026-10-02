import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Camera, 
  X, 
  User, 
  Calendar,
  Send,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { MaintenanceTicket, TicketCategory, TicketPriority, TicketStatus } from '../../types';
import { useApp } from '../../context/AppContext';

export const MaintenanceModal: React.FC = () => {
  const { 
    currentUser, 
    currentRole,
    tickets, 
    createTicket, 
    updateTicketStatus 
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);

  // New ticket state
  const [category, setCategory] = useState<TicketCategory>('listrik');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('normal');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80');

  // Technician update state for admin
  const [techNote, setTechNote] = useState('');

  const myTickets = currentRole === 'user' 
    ? tickets.filter((t) => t.tenantId === currentUser.id || t.tenantName === currentUser.name)
    : tickets;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createTicket({
      tenantId: currentUser.id,
      tenantName: currentUser.name,
      roomNumber: '101',
      kostId: 'kost-01',
      kostName: 'Kost Cendekia Margonda Residence',
      category,
      title,
      description,
      priority,
      photoUrl,
    });

    setTitle('');
    setDescription('');
    setCreateModalOpen(false);
  };

  const getStatusBadge = (status: TicketStatus) => {
    const config: Record<TicketStatus, { bg: string; text: string; label: string }> = {
      diajukan: { bg: 'bg-slate-100 text-slate-700', text: 'Diajukan', label: 'Menunggu Review' },
      diproses: { bg: 'bg-blue-100 text-blue-800', text: 'Diproses', label: 'Sedang Ditinjau' },
      teknisi_dikirim: { bg: 'bg-amber-100 text-amber-800', text: 'Teknisi Dikirim', label: 'Teknisi Dijadwalkan' },
      selesai: { bg: 'bg-emerald-100 text-emerald-800', text: 'Selesai', label: 'Tuntas' },
    };
    const c = config[status] || config.diajukan;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.bg}`}>
        {c.label}
      </span>
    );
  };

  const getPriorityBadge = (p: TicketPriority) => {
    const config: Record<TicketPriority, { bg: string; label: string }> = {
      normal: { bg: 'bg-slate-100 text-slate-600', label: 'Normal' },
      mendesak: { bg: 'bg-amber-100 text-amber-800', label: 'Mendesak' },
      darurat: { bg: 'bg-rose-100 text-rose-800 font-black', label: 'Darurat' },
    };
    const c = config[p];
    return <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${c.bg}`}>{c.label}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Wrench className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Pusat Pelaporan Kendala & Perbaikan Fasilitas
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Laporkan kendala listrik, saluran air, WiFi, atau kerusakan fasilitas kamar secara terpusat. Pantau progres teknisi secara real-time.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan Kendala Baru</span>
        </button>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myTickets.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">Semua Fasilitas Berfungsi Normal</h3>
            <p className="text-xs text-slate-500 mt-1">Belum ada kendala yang dilaporkan. Kamar kos dalam kondisi prima.</p>
          </div>
        ) : (
          myTickets.map((tkt) => (
            <div
              key={tkt.id}
              onClick={() => setSelectedTicket(tkt)}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      #{tkt.ticketCode}
                    </span>
                    {getPriorityBadge(tkt.priority)}
                  </div>
                  {getStatusBadge(tkt.status)}
                </div>

                <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">
                  {tkt.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {tkt.description}
                </p>

                {tkt.technicianNote && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs">
                    <span className="font-bold text-amber-900 block text-[11px]">Catatan Teknisi:</span>
                    <p className="text-amber-800 mt-0.5">{tkt.technicianNote}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{tkt.kostName} • Kamar {tkt.roomNumber}</span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  Lihat Timeline <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Details & Timeline Drawer Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">#{selectedTicket.ticketCode}</span>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">{selectedTicket.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Deskripsi Masalah:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {selectedTicket.photoUrl && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Foto Lampiran Kendala:
                  </span>
                  <img
                    src={selectedTicket.photoUrl}
                    alt="Bukti Kerusakan"
                    className="w-full h-48 object-cover rounded-2xl border border-slate-200"
                  />
                </div>
              )}

              {/* Progress Timeline */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Riwayat Progres Penanganan:
                </span>
                <div className="space-y-4 pl-2 border-l-2 border-emerald-500 ml-2">
                  {selectedTicket.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 absolute -left-[23px] top-1 ring-4 ring-white" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 capitalize">
                          {step.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">{step.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{step.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin status update controls (available for admin / superadmin) */}
              {(currentRole === 'admin' || currentRole === 'superadmin') && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Tindakan Pengelola (Admin Controls):
                  </h4>
                  <input
                    type="text"
                    value={techNote}
                    onChange={(e) => setTechNote(e.target.value)}
                    placeholder="Tulis catatan teknisi / waktu kedatangan..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        updateTicketStatus(selectedTicket.id, 'diproses', techNote || 'Ditinjau pengelola');
                        setSelectedTicket(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs hover:bg-blue-200"
                    >
                      Tandai Diproses
                    </button>
                    <button
                      onClick={() => {
                        updateTicketStatus(selectedTicket.id, 'teknisi_dikirim', techNote || 'Teknisi ditugaskan ke lokasi');
                        setSelectedTicket(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs hover:bg-amber-200"
                    >
                      Kirim Teknisi
                    </button>
                    <button
                      onClick={() => {
                        updateTicketStatus(selectedTicket.id, 'selesai', techNote || 'Perbaikan selesai tuntas');
                        setSelectedTicket(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs hover:bg-emerald-200"
                    >
                      Selesaikan Tiket
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* New Ticket Form Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Form Laporan Kendala Kamar</h3>
                <p className="text-xs text-slate-500">Teknisi kos akan segera meninjau laporan Anda</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Kategori Masalah
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                >
                  <option value="listrik">Listrik & Lampu Kamar</option>
                  <option value="plumbing">Sanitasi, Kran Air & Toilet</option>
                  <option value="wifi">Koneksi WiFi & Internet</option>
                  <option value="kebersihan">Kebersihan Area Kamar / Lorong</option>
                  <option value="fasilitas">Kerusakan Perabot / Meja / AC</option>
                  <option value="keamanan">Keamanan / Pintu / Akses Kartu</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Tingkat Urgensi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'mendesak', 'darurat'] as TicketPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        priority === p
                          ? p === 'darurat'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Judul Kendala
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: AC kurang dingin & berbunyi getar"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Penjelasan Detail & Gejala
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan sejak kapan terjadi dan di bagian mana kamar yang bermasalah..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Foto Bukti Kerusakan (Simulasi Terlampir)
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                  <div className="flex-1 text-xs text-slate-500 truncate">
                    <span>foto_bukti_kendala_kamar101.jpg</span>
                    <span className="block text-[10px] text-emerald-600 font-bold">Siap diunggah ke pengelola</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Laporan ke Pengelola Kos</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
