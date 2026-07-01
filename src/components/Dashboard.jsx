// Dashboard.jsx
import React, { useState, useEffect } from "react"; 
import api from "../api"; // Menggunakan konfigurasi API terpusat (Auto-token)
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

// Util format angka ribuan ala number_format
function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value || 0);
}

// Util format tanggal operasional gudang
function formatDate(dateString) {
  if (!dateString) return "-";
  // Menangani format standar timestamp database
  const cleanDate = dateString.replace(" ", "T");
  const d = new Date(cleanDate);
  if (isNaN(d.getTime())) return dateString; // Fallback jika format teks biasa
  
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const tgl = String(d.getDate()).padStart(2, "0");
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return `${tgl} ${bulan[d.getMonth()]} ${d.getFullYear()}, ${jam}:${menit}`;
}

export default function Dashboard() {
  // State dasar penampung data dashboard dari API
  const [summary, setSummary] = useState({ 
    totalProduk: 0, 
    stokTersedia: 0, 
    stokRendah: 0, 
    stokHabis: 0 
  });
  const [kategoriStok, setKategoriStok] = useState([]);
  const [aktivitas, setAktivitas] = useState([]);
  const [stokRendahList, setStokRendahList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Tembak endpoint dashboard. Token otomatis disisipkan Interceptor
        const response = await api.get("/dashboard"); 
        const resData = response.data.data || response.data;
        
        // Pemasangan data ke masing-masing state secara dinamis
        if (resData.summary) {
          setSummary({
            totalProduk: resData.summary.totalProduk ?? resData.summary.total_produk ?? 0,
            stokTersedia: resData.summary.stokTersedia ?? resData.summary.stok_tersedia ?? 0,
            stokRendah: resData.summary.stokRendah ?? resData.summary.stok_rendah ?? 0,
            stokHabis: resData.summary.stokHabis ?? resData.summary.stok_habis ?? 0,
          });
        }
        if (resData.kategoriStok || resData.kategori_stok) {
          setKategoriStok(resData.kategoriStok || resData.kategori_stok || []);
        }
        if (resData.aktivitas) {
          setAktivitas(resData.aktivitas || []);
        }
        if (resData.stokRendahList || resData.stok_rendah_list || resData.stokRendah) {
          setStokRendahList(resData.stokRendahList || resData.stok_rendah_list || resData.stokRendah || []);
        }
        
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
        if (error.response?.status === 401) {
          alert("Sesi akses habis atau tidak valid, silakan login kembali.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-[#f8f9fc] flex h-screen overflow-hidden">
      {/* Komponen Navigasi Kiri */}
      <Sidebar />

      {/* Area Konten Utama Dashboard */}
      <div className="flex-grow p-10 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1.5 text-[15px]">Ringkasan operasional inventori gudang hari ini.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-semibold text-sm tracking-wide">
            Sedang memuat data operasional gudang dari database...
          </div>
        ) : (
          <>
            {/* === BARISAN KARTU RINGKASAN DATA STOK === */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              {/* Kartu 1: Total Ragam Produk */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div className="bg-[#eff6ff] text-[#3b82f6] rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Total Produk</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{summary.totalProduk}</p>
                </div>
              </div>

              {/* Kartu 2: Total Stok Unit yang Tersedia */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div className="bg-[#dcfce3] text-[#16a34a] rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Stok Tersedia</h3>
                  <p className="text-3xl font-bold text-[#16a34a] mt-1">{formatNumber(summary.stokTersedia)}</p>
                </div>
              </div>

              {/* Kartu 3: Produk yang Menyentuh Batas Minimum */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div className="bg-yellow-100 text-yellow-600 rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Stok Rendah</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{summary.stokRendah}</p>
                </div>
              </div>

              {/* Kartu 4: Produk yang Kosong Total */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                  <XCircle size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Stok Habis</h3>
                  <p className="text-3xl font-bold text-red-600 mt-1">{summary.stokHabis}</p>
                </div>
              </div>
            </div>

            {/* === BAGIAN STATISTIK VOLUME PRODUK PER KATEGORI === */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-10 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Statistik Stok per Kategori</h2>
              <div className="space-y-6">
                {kategoriStok.length > 0 ? (
                  kategoriStok.map((rk, index) => {
                    const namaKategori = rk.kategori || rk.nama_kategori || "Umum";
                    const totalUnit = rk.total || rk.total_unit || 0;
                    const percent = Math.min((totalUnit / 500) * 100, 100); // Progress bar max 500 unit
                    return (
                      <div key={index}>
                        <div className="flex justify-between text-sm font-semibold mb-2">
                          <span className="text-gray-700">{namaKategori}</span>
                          <span className="text-gray-900">{totalUnit} unit</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-[#3b82f6] h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">Belum ada rincian data kategori produk.</p>
                )}
              </div>
            </div>

            {/* === LAYOUT GRID BAWAH: AKTIVITAS & PERINGATAN STOK === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Kolom Kiri: Riwayat Transaksi Keluar Masuk Terakhir */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Aktivitas Terakhir</h2>
                  <Link to="/transaksi" className="text-[#1d4ed8] text-xs font-bold hover:underline">
                    Lihat Semua
                  </Link>
                </div>
                <div className="p-6 space-y-6">
                  {aktivitas.length > 0 ? (
                    aktivitas.map((ra, index) => {
                      const tipeTrx = (ra.tipe || ra.tipe_trx || "").toLowerCase();
                      const isIn = tipeTrx.includes("masuk") || tipeTrx === "in";
                      const namaItem = ra.namaBarang || ra.nama_barang || "Produk";
                      return (
                        <div key={ra.id || index} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`${
                              isIn ? "bg-[#dcfce3] text-[#166534]" : "bg-[#ffedd5] text-[#c2410c]"
                            } w-10 h-10 rounded-lg flex items-center justify-center`}>
                              {isIn ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{namaItem}</p>
                              <p className="text-[11px] text-gray-400">{formatDate(ra.tanggal || ra.created_at)}</p>
                            </div>
                          </div>
                          <p className={`text-sm font-bold ${isIn ? "text-[#16a34a]" : "text-[#ea580c]"}`}>
                            {isIn ? "+" : "-"}
                            {ra.jumlah || ra.qty || 0}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">Belum ada pergerakan barang masuk/keluar.</p>
                  )}
                </div>
              </div>

              {/* Kolom Kanan: Tabel Monitor Item Bermasalah / Menipis */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Ringkasan Stok Rendah</h2>
                  <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    Perlu Atensi
                  </span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produk</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Stok</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stokRendahList.length > 0 ? (
                      stokRendahList.map((rl, index) => {
                        const kodeBarang = rl.kodeBarang || rl.kode_barang || "-";
                        const namaBarang = rl.namaBarang || rl.nama_barang || "Produk";
                        const stokSaatIni = rl.stokSaatIni ?? rl.stok_saat_ini ?? 0;
                        return (
                          <tr key={kodeBarang + index} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-[12px] font-mono font-semibold text-gray-600">
                              {kodeBarang}
                            </td>
                            <td className="px-6 py-4 text-[12px] font-bold text-gray-900">
                              {namaBarang}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-red-600 text-[12px]">
                              {stokSaatIni}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                          Aman, seluruh stok barang di gudang melimpah.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}