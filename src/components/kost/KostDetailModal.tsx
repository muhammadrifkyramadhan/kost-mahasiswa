import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Bed, 
  Wifi, 
  Bath, 
  Wind, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Share2, 
  Heart,
  ChevronRight,
  Maximize2,
  Tv,
  Coffee,
  Car,
  Camera
} from 'lucide-react';
import { KostListing, Review } from '../../types';
import { useApp } from '../../context/AppContext';

interface KostDetailModalProps {
  kost: KostListing | null;
  onClose: () => void;
}

export const KostDetailModal: React.FC<KostDetailModalProps> = ({ kost, onClose }) => {
  const { 
    setActiveBookingModalKost, 
    setChatDrawerOpen, 
    setChatTab, 
    addNotification 
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [show360Simulation, setShow360Simulation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [favorited, setFavorited] = useState(false);

  if (!kost) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    addNotification({
      type: 'system',
      title: 'Tautan Disalin',
      message: `Link ${kost.name} telah disalin ke clipboard Anda.`,
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenDirectChat = () => {
    setChatTab('direct');
    setChatDrawerOpen(true);
    onClose();
  };

  const handleStartBooking = () => {
    setActiveBookingModalKost(kost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              {kost.city} • Dekat {kost.campusKey}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
              {kost.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFavorited(!favorited)}
              aria-label="Simpan ke favorit"
              className={`p-2 rounded-full border transition-colors ${
                favorited ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              aria-label="Bagikan kos"
              className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup jendela detail"
              className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          
          {/* Main Photo Gallery */}
          <div className="space-y-2">
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-900">
              {show360Simulation ? (
                <div className="w-full h-full relative flex items-center justify-center bg-slate-950 text-white p-6 text-center">
                  <div className="space-y-3 max-w-md animate-pulse">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-base">Virtual Room Tour 360° Interaktif</h4>
                    <p className="text-xs text-slate-300">
                      Menampilkan simulasi sudut kamar 360 derajat lengkap dengan pencahayaan alami jendela, ventilasi, dan posisi stopkontak belajar.
                    </p>
                    <button
                      onClick={() => setShow360Simulation(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900"
                    >
                      Kembali ke Galeri Foto
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={kost.images[activePhotoIndex]}
                  alt={kost.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* 360 preview trigger button */}
              <button
                onClick={() => setShow360Simulation(!show360Simulation)}
                className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-white/20 transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{show360Simulation ? 'Tutup 360°' : 'Simulasi Virtual Tour 360°'}</span>
              </button>
            </div>

            {/* Thumbnail list */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {kost.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActivePhotoIndex(i);
                    setShow360Simulation(false);
                  }}
                  className={`w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activePhotoIndex === i && !show360Simulation ? 'border-emerald-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats & Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Tipe Hunian</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 capitalize">
                Kos {kost.type}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Jarak Kampus</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 truncate block">
                {kost.distanceToCampus}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Rating Terverifikasi</span>
              <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{kost.rating} ({kost.reviewCount} ulasan)</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Kamar Kosong</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {kost.availableRooms} dari {kost.totalRooms} kamar
              </span>
            </div>
          </div>

          {/* Building Specifications Matrix */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Spesifikasi Bangunan & Standar Mutu Hunian
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Kelistrikan</span>
                <span className="font-bold text-slate-800">Token 900-1300 VA</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Koneksi Internet</span>
                <span className="font-bold text-slate-800">Fiber Optik Dedicated</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Akses & Keamanan</span>
                <span className="font-bold text-slate-800">RFID Smart Lock 24 Jam</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Kualitas Air</span>
                <span className="font-bold text-slate-800">Air Sumur Bor + Filter RO</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sirkulasi & Cahaya</span>
                <span className="font-bold text-slate-800">Jendela Menghadap Luar</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Legalitas Bangunan</span>
                <span className="font-bold text-emerald-700">PBG/IMB Resmi Terdaftar</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Tentang Kos Ini
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {kost.description}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{kost.address}</span>
            </div>
          </div>

          {/* Room Availability Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Denah & Ketersediaan Kamar Spesifik
              </h3>
              <span className="text-xs text-slate-500">Pilih kamar saat booking</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {kost.rooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    room.isAvailable
                      ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      Kamar {room.number}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      room.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {room.isAvailable ? 'Tersedia' : 'Terisi'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Lantai {room.floor} • Ukuran {room.size}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-2">
                    {formatRupiah(room.pricePerMonth)}/bln
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Fasilitas Kos & Kamar Lengkap
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {kost.facilities.map((fac) => (
                <div
                  key={fac}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules & Regulations */}
          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Peraturan & Tata Tertib Kos
            </h3>
            <ul className="space-y-1.5">
              {kost.rules.map((rule, idx) => (
                <li key={idx} className="text-xs text-amber-900/80 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Owner Profile & Direct Chat */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={kost.ownerAvatar}
                alt={kost.ownerName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-900">{kost.ownerName}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                    Pemilik Terverifikasi
                  </span>
                </div>
                <p className="text-xs text-slate-500">Fast response via chat sistem & WhatsApp</p>
              </div>
            </div>

            <button
              onClick={handleOpenDirectChat}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Tanya Pemilik Langsung</span>
            </button>
          </div>

          {/* Verified Tenant Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Ulasan Penghuni Terverifikasi ({kost.reviews.length})
                </h3>
                <p className="text-xs text-slate-500">Hanya mahasiswa yang pernah atau sedang sewa di sini</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 font-bold text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{kost.rating} / 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {kost.reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada ulasan untuk kos ini.</p>
              ) : (
                kost.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Penyewa Terverifikasi ({rev.roomNumber})
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.userCampus} • {rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-10">
                      "{rev.comment}"
                    </p>

                    {rev.ownerResponse && (
                      <div className="ml-10 mt-2 p-2.5 rounded-xl bg-slate-50 border-l-2 border-emerald-500 text-xs">
                        <span className="font-bold text-slate-800 block text-[11px]">Respon Pemilik Kos:</span>
                        <p className="text-slate-600 mt-0.5">{rev.ownerResponse.comment}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="sticky bottom-0 z-30 bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Harga Sewa Bulanan</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-extrabold text-emerald-600">
                {formatRupiah(kost.pricePerMonth)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/bulan</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartBooking}
              disabled={kost.availableRooms === 0}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 ${
                kost.availableRooms > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{kost.availableRooms > 0 ? 'Ajukan Sewa & Booking Kamar' : 'Semua Kamar Penuh'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
