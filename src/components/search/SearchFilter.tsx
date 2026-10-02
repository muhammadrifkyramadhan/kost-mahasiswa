import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  DollarSign, 
  Check, 
  X, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { KostType } from '../../types';

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  selectedGender: KostType | 'all';
  setSelectedGender: (gender: KostType | 'all') => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedFacilities: string[];
  toggleFacility: (facility: string) => void;
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'distance';
  setSortBy: (sort: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'distance') => void;
  resetFilters: () => void;
}

export const CAMPUS_OPTIONS = [
  { key: 'all', label: 'Semua Kampus', city: 'Indonesia' },
  { key: 'UI', label: 'UI Depok', city: 'Depok' },
  { key: 'ITB', label: 'ITB Dago', city: 'Bandung' },
  { key: 'UGM', label: 'UGM Bulaksumur', city: 'Yogyakarta' },
  { key: 'UNDIP', label: 'UNDIP Tembalang', city: 'Semarang' },
  { key: 'ITS', label: 'ITS Sukolilo', city: 'Surabaya' },
  { key: 'UB', label: 'UB Malang', city: 'Malang' },
];

export const FACILITY_FILTER_OPTIONS = [
  'AC Dingin',
  'Kamar Mandi Dalam',
  'WiFi 100 Mbps',
  'Water Heater',
  'Kasur Springbed',
  'Meja Belajar & Lemari',
  'Dapur Bersama',
  'Parkir Motor & Mobil',
  'CCTV 24 Jam',
];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCampus,
  setSelectedCampus,
  selectedGender,
  setSelectedGender,
  maxPrice,
  setMaxPrice,
  selectedFacilities,
  toggleFacility,
  sortBy,
  setSortBy,
  resetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const hasActiveFilters = 
    selectedCampus !== 'all' || 
    selectedGender !== 'all' || 
    maxPrice < 3000000 || 
    selectedFacilities.length > 0 || 
    searchQuery.trim() !== '';

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-slate-100">
      
      {/* Top Search Input & Campus Tags */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        
        {/* Main Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama kos, area jalan (e.g. Margonda, Pogung, Dago), atau fasilitas..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all ${
              showAdvanced || selectedFacilities.length > 0 || maxPrice < 3000000
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Detail</span>
            {(selectedFacilities.length > 0 || maxPrice < 3000000) && (
              <span className="w-5 h-5 rounded-full bg-white text-emerald-700 text-xs flex items-center justify-center font-bold">
                {selectedFacilities.length + (maxPrice < 3000000 ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Urutkan hasil pencarian kos"
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-2xl px-4 py-3.5 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="recommended">Rekomendasi Terbaik</option>
              <option value="price_low">Harga Terendah</option>
              <option value="price_high">Harga Tertinggi</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="distance">Jarak Terdekat Kampus</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* University Campus Quick Badges */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          Kampus:
        </span>
        {CAMPUS_OPTIONS.map((c) => {
          const isSelected = selectedCampus === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedCampus(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Gender Quick Toggle */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipe Kos:</span>
        {(['all', 'putri', 'putra', 'campur'] as const).map((gender) => {
          const isSelected = selectedGender === gender;
          const labels: Record<string, string> = {
            all: 'Semua Tipe',
            putri: 'Khusus Putri',
            putra: 'Khusus Putra',
            campur: 'Campur (Putra/Putri)'
          };
          return (
            <button
              key={gender}
              onClick={() => setSelectedGender(gender)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {labels[gender]}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* Advanced Filter Collapse (Price Slider & Facilities) */}
      {showAdvanced && (
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          
          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Batas Harga Sewa Maksimal:
              </label>
              <span className="text-sm font-extrabold text-emerald-600">
                {formatRupiah(maxPrice)} / bulan
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={3000000}
              step={100000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Batas Harga Sewa Maksimal"
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Rp 1.000.000</span>
              <span>Rp 2.000.000</span>
              <span>Rp 3.000.000</span>
            </div>
          </div>

          {/* Facility Checkboxes */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Fasilitas Kamar & Gedung:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FACILITY_FILTER_OPTIONS.map((facility) => {
                const checked = selectedFacilities.includes(facility);
                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => toggleFacility(facility)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs text-left transition-all border ${
                      checked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                      checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="truncate">{facility}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
