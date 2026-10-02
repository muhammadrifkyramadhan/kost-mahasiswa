import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  QrCode, 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  Clock, 
  Download, 
  Printer, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Booking, PaymentMethod } from '../../types';
import { useApp } from '../../context/AppContext';

interface PaymentModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ booking, onClose }) => {
  const { processPayment } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris');
  const [copiedVA, setCopiedVA] = useState(false);
  const [timeLeft, setTimeLeft] = useState(899); // 14 mins 59 secs
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(booking?.paymentStatus === 'paid');

  useEffect(() => {
    if (booking?.paymentStatus === 'paid') {
      setPaidSuccess(true);
    }
  }, [booking?.paymentStatus]);

  // Countdown timer for pending payment
  useEffect(() => {
    if (paidSuccess) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paidSuccess]);

  if (!booking) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Simulated Virtual Account Numbers
  const vaNumbers: Record<string, { bank: string; va: string }> = {
    bca_va: { bank: 'BCA Virtual Account', va: `8277 0812 ${booking.roomNumber} 992` },
    mandiri_va: { bank: 'Mandiri Virtual Account', va: `8890 0812 ${booking.roomNumber} 451` },
    bri_va: { bank: 'BRI BRIVA', va: `1029 0812 ${booking.roomNumber} 776` },
    bni_va: { bank: 'BNI Virtual Account', va: `9881 0812 ${booking.roomNumber} 318` },
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text.replace(/\s+/g, ''));
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      processPayment(booking.id, selectedMethod, true);
      setIsProcessing(false);
      setPaidSuccess(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // confetti fallback
      }
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              💳
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {paidSuccess ? 'Kuitansi Digital Terverifikasi' : 'Portal Pembayaran Sewa Kos'}
              </h3>
              <p className="text-xs text-slate-500">
                No. Booking: <span className="font-mono font-bold text-slate-700">{booking.bookingCode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paidSuccess ? (
          /* SUCCESS INVOICE & RECEIPT VIEW */
          <div className="overflow-y-auto p-6 space-y-6">
            
            <div className="text-center space-y-2 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                LUNAS • REAL-TIME VERIFIED
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                {formatRupiah(booking.totalAmount)}
              </h2>
              <p className="text-xs text-slate-500">
                Pembayaran berhasil diverifikasi secara instan via gateway digital
              </p>
            </div>

            {/* Official Digital Invoice Receipt Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-5 text-slate-800 relative overflow-hidden">
              
              {/* Official Watermark */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-[-25deg] pointer-events-none opacity-[0.06] select-none text-7xl font-black uppercase text-slate-900">
                LUNAS OFFICIAL
              </div>

              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                      KM
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 tracking-tight">PT KOST MAHASISWA INDONESIA</h4>
                      <p className="text-[11px] text-slate-500">Izin Usaha OSS: 190283749102 • NPWP: 42.891.029.1-012.000</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Gedung Graha Mahasiswa Lt. 4, Jl. Margonda Raya No. 100, Depok, Jawa Barat
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
                    BUKTI PEMBAYARAN RESMI
                  </span>
                  <div className="font-mono font-bold text-xs text-slate-900 mt-1.5">
                    INV/KM/{new Date().getFullYear()}/{booking.bookingCode}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Tanggal Terbit: {booking.paidAt || '2026-10-02 08:30 WIB'}
                  </div>
                </div>
              </div>

              {/* Parties Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Diterbitkan Kepada (Penyewa):
                  </span>
                  <div className="font-bold text-sm text-slate-900">{booking.tenantName}</div>
                  <div className="text-slate-600 mt-0.5">{booking.tenantCampus}</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-0.5">{booking.tenantPhone} • {booking.tenantEmail}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Properti & Unit Kamar:
                  </span>
                  <div className="font-bold text-sm text-slate-900">{booking.kostName}</div>
                  <div className="text-slate-600 mt-0.5">Unit Kamar: <span className="font-extrabold text-emerald-700">No. {booking.roomNumber}</span></div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Masa Sewa: {booking.startDate} s/d {booking.endDate} ({booking.durationMonths} Bulan)</div>
                </div>
              </div>

              {/* Itemized Financial Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Deskripsi Tagihan</th>
                      <th className="p-3 text-center">Durasi</th>
                      <th className="p-3 text-right">Tarif / Bulan</th>
                      <th className="p-3 text-right">Jumlah (IDR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    <tr>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">Sewa Kamar Eksklusif Mahasiswa</div>
                        <div className="text-[10px] text-slate-500">Termasuk fasilitas WiFi Fiber 100Mbps, AC, & Kamar Mandi Dalam</div>
                      </td>
                      <td className="p-3 text-center font-bold">{booking.durationMonths} Bulan</td>
                      <td className="p-3 text-right font-mono">{formatRupiah(booking.monthlyRent)}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(booking.monthlyRent * booking.durationMonths)}
                      </td>
                    </tr>
                    {booking.discountAmount > 0 && (
                      <tr className="bg-emerald-50/40 text-emerald-800">
                        <td className="p-3 font-semibold" colSpan={3}>
                          Potongan Diskon Promo Paket Sewa ({booking.durationMonths} Bulan)
                        </td>
                        <td className="p-3 text-right font-mono font-bold">
                          -{formatRupiah(booking.discountAmount)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="p-3" colSpan={3}>
                        <div className="font-semibold text-slate-800">Deposit Jaminan Pemeliharaan Kamar (Refundable)</div>
                        <div className="text-[10px] text-slate-400">Dikembalikan penuh saat selesai masa sewa jika tidak ada kerusakan</div>
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-slate-800">
                        {formatRupiah(booking.depositFee)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-500" colSpan={3}>
                        Biaya Pemrosesan Sistem & Gateway Digital Terenkripsi
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-slate-800">
                        {formatRupiah(booking.serviceFee)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                    <tr>
                      <td className="p-3 text-sm text-slate-900" colSpan={3}>
                        TOTAL PEMBAYARAN LUNAS (IDR):
                      </td>
                      <td className="p-3 text-right font-mono text-base font-black text-emerald-600">
                        {formatRupiah(booking.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Verification & Legal Stamp Footer */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    <span className="font-bold text-slate-700 block">Autentikasi Digital Sah:</span>
                    <span>Tervalidasi secara kriptografis oleh Gateway Bank Indonesia.</span>
                    <span className="block font-mono text-[10px] text-slate-400 mt-0.5">Hash: 8f9b2c4e1a0d3e5f</span>
                  </div>
                </div>

                {/* Simulated E-Meterai Official Badge */}
                <div className="border-2 border-emerald-600 text-emerald-800 px-3.5 py-2 rounded-xl text-center bg-emerald-50/80 shadow-xs">
                  <div className="text-[9px] font-black uppercase tracking-widest text-emerald-700">METERAI ELEKTRONIK</div>
                  <div className="text-xs font-black tracking-tight">TANDA TANGAN SAH</div>
                  <div className="text-[9px] font-bold text-emerald-600">KEMENKEU RI TERA DIGITAL</div>
                </div>
              </div>

            </div>

            {/* Receipt Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-colors"
              >
                <span>Selesai & Ke Dashboard</span>
              </button>
            </div>

          </div>
        ) : (
          /* ACTIVE PAYMENT GATEWAY CHECKOUT VIEW */
          <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Timer Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Selesaikan pembayaran dalam:</span>
              </div>
              <span className="font-mono font-extrabold text-sm text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                {timeFormatted}
              </span>
            </div>

            {/* Total Bill Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Total Tagihan Sewa</span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                  {formatRupiah(booking.totalAmount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Kamar</span>
                <span className="text-sm font-bold text-white">No. {booking.roomNumber}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Pilih Saluran Pembayaran Digital
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('qris')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedMethod === 'qris'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-xs text-slate-900">QRIS</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Semua E-Wallet/Bank</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('bca_va')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedMethod === 'bca_va'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-xs text-blue-700">BCA VA</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">BCA Virtual Account</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('mandiri_va')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedMethod === 'mandiri_va'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-xs text-amber-700">Mandiri VA</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Livin / ATM Mandiri</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('gopay')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedMethod === 'gopay'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-xs text-emerald-700">GoPay / Dana</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">E-Wallet Direct</div>
                </button>
              </div>

              {/* Method Detail View */}
              {selectedMethod === 'qris' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col items-center text-center space-y-3">
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200">
                    {/* SVG QR Code Simulation */}
                    <div className="w-48 h-48 bg-white flex flex-col items-center justify-center p-2">
                      <div className="text-[10px] font-black tracking-widest text-slate-900 border-b pb-1 w-full text-center">
                        QRIS STANDAR PEMBAYARAN NASIONAL
                      </div>
                      <div className="my-auto">
                        <QrCode className="w-32 h-32 text-slate-900" />
                      </div>
                      <div className="text-[9px] font-bold text-slate-500">
                        NMID: ID1029384729103 • KostMahasiswa
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 max-w-sm">
                    Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, Dana, ShopeePay) lalu scan kode QR di atas.
                  </p>
                </div>
              )}

              {selectedMethod.includes('_va') && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">
                      {vaNumbers[selectedMethod]?.bank || 'Virtual Account'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Verifikasi Otomatis 24 Jam
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Nomor Virtual Account:</span>
                      <span className="text-base sm:text-lg font-mono font-black text-slate-900 tracking-wider">
                        {vaNumbers[selectedMethod]?.va}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(vaNumbers[selectedMethod]?.va || '')}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedVA ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedVA ? 'Disalin' : 'Salin'}</span>
                    </button>
                  </div>

                  <ul className="text-xs text-slate-500 space-y-1 pl-4 list-disc">
                    <li>Masukkan nomor Virtual Account pada menu transfer/bayar bank Anda.</li>
                    <li>Nominal yang dimasukkan harus tepat {formatRupiah(booking.totalAmount)}.</li>
                    <li>Sistem akan mengkonfirmasi pembayaran secara otomatis tanpa perlu upload struk manual.</li>
                  </ul>
                </div>
              )}

              {selectedMethod === 'gopay' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold text-xl">
                    📱
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">E-Wallet Direct Debit</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Akan dikirimkan notifikasi pembayaran langsung ke aplikasi GoPay / DANA terdaftar pada nomor HP Anda (<span className="font-bold text-slate-800">{booking.tenantPhone}</span>).
                  </p>
                </div>
              )}
            </div>

            {/* Sandbox Simulation Button for seamless testing */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Integrasi Gateway Sandbox:</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Klik tombol di bawah untuk menyimulasikan transaksi pembayaran berhasil secara instan dan melihat penerbitan kuitansi digital resmi.
              </p>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isProcessing ? 'Memverifikasi Transaksi Gateway...' : 'Simulasi Pembayaran Berhasil (Instant Pay)'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
