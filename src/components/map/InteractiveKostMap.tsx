import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Star, 
  Bed, 
  Layers, 
  ShieldCheck, 
  Maximize2,
  Compass
} from 'lucide-react';
import { KostListing } from '../../types';
import { useApp } from '../../context/AppContext';

interface InteractiveKostMapProps {
  kosts: KostListing[];
  onSelectKost: (kost: KostListing) => void;
}

export const InteractiveKostMap: React.FC<InteractiveKostMapProps> = ({
  kosts,
  onSelectKost,
}) => {
  const { setActiveBookingModalKost } = useApp();
  const [activePinKost, setActivePinKost] = useState<KostListing | null>(kosts[0] || null);
  const [mapZoom, setMapZoom] = useState<number>(1);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Map coordinates projection for canvas simulation across Indonesian major university clusters
  const campusCoordinates: Record<string, { x: number; y: number; name: string }> = {
    UI: { x: 28, y: 38, name: 'Universitas Indonesia (Depok)' },
    ITB: { x: 38, y: 52, name: 'ITB Dago (Bandung)' },
    UGM: { x: 55, y: 64, name: 'UGM Bulaksumur (Yogyakarta)' },
    UNDIP: { x: 58, y: 46, name: 'UNDIP Tembalang (Semarang)' },
    ITS: { x: 74, y: 56, name: 'ITS Sukolilo (Surabaya)' },
    UB: { x: 71, y: 72, name: 'UB Brawijaya (Malang)' },
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
      
      {/* Map Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
            <h3 className="font-extrabold text-base sm:text-lg">Peta Interaktif Radius Kampus</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih pin lokasi kos untuk melihat estimasi jarak jalan kaki dan ketersediaan kamar secara real-time
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-400/30" />
            <span className="text-slate-300">Ada Kamar Kosong</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-300">Pusat Kampus</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative w-full h-[450px] sm:h-[550px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden select-none">
        
        {/* Subtle Map Grid lines */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        />

        {/* Simulated Road & River Topography Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <path d="M 0,200 Q 250,180 500,260 T 1000,240" fill="none" stroke="#0284c7" strokeWidth="6" />
          <path d="M 150,0 Q 200,300 350,550" fill="none" stroke="#475569" strokeWidth="4" strokeDasharray="6,6" />
          <path d="M 500,0 Q 550,250 800,550" fill="none" stroke="#475569" strokeWidth="4" strokeDasharray="6,6" />
          <path d="M 0,400 Q 400,350 1000,450" fill="none" stroke="#64748b" strokeWidth="5" />
        </svg>

        {/* University Anchors */}
        {Object.entries(campusCoordinates).map(([key, coord]) => (
          <div
            key={key}
            className="absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-none"
            style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
          >
            {/* Campus Radius Glow */}
            <div className="w-28 h-28 rounded-full bg-sky-500/10 border border-sky-400/20 absolute -inset-6 animate-pulse" />
            <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-sky-400 text-sky-300 text-[11px] font-bold shadow-lg shadow-sky-500/20">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>🏛️ {coord.name}</span>
            </div>
          </div>
        ))}

        {/* Kost Markers */}
        {kosts.map((kost) => {
          const baseCoord = campusCoordinates[kost.campusKey] || { x: 50, y: 50 };
          // Slightly offset from campus to make realistic clustering
          const offsetX = kost.id === 'kost-01' ? 4 : kost.id === 'kost-02' ? 5 : kost.id === 'kost-03' ? -4 : kost.id === 'kost-04' ? 3 : 2;
          const offsetY = kost.id === 'kost-01' ? -6 : kost.id === 'kost-02' ? 5 : kost.id === 'kost-03' ? 6 : kost.id === 'kost-04' ? -5 : 4;
          const leftPercent = Math.min(90, Math.max(10, baseCoord.x + offsetX));
          const topPercent = Math.min(85, Math.max(15, baseCoord.y + offsetY));

          const isSelected = activePinKost?.id === kost.id;

          return (
            <div
              key={kost.id}
              onClick={() => setActivePinKost(kost)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 hover:scale-110"
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
            >
              <div className="flex flex-col items-center">
                {/* Price Pill Tag */}
                <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-xl flex items-center gap-1 transition-all ${
                  isSelected 
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50 scale-105' 
                    : 'bg-slate-900 text-white border border-emerald-500/60 hover:border-emerald-400'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{formatRupiah(kost.pricePerMonth).replace(',00', '')}</span>
                </div>

                {/* Marker Pin Point */}
                <div className={`w-3 h-3 rotate-45 -mt-1.5 ${isSelected ? 'bg-emerald-500' : 'bg-slate-900'}`} />
              </div>
            </div>
          );
        })}

        {/* Bottom Floating Card for Active Selected Kost */}
        {activePinKost && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200 z-30 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex gap-3">
              <img
                src={activePinKost.images[0]}
                alt={activePinKost.name}
                className="w-24 h-24 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <Navigation className="w-3 h-3 text-emerald-600" />
                  <span>{activePinKost.distanceToCampus}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 truncate mt-0.5">
                  {activePinKost.name}
                </h4>
                <p className="text-xs text-slate-500 truncate">{activePinKost.address}</p>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Mulai </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatRupiah(activePinKost.pricePerMonth)}
                    </span>
                    <span className="text-[10px] text-slate-500">/bln</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {activePinKost.availableRooms} kamar kosong
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => onSelectKost(activePinKost)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
              >
                Lihat Detail & Foto
              </button>
              <button
                onClick={() => setActiveBookingModalKost(activePinKost)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs text-center"
              >
                Booking Kamar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
