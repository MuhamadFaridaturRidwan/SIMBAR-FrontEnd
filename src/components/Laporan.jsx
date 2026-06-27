// Laporan.jsx
import React, { useState, useMemo } from "react";
import { Printer, Download, AlertTriangle } from "lucide-react";
import Sidebar from "./Sidebar";

// ----------------------------------------------------------------------
// MOCK DATA
// barangData merepresentasikan tabel `barang`, transaksiData merepresentasikan
// gabungan `barang_masuk` + `barang_keluar`. Nama field dipertahankan mirip
// kolom SQL asal agar mapping ke response API nanti mudah — tinggal ganti
// sumber data ini dengan hasil fetch/axios dari endpoint laporan.
// ----------------------------------------------------------------------
const barangData = [
  { kode_barang: "BRG-0021", nama_barang: "Helm Safety SNI Kuning", stok_saat_ini: 45, stok_min: 20, harga_satuan: 85000 },
  { kode_barang: "BRG-0034", nama_barang: "Kardus Box Double Wall 40x40", stok_saat_ini: 8, stok_min: 15, harga_satuan: 12000 },
  { kode_barang: "BRG-0102", nama_barang: "Kertas A4 80gsm", stok_saat_ini: 0, stok_min: 10, harga_satuan: 48000 },
  { kode_barang: "BRG-0177", nama_barang: "Sarung Tangan Safety Anti Panas", stok_saat_ini: 4, stok_min: 12, harga_satuan: 35000 },
  { kode_barang: "BRG-0099", nama_barang: "Lakban Bening 2 inch", stok_saat_ini: 3, stok_min: 8, harga_satuan: 9500 },
  { kode_barang: "BRG-0210", nama_barang: "Gunting Listrik Crimping", stok_saat_ini: 17, stok_min: 5, harga_satuan: 145000 },
  { kode_barang: "BRG-0145", nama_barang: "Spidol Whiteboard Hitam", stok_saat_ini: 60, stok_min: 20, harga_satuan: 8500 },
  { kode_barang: "BRG-0256", nama_barang: "Obeng Set Multifungsi", stok_saat_ini: 0, stok_min: 6, harga_satuan: 95000 },
  { kode_barang: "BRG-0114", nama_barang: "Baterai AA Alkaline", stok_saat_ini: 5, stok_min: 25, harga_satuan: 22000 },
  { kode_barang: "BRG-0231", nama_barang: "Toner Printer HP 12A", stok_saat_ini: 2, stok_min: 6, harga_satuan: 580000 },
];

const transaksiData = [
  { tipe_trx: "Barang Masuk", tanggal: "2026-06-27", nama_barang: "Kabel UTP Cat6 (box)", jumlah: 50 },
  { tipe_trx: "Barang Keluar", tanggal: "2026-06-27", nama_barang: "Kertas A4 80gsm", jumlah: 20 },
  { tipe_trx: "Barang Keluar", tanggal: "2026-06-26", nama_barang: "Toner Printer HP 12A", jumlah: 5 },
  { tipe_trx: "Barang Masuk", tanggal: "2026-06-26", nama_barang: "Rak Besi Siku 4 Tingkat", jumlah: 8 },
  { tipe_trx: "Barang Keluar", tanggal: "2026-06-25", nama_barang: "Baterai AA Alkaline", jumlah: 30 },
  { tipe_trx: "Barang Masuk", tanggal: "2026-06-24", nama_barang: "Helm Safety SNI Kuning", jumlah: 25 },
  { tipe_trx: "Barang Keluar", tanggal: "2026-06-23", nama_barang: "Lakban Bening 2 inch", jumlah: 12 },
  { tipe_trx: "Barang Masuk", tanggal: "2026-06-22", nama_barang: "Sarung Tangan Safety Anti Panas", jumlah: 40 },
  { tipe_trx: "Barang Masuk", tanggal: "2026-06-15", nama_barang: "Toner Printer HP 12A", jumlah: 10 },
  { tipe_trx: "Barang Keluar", tanggal: "2026-06-10", nama_barang: "Spidol Whiteboard Hitam", jumlah: 15 },
];

// Util format angka ribuan ala number_format($x, 0, '', '.')
function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

const TABS = [
  { key: "inventori", label: "Laporan Inventori" },
  { key: "transaksi", label: "Laporan Transaksi" },
  { key: "stok", label: "Stok Rendah" },
];

export default function Laporan() {
  // State tab aktif — menggantikan $_GET['tab']
  const [activeTab, setActiveTab] = useState("inventori");

  // State filter rentang tanggal (khusus tab Laporan Transaksi)
  const [dariTanggal, setDariTanggal] = useState("");
  const [sampaiTanggal, setSampaiTanggal] = useState("");

  // ----------------------------------------------------------------------
  // TAB: LAPORAN INVENTORI
  // Menghitung total produk, total unit, total nilai aset, dan jumlah
  // produk yang perlu restock — semuanya dari barangData via .reduce().
  // ----------------------------------------------------------------------
  const inventoriSummary = useMemo(() => {
    return barangData.reduce(
      (acc, item) => {
        acc.totalProduk += 1;
        acc.totalUnit += item.stok_saat_ini;
        acc.totalNilai += item.stok_saat_ini * item.harga_satuan;
        if (item.stok_saat_ini <= item.stok_min) acc.perluRestock += 1;
        return acc;
      },
      { totalProduk: 0, totalUnit: 0, totalNilai: 0, perluRestock: 0 }
    );
  }, []);

  // ----------------------------------------------------------------------
  // TAB: LAPORAN TRANSAKSI
  // Filter dulu berdasarkan rentang dariTanggal/sampaiTanggal (kalau
  // keduanya diisi, sama seperti pengecekan PHP asal
  // `!empty($_GET['dari']) && !empty($_GET['sampai'])`), baru hitung
  // total transaksi, total masuk, total keluar, dan selisihnya.
  // ----------------------------------------------------------------------
  const transaksiSummary = useMemo(() => {
    const dataTerfilter =
      dariTanggal && sampaiTanggal
        ? transaksiData.filter(
            (row) => row.tanggal >= dariTanggal && row.tanggal <= sampaiTanggal
          )
        : transaksiData;

    return dataTerfilter.reduce(
      (acc, row) => {
        acc.totalTransaksi += 1;
        if (row.tipe_trx === "Barang Masuk") {
          acc.totalMasuk += row.jumlah;
        } else {
          acc.totalKeluar += row.jumlah;
        }
        acc.selisih = acc.totalMasuk - acc.totalKeluar;
        return acc;
      },
      { totalTransaksi: 0, totalMasuk: 0, totalKeluar: 0, selisih: 0 }
    );
  }, [dariTanggal, sampaiTanggal]);

  // ----------------------------------------------------------------------
  // TAB: STOK RENDAH
  // Saring barang dengan stok_saat_ini <= stok_min DAN > 0 (barang yang
  // benar-benar habis tidak masuk daftar restock di sini, sama seperti
  // query SQL asal), lalu hitung kekurangan & estimasi biaya restock.
  // ----------------------------------------------------------------------
  const stokRendahList = useMemo(() => {
    return barangData
      .filter((item) => item.stok_saat_ini <= item.stok_min && item.stok_saat_ini > 0)
      .map((item) => ({
        ...item,
        kurang: item.stok_min - item.stok_saat_ini,
        estimasiBiaya: (item.stok_min - item.stok_saat_ini) * item.harga_satuan,
      }));
  }, []);

  const stokRendahSummary = useMemo(() => {
    return stokRendahList.reduce(
      (acc, item) => {
        acc.jumlahProduk += 1;
        acc.totalKurang += item.kurang;
        acc.totalBiaya += item.estimasiBiaya;
        return acc;
      },
      { jumlahProduk: 0, totalKurang: 0, totalBiaya: 0 }
    );
  }, [stokRendahList]);

  const handleDownloadCSV = () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // 1. Tambahkan Judul & Header Inventori
  csvContent += "=== LAPORAN INVENTORI ===\n";
  csvContent += "Kode,Nama Produk,Stok,Harga Satuan,Total Nilai\n";
  
  // Gunakan data barang dari state/file mockData milikmu
  mockBarangData.forEach((r) => {
    const totalNilai = r.stok_saat_ini * r.harga_satuan;
    csvContent += `${r.kode_barang},${r.nama_barang},${r.stok_saat_ini},${r.harga_satuan},${totalNilai}\n`;
  });

  csvContent += "\n=== RIWAYAT TRANSAKSI ===\n";
  csvContent += "Tanggal,Tipe,Produk,Jumlah,Referensi\n";

  // Ambil data transaksi dari state/file mockData milikmu
  mockTransaksiData.forEach((r) => {
    csvContent += `${r.tanggal},${r.tipe_trx.toUpperCase()},${r.nama_barang},${r.jumlah},${r.referensi}\n`;
  });

  // Pembuatan trigger download otomatis di browser
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Laporan_Lengkap_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc]">
      <Sidebar />

      <div className="flex-grow p-10 overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Laporan
            </h1>
            <p className="text-gray-500 mt-1.5 text-[15px]">
              Laporan inventori dan analisis stok gudang
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm transition"
            >
              <Printer size={16} /> Print
            </button>
            {/* Ganti href="#" dengan endpoint unduh laporan sungguhan saat backend siap */}
            <button 
              onClick={handleDownloadCSV} 
              className="bg-[#1d4ed8] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm transition shadow-sm cursor-pointer"
            >
              <Download size={16} /> Download Laporan Lengkap
            </button>
          </div>
        </div>

        {/* === Pemilihan Jenis Laporan (Tab) === */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 shadow-sm">
          <label className="block text-[13px] font-semibold text-gray-700 mb-3">
            Pilih Jenis Laporan
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`${
                  activeTab === t.key
                    ? "bg-[#1d4ed8] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } text-center py-3 rounded-lg font-semibold text-sm transition`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "transaksi" && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    value={dariTanggal}
                    onChange={(e) => setDariTanggal(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={sampaiTanggal}
                    onChange={(e) => setSampaiTanggal(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* === TAB: LAPORAN INVENTORI === */}
        {activeTab === "inventori" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                  Total Produk
                </h3>
                <p className="text-4xl font-bold text-gray-900">
                  {formatNumber(inventoriSummary.totalProduk)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                  Total Unit
                </h3>
                <p className="text-4xl font-bold text-[#1d4ed8]">
                  {formatNumber(inventoriSummary.totalUnit)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                  Total Nilai
                </h3>
                <p className="text-3xl font-bold text-[#16a34a] mt-1">
                  Rp {formatNumber(inventoriSummary.totalNilai)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                  Perlu Restock
                </h3>
                <p className="text-4xl font-bold text-[#d97706]">
                  {formatNumber(inventoriSummary.perluRestock)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-10">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Detail Inventori
                </h2>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Produk
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                      Jumlah
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">
                      Nilai
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {barangData.map((r) => (
                    <tr key={r.kode_barang} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-[13px] font-mono text-gray-600">
                        {r.kode_barang}
                      </td>
                      <td className="px-6 py-4 font-bold text-[13px]">
                        {r.nama_barang}
                      </td>
                      <td className="px-6 py-4 text-center text-[13px]">
                        {r.stok_saat_ini}
                      </td>
                      <td className="px-6 py-4 text-right text-[13px] font-bold">
                        Rp {formatNumber(r.stok_saat_ini * r.harga_satuan)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* === TAB: LAPORAN TRANSAKSI === */}
        {activeTab === "transaksi" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                Total Transaksi
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {transaksiSummary.totalTransaksi}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                Barang Masuk
              </h3>
              <p className="text-3xl font-bold text-[#16a34a]">
                {transaksiSummary.totalMasuk}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                Barang Keluar
              </h3>
              <p className="text-3xl font-bold text-[#ea580c]">
                {transaksiSummary.totalKeluar}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                Selisih
              </h3>
              <p
                className={`text-3xl font-bold ${
                  transaksiSummary.selisih > 0
                    ? "text-[#16a34a]"
                    : "text-[#ea580c]"
                }`}
              >
                {transaksiSummary.selisih > 0
                  ? `+${transaksiSummary.selisih}`
                  : transaksiSummary.selisih}
              </p>
            </div>
          </div>
        )}

        {/* === TAB: STOK RENDAH === */}
        {activeTab === "stok" && (
          <>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8 flex items-center gap-5">
              <AlertTriangle size={28} className="text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-800 text-lg">
                  Peringatan Stok Rendah
                </h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Ada {stokRendahSummary.jumlahProduk} produk di bawah batas
                  minimum.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                  Produk Rendah
                </h3>
                <p className="text-4xl font-bold text-gray-900">
                  {stokRendahSummary.jumlahProduk}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                  Total Kekurangan
                </h3>
                <p className="text-4xl font-bold text-[#ea580c]">
                  {stokRendahSummary.totalKurang} unit
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-gray-500 text-[13px] font-medium mb-2">
                  Estimasi Biaya
                </h3>
                <p className="text-3xl font-bold text-[#16a34a] mt-1">
                  Rp {formatNumber(stokRendahSummary.totalBiaya)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Produk Perlu Restock
                </h2>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Produk
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                      Kurang
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">
                      Estimasi Biaya
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stokRendahList.map((i) => (
                    <tr key={i.kode_barang} className="hover:bg-gray-50">
                      <td className="px-6 py-5">
                        <p className="font-bold text-[14px]">{i.nama_barang}</p>
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-orange-600">
                        {i.kurang}
                      </td>
                      <td className="px-6 py-5 text-right font-bold">
                        Rp {formatNumber(i.estimasiBiaya)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
