// Transaksi.jsx
import React, { useState, useEffect, useMemo } from "react"; 
import { ArrowUp, ArrowDown, Search, Loader2 } from "lucide-react";
import api from "../api"; // 1. Mengubah import dari axios ke instance api terpusat (Auto-token)
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

export default function Transaksi() {
  // STATE REAL DATABASE (Menampung gabungan riwayat transaksi masuk & keluar)
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State filter pencarian halaman
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("");
  const [tanggal, setTanggal] = useState("");

  // 2. RITUAL FETCH DATA GABUNGAN SECARA ASYNCHRONOUS (ANTI-404)
  useEffect(() => {
    const fetchTransaksiGudang = async () => {
      try {
        setLoading(true);
        
        // Menembak dua endpoint aktif Laravel secara bersamaan menggunakan Promise.all
        const [resMasuk, resKeluar] = await Promise.all([
          api.get("/barang-masuk"),
          api.get("/barang-keluar")
        ]);

        const dataMasukRaw = resMasuk.data.data || resMasuk.data || [];
        const dataKeluarRaw = resKeluar.data.data || resKeluar.data || [];

        // Standarisasi properti objek Barang Masuk agar match dengan struktur tabel UI
        const dataMasuk = dataMasukRaw.map(item => ({
          // Potong YYYY-MM-DD agar sinkron dengan input date HTML
          tanggal: item.tanggal_masuk ? item.tanggal_masuk.substring(0, 10) : item.created_at?.substring(0, 10),
          tipe_trx: "Barang Masuk",
          nama_barang: item.barang?.nama_barang || item.nama_barang || "Produk",
          kode_barang: item.barang?.kode_barang || item.kode_barang || "-",
          jumlah: item.jumlah || item.qty || 0,
          referensi: item.referensi || "-",
          catatan: item.catatan || "-",
          oleh: item.oleh || "Admin"
        }));

        // Standarisasi properti objek Barang Keluar agar match dengan struktur tabel UI
        const dataKeluar = dataKeluarRaw.map(item => ({
          tanggal: item.tanggal_keluar ? item.tanggal_keluar.substring(0, 10) : item.created_at?.substring(0, 10),
          tipe_trx: "Barang Keluar",
          nama_barang: item.barang?.nama_barang || item.nama_barang || "Produk",
          kode_barang: item.barang?.kode_barang || item.kode_barang || "-",
          jumlah: item.jumlah || item.qty || 0,
          referensi: item.referensi || "-",
          catatan: item.catatan || "-",
          oleh: item.oleh || "Admin"
        }));

        // Menggabungkan kedua list data (Simulasi UNION ALL database)
        setTransaksiList([...dataMasuk, ...dataKeluar]);

      } catch (error) {
        console.error("Gagal memuat data transaksi:", error);
        if (error.response?.status === 401) {
          alert("Sesi masuk habis, silakan login ulang!");
        } else {
          alert("Gagal mengambil riwayat transaksi dari server!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransaksiGudang();
  }, []);

  // 3. PENYESUAIAN FILTER OPTIMASI INSTANT DI FRONT-END
  const filteredTransaksi = useMemo(() => {
    return transaksiList
      .filter((row) => {
        const keyword = search.trim().toLowerCase();
        
        // Pengecekan null-safety menghindari aplikasi crash akibat record kosong di DB
        const matchSearch =
          keyword === "" ||
          (row.nama_barang && row.nama_barang.toLowerCase().includes(keyword)) ||
          (row.referensi && row.referensi.toLowerCase().includes(keyword)) ||
          (row.kode_barang && row.kode_barang.toLowerCase().includes(keyword));

        const matchTipe = tipe === "" || row.tipe_trx === tipe;
        
        // Pengecekan kecocokan tanggal (Format YYYY-MM-DD)
        const matchTanggal = tanggal === "" || row.tanggal === tanggal;

        return matchSearch && matchTipe && matchTanggal;
      })
      // URUTKAN BERDASARKAN TANGGAL TERBARU (ORDER BY tanggal DESC)
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [transaksiList, search, tipe, tanggal]);

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
              Kelola barang masuk dan keluar gudang (Real-time DB)
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/tambah-masuk"
              className="bg-[#16a34a] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm hover:bg-green-700 transition w-fit"
            >
              <ArrowUp size={16} /> Barang Masuk
            </Link>
            <Link
              to="/tambah-keluar"
              className="bg-[#ea580c] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm hover:bg-orange-700 transition w-fit"
            >
              <ArrowDown size={16} /> Barang Keluar
            </Link>
          </div>
        </div>

        {/* === Filter & Pencarian === */}
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

        {/* === Tabel Riwayat Transaksi Gabungan === */}
        <div className="bg-white rounded-b-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Tipe</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Produk</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Jumlah</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Referensi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Catatan</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Oleh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                      Sedang menyusun riwayat data transaksi dari database...
                    </div>
                  </td>
                </tr>
              ) : filteredTransaksi.length > 0 ? (
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
                          {isMasuk ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
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
                    Tidak ada catatan riwayat transaksi di database.
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