# KostMahasiswa - Sistem Informasi & Booking Kos Kampus Terpadu

Aplikasi web modern untuk pencarian, reservasi kamar online, pembayaran sewa digital (QRIS & Virtual Account), pelaporan tiket kendala teknisi, dan autentikasi dua faktor (2FA WhatsApp OTP) untuk mahasiswa di 6 kampus utama Indonesia (UI, ITB, UGM, UNDIP, ITS, UB).

## 🚀 Panduan Menjalankan Proyek

### 1. Prasyarat
- Node.js versi 18 atau lebih baru
- NPM atau Bun / Yarn

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:3000`.

### 4. Build untuk Produksi
```bash
npm run build
```

## 💻 Panduan Membuka & Menjalankan di Visual Studio Code (VS Code)

### Langkah 1: Ekstrak File ZIP
Ekstrak file `kost-mahasiswa-project.zip` ke folder pilihan Anda (misalnya di folder `Documents` atau `Projects`).

### Langkah 2: Buka Folder di VS Code
- Jalankan aplikasi **Visual Studio Code**.
- Klik menu **File** > **Open Folder...** (atau tekan `Ctrl + K, Ctrl + O` di Windows / `Cmd + O` di Mac).
- Pilih folder hasil ekstrak tadi (folder yang berisi file `package.json`).
- Atau jika lewat Terminal:
  ```bash
  cd nama-folder-hasil-ekstrak
  code .
  ```

### Langkah 3: Buka Terminal Terintegrasi VS Code
- Tekan tombol **`Ctrl + \``** (Backtick) atau klik menu **Terminal** > **New Terminal**.

### Langkah 4: Install Dependensi & Jalankan
1. Ketik di terminal VS Code:
   ```bash
   npm install
   ```
2. Setelah proses instalasi selesai, jalankan:
   ```bash
   npm run dev
   ```
3. Tekan `Ctrl + Klik` tautan `http://localhost:3000` yang muncul di terminal untuk membuka website di browser Anda.

---

## 🛠️ Teknologi yang Digunakan
- **React 19** + **TypeScript**
- **Vite** (Bundler super cepat)
- **Tailwind CSS** (Styling responsif)
- **Lucide React** (Koleksi icon modern)
- **Canvas Confetti** (Efek pembayaran sukses)

## 🏢 Fitur Utama
1. **Pencarian & Filter Radius Kampus**: Filter harga, fasilitas, gender (Putra/Putri/Campur), dan jarak kampus.
2. **Peta Interaktif Kampus**: Visualisasi pin kos di sekitar UI Depok, ITB Dago, UGM Jogja, UNDIP Tembalang, ITS Sukolilo, dan UB Malang.
3. **Pemesanan Kamar Spesifik (Room Matrix)**: Pemilihan nomor kamar (lantai 1/2) dengan status ketersediaan real-time.
4. **Gateway Pembayaran Digital**: Simulasi QRIS Bank Indonesia & Virtual Account BCA/Mandiri/GoPay lengkap dengan kalkulasi diskon, deposit, dan cetak kuitansi resmi (E-Invoice).
5. **Autentikasi 2FA WhatsApp OTP**: Keamanan akun dengan kode 6-digit OTP.
6. **Sistem Tiket Kendala Penghuni (ITIL)**: Pelaporan kerusakan AC, listrik, sanitasi, dan pelacakan teknisi.
7. **Chat Lorong Komunitas & Chat Pengelola**: Komunikasi langsung antar mahasiswa dan pemilik kos.

© 2026 PT Kost Mahasiswa Indonesia. All Rights Reserved.
