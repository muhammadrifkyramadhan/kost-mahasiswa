import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Bed, 
  Wifi, 
  Sparkles,
  Bath,
  Wind,
  CheckCircle,
  Clock
} from 'lucide-react';
import { KostListing } from '../../types';
import { useApp } from '../../context/AppContext';

interface KostCardProps {
  kost: KostListing;
  onSelect: (kost: KostListing) => void;
}

export const KostCard: React.FC<KostCardProps> = ({ kost, onSelect }) => {
  const { setActiveBookingModalKost } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % kost.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + kost.images.length) % kost.images.length);
  };

  const genderBadgeStyle = {
    putri: 'bg-rose-100 text-rose-700 border-rose-200',
    putra: 'bg-blue-100 text-blue-700 border-blue-200',
    campur: 'bg-teal-100 text-teal-800 border-teal-200',
  }[kost.type];

  const genderLabel = {
    putri: 'Khusus Putri',
    putra: 'Khusus Putra',
    campur: 'Campur (Putra/i)',
  }[kost.type];

  return (
    <div 
      onClick={() => onSelect(kost)}
      className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Image Container & Carousel */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={kost.images[activeImageIndex]}
          alt={kost.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${genderBadgeStyle}`}>
              {genderLabel}
            </span>
            {kost.isSuperhost && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3" />
                Superhost
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{kost.rating}</span>
            <span className="text-[10px] text-slate-400">({kost.reviewCount})</span>
          </div>
        </div>

        {/* Navigation Arrows for multi-photo */}
        {kost.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Foto sebelumnya"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Foto berikutnya"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
              {kost.images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeImageIndex === i ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Room availability banner */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-medium">
          {kost.availableRooms > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white font-bold backdrop-blur-sm text-[11px]">
              <Bed className="w-3 h-3" />
              Tersedia {kost.availableRooms} Kamar
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/90 text-white font-bold backdrop-blur-sm text-[11px]">
              Kamar Penuh
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Campus Distance Highlight */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{kost.campusNearby}</span>
          </div>

          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {kost.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {kost.tagline}
          </p>

          {/* Key Facility Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {kost.facilities.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 flex items-center gap-1"
              >
                {f.includes('AC') && <Wind className="w-3 h-3 text-cyan-600" />}
                {f.includes('Kamar Mandi') && <Bath className="w-3 h-3 text-blue-600" />}
                {f.includes('WiFi') && <Wifi className="w-3 h-3 text-emerald-600" />}
                <span>{f}</span>
              </span>
            ))}
            {kost.facilities.length > 3 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-50 text-slate-400">
                +{kost.facilities.length - 3} lagi
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Mulai dari</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-emerald-600">
                {formatRupiah(kost.pricePerMonth)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/bulan</span>
            </div>
            {kost.discountPerYearPercent && (
              <span className="text-[10px] font-bold text-amber-600">
                Hemat {kost.discountPerYearPercent}% sewa tahunan
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveBookingModalKost(kost);
            }}
            disabled={kost.availableRooms === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              kost.availableRooms > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {kost.availableRooms > 0 ? 'Pesan Kamar' : 'Penuh'}
          </button>
        </div>

      </div>
    </div>
  );
};
