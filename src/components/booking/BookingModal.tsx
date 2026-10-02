import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Bed, 
  ShieldCheck, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { KostListing, Room } from '../../types';
import { useApp } from '../../context/AppContext';

interface BookingModalProps {
  kost: KostListing | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ kost, onClose }) => {
  const { currentUser, createBooking, setActivePaymentBooking } = useApp();

  if (!kost) return null;

  const availableRooms = kost.rooms.filter((r) => r.isAvailable);
  const defaultRoom = availableRooms[0] || kost.rooms[0];

  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>(defaultRoom.number);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [tenantName, setTenantName] = useState<string>(currentUser.name);
  const [tenantPhone, setTenantPhone] = useState<string>(currentUser.phone);
  const [tenantEmail, setTenantEmail] = useState<string>(currentUser.email);
  const [tenantCampus, setTenantCampus] = useState<string>(currentUser.campus || 'Universitas Indonesia');
  const [emergencyContact, setEmergencyContact] = useState<string>(currentUser.emergencyContact || '081299887766 (Orang Tua/Wali)');

  const selectedRoomObj = kost.rooms.find((r) => r.number === selectedRoomNumber) || defaultRoom;
  const baseMonthlyRent = selectedRoomObj.pricePerMonth;

  // Calculate discount based on duration
  let discountPercent = 0;
  if (durationMonths === 6) discountPercent = 5;
  if (durationMonths >= 12) discountPercent = 10;

  const subtotalRent = baseMonthlyRent * durationMonths;
  const discountAmount = Math.round((subtotalRent * discountPercent) / 100);
  const depositFee = 500000; // standard security deposit
  const serviceFee = 15000; // digital transaction & system admin fee
  const totalAmount = subtotalRent - discountAmount + depositFee + serviceFee;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Calculate end date based on start date and duration
  const calculateEndDate = () => {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + durationMonths);
    return d.toISOString().substring(0, 10);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    const endDate = calculateEndDate();

    const newBooking = createBooking({
      kostId: kost.id,
      kostName: kost.name,
      kostImage: kost.images[0],
      roomNumber: selectedRoomNumber,
      tenantId: currentUser.id,
      tenantName,
      tenantPhone,
      tenantEmail,
      tenantCampus,
      startDate,
      durationMonths,
      endDate,
      monthlyRent: baseMonthlyRent,
      depositFee,
      serviceFee,
      discountAmount,
      totalAmount,
      paymentMethod: 'qris',
      nextPaymentDue: endDate,
    });

    onClose();
    setActivePaymentBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Form Pemesanan & Sewa Kamar
            </h3>
            <p className="text-xs text-slate-500">{kost.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleProceedToPayment} className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Step 1: Select Room Number */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-emerald-600" />
              1. Pilih Nomor Kamar Kos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {kost.rooms.map((room) => {
                const isSelected = selectedRoomNumber === room.number;
                return (
                  <button
                    key={room.id}
                    type="button"
                    disabled={!room.isAvailable}
                    onClick={() => setSelectedRoomNumber(room.number)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : room.isAvailable
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">
                        Kamar {room.number}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        room.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {room.isAvailable ? 'Tersedia' : 'Penuh'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Lt. {room.floor} • {room.size}
                    </div>
                    <div className="text-xs font-bold text-emerald-600 mt-1">
                      {formatRupiah(room.pricePerMonth)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Date & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                2. Tanggal Mulai Masuk (Check-In)
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                Durasi Sewa
              </label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
              >
                <option value={1}>1 Bulan (Standar)</option>
                <option value={3}>3 Bulan (Per Triwulan)</option>
                <option value={6}>6 Bulan / 1 Semester (Diskon 5%)</option>
                <option value={12}>12 Bulan / 1 Tahun Penuh (Diskon 10%)</option>
              </select>
            </div>
          </div>

          {/* Step 3: Tenant Details */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              3. Data Calon Penghuni
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Nama Lengkap</span>
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Nomor WhatsApp / HP</span>
                <input
                  type="tel"
                  required
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Email Aktif</span>
                <input
                  type="email"
                  required
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Kampus & Jurusan</span>
                <input
                  type="text"
                  required
                  value={tenantCampus}
                  onChange={(e) => setTenantCampus(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-[11px] text-slate-500 block mb-1">Kontak Darurat (Nama & No. HP Orang Tua / Wali)</span>
              <input
                type="text"
                required
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Contoh: Ibu Rina - 081234567890"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              Rincian Pembayaran Sewa
            </h4>
            <div className="flex justify-between text-slate-600">
              <span>Sewa Kamar {selectedRoomNumber} ({durationMonths} Bulan x {formatRupiah(baseMonthlyRent)})</span>
              <span className="font-semibold text-slate-800">{formatRupiah(subtotalRent)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Diskon Paket Sewa {durationMonths} Bulan</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                Deposit Jaminan Kamar (dapat dikembalikan)
              </span>
              <span className="font-semibold text-slate-800">{formatRupiah(depositFee)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Biaya Sistem & Pemeliharaan Digital</span>
              <span className="font-semibold text-slate-800">{formatRupiah(serviceFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-extrabold text-sm sm:text-base text-slate-900">
              <span>Total Tagihan Pertama:</span>
              <span className="text-emerald-600">{formatRupiah(totalAmount)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Lanjut ke Pembayaran Digital (QRIS / VA)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
