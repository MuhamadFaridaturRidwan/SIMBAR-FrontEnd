// mockData.js
// Data contoh (dummy) untuk menggantikan query MySQL sementara.
// Struktur ini dibuat agar mudah digantikan oleh response Axios/Fetch
// dari endpoint API nantinya (misal: GET /api/dashboard/summary, dst).

// 1. Data ringkasan (kartu statistik atas)
export const mockSummary = {
  totalProduk: 248,
  stokTersedia: 18420,
  stokRendah: 12,
  stokHabis: 4,
};

// 2. Data statistik stok per kategori
// "total" dipakai untuk menghitung lebar progress bar (maks referensi 500 unit, sama seperti kode asal)
export const mockKategoriStok = [
  { kategori: "Elektronik", total: 480 },
  { kategori: "Alat Tulis Kantor", total: 410 },
  { kategori: "Perlengkapan Gudang", total: 365 },
  { kategori: "Bahan Baku", total: 290 },
  { kategori: "Sparepart", total: 150 },
];

// 3. Data aktivitas terakhir (gabungan barang masuk & keluar)
// tipe: 'masuk' | 'keluar'
export const mockAktivitas = [
  {
    id: 1,
    tipe: "masuk",
    tanggal: "2026-06-27 09:15:00",
    namaBarang: "Kabel UTP Cat6 (box)",
    jumlah: 50,
  },
  {
    id: 2,
    tipe: "keluar",
    tanggal: "2026-06-27 08:42:00",
    namaBarang: "Kertas A4 80gsm",
    jumlah: 20,
  },
  {
    id: 3,
    tipe: "keluar",
    tanggal: "2026-06-26 16:30:00",
    namaBarang: "Toner Printer HP 12A",
    jumlah: 5,
  },
  {
    id: 4,
    tipe: "masuk",
    tanggal: "2026-06-26 14:05:00",
    namaBarang: "Rak Besi Siku 4 Tingkat",
    jumlah: 8,
  },
  {
    id: 5,
    tipe: "keluar",
    tanggal: "2026-06-26 10:20:00",
    namaBarang: "Baterai AA Alkaline",
    jumlah: 30,
  },
];

// 4. Data ringkasan stok rendah
export const mockStokRendah = [
  { kodeBarang: "BRG-0231", namaBarang: "Toner Printer HP 12A", stokSaatIni: 2 },
  { kodeBarang: "BRG-0114", namaBarang: "Baterai AA Alkaline", stokSaatIni: 5 },
  { kodeBarang: "BRG-0099", namaBarang: "Lakban Bening 2 inch", stokSaatIni: 3 },
  { kodeBarang: "BRG-0177", namaBarang: "Sarung Tangan Safety", stokSaatIni: 4 },
  { kodeBarang: "BRG-0042", namaBarang: "Kabel Tie 20cm (pak)", stokSaatIni: 1 },
];
