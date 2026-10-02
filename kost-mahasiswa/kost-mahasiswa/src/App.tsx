import React, { useState, useMemo } from 'react';
import { 
  AppProvider, 
  useApp 
} from './context/AppContext';
import { Navbar } from './components/navbar/Navbar';
import { SearchFilter } from './components/search/SearchFilter';
import { KostCard } from './components/kost/KostCard';
import { KostDetailModal } from './components/kost/KostDetailModal';
import { BookingModal } from './components/booking/BookingModal';
import { PaymentModal } from './components/payment/PaymentModal';
import { InteractiveKostMap } from './components/map/InteractiveKostMap';
import { MaintenanceModal } from './components/tickets/MaintenanceModal';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { AuthGate } from './components/auth/AuthGate';
import { UserProfileView } from './components/profile/UserProfileView';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { SuperAdminDashboard } from './components/dashboard/SuperAdminDashboard';
import { DeveloperDashboard } from './components/dashboard/DeveloperDashboard';
import { NotificationToast } from './components/notifications/NotificationToast';
import { KostListing, KostType } from './types';
import { downloadProjectZip } from './utils/downloadProject';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  CreditCard, 
  PhoneCall, 
  Clock, 
  Heart,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Users,
  Download
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    isLoggedIn,
    kosts,
    selectedKost,
    setSelectedKost,
    activeBookingModalKost,
    setActiveBookingModalKost,
    activePaymentBooking,
    setActivePaymentBooking,
    activeTab,
    setActiveTab,
    currentUser,
    currentRole
  } = useApp();

  // If user is not logged in yet, show the full AuthGate login/register screen
  if (!isLoggedIn) {
    return (
      <>
        <AuthGate />
        <NotificationToast />
      </>
    );
  }

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedGender, setSelectedGender] = useState<KostType | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating' | 'distance'>('recommended');

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCampus('all');
    setSelectedGender('all');
    setMaxPrice(3000000);
    setSelectedFacilities([]);
    setSortBy('recommended');
  };

  // Filtered & Sorted Kosts
  const filteredKosts = useMemo(() => {
    return kosts.filter((kost) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = kost.name.toLowerCase().includes(query);
        const matchesAddress = kost.address.toLowerCase().includes(query);
        const matchesCampus = kost.campusNearby.toLowerCase().includes(query);
        const matchesFac = kost.facilities.some((f) => f.toLowerCase().includes(query));
        if (!matchesName && !matchesAddress && !matchesCampus && !matchesFac) return false;
      }

      // Campus filter
      if (selectedCampus !== 'all' && kost.campusKey !== selectedCampus) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'all' && kost.type !== selectedGender) {
        return false;
      }

      // Price filter
      if (kost.pricePerMonth > maxPrice) {
        return false;
      }

      // Facilities filter
      if (selectedFacilities.length > 0) {
        const hasAllFacilities = selectedFacilities.every((fac) =>
          kost.facilities.some((kf) => kf.toLowerCase().includes(fac.toLowerCase()))
        );
        if (!hasAllFacilities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.pricePerMonth - b.pricePerMonth;
      if (sortBy === 'price_high') return b.pricePerMonth - a.pricePerMonth;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') {
        const distA = parseInt(a.distanceToCampus) || 999;
        const distB = parseInt(b.distanceToCampus) || 999;
        return distA - distB;
      }
      return 0; // recommended default
    });
  }, [kosts, searchQuery, selectedCampus, selectedGender, maxPrice, selectedFacilities, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'browse' && (
          <div className="space-y-8 pb-16">
            
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white pt-10 pb-16 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
              
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto relative z-10">
                <div className="max-w-3xl space-y-4">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sistem Informasi Kos Mahasiswa Terakreditasi #1 Indonesia</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    Temukan Kos Nyaman, <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                      Dekat Kampus Impianmu
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                    Dilengkapi fitur booking kamar online, pembayaran digital instan via QRIS & Virtual Account, tur virtual 360°, chat langsung pemilik, tiket perbaikan kendala, dan keamanan akun 2FA.
                  </p>

                  {/* Highlights Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Ulasan Penghuni Terverifikasi</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>QRIS & VA Bank Resmi</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>Radius Kampus UI, ITB, UGM, UNDIP, ITS, UB</span>
                    </div>
                  </div>

                </div>

                {/* Search & Filter Component Mounted in Hero */}
                <div className="mt-8">
                  <SearchFilter
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCampus={selectedCampus}
                    setSelectedCampus={setSelectedCampus}
                    selectedGender={selectedGender}
                    setSelectedGender={setSelectedGender}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    selectedFacilities={selectedFacilities}
                    toggleFacility={toggleFacility}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    resetFilters={resetFilters}
                  />
                </div>

              </div>
            </div>

            {/* Listings Section Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {selectedCampus === 'all' ? 'Rekomendasi Kos Mahasiswa Terpopuler' : `Kos Sekitar Kampus ${selectedCampus}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Menampilkan <span className="font-extrabold text-slate-800">{filteredKosts.length} pilihan kos</span> dengan status kamar real-time
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('map')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs transition-colors"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Buka Peta Radius Kampus</span>
                </button>
              </div>

              {/* Kos Cards Grid */}
              {filteredKosts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3 text-2xl">
                    🔍
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800">Tidak Ada Kos yang Cocok</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Coba sesuaikan batas harga, ubah pilihan kampus, atau hapus filter fasilitas untuk melihat kos lainnya.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Reset Filter Pencarian
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredKosts.map((kost) => (
                    <KostCard
                      key={kost.id}
                      kost={kost}
                      onSelect={(k) => setSelectedKost(k)}
                    />
                  ))}
                </div>
              )}

              {/* Why Choose Us Feature Cards */}
              <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Standar Kenyamanan Kos Mahasiswa Terverifikasi
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Setiap kamar diverifikasi langsung oleh tim platform untuk menjamin keamanan, kejujuran fasilitas, dan kenyamanan belajar mahasiswa.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Ulasan & Rating Transparan</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Hanya penghuni yang pernah menyewa kamar yang dapat memberikan ulasan, foto nyata, dan penilaian fasilitas.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-700 shrink-0">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Pembayaran Digital Terintegrasi</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Sewa bulanan praktis via QRIS dan Virtual Account tanpa perlu konfirmasi manual. Kuitansi digital resmi langsung terbit.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Layanan Tiket Kendala Cepat</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Laporkan AC rusak, lampu putus, atau kendala WiFi dengan tracking jadwal teknisi langsung di akun penghuni.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Interactive Map View */}
        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <InteractiveKostMap
              kosts={kosts}
              onSelectKost={(k) => setSelectedKost(k)}
            />
          </div>
        )}

        {/* Tenant Maintenance Tickets View */}
        {activeTab === 'tenant-tickets' && <MaintenanceModal />}

        {/* Profile & Lease History View */}
        {activeTab === 'profile' && <UserProfileView />}

        {/* Admin Dashboard View */}
        {activeTab === 'admin-dashboard' && <AdminDashboard />}

        {/* Super Admin Dashboard View */}
        {activeTab === 'superadmin-dashboard' && <SuperAdminDashboard />}

        {/* Developer Dashboard View */}
        {activeTab === 'dev-dashboard' && <DeveloperDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-base tracking-tight">
                  Kost<span className="text-emerald-400">Mahasiswa</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Sistem informasi dan booking kos mahasiswa terlengkap di Indonesia dengan sistem pembayaran digital, integrasi kampus, dan keamanan autentikasi 2FA.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Area Kampus Utama</h4>
              <ul className="space-y-1.5 text-xs">
                <li>Universitas Indonesia (UI Depok)</li>
                <li>Institut Teknologi Bandung (ITB Dago)</li>
                <li>Universitas Gadjah Mada (UGM Sleman)</li>
                <li>Universitas Diponegoro (UNDIP Tembalang)</li>
                <li>Institut Teknologi Sepuluh Nopember (ITS)</li>
                <li>Universitas Brawijaya (UB Malang)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Fitur Platform</h4>
              <ul className="space-y-1.5 text-xs">
                <li>Booking Kamar Online Real-Time</li>
                <li>Integrasi Pembayaran QRIS & VA Bank</li>
                <li>Notifikasi Pengingat Jatuh Tempo Sewa</li>
                <li>Sistem Pelaporan Kendala Teknisi</li>
                <li>Chat Antar Penghuni & Pemilik Kos</li>
                <li>Autentikasi Dua Faktor (2FA OTP)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Bantuan & Layanan</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Layanan Pelanggan WhatsApp 24/7</li>
                <li>Email: bantuan@kostmahasiswa.id</li>
                <li>Graha Mahasiswa Lt. 4, Margonda, Depok</li>
                <li>Panduan Tata Tertib & FAQ Penghuni</li>
                <li>Kebijakan Pengembalian Deposit</li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
            <div>
              © 2026 KostMahasiswa Indonesia. Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={() => downloadProjectZip()}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unduh Folder Proyek (.ZIP)</span>
              </button>
              <span>Keamanan Terenkripsi SSL 256-bit</span>
              <span>2FA WhatsApp Ready</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <KostDetailModal
        kost={selectedKost}
        onClose={() => setSelectedKost(null)}
      />

      <BookingModal
        kost={activeBookingModalKost}
        onClose={() => setActiveBookingModalKost(null)}
      />

      <PaymentModal
        booking={activePaymentBooking}
        onClose={() => setActivePaymentBooking(null)}
      />

      <AuthModal />
      <ChatDrawer />
      <NotificationToast />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
