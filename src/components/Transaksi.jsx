// Transaksi.jsx
import React, { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, Search } from "lucide-react";
import Sidebar from "./Sidebar";

// ----------------------------------------------------------------------
// MOCK DATA
// Merepresentasikan hasil query UNION ALL (barang_masuk + barang_keluar)
// dari transaksi.php. Field dipertahankan mirip alias kolom SQL asal
// (tipe_trx, nama_barang, dst) agar mapping ke response API nanti mudah —
// tinggal ganti sumber data ini dengan hasil fetch/axios dari
// GET /api/transaksi.
// ----------------------------------------------------------------------
const initialTransaksiData = [
  {
    tanggal: "2026-06-27",
    tipe_trx: "Barang Masuk",
    nama_barang: "Kabel UTP Cat6 (box)",
    kode_barang: "BRG-0301",
    jumlah: 50,
    referensi: "PO-2026-0612",
    catatan: "Restock dari supplier utama",
    oleh: "Andi Saputra",
  },
  {
    tanggal: "2026-06-27",
    tipe_trx: "Barang Keluar",
    nama_barang: "Kertas A4 80gsm",
    kode_barang: "BRG-0102",
    jumlah: 20,
    referensi: "SO-2026-0455",
    catatan: "Permintaan divisi Administrasi",
    oleh: "Siti Rahma",
  },
  {
    tanggal: "2026-06-26",
    tipe_trx: "Barang Keluar",
    nama_barang: "Toner Printer HP 12A",
    kode_barang: "BRG-0231",
    jumlah: 5,
    referensi: "SO-2026-0448",
    catatan: "Penggantian toner lantai 2",
    oleh: "Budi Santoso",
  },
  {
    tanggal: "2026-06-26",
    tipe_trx: "Barang Masuk",
    nama_barang: "Rak Besi Siku 4 Tingkat",
    kode_barang: "BRG-0189",
    jumlah: 8,
    referensi: "PO-2026-0609",
    catatan: "Tambahan rak gudang B",
    oleh: "Andi Saputra",
  },
  {
    tanggal: "2026-06-25",
    tipe_trx: "Barang Keluar",
    nama_barang: "Baterai AA Alkaline",
    kode_barang: "BRG-0114",
    jumlah: 30,
    referensi: "SO-2026-0441",
    catatan: "Kebutuhan remote & senter gudang",
    oleh: "Siti Rahma",
  },
  {
    tanggal: "2026-06-24",
    tipe_trx: "Barang Masuk",
    nama_barang: "Helm Safety SNI Kuning",
    kode_barang: "BRG-0021",
    jumlah: 25,
    referensi: "PO-2026-0601",
    catatan: "Restock APD wajib proyek baru",
    oleh: "Dedi Kurniawan",
  },
  {
    tanggal: "2026-06-23",
    tipe_trx: "Barang Keluar",
    nama_barang: "Lakban Bening 2 inch",
    kode_barang: "BRG-0099",
    jumlah: 12,
    referensi: "SO-2026-0436",
    catatan: "Packing kiriman cabang Bandung",
    oleh: "Budi Santoso",
  },
  {
    tanggal: "2026-06-22",
    tipe_trx: "Barang Masuk",
    nama_barang: "Sarung Tangan Safety Anti Panas",
    kode_barang: "BRG-0177",
    jumlah: 40,
    referensi: "PO-2026-0595",
    catatan: "Stok pengganti yang menipis",
    oleh: "Dedi Kurniawan",
  },
];

export default function Transaksi() {
  // State filter — menggantikan $_GET['search'], $_GET['tipe'], $_GET['tanggal']
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("");
  const [tanggal, setTanggal] = useState("");

  // ----------------------------------------------------------------------
  // TODO (integrasi API): kalau datanya besar/dari backend sungguhan,
  // pindahkan filter ini ke server — kirim search/tipe/tanggal sebagai
  // query param ke axios.get("/api/transaksi", { params: { search, tipe, tanggal } }).
  // Untuk sekarang masih disaring di client dari initialTransaksiData.
  // ----------------------------------------------------------------------
  const filteredTransaksi = useMemo(() => {
    return initialTransaksiData
      .filter((row) => {
        const keyword = search.trim().toLowerCase();
        const matchSearch =
          keyword === "" ||
          row.nama_barang.toLowerCase().includes(keyword) ||
          row.referensi.toLowerCase().includes(keyword) ||
          row.kode_barang.toLowerCase().includes(keyword);

        const matchTipe = tipe === "" || row.tipe_trx === tipe;

        const matchTanggal = tanggal === "" || row.tanggal === tanggal;

        return matchSearch && matchTipe && matchTanggal;
      })
      // ORDER BY tanggal DESC, sama seperti query SQL asal
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [search, tipe, tanggal]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc]">
      <Sidebar />

      <div className="flex-grow p-10 overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Transaksi Barang
            </h1>
            <p className="text-gray-500 mt-1.5 text-[15px]">
              Kelola barang masuk dan keluar gudang
            </p>
          </div>
          <div className="flex gap-3">
            {/* Ganti href="#" dengan <Link to="/tambah-masuk"> dari react-router-dom saat routing siap */}
            <a
              href="#"
              className="bg-[#16a34a] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm hover:bg-green-700 transition w-fit"
            >
              <ArrowUp size={16} /> Barang Masuk
            </a>
            {/* Ganti href="#" dengan <Link to="/tambah-keluar"> dari react-router-dom saat routing siap */}
            <a
              href="#"
              className="bg-[#ea580c] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm hover:bg-orange-700 transition w-fit"
            >
              <ArrowDown size={16} /> Barang Keluar
            </a>
          </div>
        </div>

        {/* === Filter & Pencarian (real-time, tanpa reload) === */}
        <div className="bg-white p-6 rounded-t-xl border border-gray-200 border-b-0 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            <div className="col-span-6">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Cari Transaksi
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ketik produk, referensi, atau SKU..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="col-span-3">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Tipe Transaksi
              </label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option value="">Semua Transaksi</option>
                <option value="Barang Masuk">Barang Masuk</option>
                <option value="Barang Keluar">Barang Keluar</option>
              </select>
            </div>

            <div className="col-span-3">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* === Tabel Riwayat Transaksi === */}
        <div className="bg-white rounded-b-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">
                  Tipe
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">
                  Produk
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">
                  Referensi
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">
                  Catatan
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">
                  Oleh
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransaksi.length > 0 ? (
                filteredTransaksi.map((row, idx) => {
                  const isMasuk = row.tipe_trx === "Barang Masuk";
                  return (
                    <tr key={`${row.kode_barang}-${row.referensi}-${idx}`} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-[13px] text-gray-600 font-medium">
                        {row.tanggal}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${
                            isMasuk
                              ? "bg-[#dcfce3] text-[#166534]"
                              : "bg-[#ffedd5] text-[#c2410c]"
                          } px-2.5 py-1 rounded-full text-[11px] font-bold flex w-max items-center gap-1`}
                        >
                          {isMasuk ? (
                            <ArrowUp size={10} />
                          ) : (
                            <ArrowDown size={10} />
                          )}{" "}
                          {isMasuk ? "Masuk" : "Keluar"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 text-[13px]">
                          {row.nama_barang}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                          {row.kode_barang}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-bold text-[13px] ${
                            isMasuk ? "text-[#16a34a]" : "text-[#ea580c]"
                          }`}
                        >
                          {isMasuk ? "+" : "-"}
                          {row.jumlah} unit
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-semibold text-gray-700">
                        {row.referensi}
                      </td>
                      <td className="px-6 py-4 text-[12px] text-gray-500 w-48">
                        {row.catatan}
                      </td>
                      <td className="px-6 py-4 text-[12px] text-gray-600">
                        {row.oleh}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    Tidak ada riwayat transaksi yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
