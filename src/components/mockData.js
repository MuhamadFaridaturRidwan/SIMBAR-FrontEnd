// =========================================================================
// PUSAT MOCK DATA (TEMA SAFETY, PACKAGING, OFFICE SUPPLIES, & EQUIPMENT)
// Mendukung properti camelCase (Dashboard) & snake_case (DaftarBarang/Transaksi)
// =========================================================================

// 1. Data Ringkasan Kartu Atas (Halaman Dashboard & Laporan)
export const mockSummary = {
  totalProduk: 7,
  total_produk: 7,
  stokTersedia: 847,
  stok_tersedia: 847,
  stokRendah: 3,
  stok_rendah: 3,
  stokHabis: 1,
  stok_habis: 1,
};

// 2. Statistik Stok per Kategori (Halaman Dashboard)
export const mockKategoriStok = [
  { kategori: "Safety", total: 504 },
  { kategori: "Packaging", total: 320 },
  { kategori: "Office Supplies", total: 22 },
  { kategori: "Equipment", total: 1 },
];

// 3. Aktivitas Terakhir (Halaman Dashboard)
export const mockAktivitas = [
  { id: 1, tipe: "masuk", tanggal: "2026-06-27 14:30:00", namaBarang: "Helm Safety Krisbow", nama_barang: "Helm Safety Krisbow", jumlah: 25 },
  { id: 2, tipe: "keluar", tanggal: "2026-06-27 11:15:00", namaBarang: "Kardus Packing A4", nama_barang: "Kardus Packing A4", jumlah: 100 },
  { id: 3, tipe: "masuk", tanggal: "2026-06-26 09:00:00", namaBarang: "Isolasi Tokopedia", nama_barang: "Isolasi Tokopedia", jumlah: 50 },
  { id: 4, tipe: "keluar", tanggal: "2026-06-25 16:00:00", namaBarang: "Kursi Kerja Statis", nama_barang: "Kursi Kerja Statis", jumlah: 2 },
];

// 4. Ringkasan khusus barang kritis / Stok Rendah <= 10 (Dashboard & Halaman StokRendah)
export const mockStokRendah = [
  { id_barang: "4", idBarang: "4", kodeBarang: "SF-003", kode_barang: "SF-003", namaBarang: "Sarung Tangan Las", nama_barang: "Sarung Tangan Las", stokSaatIni: 4, stok_saat_ini: 4, stokMin: 10, stok_min: 10, kategori: "Safety", lokasi: "Rak A3" },
  { id_barang: "5", idBarang: "5", kodeBarang: "OS-012", kode_barang: "OS-012", namaBarang: "Spidol Snowman Hitam", nama_barang: "Spidol Snowman Hitam", stokSaatIni: 2, stok_saat_ini: 2, stokMin: 5, stok_min: 5, kategori: "Office Supplies", lokasi: "Rak B1" },
  { id_barang: "6", idBarang: "6", kodeBarang: "EQ-007", kode_barang: "EQ-007", namaBarang: "Obeng Set Pro", nama_barang: "Obeng Set Pro", stokSaatIni: 1, stok_saat_ini: 1, stokMin: 5, stok_min: 5, kategori: "Equipment", lokasi: "Rak C1" },
  { id_barang: "7", idBarang: "7", kodeBarang: "OS-099", kode_barang: "OS-099", namaBarang: "Kursi Kerja Statis", nama_barang: "Kursi Kerja Statis", stokSaatIni: 0, stok_saat_ini: 0, stokMin: 2, stok_min: 2, kategori: "Office Supplies", lokasi: "Ruang Staf" },
];

// 5. Data Master Semua Barang Lengkap (Halaman DaftarBarang & Laporan)
export const mockBarangData = [
  { id_barang: "1", kode_barang: "SF-001", kodeBarang: "SF-001", nama_barang: "Helm Safety Krisbow", namaBarang: "Helm Safety Krisbow", kategori: "Safety", supplier: "PT Krisbow Indonesia", lokasi: "Rak A1", stok_saat_ini: 500, stokSaatIni: 500, stok_min: 10, stokMin: 10, harga_satuan: 150000 },
  { id_barang: "2", kode_barang: "PK-001", kodeBarang: "PK-001", nama_barang: "Kardus Packing A4", namaBarang: "Kardus Packing A4", kategori: "Packaging", supplier: "PT Karya Pack", lokasi: "Rak M1", stok_saat_ini: 220, stokSaatIni: 220, stok_min: 20, stokMin: 20, harga_satuan: 5000 },
  { id_barang: "3", kode_barang: "PK-002", kodeBarang: "PK-002", nama_barang: "Isolasi Tokopedia", namaBarang: "Isolasi Tokopedia", kategori: "Packaging", supplier: "PT Karya Pack", lokasi: "Rak M2", stok_saat_ini: 100, stokSaatIni: 100, stok_min: 15, stokMin: 15, harga_satuan: 12000 },
  { id_barang: "4", kode_barang: "SF-003", kodeBarang: "SF-003", nama_barang: "Sarung Tangan Las", namaBarang: "Sarung Tangan Las", kategori: "Safety", supplier: "PT Krisbow Indonesia", lokasi: "Rak A3", stok_saat_ini: 4, stokSaatIni: 4, stok_min: 10, stokMin: 10, harga_satuan: 45000 },
  { id_barang: "5", kode_barang: "OS-012", kodeBarang: "OS-012", nama_barang: "Spidol Snowman Hitam", namaBarang: "Spidol Snowman Hitam", kategori: "Office Supplies", supplier: "CV Atk Sejahtera", lokasi: "Rak B1", stok_saat_ini: 2, stokSaatIni: 2, stok_min: 5, stokMin: 5, harga_satuan: 8000 },
  { id_barang: "6", kode_barang: "EQ-007", kodeBarang: "EQ-007", nama_barang: "Obeng Set Pro", namaBarang: "Obeng Set Pro", kategori: "Equipment", supplier: "PT Teknik Perkasa", lokasi: "Rak C1", stok_saat_ini: 1, stokSaatIni: 1, stok_min: 5, stokMin: 5, harga_satuan: 250000 },
  { id_barang: "7", kode_barang: "OS-099", kodeBarang: "OS-099", nama_barang: "Kursi Kerja Statis", namaBarang: "Kursi Kerja Statis", kategori: "Office Supplies", supplier: "CV Atk Sejahtera", lokasi: "Ruang Staf", stok_saat_ini: 0, stokSaatIni: 0, stok_min: 2, stokMin: 2, harga_satuan: 350000 },
];

// 6. Data Riwayat Transaksi Gabungan UNION ALL (Halaman Transaksi & Laporan)
export const mockTransaksiData = [
  { tanggal: "2026-06-27 14:30:00", tipe_trx: "Barang Masuk", nama_barang: "Helm Safety Krisbow", namaBarang: "Helm Safety Krisbow", kode_barang: "SF-001", kodeBarang: "SF-001", jumlah: 25, referensi: "PO-2026-001", catatan: "Restock gudang depan", oleh: "Admin User" },
  { tanggal: "2026-06-27 11:15:00", tipe_trx: "Barang Keluar", nama_barang: "Kardus Packing A4", namaBarang: "Kardus Packing A4", kode_barang: "PK-001", kodeBarang: "PK-001", jumlah: 100, referensi: "SJ-2026-012", catatan: "Kebutuhan packing tim logistik", oleh: "Admin User" },
  { tanggal: "2026-06-26 09:00:00", tipe_trx: "Barang Masuk", nama_barang: "Isolasi Tokopedia", namaBarang: "Isolasi Tokopedia", kode_barang: "PK-002", kodeBarang: "PK-002", jumlah: 50, referensi: "PO-2026-002", catatan: "Kiriman supplier baru", oleh: "Admin User" },
  { tanggal: "2026-06-25 16:00:00", tipe_trx: "Barang Keluar", nama_barang: "Kursi Kerja Statis", namaBarang: "Kursi Kerja Statis", kode_barang: "OS-099", kodeBarang: "OS-099", jumlah: 2, referensi: "SJ-2026-011", catatan: "Inventaris ruang admin baru", oleh: "Admin User" },
];